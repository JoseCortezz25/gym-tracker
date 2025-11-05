# Phase 2 - Domain Business Logic Architecture Plan

**Created**: 2025-11-05
**Session**: phase2-logic-20251105
**Agent**: domain-architect
**Complexity**: High
**Status**: 📋 Ready for Implementation

---

## Executive Summary

This plan defines the complete business logic layer for Phase 2 of the Gym Tracker application. Phase 1 delivered the UI structure with mock data. Phase 2 will implement:

1. **Authentication domain** (user registration, login, session management)
2. **Routines domain** (CRUD operations, activation, archiving)
3. **Workouts domain** (session tracking, real-time logging, auto-save)
4. **Exercises domain** (library management, custom exercises)

All domains follow the **Server Actions pattern** (replaces traditional Repository pattern), use **Zod for validation**, and implement **React Query for server state** management.

---

## Table of Contents

1. [Domain Overview](#1-domain-overview)
2. [Auth Domain](#2-auth-domain)
3. [Routines Domain](#3-routines-domain)
4. [Workouts Domain](#4-workouts-domain)
5. [Exercises Domain](#5-exercises-domain)
6. [Integration Points](#6-integration-points)
7. [Error Handling Strategy](#7-error-handling-strategy)
8. [Implementation Order](#8-implementation-order)
9. [Files to Create](#9-files-to-create)
10. [Architectural Decisions](#10-architectural-decisions)

---

## 1. Domain Overview

### 1.1 Architecture Pattern

Following `.claude/knowledge/architecture-patterns.md` section 4.1, we use **Server Actions** instead of traditional Repository pattern:

```
Traditional:           Server Actions Pattern (Next.js 15):
┌─────────────┐       ┌────────────────────────────┐
│ Controller  │       │                            │
├─────────────┤       │      Server Action         │
│ Service     │  ──>  │ (validation + auth +       │
├─────────────┤       │  logic + persistence)      │
│ Repository  │       │                            │
└─────────────┘       └────────────────────────────┘
```

**Benefits**:
- ✅ Single layer instead of 3 (Controller → Service → Repository)
- ✅ Automatic type safety with TypeScript
- ✅ Built-in Next.js 15 optimization
- ✅ Direct database access (no unnecessary abstraction)

### 1.2 Domain Structure

Each domain follows this structure:

```
src/domains/{domain}/
├── types.ts              # TypeScript interfaces
├── schema.ts             # Zod validation schemas
├── actions.ts            # Server Actions (mutations + reads)
├── hooks/                # React Query hooks (client-side)
│   ├── use-{entity}.ts
│   └── use-{feature}.ts
├── stores/               # Zustand stores (UI state ONLY)
│   └── {feature}-store.ts
└── components/           # Domain-specific components (already exist from Phase 1)
```

### 1.3 State Management Decision Matrix

| State Type | Tool | Example |
|-----------|------|---------|
| **Server Data** (backend) | React Query | Users, routines, workouts, exercises |
| **UI State** (local preferences) | Zustand | Sidebar open, filters, view mode |
| **Local State** (component-only) | useState | Form input, modal open |
| **Complex Forms** (validation) | React Hook Form | Registration, routine editor |

**CRITICAL**: ❌ NEVER use Zustand for server data (PRD section 9.6, Critical Constraints #7)

---

## 2. Auth Domain

### 2.1 Business Context

**Problem**: Users need secure authentication to access their personal workout data.

**Business Goals**:
- Secure user registration with email/password
- Session-based authentication
- Password recovery mechanism
- Prevent unauthorized access to user data

**User Stories**:
1. As a new user, I want to register with email/password so I can create my account
2. As a registered user, I want to log in so I can access my workout data
3. As a user who forgot my password, I want to reset it so I can regain access

### 2.2 Domain Entities

#### User Entity

```typescript
// src/domains/auth/types.ts
export interface User {
  // Core attributes
  id: string;
  email: string;
  name: string | null;

  // Security
  emailVerified: Date | null;

  // Metadata
  createdAt: Date;
  lastLoginAt: Date | null;
}

// Auth session (from NextAuth)
export interface AuthSession {
  user: User;
  expires: string;
}

// Credentials for login
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Registration input
export interface RegisterInput {
  email: string;
  password: string;
  confirmPassword: string;
}

// Password reset
export interface PasswordResetInput {
  token: string;
  password: string;
  confirmPassword: string;
}
```

### 2.3 Business Rules

#### Validation Rules

1. **Email Validation**
   - Must be valid email format
   - Must be unique in system
   - Error: "Email already registered"

2. **Password Requirements** (PRD section 8.1)
   - Minimum 8 characters
   - Must include at least 1 letter
   - Must include at least 1 number
   - Error: "Password must be at least 8 characters with 1 letter and 1 number"

3. **Password Confirmation**
   - Must match password field
   - Error: "Passwords do not match"

4. **Session Expiration**
   - Default: 7 days of inactivity (PRD section 10.4)
   - "Remember me" extends to 30 days

#### State Transitions

```
NOT_REGISTERED → REGISTERED (pending verification) → VERIFIED
                      ↓
                 RESET_REQUESTED → PASSWORD_RESET
```

### 2.4 Zod Validation Schemas

```typescript
// src/domains/auth/schema.ts
import { z } from 'zod';

// Email validation
export const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Invalid email format');

// Password validation (PRD business rule)
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Registration schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
});

// Password reset request
export const passwordResetRequestSchema = z.object({
  email: emailSchema
});

// Password reset
export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// TypeScript types inferred from schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
```

### 2.5 Server Actions Design

```typescript
// src/domains/auth/actions.ts
'use server';

import { z } from 'zod';
import { signIn, signOut } from '@/lib/auth';
import { db } from '@/lib/db';
import { hash, compare } from 'bcryptjs';
import { registerSchema, loginSchema, passwordResetRequestSchema, passwordResetSchema } from './schema';

// ========================================
// User Registration
// ========================================
export async function registerUser(input: unknown) {
  // 1. Validate input
  const validated = registerSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors
    };
  }

  const { email, password } = validated.data;

  try {
    // 2. Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return {
        success: false,
        error: 'Email already registered'
      };
    }

    // 3. Hash password (bcrypt with 12 rounds - PRD section 10.4)
    const passwordHash = await hash(password, 12);

    // 4. Create user
    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        createdAt: new Date()
      }
    });

    // 5. Send verification email (TODO: implement email service)
    // await sendVerificationEmail(user.email, user.id);

    return {
      success: true,
      userId: user.id,
      message: 'Registration successful. Please check your email to verify your account.'
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during registration'
    };
  }
}

// ========================================
// User Login
// ========================================
export async function loginUser(input: unknown) {
  // 1. Validate input
  const validated = loginSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors
    };
  }

  const { email, password, rememberMe } = validated.data;

  try {
    // 2. Find user
    const user = await db.user.findUnique({
      where: { email }
    });

    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // 3. Verify password
    const isValidPassword = await compare(password, user.passwordHash);

    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // 4. Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // 5. Create session (using NextAuth)
    const session = await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during login'
    };
  }
}

// ========================================
// User Logout
// ========================================
export async function logoutUser() {
  try {
    await signOut({ redirect: false });
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during logout'
    };
  }
}

// ========================================
// Password Reset Request
// ========================================
export async function requestPasswordReset(input: unknown) {
  const validated = passwordResetRequestSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors
    };
  }

  const { email } = validated.data;

  try {
    const user = await db.user.findUnique({
      where: { email }
    });

    // Always return success (security: don't reveal if email exists)
    if (!user) {
      return {
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.'
      };
    }

    // Generate reset token (valid 24 hours - PRD US-1.3)
    const resetToken = generateSecureToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt
      }
    });

    // Send reset email (TODO: implement email service)
    // await sendPasswordResetEmail(user.email, resetToken);

    return {
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.'
    };
  } catch (error) {
    console.error('Password reset request error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}

// ========================================
// Password Reset
// ========================================
export async function resetPassword(input: unknown) {
  const validated = passwordResetSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors
    };
  }

  const { token, password } = validated.data;

  try {
    // Verify token
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return {
        success: false,
        error: 'Invalid or expired reset token'
      };
    }

    // Hash new password
    const passwordHash = await hash(password, 12);

    // Update password
    await db.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash }
    });

    // Delete used token
    await db.passwordResetToken.delete({
      where: { id: resetToken.id }
    });

    return {
      success: true,
      message: 'Password reset successful. You can now log in with your new password.'
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}

// ========================================
// Get Current User (Server Component)
// ========================================
export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // Fetch full user data
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      createdAt: true,
      lastLoginAt: true
    }
  });

  return user;
}

// Helper function
function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
```

### 2.6 React Query Hooks

```typescript
// src/domains/auth/hooks/use-auth.ts
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { loginUser, logoutUser, registerUser, getCurrentUser } from '../actions';
import type { LoginInput, RegisterInput } from '../types';

// Get current user (rarely used - prefer Server Components)
export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'current-user'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Login mutation
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) => loginUser(input),
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate current user cache
        queryClient.invalidateQueries({ queryKey: ['auth', 'current-user'] });
        // Redirect to dashboard
        router.push('/dashboard');
      }
    },
  });
}

// Register mutation
export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (input: RegisterInput) => registerUser(input),
    onSuccess: (data) => {
      if (data.success) {
        // Redirect to login with success message
        router.push('/login?registered=true');
      }
    },
  });
}

// Logout mutation
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Clear all caches
      queryClient.clear();
      // Redirect to login
      router.push('/login');
    },
  });
}
```

### 2.7 Error Handling

```typescript
// src/domains/auth/errors.ts
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}

export class UserAlreadyExistsError extends AuthError {
  constructor() {
    super('Email already registered');
    this.name = 'UserAlreadyExistsError';
  }
}

export class SessionExpiredError extends AuthError {
  constructor() {
    super('Your session has expired. Please log in again.');
    this.name = 'SessionExpiredError';
  }
}
```

---

## 3. Routines Domain

### 3.1 Business Context

**Problem**: Users need to organize their workouts into structured routines.

**Business Goals**:
- Create multi-day workout routines
- Manage exercise configuration (sets, reps, weight targets)
- Activate one routine at a time
- Preserve workout history when archiving routines

**User Stories**:
1. As a user, I want to create a "Push-Pull-Legs" routine so I can organize my weekly workouts
2. As a user, I want to add exercises to each day with target sets/reps/weight
3. As a user, I want to activate one routine so it appears on my dashboard
4. As a user, I want to archive old routines without losing workout history

### 3.2 Domain Entities

```typescript
// src/domains/routines/types.ts

// Core Routine entity
export interface Routine {
  id: string;
  userId: string;
  name: string;
  isActive: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  days?: RoutineDay[];
}

// Routine Day (e.g., "Push Day")
export interface RoutineDay {
  id: string;
  routineId: string;
  name: string;
  dayOfWeek: DayOfWeek | null;
  order: number;
  createdAt: Date;

  // Relationships
  exercises?: RoutineExercise[];
}

// Exercise configuration in routine
export interface RoutineExercise {
  id: string;
  routineDayId: string;
  exerciseId: string;
  order: number;

  // Target configuration (OPTION A - Fixed Structure from PRD decision)
  targetSets: number | null;
  targetReps: number | null;
  targetWeight: number | null; // in kg

  notes: string | null;
  createdAt: Date;

  // Relationships
  exercise?: Exercise;
}

// Enums
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// DTOs for creation
export interface CreateRoutineInput {
  name: string;
}

export interface UpdateRoutineInput {
  name?: string;
}

export interface CreateRoutineDayInput {
  routineId: string;
  name: string;
  dayOfWeek?: DayOfWeek;
  order: number;
}

export interface AddExerciseToRoutineInput {
  routineDayId: string;
  exerciseId: string;
  order: number;
  targetSets?: number;
  targetReps?: number;
  targetWeight?: number;
  notes?: string;
}
```

### 3.3 Business Rules

#### Validation Rules (PRD section 9.2)

1. **Unique Routine Name per User**
   - User cannot have two routines with same name
   - Validation: Check existing routines for userId
   - Error: "You already have a routine with this name"

2. **Only 1 Active Routine** (PRD business rule 9.2.2)
   - When activating routine, all others are automatically deactivated
   - Validation: Before setting isActive = true, set all other user routines to isActive = false
   - Info message: "Previous active routine deactivated"

3. **No Deletion with History** (PRD business rule 9.2.3)
   - If routine has associated WorkoutSessions, mark as archived instead of deleting
   - Validation: Check WorkoutSession count
   - Action: Set isArchived = true instead of DELETE
   - Info message: "Routine archived to preserve workout history"

4. **No Duplicate Days** (PRD business rule 9.2.4)
   - Within a routine, cannot have two days with same dayOfWeek
   - Validation: Check existing RoutineDay entries
   - Error: "You already have a day assigned to {dayOfWeek}"

5. **No Duplicate Exercises in Day** (PRD business rule 9.2.5)
   - Within a RoutineDay, cannot have two RoutineExercises with same exerciseId
   - Validation: Check existing RoutineExercise entries
   - Error: "This exercise is already in this day"

6. **Reasonable Target Values**
   - targetSets: 1-10 (most users don't do more than 10 sets)
   - targetReps: 1-100 (more than 100 is likely an error)
   - targetWeight: 0-500 kg (reasonable maximum)

#### State Transitions

```
DRAFT → ACTIVE (only one at a time) → ARCHIVED
  ↓                                       ↑
  └───────────── DELETE ─────────────────┘
                (only if no workout history)
```

### 3.4 Zod Validation Schemas

```typescript
// src/domains/routines/schema.ts
import { z } from 'zod';

// Day of week enum
export const dayOfWeekSchema = z.enum([
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
]).nullable();

// Create routine schema
export const createRoutineSchema = z.object({
  name: z.string()
    .min(1, 'Routine name is required')
    .max(100, 'Routine name must be less than 100 characters')
});

// Update routine schema
export const updateRoutineSchema = z.object({
  name: z.string()
    .min(1, 'Routine name is required')
    .max(100, 'Routine name must be less than 100 characters')
    .optional()
});

// Create routine day schema
export const createRoutineDaySchema = z.object({
  routineId: z.string().uuid('Invalid routine ID'),
  name: z.string()
    .min(1, 'Day name is required')
    .max(50, 'Day name must be less than 50 characters'),
  dayOfWeek: dayOfWeekSchema.optional(),
  order: z.number().int().min(0, 'Order must be non-negative')
});

// Add exercise to routine schema
export const addExerciseToRoutineSchema = z.object({
  routineDayId: z.string().uuid('Invalid routine day ID'),
  exerciseId: z.string().uuid('Invalid exercise ID'),
  order: z.number().int().min(0, 'Order must be non-negative'),
  targetSets: z.number()
    .int()
    .min(1, 'Target sets must be at least 1')
    .max(10, 'Target sets must be at most 10')
    .nullable()
    .optional(),
  targetReps: z.number()
    .int()
    .min(1, 'Target reps must be at least 1')
    .max(100, 'Target reps must be at most 100')
    .nullable()
    .optional(),
  targetWeight: z.number()
    .min(0, 'Target weight must be non-negative')
    .max(500, 'Target weight must be at most 500 kg')
    .nullable()
    .optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').nullable().optional()
});

// Update exercise in routine schema
export const updateRoutineExerciseSchema = addExerciseToRoutineSchema.omit({
  routineDayId: true,
  exerciseId: true
}).partial();

// TypeScript types
export type CreateRoutineInput = z.infer<typeof createRoutineSchema>;
export type UpdateRoutineInput = z.infer<typeof updateRoutineSchema>;
export type CreateRoutineDayInput = z.infer<typeof createRoutineDaySchema>;
export type AddExerciseToRoutineInput = z.infer<typeof addExerciseToRoutineSchema>;
export type UpdateRoutineExerciseInput = z.infer<typeof updateRoutineExerciseSchema>;
```

### 3.5 Server Actions Design

```typescript
// src/domains/routines/actions.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  createRoutineSchema,
  updateRoutineSchema,
  createRoutineDaySchema,
  addExerciseToRoutineSchema
} from './schema';
import { revalidatePath } from 'next/cache';

// ========================================
// Create Routine
// ========================================
export async function createRoutine(input: unknown) {
  // 1. Session validation (MANDATORY)
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  // 2. Input validation
  const validated = createRoutineSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors
    };
  }

  const { name } = validated.data;

  try {
    // 3. Business rule: Check unique name per user
    const existingRoutine = await db.routine.findFirst({
      where: {
        userId: session.user.id,
        name,
        isArchived: false
      }
    });

    if (existingRoutine) {
      return {
        success: false,
        error: 'You already have a routine with this name'
      };
    }

    // 4. Create routine
    const routine = await db.routine.create({
      data: {
        userId: session.user.id,
        name,
        isActive: false,
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // 5. Invalidate cache
    revalidatePath('/routines');

    return {
      success: true,
      routine
    };
  } catch (error) {
    console.error('Create routine error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}

// ========================================
// Get User Routines
// ========================================
export async function getUserRoutines() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const routines = await db.routine.findMany({
    where: {
      userId: session.user.id,
      isArchived: false
    },
    include: {
      days: {
        include: {
          exercises: {
            include: {
              exercise: true
            },
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      }
    },
    orderBy: [
      { isActive: 'desc' }, // Active routine first
      { updatedAt: 'desc' }
    ]
  });

  return routines;
}

// ========================================
// Get Routine by ID
// ========================================
export async function getRoutineById(routineId: string) {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const routine = await db.routine.findFirst({
    where: {
      id: routineId,
      userId: session.user.id
    },
    include: {
      days: {
        include: {
          exercises: {
            include: {
              exercise: true
            },
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      }
    }
  });

  return routine;
}

// ========================================
// Activate Routine
// ========================================
export async function activateRoutine(routineId: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Business rule: Deactivate all other routines first
    await db.routine.updateMany({
      where: {
        userId: session.user.id,
        isActive: true
      },
      data: { isActive: false }
    });

    // Activate selected routine
    await db.routine.update({
      where: {
        id: routineId,
        userId: session.user.id
      },
      data: {
        isActive: true,
        updatedAt: new Date()
      }
    });

    revalidatePath('/routines');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'Routine activated'
    };
  } catch (error) {
    console.error('Activate routine error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}

// ========================================
// Archive Routine
// ========================================
export async function archiveRoutine(routineId: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Mark as archived (preserves history)
    await db.routine.update({
      where: {
        id: routineId,
        userId: session.user.id
      },
      data: {
        isArchived: true,
        isActive: false,
        updatedAt: new Date()
      }
    });

    revalidatePath('/routines');

    return {
      success: true,
      message: 'Routine archived'
    };
  } catch (error) {
    console.error('Archive routine error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}

// ========================================
// Delete Routine (only if no workout history)
// ========================================
export async function deleteRoutine(routineId: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Business rule: Check if has workout sessions
    const workoutCount = await db.workoutSession.count({
      where: { routineId }
    });

    if (workoutCount > 0) {
      // Archive instead of delete
      return archiveRoutine(routineId);
    }

    // Safe to delete (no history)
    await db.routine.delete({
      where: {
        id: routineId,
        userId: session.user.id
      }
    });

    revalidatePath('/routines');

    return {
      success: true,
      message: 'Routine deleted'
    };
  } catch (error) {
    console.error('Delete routine error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}

// ========================================
// Add Exercise to Routine Day
// ========================================
export async function addExerciseToRoutine(input: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  const validated = addExerciseToRoutineSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors
    };
  }

  const { routineDayId, exerciseId, order, targetSets, targetReps, targetWeight, notes } = validated.data;

  try {
    // Verify routine day belongs to user
    const routineDay = await db.routineDay.findFirst({
      where: {
        id: routineDayId,
        routine: {
          userId: session.user.id
        }
      }
    });

    if (!routineDay) {
      return {
        success: false,
        error: 'Routine day not found'
      };
    }

    // Business rule: Check no duplicate exercise in day
    const existingExercise = await db.routineExercise.findFirst({
      where: {
        routineDayId,
        exerciseId
      }
    });

    if (existingExercise) {
      return {
        success: false,
        error: 'This exercise is already in this day'
      };
    }

    // Add exercise
    const routineExercise = await db.routineExercise.create({
      data: {
        routineDayId,
        exerciseId,
        order,
        targetSets: targetSets ?? null,
        targetReps: targetReps ?? null,
        targetWeight: targetWeight ?? null,
        notes: notes ?? null,
        createdAt: new Date()
      }
    });

    revalidatePath('/routines');

    return {
      success: true,
      routineExercise
    };
  } catch (error) {
    console.error('Add exercise error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}
```

### 3.6 React Query Hooks

```typescript
// src/domains/routines/hooks/use-routines.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserRoutines,
  getRoutineById,
  createRoutine,
  activateRoutine,
  archiveRoutine,
  deleteRoutine
} from '../actions';
import type { CreateRoutineInput } from '../types';

// Get all user routines
export function useRoutines() {
  return useQuery({
    queryKey: ['routines'],
    queryFn: getUserRoutines,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get single routine by ID
export function useRoutine(routineId: string) {
  return useQuery({
    queryKey: ['routines', routineId],
    queryFn: () => getRoutineById(routineId),
    staleTime: 2 * 60 * 1000,
  });
}

// Create routine mutation
export function useCreateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRoutineInput) => createRoutine(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
  });
}

// Activate routine mutation
export function useActivateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (routineId: string) => activateRoutine(routineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
  });
}

// Archive routine mutation
export function useArchiveRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (routineId: string) => archiveRoutine(routineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
  });
}

// Delete routine mutation
export function useDeleteRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (routineId: string) => deleteRoutine(routineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
  });
}
```

---

## 4. Workouts Domain

### 4.1 Business Context

**Problem**: Users need to track their workout sessions in real-time with auto-save functionality.

**Business Goals**:
- Start workout session from active routine
- Log sets/reps/weight for each exercise
- Auto-save to prevent data loss
- Complete session with summary
- Support modifying exercises during workout

**User Stories**:
1. As a user, I want to start a workout session so I can track today's workout
2. As a user, I want to log each set with weight/reps so I have accurate records
3. As a user, I want auto-save so I don't lose data if app closes
4. As a user, I want to complete session and see summary

### 4.2 Domain Entities

```typescript
// src/domains/workouts/types.ts

// Workout Session entity
export interface WorkoutSession {
  id: string;
  userId: string;
  routineId: string | null;
  routineDayId: string | null;

  // Timestamps
  startedAt: Date;
  completedAt: Date | null;
  duration: number | null; // in minutes, calculated

  // Metadata
  rating: number | null; // 1-5 stars
  notes: string | null;
  createdAt: Date;

  // Relationships
  exercises?: WorkoutExercise[];
  routine?: Routine;
}

// Exercise performed in session
export interface WorkoutExercise {
  id: string;
  workoutSessionId: string;
  exerciseId: string;
  order: number;
  notes: string | null;
  createdAt: Date;

  // Relationships
  sets?: WorkoutSet[];
  exercise?: Exercise;
}

// Individual set in workout
export interface WorkoutSet {
  id: string;
  workoutExerciseId: string;
  setNumber: number; // 1, 2, 3, ...
  weight: number; // kg
  reps: number;
  isCompleted: boolean;
  createdAt: Date;
}

// Session state for tracking
export type SessionState = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

// DTOs
export interface StartSessionInput {
  routineId?: string;
  routineDayId?: string;
}

export interface LogSetInput {
  workoutExerciseId: string;
  setNumber: number;
  weight: number;
  reps: number;
  isCompleted: boolean;
}

export interface CompleteSessionInput {
  workoutSessionId: string;
  rating?: number;
  notes?: string;
}
```

### 4.3 Business Rules (PRD section 9.3)

#### Validation Rules

1. **Only 1 Active Session** (PRD 9.3.1)
   - User cannot have two IN_PROGRESS sessions simultaneously
   - Validation: Check for existing session where completedAt is null
   - Error: "You already have an active workout session"

2. **Coherent Timestamps** (PRD 9.3.2)
   - startedAt < completedAt
   - Validation: Ensure completedAt is after startedAt
   - Error: "Invalid session timestamps"

3. **Reasonable Duration** (PRD 9.3.3)
   - Session cannot last more than 4 hours (240 minutes)
   - Warning (not error): "This session is unusually long. Continue?"

4. **Reasonable Weight** (PRD 9.3.4)
   - Weight cannot be negative
   - Weight range: 0-500 kg
   - Error: "Invalid weight value"

5. **Reasonable Reps** (PRD 9.3.5)
   - Reps must be between 1-100
   - Error: "Reps must be between 1 and 100"

6. **Session Rating**
   - Rating must be 1-5 if provided
   - Error: "Rating must be between 1 and 5"

#### State Transitions (PRD section 9.1)

```
NOT_STARTED → IN_PROGRESS → COMPLETED
                   ↓
               CANCELLED
```

### 4.4 Zod Validation Schemas

```typescript
// src/domains/workouts/schema.ts
import { z } from 'zod';

// Start session schema
export const startSessionSchema = z.object({
  routineId: z.string().uuid('Invalid routine ID').optional(),
  routineDayId: z.string().uuid('Invalid routine day ID').optional()
});

// Log set schema (PRD validation rules)
export const logSetSchema = z.object({
  workoutExerciseId: z.string().uuid('Invalid workout exercise ID'),
  setNumber: z.number().int().min(1, 'Set number must be at least 1'),
  weight: z.number()
    .min(0, 'Weight cannot be negative')
    .max(500, 'Weight must be at most 500 kg'),
  reps: z.number()
    .int()
    .min(1, 'Reps must be at least 1')
    .max(100, 'Reps must be at most 100'),
  isCompleted: z.boolean()
});

// Complete session schema
export const completeSessionSchema = z.object({
  workoutSessionId: z.string().uuid('Invalid session ID'),
  rating: z.number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
    .nullable()
    .optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').nullable().optional()
});

// Update set schema
export const updateSetSchema = logSetSchema.omit({ workoutExerciseId: true }).partial();

// TypeScript types
export type StartSessionInput = z.infer<typeof startSessionSchema>;
export type LogSetInput = z.infer<typeof logSetSchema>;
export type CompleteSessionInput = z.infer<typeof completeSessionSchema>;
export type UpdateSetInput = z.infer<typeof updateSetSchema>;
```

### 4.5 Server Actions Design

```typescript
// src/domains/workouts/actions.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { startSessionSchema, logSetSchema, completeSessionSchema } from './schema';
import { revalidatePath } from 'next/cache';

// ========================================
// Start Workout Session
// ========================================
export async function startWorkoutSession(input: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  const validated = startSessionSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors
    };
  }

  const { routineId, routineDayId } = validated.data;

  try {
    // Business rule: Check for existing active session
    const activeSession = await db.workoutSession.findFirst({
      where: {
        userId: session.user.id,
        completedAt: null
      }
    });

    if (activeSession) {
      return {
        success: false,
        error: 'You already have an active workout session'
      };
    }

    // Create new session
    const workoutSession = await db.workoutSession.create({
      data: {
        userId: session.user.id,
        routineId: routineId ?? null,
        routineDayId: routineDayId ?? null,
        startedAt: new Date(),
        completedAt: null,
        duration: null,
        rating: null,
        notes: null,
        createdAt: new Date()
      }
    });

    // If routine day provided, copy exercises from routine to session
    if (routineDayId) {
      const routineExercises = await db.routineExercise.findMany({
        where: { routineDayId },
        orderBy: { order: 'asc' }
      });

      for (const routineExercise of routineExercises) {
        await db.workoutExercise.create({
          data: {
            workoutSessionId: workoutSession.id,
            exerciseId: routineExercise.exerciseId,
            order: routineExercise.order,
            notes: null,
            createdAt: new Date()
          }
        });
      }
    }

    revalidatePath('/dashboard');
    revalidatePath('/workouts');

    return {
      success: true,
      workoutSession
    };
  } catch (error) {
    console.error('Start session error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}

// ========================================
// Get Active Session
// ========================================
export async function getActiveSession() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const activeSession = await db.workoutSession.findFirst({
    where: {
      userId: session.user.id,
      completedAt: null
    },
    include: {
      exercises: {
        include: {
          exercise: true,
          sets: {
            orderBy: { setNumber: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      },
      routine: true
    }
  });

  return activeSession;
}

// ========================================
// Log Set (auto-save)
// ========================================
export async function logSet(input: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  const validated = logSetSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors
    };
  }

  const { workoutExerciseId, setNumber, weight, reps, isCompleted } = validated.data;

  try {
    // Verify workout exercise belongs to user's session
    const workoutExercise = await db.workoutExercise.findFirst({
      where: {
        id: workoutExerciseId,
        workoutSession: {
          userId: session.user.id
        }
      }
    });

    if (!workoutExercise) {
      return {
        success: false,
        error: 'Workout exercise not found'
      };
    }

    // Check if set already exists (update) or create new
    const existingSet = await db.workoutSet.findFirst({
      where: {
        workoutExerciseId,
        setNumber
      }
    });

    let workoutSet;
    if (existingSet) {
      // Update existing set
      workoutSet = await db.workoutSet.update({
        where: { id: existingSet.id },
        data: {
          weight,
          reps,
          isCompleted
        }
      });
    } else {
      // Create new set
      workoutSet = await db.workoutSet.create({
        data: {
          workoutExerciseId,
          setNumber,
          weight,
          reps,
          isCompleted,
          createdAt: new Date()
        }
      });
    }

    // No revalidatePath here - auto-save should be silent

    return {
      success: true,
      workoutSet
    };
  } catch (error) {
    console.error('Log set error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}

// ========================================
// Complete Workout Session
// ========================================
export async function completeWorkoutSession(input: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  const validated = completeSessionSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors
    };
  }

  const { workoutSessionId, rating, notes } = validated.data;

  try {
    // Get session
    const workoutSession = await db.workoutSession.findFirst({
      where: {
        id: workoutSessionId,
        userId: session.user.id,
        completedAt: null // Must be active
      }
    });

    if (!workoutSession) {
      return {
        success: false,
        error: 'Active session not found'
      };
    }

    // Calculate duration
    const completedAt = new Date();
    const duration = Math.floor((completedAt.getTime() - workoutSession.startedAt.getTime()) / (1000 * 60)); // minutes

    // Business rule: Warn if duration > 4 hours (240 minutes)
    if (duration > 240) {
      // Log warning but allow completion
      console.warn(`Session ${workoutSessionId} has unusually long duration: ${duration} minutes`);
    }

    // Update session
    const updatedSession = await db.workoutSession.update({
      where: { id: workoutSessionId },
      data: {
        completedAt,
        duration,
        rating: rating ?? null,
        notes: notes ?? null
      },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: true
          }
        }
      }
    });

    revalidatePath('/dashboard');
    revalidatePath('/workouts');
    revalidatePath('/history');

    return {
      success: true,
      workoutSession: updatedSession,
      summary: {
        duration,
        totalSets: updatedSession.exercises.reduce((acc, ex) => acc + ex.sets.length, 0),
        totalVolume: updatedSession.exercises.reduce((acc, ex) =>
          acc + ex.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0), 0
        )
      }
    };
  } catch (error) {
    console.error('Complete session error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}

// ========================================
// Cancel Workout Session
// ========================================
export async function cancelWorkoutSession(workoutSessionId: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Delete incomplete session and all related data
    await db.workoutSession.delete({
      where: {
        id: workoutSessionId,
        userId: session.user.id,
        completedAt: null
      }
    });

    revalidatePath('/dashboard');
    revalidatePath('/workouts');

    return {
      success: true,
      message: 'Session cancelled'
    };
  } catch (error) {
    console.error('Cancel session error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}

// ========================================
// Get Workout History
// ========================================
export async function getWorkoutHistory(limit: number = 20, offset: number = 0) {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const sessions = await db.workoutSession.findMany({
    where: {
      userId: session.user.id,
      completedAt: { not: null }
    },
    include: {
      routine: true,
      exercises: {
        include: {
          exercise: true,
          sets: true
        }
      }
    },
    orderBy: { completedAt: 'desc' },
    take: limit,
    skip: offset
  });

  return sessions;
}
```

### 4.6 Zustand Store for Active Session UI State

```typescript
// src/domains/workouts/stores/active-session-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ActiveSessionStore {
  // UI state only (NOT server data)
  isTimerRunning: boolean;
  currentExerciseIndex: number;
  isRestTimerVisible: boolean;
  restTimeRemaining: number; // seconds

  // Actions
  startTimer: () => void;
  stopTimer: () => void;
  setCurrentExerciseIndex: (index: number) => void;
  showRestTimer: (seconds: number) => void;
  hideRestTimer: () => void;
  decrementRestTime: () => void;
}

export const useActiveSessionStore = create<ActiveSessionStore>()(
  persist(
    (set) => ({
      isTimerRunning: false,
      currentExerciseIndex: 0,
      isRestTimerVisible: false,
      restTimeRemaining: 0,

      startTimer: () => set({ isTimerRunning: true }),
      stopTimer: () => set({ isTimerRunning: false }),
      setCurrentExerciseIndex: (index) => set({ currentExerciseIndex: index }),
      showRestTimer: (seconds) => set({ isRestTimerVisible: true, restTimeRemaining: seconds }),
      hideRestTimer: () => set({ isRestTimerVisible: false, restTimeRemaining: 0 }),
      decrementRestTime: () => set((state) => ({
        restTimeRemaining: Math.max(0, state.restTimeRemaining - 1)
      }))
    }),
    {
      name: 'active-session-storage'
    }
  )
);
```

### 4.7 React Query Hooks

```typescript
// src/domains/workouts/hooks/use-workout-session.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  startWorkoutSession,
  getActiveSession,
  logSet,
  completeWorkoutSession,
  cancelWorkoutSession,
  getWorkoutHistory
} from '../actions';
import type { StartSessionInput, LogSetInput, CompleteSessionInput } from '../types';

// Get active session
export function useActiveSession() {
  return useQuery({
    queryKey: ['workouts', 'active'],
    queryFn: getActiveSession,
    staleTime: 30 * 1000, // 30 seconds (auto-save needs fresh data)
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

// Start session mutation
export function useStartSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: StartSessionInput) => startWorkoutSession(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts', 'active'] });
    },
  });
}

// Log set mutation (auto-save)
export function useLogSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LogSetInput) => logSet(input),
    onMutate: async (newSet) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['workouts', 'active'] });

      const previousSession = queryClient.getQueryData(['workouts', 'active']);

      queryClient.setQueryData(['workouts', 'active'], (old: any) => {
        if (!old) return old;

        // Update set in cache optimistically
        return {
          ...old,
          exercises: old.exercises.map((ex: any) =>
            ex.id === newSet.workoutExerciseId
              ? {
                  ...ex,
                  sets: [...ex.sets, newSet] // Add or update set
                }
              : ex
          )
        };
      });

      return { previousSession };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousSession) {
        queryClient.setQueryData(['workouts', 'active'], context.previousSession);
      }
    },
    onSettled: () => {
      // Refetch to sync with server
      queryClient.invalidateQueries({ queryKey: ['workouts', 'active'] });
    },
  });
}

// Complete session mutation
export function useCompleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CompleteSessionInput) => completeWorkoutSession(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts', 'active'] });
      queryClient.invalidateQueries({ queryKey: ['workouts', 'history'] });
    },
  });
}

// Cancel session mutation
export function useCancelSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => cancelWorkoutSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts', 'active'] });
    },
  });
}

// Get workout history
export function useWorkoutHistory(limit = 20, offset = 0) {
  return useQuery({
    queryKey: ['workouts', 'history', limit, offset],
    queryFn: () => getWorkoutHistory(limit, offset),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

---

## 5. Exercises Domain

### 5.1 Business Context

**Problem**: Users need a library of exercises to choose from when creating routines.

**Business Goals**:
- Provide 50+ predefined exercises (PRD section 5.3)
- Allow users to create custom exercises
- Organize by muscle group (category)
- Search and filter functionality

**User Stories**:
1. As a user, I want to browse predefined exercises so I can quickly add common movements
2. As a user, I want to create custom exercises so I can track gym-specific equipment
3. As a user, I want to search exercises by name
4. As a user, I want to filter exercises by muscle group

### 5.2 Domain Entities

```typescript
// src/domains/exercises/types.ts

// Exercise entity
export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  description: string | null;
  isPredefined: boolean;
  userId: string | null; // null if predefined, userId if custom
  createdAt: Date;
}

// Exercise category (PRD section 8.2)
export type ExerciseCategory =
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'cardio';

// DTOs
export interface CreateCustomExerciseInput {
  name: string;
  category: ExerciseCategory;
  description?: string;
}

export interface UpdateCustomExerciseInput {
  name?: string;
  category?: ExerciseCategory;
  description?: string;
}

export interface ExerciseFilters {
  category?: ExerciseCategory;
  search?: string;
  includeCustom?: boolean;
}
```

### 5.3 Business Rules (PRD section 8.2)

#### Validation Rules

1. **Predefined vs Custom**
   - If isPredefined = true, userId must be null
   - If isPredefined = false, userId is required
   - Error: "Invalid exercise configuration"

2. **Name Required**
   - Name cannot be empty
   - Error: "Exercise name is required"

3. **Category Required**
   - Must be one of 7 categories
   - Error: "Invalid exercise category"

4. **Custom Exercise Privacy**
   - Custom exercises only visible to creator
   - Validation: Filter by userId in queries
   - Info: "This is a custom exercise only you can see"

5. **Prevent Duplicate Names**
   - User cannot create custom exercise with same name as predefined
   - User cannot create two custom exercises with same name
   - Error: "An exercise with this name already exists"

### 5.4 Zod Validation Schemas

```typescript
// src/domains/exercises/schema.ts
import { z } from 'zod';

// Exercise category enum
export const exerciseCategorySchema = z.enum([
  'chest',
  'back',
  'legs',
  'shoulders',
  'arms',
  'core',
  'cardio'
]);

// Create custom exercise schema
export const createCustomExerciseSchema = z.object({
  name: z.string()
    .min(1, 'Exercise name is required')
    .max(100, 'Exercise name must be less than 100 characters'),
  category: exerciseCategorySchema,
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
});

// Update custom exercise schema
export const updateCustomExerciseSchema = createCustomExerciseSchema.partial();

// Exercise filters schema
export const exerciseFiltersSchema = z.object({
  category: exerciseCategorySchema.optional(),
  search: z.string().max(100).optional(),
  includeCustom: z.boolean().optional()
});

// TypeScript types
export type CreateCustomExerciseInput = z.infer<typeof createCustomExerciseSchema>;
export type UpdateCustomExerciseInput = z.infer<typeof updateCustomExerciseSchema>;
export type ExerciseFilters = z.infer<typeof exerciseFiltersSchema>;
```

### 5.5 Server Actions Design

```typescript
// src/domains/exercises/actions.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { createCustomExerciseSchema, exerciseFiltersSchema } from './schema';
import { revalidatePath } from 'next/cache';

// ========================================
// Get All Exercises (predefined + user's custom)
// ========================================
export async function getAllExercises(filters?: unknown) {
  const session = await auth();

  // Parse filters
  const validatedFilters = filters
    ? exerciseFiltersSchema.safeParse(filters)
    : { success: true, data: {} };

  if (!validatedFilters.success) {
    return [];
  }

  const { category, search, includeCustom = true } = validatedFilters.data;

  const whereClause: any = {
    OR: [
      { isPredefined: true }, // All predefined exercises
      ...(session?.user && includeCustom
        ? [{ isPredefined: false, userId: session.user.id }] // User's custom exercises
        : []
      )
    ]
  };

  if (category) {
    whereClause.category = category;
  }

  if (search) {
    whereClause.name = {
      contains: search,
      mode: 'insensitive'
    };
  }

  const exercises = await db.exercise.findMany({
    where: whereClause,
    orderBy: [
      { isPredefined: 'desc' }, // Predefined first
      { name: 'asc' }
    ]
  });

  return exercises;
}

// ========================================
// Get Exercise by ID
// ========================================
export async function getExerciseById(exerciseId: string) {
  const session = await auth();

  const exercise = await db.exercise.findFirst({
    where: {
      id: exerciseId,
      OR: [
        { isPredefined: true },
        ...(session?.user ? [{ userId: session.user.id }] : [])
      ]
    }
  });

  return exercise;
}

// ========================================
// Create Custom Exercise
// ========================================
export async function createCustomExercise(input: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  const validated = createCustomExerciseSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors
    };
  }

  const { name, category, description } = validated.data;

  try {
    // Business rule: Check for duplicate names
    const existingExercise = await db.exercise.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        },
        OR: [
          { isPredefined: true },
          { userId: session.user.id }
        ]
      }
    });

    if (existingExercise) {
      return {
        success: false,
        error: 'An exercise with this name already exists'
      };
    }

    // Create custom exercise
    const exercise = await db.exercise.create({
      data: {
        name,
        category,
        description: description ?? null,
        isPredefined: false,
        userId: session.user.id,
        createdAt: new Date()
      }
    });

    revalidatePath('/exercises');

    return {
      success: true,
      exercise
    };
  } catch (error) {
    console.error('Create custom exercise error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}

// ========================================
// Delete Custom Exercise
// ========================================
export async function deleteCustomExercise(exerciseId: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Check if exercise is being used in any routines
    const usageCount = await db.routineExercise.count({
      where: { exerciseId }
    });

    if (usageCount > 0) {
      return {
        success: false,
        error: 'Cannot delete exercise that is being used in routines'
      };
    }

    // Delete exercise
    await db.exercise.delete({
      where: {
        id: exerciseId,
        userId: session.user.id,
        isPredefined: false
      }
    });

    revalidatePath('/exercises');

    return {
      success: true,
      message: 'Exercise deleted'
    };
  } catch (error) {
    console.error('Delete custom exercise error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}
```

### 5.6 React Query Hooks

```typescript
// src/domains/exercises/hooks/use-exercises.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllExercises,
  getExerciseById,
  createCustomExercise,
  deleteCustomExercise
} from '../actions';
import type { ExerciseFilters, CreateCustomExerciseInput } from '../types';

// Get all exercises (with filters)
export function useExercises(filters?: ExerciseFilters) {
  return useQuery({
    queryKey: ['exercises', filters],
    queryFn: () => getAllExercises(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes (exercises don't change often)
  });
}

// Get single exercise
export function useExercise(exerciseId: string) {
  return useQuery({
    queryKey: ['exercises', exerciseId],
    queryFn: () => getExerciseById(exerciseId),
    staleTime: 10 * 60 * 1000,
  });
}

// Create custom exercise mutation
export function useCreateCustomExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCustomExerciseInput) => createCustomExercise(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}

// Delete custom exercise mutation
export function useDeleteCustomExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (exerciseId: string) => deleteCustomExercise(exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}
```

---

## 6. Integration Points

### 6.1 Domain Interaction Map

```
┌─────────────┐
│    Auth     │──────────────────────────────────┐
└─────────────┘                                  │
       │                                         │
       │ (userId)                                │
       │                                         │
       ↓                                         ↓
┌─────────────┐         ┌─────────────┐   ┌─────────────┐
│  Routines   │────────>│  Exercises  │   │  Workouts   │
└─────────────┘         └─────────────┘   └─────────────┘
       │                      ↑                   │
       │ (routineId)          │                   │
       │                      │ (exerciseId)      │
       └──────────────────────┴───────────────────┘
                    (workout uses routine + exercises)
```

### 6.2 Cross-Domain Dependencies

#### Auth → All Domains
- **Dependency**: All domains require `userId` from auth session
- **Validation**: Every Server Action must validate session
- **Pattern**: `const session = await auth(); if (!session?.user) return error;`

#### Routines → Exercises
- **Dependency**: Routine exercises reference Exercise entity
- **Query**: When fetching routine, include exercise details
- **Pattern**: `include: { exercise: true }` in Prisma queries

#### Workouts → Routines
- **Dependency**: Workout sessions can be based on routine
- **Flow**: User starts session → copies exercises from RoutineDay → tracks actual performance
- **Optional**: Users can also start free session without routine

#### Workouts → Exercises
- **Dependency**: Workout exercises reference Exercise entity
- **Query**: When fetching session, include exercise details for display

### 6.3 Data Flow Examples

#### Example 1: Start Workout from Routine

```
1. User clicks "Start Workout" on Dashboard
2. UI calls startWorkoutSession({ routineId, routineDayId })
3. Server Action:
   a. Validates session (auth domain)
   b. Creates WorkoutSession record
   c. Fetches exercises from RoutineDay (routines domain)
   d. Creates WorkoutExercise records (copies from routine)
4. Returns active session to client
5. UI displays exercises with input fields for logging sets
```

#### Example 2: Log Set with Auto-Save

```
1. User enters weight/reps and marks set complete
2. UI calls logSet({ workoutExerciseId, setNumber, weight, reps })
3. Optimistic Update:
   a. React Query immediately updates cache
   b. UI shows set as saved (green checkmark)
4. Server Action:
   a. Validates session
   b. Creates or updates WorkoutSet record
5. Background refetch syncs with server
6. If conflict, server version wins (rollback optimistic update)
```

---

## 7. Error Handling Strategy

### 7.1 Error Types

```typescript
// src/lib/errors.ts

// Base error classes
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string) {
    super(message, 'BUSINESS_RULE_VIOLATION', 422);
    this.name = 'BusinessRuleError';
  }
}
```

### 7.2 Error Handling in Server Actions

```typescript
// Pattern for all Server Actions
export async function someAction(input: unknown) {
  try {
    // 1. Validate session
    const session = await auth();
    if (!session?.user) {
      throw new AuthenticationError();
    }

    // 2. Validate input
    const validated = someSchema.safeParse(input);
    if (!validated.success) {
      throw new ValidationError(validated.error.message);
    }

    // 3. Business logic
    // ...

    return { success: true, data: result };
  } catch (error) {
    // Structured error response
    if (error instanceof AppError) {
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }

    // Unknown error
    console.error('Unexpected error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}
```

### 7.3 Error Handling in React Query

```typescript
// Global error handling in QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        if (error instanceof AuthenticationError) return false;
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      onError: (error) => {
        // Global error handler
        if (error instanceof AuthenticationError) {
          // Redirect to login
          window.location.href = '/login';
        }
      }
    },
    mutations: {
      onError: (error) => {
        // Show toast notification
        toast.error(error.message || 'An error occurred');
      }
    }
  }
});
```

---

## 8. Implementation Order

### Phase 2A: Foundation (Week 1)
**Priority: P0 (Critical)**

1. **Database Setup**
   - Define Prisma schema for all entities
   - Create migrations
   - Seed predefined exercises (50+ from PRD)

2. **Auth Configuration**
   - Configure NextAuth.js
   - Set up session management
   - Create auth middleware

3. **Exercises Domain** (simplest, no dependencies)
   - `exercises/types.ts`
   - `exercises/schema.ts`
   - `exercises/actions.ts`
   - `exercises/hooks/use-exercises.ts`

**Success Criteria**: Can create custom exercises and fetch library

---

### Phase 2B: Routines Management (Week 2)
**Priority: P0 (Critical)**

1. **Routines Domain**
   - `routines/types.ts`
   - `routines/schema.ts`
   - `routines/actions.ts`
   - `routines/hooks/use-routines.ts`

2. **Integration**
   - Connect routine creation to exercises library
   - Implement activation logic (only 1 active)
   - Implement archiving logic (preserve history)

**Success Criteria**: Can create routine, add exercises, activate routine

---

### Phase 2C: Authentication (Week 2-3)
**Priority: P0 (Critical)**

1. **Auth Domain**
   - `auth/types.ts`
   - `auth/schema.ts`
   - `auth/actions.ts`
   - `auth/hooks/use-auth.ts`

2. **Integration**
   - Protect all routes with middleware
   - Add session validation to all Server Actions
   - Connect registration/login pages to actions

**Success Criteria**: Can register, login, logout, reset password

---

### Phase 2D: Workout Tracking (Week 3-4)
**Priority: P0 (Critical)**

1. **Workouts Domain**
   - `workouts/types.ts`
   - `workouts/schema.ts`
   - `workouts/actions.ts`
   - `workouts/stores/active-session-store.ts`
   - `workouts/hooks/use-workout-session.ts`

2. **Auto-Save Logic**
   - Implement optimistic updates in React Query
   - Add auto-save on every set log
   - Handle network failures gracefully

3. **Integration**
   - Start session from active routine
   - Copy exercises from routine to session
   - Track performance vs targets

**Success Criteria**: Can start session, log sets with auto-save, complete session

---

### Phase 2E: Polish & Testing (Week 4)
**Priority: P1 (High)**

1. **Error Handling**
   - Implement global error handlers
   - Add toast notifications
   - Handle offline scenarios

2. **Performance**
   - Optimize database queries (add indexes)
   - Implement pagination for history
   - Add loading states everywhere

3. **Testing**
   - Test all business rules
   - Test validation schemas
   - Test state transitions
   - Test cross-domain integrations

**Success Criteria**: All Phase 1 pages now work with real data

---

## 9. Files to Create

### 9.1 Auth Domain

```
src/domains/auth/
├── types.ts              ← User, AuthSession, credentials types
├── schema.ts             ← registerSchema, loginSchema, password validation
├── actions.ts            ← registerUser, loginUser, logoutUser, resetPassword
├── hooks/
│   └── use-auth.ts       ← useLogin, useRegister, useLogout hooks
└── errors.ts             ← AuthError, InvalidCredentialsError, etc.
```

### 9.2 Routines Domain

```
src/domains/routines/
├── types.ts              ← Routine, RoutineDay, RoutineExercise types
├── schema.ts             ← createRoutineSchema, addExerciseSchema, etc.
├── actions.ts            ← createRoutine, activateRoutine, archiveRoutine, etc.
└── hooks/
    └── use-routines.ts   ← useRoutines, useCreateRoutine, useActivateRoutine
```

### 9.3 Workouts Domain

```
src/domains/workouts/
├── types.ts              ← WorkoutSession, WorkoutExercise, WorkoutSet types
├── schema.ts             ← startSessionSchema, logSetSchema, completeSessionSchema
├── actions.ts            ← startSession, logSet, completeSession, etc.
├── stores/
│   └── active-session-store.ts  ← Zustand store for UI state (timer, rest, etc.)
└── hooks/
    └── use-workout-session.ts   ← useActiveSession, useLogSet, useCompleteSession
```

### 9.4 Exercises Domain

```
src/domains/exercises/
├── types.ts              ← Exercise, ExerciseCategory types
├── schema.ts             ← createCustomExerciseSchema, exerciseFiltersSchema
├── actions.ts            ← getAllExercises, createCustomExercise, etc.
└── hooks/
    └── use-exercises.ts  ← useExercises, useCreateCustomExercise
```

### 9.5 Shared Infrastructure

```
src/lib/
├── auth.ts               ← NextAuth configuration (UPDATE)
├── db.ts                 ← Prisma client (UPDATE with new schema)
├── errors.ts             ← Global error classes (NEW)
└── middleware.ts         ← Route protection middleware (UPDATE)

prisma/
├── schema.prisma         ← Complete database schema (NEW)
├── migrations/           ← Database migrations (NEW)
└── seed.ts               ← Seed predefined exercises (NEW)
```

---

## 10. Architectural Decisions

### 10.1 Why Server Actions Instead of Repository Pattern?

**Decision**: Use Server Actions as single layer combining validation + logic + persistence

**Reasoning**:
1. **Next.js 15 Native**: Server Actions are first-class citizens in Next.js 15
2. **Type Safety**: Automatic TypeScript inference across client-server boundary
3. **Less Boilerplate**: No need for Controller → Service → Repository layers
4. **Performance**: Direct database access without unnecessary abstractions
5. **Simplicity**: Easier to understand and maintain

**Trade-off**:
- ❌ Less abstraction (harder to swap database provider)
- ✅ But for this app, we won't change database, so unnecessary abstraction is waste

---

### 10.2 Why React Query for Server State?

**Decision**: Use React Query for all server data (users, routines, workouts, exercises)

**Reasoning**:
1. **Automatic Caching**: No manual cache management needed
2. **Optimistic Updates**: Built-in support for instant UI updates
3. **Background Refetching**: Keeps data fresh automatically
4. **Error Handling**: Centralized error handling with retry logic
5. **Loading States**: Automatic isLoading, isError states

**Alternative Rejected**: Zustand for server state
- ❌ Manual cache invalidation (error-prone)
- ❌ No automatic refetching
- ❌ No optimistic updates
- ❌ More code to maintain

---

### 10.3 Why Zustand for UI State Only?

**Decision**: Use Zustand ONLY for UI preferences (sidebar, filters, timers)

**Reasoning**:
1. **Clear Separation**: Server data (React Query) vs UI state (Zustand)
2. **Persistence**: Zustand's persist middleware for localStorage
3. **Simplicity**: No provider needed (unlike Context)
4. **Performance**: Minimal re-renders

**Critical Rule**: ❌ NEVER use Zustand for backend data (violates architecture constraint)

---

### 10.4 Why OPTION A (Fixed Exercise Structure)?

**Decision**: Each exercise has fixed configuration (e.g., "3 sets x 10 reps")

**Reasoning** (from PRD decision):
1. **Simplicity**: Covers 80% of use cases (most users do uniform sets)
2. **Faster Development**: Saves 1-2 weeks vs OPTION B (flexible structure)
3. **Simpler UX**: Fewer fields, less confusion for users
4. **Simpler Data Model**: Fewer entities, easier queries

**Future**: Can implement OPTION B (flexible sets) in Phase 2+ if users request

---

### 10.5 Why Auto-Save with Optimistic Updates?

**Decision**: Auto-save every set log with optimistic updates

**Reasoning**:
1. **Data Loss Prevention**: Users won't lose progress if app crashes
2. **Better UX**: Instant feedback (no waiting for server)
3. **Realistic**: Network failures handled gracefully with rollback

**Implementation**:
- React Query's `onMutate` for optimistic update
- `onError` for rollback if server fails
- `onSettled` for background refetch to sync

---

## Questions & Clarifications Needed

### Q1: Password Reset Email Service (P1)

**Question**: Which email service to use for password reset emails?

**Options**:
- A. Resend (simple, modern API)
- B. SendGrid (popular, robust)
- C. AWS SES (cheapest for high volume)

**Recommendation**: Resend (simplest integration for MVP)

**Blocker**: Needed before Phase 2C (Auth domain)

---

### Q2: Session Storage Strategy (P2)

**Question**: Where to store active workout session data during workout?

**Options**:
- A. Server only (fetch on every page load)
- B. localStorage + server (sync periodically)
- C. IndexedDB + server (for offline support)

**Recommendation**: **A** for MVP (simpler), **B** for Phase 2+ (better UX)

**Blocker**: Needed before Phase 2D (Workouts domain)

---

### Q3: Real-Time Progress Updates (P3)

**Question**: Should other devices see workout progress in real-time?

**Options**:
- A. No real-time (refetch on focus)
- B. Polling (refetch every 30 seconds)
- C. WebSocket (instant sync)

**Recommendation**: **A** for MVP (single-user app, no need for real-time)

**Blocker**: Not blocking, nice-to-have for future

---

## Summary

This plan defines complete business logic architecture for Phase 2:

**Key Entities Designed**:
- ✅ User (auth)
- ✅ Routine, RoutineDay, RoutineExercise
- ✅ WorkoutSession, WorkoutExercise, WorkoutSet
- ✅ Exercise (predefined + custom)

**Repository Contracts Defined**:
- ✅ Using Server Actions pattern (no traditional repositories)
- ✅ All CRUD operations defined for each domain
- ✅ React Query hooks for client-side data fetching

**Critical Business Rules Identified**:
- ✅ Password requirements (8+ chars, 1 letter, 1 number)
- ✅ Only 1 active routine at a time
- ✅ Preserve workout history when deleting routines
- ✅ Auto-save workout sets to prevent data loss
- ✅ Session validation in all Server Actions

**Recommended Implementation Order**:
1. Week 1: Database + Exercises domain (no dependencies)
2. Week 2: Routines domain + Auth domain
3. Week 3-4: Workouts domain (most complex, depends on all others)
4. Week 4: Polish, testing, error handling

**Architectural Decisions Made**:
- ✅ Server Actions > Repository pattern (Next.js 15 native)
- ✅ React Query for server state (NOT Zustand)
- ✅ Zustand only for UI state (timers, filters)
- ✅ OPTION A: Fixed exercise structure (simpler MVP)
- ✅ Auto-save with optimistic updates (better UX)

**Ready for Implementation**: Parent agent can now execute this plan step-by-step. All domain models, validation schemas, and Server Actions are fully specified with code examples.

---

**Plan Status**: ✅ Complete and Ready for Approval

**Next Action**: Parent agent reviews plan and begins implementation starting with Phase 2A (Database + Exercises domain)
