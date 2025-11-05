# Phase 2 - Next.js 15 App Router Architecture Plan

**Created**: 2025-11-05
**Session**: phase2-logic-20251105
**Agent**: nextjs-builder
**Complexity**: High
**Status**: 📋 Ready for Implementation

---

## Executive Summary

This plan defines the complete Next.js 15 App Router architecture for Phase 2, integrating React Server Components, Server Actions, and optimal data flow patterns with the domain business logic designed by domain-architect.

**Key Architecture Decisions**:
- ✅ React Server Components by default (only Client Components when necessary)
- ✅ Server Actions for ALL mutations with mandatory session validation
- ✅ Suspense boundaries for async operations
- ✅ React Query for client-side server state management
- ✅ Middleware-based route protection
- ✅ Progressive enhancement with useActionState
- ✅ Optimistic updates for workout session auto-save

---

## Table of Contents

1. [App Router Structure & RSC/Client Boundaries](#1-app-router-structure--rscclient-boundaries)
2. [Server Actions Implementation](#2-server-actions-implementation)
3. [React Server Components Strategy](#3-react-server-components-strategy)
4. [Client-Side Data Management](#4-client-side-data-management)
5. [Authentication Integration](#5-authentication-integration)
6. [Form Handling Strategy](#6-form-handling-strategy)
7. [Caching Strategy](#7-caching-strategy)
8. [Performance Optimizations](#8-performance-optimizations)
9. [Migration Steps from Phase 1 to Phase 2](#9-migration-steps-from-phase-1-to-phase-2)
10. [Implementation Checklist](#10-implementation-checklist)

---

## 1. App Router Structure & RSC/Client Boundaries

### 1.1 Complete App Directory Structure

```
src/app/
├── layout.tsx                    # ✅ Root layout (Server Component)
├── page.tsx                      # ✅ Landing page (Server Component)
├── loading.tsx                   # ✅ Root loading state
├── error.tsx                     # ❌ Root error boundary (Client Component)
├── not-found.tsx                 # ✅ 404 page (Server Component)
│
├── (auth)/                       # Route group (no URL segment)
│   ├── layout.tsx                # ✅ Auth layout (Server Component)
│   ├── login/
│   │   ├── page.tsx              # ❌ Client Component (form interactivity)
│   │   ├── loading.tsx           # ✅ Loading state
│   │   └── error.tsx             # ❌ Error boundary
│   ├── register/
│   │   ├── page.tsx              # ❌ Client Component (complex form)
│   │   ├── loading.tsx           # ✅ Loading state
│   │   └── error.tsx             # ❌ Error boundary
│   └── forgot-password/
│       ├── page.tsx              # ❌ Client Component (form)
│       └── loading.tsx           # ✅ Loading state
│
├── (app)/                        # Protected route group
│   ├── layout.tsx                # ✅ Server Component (fetches session)
│   ├── dashboard/
│   │   ├── page.tsx              # ✅ Server Component (fetches stats)
│   │   ├── loading.tsx           # ✅ Loading state
│   │   └── error.tsx             # ❌ Error boundary
│   │
│   ├── routines/
│   │   ├── page.tsx              # ✅ Server Component (fetches routines)
│   │   ├── loading.tsx           # ✅ Loading state
│   │   ├── error.tsx             # ❌ Error boundary
│   │   └── [id]/
│   │       ├── page.tsx          # ✅ Server Component (fetches routine)
│   │       └── edit/
│   │           └── page.tsx      # ❌ Client Component (interactive editor)
│   │
│   ├── workout/
│   │   ├── active/
│   │   │   ├── page.tsx          # ❌ Client Component (real-time logging)
│   │   │   ├── loading.tsx       # ✅ Loading state
│   │   │   └── error.tsx         # ❌ Error boundary
│   │   └── history/
│   │       ├── page.tsx          # ✅ Server Component (fetches history)
│   │       └── [id]/
│   │           └── page.tsx      # ✅ Server Component (fetches session)
│   │
│   └── exercises/
│       ├── page.tsx              # ✅ Server Component (fetches exercises)
│       ├── loading.tsx           # ✅ Loading state
│       └── error.tsx             # ❌ Error boundary
│
└── api/                          # API routes (if needed)
    └── webhooks/
        └── route.ts              # ✅ Webhook handler
```

### 1.2 RSC/Client Component Decision Matrix

| Page | Type | Reason |
|------|------|--------|
| `app/layout.tsx` | ✅ Server | Root layout, no interactivity |
| `app/page.tsx` | ✅ Server | Landing page, static content |
| `app/(auth)/login/page.tsx` | ❌ Client | Form with useActionState |
| `app/(auth)/register/page.tsx` | ❌ Client | Complex form with React Hook Form |
| `app/(app)/layout.tsx` | ✅ Server | Fetches session, renders layout |
| `app/(app)/dashboard/page.tsx` | ✅ Server | Fetches stats, minimal interactivity |
| `app/(app)/routines/page.tsx` | ✅ Server | Fetches routines, passes to client |
| `app/(app)/workout/active/page.tsx` | ❌ Client | Real-time logging, useState |
| `app/(app)/workout/history/page.tsx` | ✅ Server | Fetches history, static |

**Rule**: Start Server Component → Add `"use client"` only when:
- Browser interactivity (useState, useEffect)
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, geolocation)
- Third-party libraries requiring browser

### 1.3 Data Fetching Patterns

#### Pattern A: Server Component Direct Fetch

```typescript
// app/(app)/dashboard/page.tsx
// ✅ Server Component - fetches data directly
import { Suspense } from 'react';
import { getUserRoutines } from '@/domains/routines/actions';
import { getWorkoutStats } from '@/domains/workouts/actions';
import { DashboardStats } from '@/domains/workouts/components/dashboard-stats';
import { RoutineCard } from '@/domains/routines/components/routine-card';

export default async function DashboardPage() {
  // ✅ Parallel data fetching
  const [stats, routines] = await Promise.all([
    getWorkoutStats(),
    getUserRoutines()
  ]);

  return (
    <div className="space-y-8">
      <h1>Dashboard</h1>

      {/* ✅ Server Component receiving data */}
      <DashboardStats stats={stats} />

      {/* ✅ Suspense for async child components */}
      <Suspense fallback={<RoutineCardSkeleton />}>
        <RoutinesList routines={routines} />
      </Suspense>
    </div>
  );
}
```

#### Pattern B: Client Component with React Query

```typescript
// app/(app)/routines/page.tsx
// ✅ Server Component wrapper
import { Suspense } from 'react';
import { getUserRoutines } from '@/domains/routines/actions';
import { RoutinesList } from '@/domains/routines/components/routines-list';

export default async function RoutinesPage() {
  // ✅ Initial data fetch on server
  const initialRoutines = await getUserRoutines();

  return (
    <div className="space-y-6">
      <h1>My Routines</h1>

      {/* ❌ Client Component receives initial data */}
      <Suspense fallback={<RoutinesListSkeleton />}>
        <RoutinesList initialData={initialRoutines} />
      </Suspense>
    </div>
  );
}

// domains/routines/components/routines-list.tsx
'use client';
import { useRoutines } from '../hooks/use-routines';

export function RoutinesList({ initialData }) {
  // ✅ React Query uses initial data, then manages cache
  const { data: routines, isLoading } = useRoutines({ initialData });

  // Interactive list with mutations...
}
```

#### Pattern C: Client-Only Fetch (Rare)

```typescript
// app/(app)/workout/active/page.tsx
'use client';
import { useActiveSession } from '@/domains/workouts/hooks/use-workout-session';

export default function ActiveWorkoutPage() {
  // ❌ Client Component - fetches on mount
  const { data: session, isLoading } = useActiveSession();

  if (isLoading) return <ActiveWorkoutSkeleton />;
  if (!session) return <NoActiveSessionState />;

  return <ActiveWorkoutInterface session={session} />;
}
```

**When to Use Each Pattern**:
- Pattern A: Static pages, no mutations (dashboard, history)
- Pattern B: Pages with mutations, optimistic updates (routines list)
- Pattern C: Real-time pages requiring constant updates (active workout)

---

## 2. Server Actions Implementation

### 2.1 Server Action Pattern Template

All Server Actions MUST follow this pattern:

```typescript
// domains/{domain}/actions.ts
'use server';

import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { someSchema } from './schema';

// ========================================
// Action Template
// ========================================
export async function someAction(input: unknown) {
  // 1. SESSION VALIDATION (MANDATORY)
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      error: 'Unauthorized'
    };
  }

  // 2. INPUT VALIDATION
  const validated = someSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors
    };
  }

  // 3. AUTHORIZATION (if needed)
  if (!session.user.roles.includes('required-role')) {
    return {
      success: false,
      error: 'Forbidden'
    };
  }

  try {
    // 4. BUSINESS LOGIC
    const data = validated.data;

    // Business rule checks...
    if (someBusinessRule) {
      return {
        success: false,
        error: 'Business rule violation message'
      };
    }

    // 5. PERSISTENCE
    const result = await db.entity.create({
      data: { ...data, userId: session.user.id }
    });

    // 6. CACHE INVALIDATION
    revalidatePath('/relevant-path');
    // OR
    revalidateTag('relevant-tag');

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Action error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}
```

### 2.2 Session Validation Pattern

**File**: `src/lib/auth-utils.ts` (NEW)

```typescript
'use server';

import { auth } from '@/lib/auth';

// ========================================
// Reusable Session Validation
// ========================================
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireRole(role: string) {
  const session = await requireAuth();
  if (!session.user.roles?.includes(role)) {
    throw new Error('Forbidden');
  }
  return session;
}

// Usage in Server Actions
export async function someAdminAction(input: unknown) {
  const session = await requireRole('admin');
  // ... rest of action
}
```

### 2.3 Cache Revalidation Strategy

| Mutation | Revalidation Strategy |
|----------|----------------------|
| Create routine | `revalidatePath('/routines')` |
| Update routine | `revalidatePath('/routines')`, `revalidatePath('/dashboard')` |
| Activate routine | `revalidatePath('/routines')`, `revalidatePath('/dashboard')` |
| Log workout set | No revalidation (silent auto-save) |
| Complete workout | `revalidatePath('/dashboard')`, `revalidatePath('/history')` |
| Create exercise | `revalidatePath('/exercises')` |

**Revalidate Path vs Tag**:
- `revalidatePath`: Revalidate all data on specific route
- `revalidateTag`: Revalidate specific cached queries (use with `fetch` tags)

```typescript
// Example: Tag-based revalidation
export async function getRoutines() {
  const routines = await fetch('/api/routines', {
    next: {
      revalidate: 3600, // 1 hour
      tags: ['routines']
    }
  });
}

// In mutation
revalidateTag('routines'); // Only invalidates routine queries
```

### 2.4 Error Response Format

**Standard Error Response**:

```typescript
// Success
return {
  success: true,
  data: result,
  message?: 'Optional success message'
};

// Validation Error
return {
  success: false,
  errors: {
    email: ['Invalid email format'],
    password: ['Password too short']
  }
};

// Business Rule Error
return {
  success: false,
  error: 'You already have an active routine'
};

// Unexpected Error
return {
  success: false,
  error: 'An unexpected error occurred'
};
```

---

## 3. React Server Components Strategy

### 3.1 Root Layout (Server Component)

**File**: `src/app/layout.tsx` (UPDATE)

```typescript
// ✅ Server Component
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/lib/providers/query-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gym Tracker',
  description: 'Track your workouts and progress',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ✅ QueryProvider is Client Component wrapper */}
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
```

### 3.2 Protected App Layout (Server Component)

**File**: `src/app/(app)/layout.tsx` (UPDATE)

```typescript
// ✅ Server Component - fetches session
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AppSidebar } from '@/components/organisms/app-sidebar';
import { AppHeader } from '@/components/organisms/app-header';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Fetch session on server
  const session = await auth();

  // ✅ Server-side redirect if not authenticated
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      {/* ✅ Pass session to client components */}
      <AppSidebar user={session.user} />

      <div className="flex-1">
        <AppHeader user={session.user} />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### 3.3 Dashboard Page (Server Component)

**File**: `src/app/(app)/dashboard/page.tsx` (UPDATE)

```typescript
// ✅ Server Component
import { Suspense } from 'react';
import { getUserRoutines } from '@/domains/routines/actions';
import { getWorkoutStats } from '@/domains/workouts/actions';
import { getActiveSession } from '@/domains/workouts/actions';
import { DashboardStats } from '@/domains/workouts/components/dashboard-stats';
import { ActiveRoutineCard } from '@/domains/routines/components/active-routine-card';
import { RecentActivity } from '@/domains/workouts/components/recent-activity';
import { workoutsTextMap } from '@/domains/workouts/workouts.text-map';

export default async function DashboardPage() {
  const text = workoutsTextMap.dashboard;

  // ✅ Parallel data fetching
  const [stats, routines, activeSession] = await Promise.all([
    getWorkoutStats(),
    getUserRoutines(),
    getActiveSession()
  ]);

  const activeRoutine = routines?.find(r => r.isActive);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {text.heading}
        </h1>
        <p className="mt-2 text-gray-600">
          {text.welcome.replace('{name}', 'User')}
        </p>
      </div>

      {/* ✅ Stats cards - Server Component */}
      <DashboardStats stats={stats} />

      {/* ✅ Active routine or start prompt */}
      <Suspense fallback={<ActiveRoutineCardSkeleton />}>
        <ActiveRoutineCard
          routine={activeRoutine}
          hasActiveSession={!!activeSession}
        />
      </Suspense>

      {/* ✅ Recent activity with Suspense */}
      <Suspense fallback={<RecentActivitySkeleton />}>
        <RecentActivity />
      </Suspense>
    </div>
  );
}
```

### 3.4 Routines Page (Server Component)

**File**: `src/app/(app)/routines/page.tsx` (UPDATE)

```typescript
// ✅ Server Component
import { Suspense } from 'react';
import { getUserRoutines } from '@/domains/routines/actions';
import { getAllExercises } from '@/domains/exercises/actions';
import { RoutinesList } from '@/domains/routines/components/routines-list';
import { CreateRoutineButton } from '@/domains/routines/components/create-routine-button';

export default async function RoutinesPage() {
  // ✅ Fetch initial data on server
  const [routines, exercises] = await Promise.all([
    getUserRoutines(),
    getAllExercises()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Routines</h1>

        {/* ❌ Client Component for dialog interaction */}
        <CreateRoutineButton exercises={exercises} />
      </div>

      {/* ❌ Client Component for mutations (activate, archive) */}
      <Suspense fallback={<RoutinesListSkeleton />}>
        <RoutinesList initialData={routines} />
      </Suspense>
    </div>
  );
}
```

### 3.5 Active Workout Page (Client Component)

**File**: `src/app/(app)/workout/active/page.tsx` (UPDATE)

```typescript
'use client';

// ❌ Client Component - real-time interactivity required
import { useActiveSession, useLogSet } from '@/domains/workouts/hooks/use-workout-session';
import { ActiveWorkoutInterface } from '@/domains/workouts/components/active-workout-interface';
import { NoActiveSessionState } from '@/domains/workouts/components/no-active-session-state';
import { ActiveWorkoutSkeleton } from '@/domains/workouts/components/active-workout-skeleton';

export default function ActiveWorkoutPage() {
  // ✅ React Query hook for real-time data
  const { data: session, isLoading } = useActiveSession();
  const logSetMutation = useLogSet();

  if (isLoading) {
    return <ActiveWorkoutSkeleton />;
  }

  if (!session) {
    return <NoActiveSessionState />;
  }

  return (
    <ActiveWorkoutInterface
      session={session}
      onLogSet={logSetMutation.mutate}
    />
  );
}
```

### 3.6 Suspense Boundary Placement

**Rule**: Wrap EVERY async Server Component in Suspense

```typescript
// ❌ WRONG: No Suspense
export default async function Page() {
  const data = await fetchData();
  return <DataDisplay data={data} />;
}

// ✅ CORRECT: With Suspense
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<DataDisplaySkeleton />}>
      <DataSection />
    </Suspense>
  );
}

async function DataSection() {
  const data = await fetchData();
  return <DataDisplay data={data} />;
}
```

**Multiple Suspense Boundaries** (granular loading):

```typescript
export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* ✅ Stats load independently */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>

      {/* ✅ Active routine loads independently */}
      <Suspense fallback={<ActiveRoutineSkeleton />}>
        <ActiveRoutineSection />
      </Suspense>

      {/* ✅ Recent activity loads independently */}
      <Suspense fallback={<RecentActivitySkeleton />}>
        <RecentActivitySection />
      </Suspense>
    </div>
  );
}
```

---

## 4. Client-Side Data Management

### 4.1 React Query Setup

**File**: `src/lib/providers/query-provider.tsx` (NEW)

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute default
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
            retry: (failureCount, error) => {
              // Don't retry on 401/403
              if (error instanceof Error &&
                  (error.message.includes('Unauthorized') ||
                   error.message.includes('Forbidden'))) {
                return false;
              }
              return failureCount < 3;
            },
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
          },
          mutations: {
            onError: (error) => {
              // Global error handling
              console.error('Mutation error:', error);
              // Could add toast notification here
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 4.2 React Query Hooks Configuration

**Stale Time Strategy**:

| Data Type | Stale Time | Reason |
|-----------|-----------|--------|
| Exercises | 10 minutes | Rarely change |
| Routines | 2 minutes | Change occasionally |
| Active session | 30 seconds | Real-time tracking |
| Workout history | 5 minutes | Historical data |
| User profile | 5 minutes | Rarely changes |

### 4.3 Optimistic Updates Pattern

**File**: `src/domains/workouts/hooks/use-workout-session.ts` (from domain-architect plan)

```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logSet } from '../actions';
import type { LogSetInput } from '../types';

export function useLogSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LogSetInput) => logSet(input),

    // ✅ STEP 1: Optimistic update (before server responds)
    onMutate: async (newSet) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['workouts', 'active'] });

      // Snapshot current data
      const previousSession = queryClient.getQueryData(['workouts', 'active']);

      // Optimistically update cache
      queryClient.setQueryData(['workouts', 'active'], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          exercises: old.exercises.map((ex: any) =>
            ex.id === newSet.workoutExerciseId
              ? {
                  ...ex,
                  sets: [
                    ...ex.sets,
                    {
                      ...newSet,
                      id: 'temp-' + Date.now(), // Temporary ID
                      createdAt: new Date()
                    }
                  ]
                }
              : ex
          )
        };
      });

      // Return context for rollback
      return { previousSession };
    },

    // ✅ STEP 2: Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousSession) {
        queryClient.setQueryData(['workouts', 'active'], context.previousSession);
      }
      console.error('Failed to log set:', err);
    },

    // ✅ STEP 3: Sync with server
    onSettled: () => {
      // Background refetch to sync with server
      queryClient.invalidateQueries({ queryKey: ['workouts', 'active'] });
    },
  });
}
```

### 4.4 Cache Invalidation Strategy

**Manual Invalidation**:

```typescript
// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ['routines'] });

// Invalidate multiple related queries
queryClient.invalidateQueries({ queryKey: ['routines'] });
queryClient.invalidateQueries({ queryKey: ['dashboard'] });

// Invalidate all queries (rarely needed)
queryClient.invalidateQueries();
```

**Automatic Invalidation**:

```typescript
export function useCreateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRoutine,
    onSuccess: (data) => {
      // ✅ Automatic invalidation on success
      queryClient.invalidateQueries({ queryKey: ['routines'] });

      // ✅ Optionally set data directly (faster)
      queryClient.setQueryData(['routines', data.id], data);
    },
  });
}
```

---

## 5. Authentication Integration

### 5.1 NextAuth v5 Configuration

**File**: `src/lib/auth.ts` (UPDATE)

```typescript
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { compare } from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user
        const user = await db.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user) {
          return null;
        }

        // Verify password
        const isValid = await compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) {
          return null;
        }

        // Return user object
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
});
```

### 5.2 Middleware for Route Protection

**File**: `src/middleware.ts` (NEW)

```typescript
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Public routes (allow without auth)
  const publicRoutes = ['/', '/login', '/register', '/forgot-password'];
  if (publicRoutes.includes(pathname)) {
    // If already logged in, redirect to dashboard
    if (session?.user && pathname !== '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes (require auth)
  if (!session?.user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

### 5.3 Accessing Session in Components

#### Server Components

```typescript
// ✅ Server Component - direct auth() call
import { auth } from '@/lib/auth';

export default async function Page() {
  const session = await auth();

  return (
    <div>
      Welcome, {session?.user?.name || 'Guest'}
    </div>
  );
}
```

#### Client Components

```typescript
// ❌ Client Component - use React Query hook
'use client';
import { useSession } from '@/domains/auth/hooks/use-session';

export function UserMenu() {
  const { data: session, isLoading } = useSession();

  if (isLoading) return <Skeleton />;

  return (
    <div>
      {session?.user?.name}
    </div>
  );
}

// Hook definition
// src/domains/auth/hooks/use-session.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../actions';

export function useSession() {
  return useQuery({
    queryKey: ['auth', 'session'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

---

## 6. Form Handling Strategy

### 6.1 Simple Forms: useActionState + Server Actions

**Use for**: Login, password reset, simple mutations

**File**: `src/app/(auth)/login/page.tsx` (UPDATE)

```typescript
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginUser } from '@/domains/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Signing in...' : 'Sign In'}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginUser, null);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Login</h2>

      <form action={formAction} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
          {state?.errors?.email && (
            <p className="text-sm text-red-600">{state.errors.email[0]}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
          {state?.errors?.password && (
            <p className="text-sm text-red-600">{state.errors.password[0]}</p>
          )}
        </div>

        {/* Global Error */}
        {state?.error && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-800">{state.error}</p>
          </div>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}
```

**Server Action**:

```typescript
// domains/auth/actions.ts
'use server';

import { loginSchema } from './schema';

export async function loginUser(prevState: any, formData: FormData) {
  // 1. Validate
  const validated = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors
    };
  }

  // 2. Authenticate
  try {
    const result = await signIn('credentials', {
      email: validated.data.email,
      password: validated.data.password,
      redirect: false
    });

    if (!result.ok) {
      return { error: 'Invalid email or password' };
    }

    // 3. Redirect (client-side via useEffect)
    return { success: true };
  } catch (error) {
    return { error: 'An unexpected error occurred' };
  }
}
```

### 6.2 Complex Forms: React Hook Form

**Use for**: Registration, routine editor, profile settings

**File**: `src/app/(auth)/register/page.tsx` (UPDATE)

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '@/domains/auth/hooks/use-auth';
import { registerSchema } from '@/domains/auth/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    await registerMutation.mutateAsync(data);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Create Account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Server Error */}
        {registerMutation.error && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-800">
              {registerMutation.error.message}
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || registerMutation.isPending}
          className="w-full"
        >
          {isSubmitting || registerMutation.isPending
            ? 'Creating account...'
            : 'Create Account'}
        </Button>
      </form>
    </div>
  );
}
```

### 6.3 Form Strategy Decision Matrix

| Form Type | Strategy | When to Use |
|-----------|----------|-------------|
| Login | useActionState | 2-3 fields, simple validation |
| Password reset request | useActionState | 1 field (email only) |
| Registration | React Hook Form | 3+ fields, complex validation |
| Routine editor | React Hook Form | Multi-step, dynamic fields |
| Exercise search | useState | Filter only, no submission |
| Workout set logging | useState + mutation | Real-time, minimal fields |

---

## 7. Caching Strategy

### 7.1 Next.js Cache Layers

Next.js 15 has 4 cache layers:

1. **Request Memoization** (per-request, automatic)
2. **Data Cache** (persistent, opt-in)
3. **Full Route Cache** (build-time, Server Components)
4. **Router Cache** (client-side, navigation)

### 7.2 Data Cache Configuration

```typescript
// Default: No caching (Next.js 15 change)
const data = await fetch('/api/data');

// Cache for 1 hour
const data = await fetch('/api/data', {
  next: { revalidate: 3600 }
});

// Cache indefinitely (static)
const data = await fetch('/api/data', {
  cache: 'force-cache'
});

// Never cache (always fresh)
const data = await fetch('/api/data', {
  cache: 'no-store'
});
```

### 7.3 Revalidation Strategy

**Path-based Revalidation**:

```typescript
// domains/routines/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createRoutine(input: unknown) {
  // ... create routine logic

  // Revalidate all routines pages
  revalidatePath('/routines');

  // Revalidate dashboard (shows active routine)
  revalidatePath('/dashboard');

  return { success: true, routine };
}
```

**Tag-based Revalidation**:

```typescript
// Fetch with tags
const routines = await fetch('/api/routines', {
  next: {
    revalidate: 3600,
    tags: ['routines', 'user-data']
  }
});

// In mutation
import { revalidateTag } from 'next/cache';

revalidateTag('routines'); // Only invalidates routine queries
revalidateTag('user-data'); // Invalidates all user data
```

### 7.4 Caching Decision Matrix

| Data Type | Strategy | Reason |
|-----------|----------|--------|
| Predefined exercises | `revalidate: 86400` (24h) | Static data |
| User routines | `revalidatePath` on mutations | Changes on CRUD |
| Active session | React Query (no Next.js cache) | Real-time |
| Workout history | `revalidate: 3600` (1h) | Historical data |
| User profile | `revalidate: 3600` (1h) | Rarely changes |

### 7.5 Preventing Cache Issues

**Problem**: Stale data after mutation

```typescript
// ❌ WRONG: Mutation doesn't invalidate cache
export async function updateRoutine(id: string, data: any) {
  await db.routine.update({ where: { id }, data });
  return { success: true };
}

// ✅ CORRECT: Mutation invalidates cache
export async function updateRoutine(id: string, data: any) {
  await db.routine.update({ where: { id }, data });

  revalidatePath('/routines');
  revalidatePath('/dashboard');

  return { success: true };
}
```

---

## 8. Performance Optimizations

### 8.1 Parallel Data Fetching

**Pattern**: Use `Promise.all` in Server Components

```typescript
// ❌ WRONG: Sequential fetching (slow)
export default async function Page() {
  const routines = await getUserRoutines();
  const exercises = await getAllExercises();
  const stats = await getWorkoutStats();

  return <PageContent />;
}

// ✅ CORRECT: Parallel fetching (fast)
export default async function Page() {
  const [routines, exercises, stats] = await Promise.all([
    getUserRoutines(),
    getAllExercises(),
    getWorkoutStats()
  ]);

  return <PageContent />;
}
```

### 8.2 Streaming with Suspense

**Pattern**: Load critical content first, stream secondary content

```typescript
export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* ✅ Critical: Load immediately */}
      <h1>Dashboard</h1>

      {/* ✅ Important: Load with fallback */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>

      {/* ✅ Secondary: Stream later */}
      <Suspense fallback={<RecentActivitySkeleton />}>
        <RecentActivitySection />
      </Suspense>
    </div>
  );
}
```

### 8.3 Image Optimization

**Use Next.js Image Component**:

```typescript
import Image from 'next/image';

export function ExerciseCard({ exercise }) {
  return (
    <div>
      <Image
        src={exercise.imageUrl}
        alt={exercise.name}
        width={300}
        height={200}
        placeholder="blur"
        blurDataURL="/placeholder.jpg"
        priority={false} // Only true for above-fold images
      />
    </div>
  );
}
```

### 8.4 Bundle Size Optimization

**Dynamic Imports for Heavy Components**:

```typescript
import dynamic from 'next/dynamic';

// ✅ Lazy load heavy chart library
const WorkoutChart = dynamic(
  () => import('@/domains/workouts/components/workout-chart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false // Client-only component
  }
);

export function WorkoutHistory() {
  return (
    <div>
      <h2>Workout History</h2>
      <WorkoutChart data={data} />
    </div>
  );
}
```

### 8.5 React Query Optimizations

**Prefetching**:

```typescript
'use client';

import { useQueryClient } from '@tanstack/react-query';
import { getUserRoutines } from '@/domains/routines/actions';

export function DashboardPage() {
  const queryClient = useQueryClient();

  // ✅ Prefetch on hover
  const handlePrefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ['routines'],
      queryFn: getUserRoutines
    });
  };

  return (
    <Link
      href="/routines"
      onMouseEnter={handlePrefetch}
    >
      My Routines
    </Link>
  );
}
```

**Pagination**:

```typescript
export function useWorkoutHistory(page: number) {
  return useQuery({
    queryKey: ['workouts', 'history', page],
    queryFn: () => getWorkoutHistory({ page, limit: 20 }),
    staleTime: 5 * 60 * 1000,
    // ✅ Keep previous data while fetching next page
    placeholderData: keepPreviousData
  });
}
```

---

## 9. Migration Steps from Phase 1 to Phase 2

### Step 1: Setup Infrastructure (Week 1)

**A. Install Dependencies**

```bash
npm install @tanstack/react-query@^5.0.0
npm install @tanstack/react-query-devtools
npm install next-auth@beta
npm install bcryptjs
npm install @types/bcryptjs -D
```

**B. Create QueryProvider**

- Create `src/lib/providers/query-provider.tsx`
- Wrap app in `src/app/layout.tsx`

**C. Configure NextAuth**

- Update `src/lib/auth.ts`
- Create `src/middleware.ts`

### Step 2: Auth Domain Integration (Week 1-2)

**Files to Create/Update**:

- `src/domains/auth/types.ts` (NEW)
- `src/domains/auth/schema.ts` (NEW)
- `src/domains/auth/actions.ts` (NEW)
- `src/domains/auth/hooks/use-auth.ts` (NEW)
- `src/app/(auth)/login/page.tsx` (UPDATE to useActionState)
- `src/app/(auth)/register/page.tsx` (UPDATE to React Hook Form)

**Testing**:
- Register new user
- Login with credentials
- Session persists on refresh
- Logout works
- Middleware redirects

### Step 3: Exercises Domain (Week 2)

**Files to Create**:

- `src/domains/exercises/types.ts` (NEW)
- `src/domains/exercises/schema.ts` (NEW)
- `src/domains/exercises/actions.ts` (NEW)
- `src/domains/exercises/hooks/use-exercises.ts` (NEW)

**Database**:
- Create Prisma schema
- Run migrations
- Seed predefined exercises

**Testing**:
- Fetch exercises
- Filter by category
- Search by name

### Step 4: Routines Domain (Week 2-3)

**Files to Create**:

- `src/domains/routines/types.ts` (NEW)
- `src/domains/routines/schema.ts` (NEW)
- `src/domains/routines/actions.ts` (NEW)
- `src/domains/routines/hooks/use-routines.ts` (NEW)
- `src/app/(app)/routines/page.tsx` (UPDATE to Server Component)

**Testing**:
- Create routine
- Add exercises to routine
- Activate routine (only 1 active)
- Archive routine (preserves history)

### Step 5: Dashboard Integration (Week 3)

**Files to Update**:

- `src/app/(app)/dashboard/page.tsx` (UPDATE to Server Component)
- Create `src/domains/workouts/actions.ts` (getWorkoutStats)

**Testing**:
- Stats show real data
- Active routine displays
- Start workout button works

### Step 6: Workouts Domain (Week 3-4)

**Files to Create**:

- `src/domains/workouts/types.ts` (NEW)
- `src/domains/workouts/schema.ts` (NEW)
- `src/domains/workouts/actions.ts` (NEW)
- `src/domains/workouts/stores/active-session-store.ts` (NEW)
- `src/domains/workouts/hooks/use-workout-session.ts` (NEW)
- `src/app/(app)/workout/active/page.tsx` (UPDATE with real logic)

**Testing**:
- Start workout session
- Log sets with auto-save
- Optimistic updates work
- Complete session
- Summary displays

### Step 7: Polish & Testing (Week 4)

**Tasks**:
- Add loading states everywhere
- Add error boundaries
- Test offline scenarios
- Performance audit
- Accessibility audit

---

## 10. Implementation Checklist

### Phase 2A: Foundation

- [ ] Install React Query dependencies
- [ ] Create QueryProvider and wrap app
- [ ] Configure NextAuth v5
- [ ] Create middleware for route protection
- [ ] Setup Prisma schema
- [ ] Create database migrations
- [ ] Seed predefined exercises
- [ ] Test: Can access protected routes only when authenticated

### Phase 2B: Auth Domain

- [ ] Create auth types, schemas, actions
- [ ] Create auth hooks (useLogin, useRegister, useLogout)
- [ ] Update login page to use useActionState
- [ ] Update register page to use React Hook Form
- [ ] Implement password reset flow
- [ ] Test: Register, login, logout, password reset all work

### Phase 2C: Exercises Domain

- [ ] Create exercises types, schemas, actions
- [ ] Create exercises hooks (useExercises, useCreateCustomExercise)
- [ ] Test: Fetch exercises, filter, search, create custom

### Phase 2D: Routines Domain

- [ ] Create routines types, schemas, actions
- [ ] Create routines hooks (useRoutines, useCreateRoutine, etc.)
- [ ] Update routines page to Server Component
- [ ] Implement CRUD operations
- [ ] Test: Create, activate, archive, delete routines

### Phase 2E: Dashboard Integration

- [ ] Create getWorkoutStats Server Action
- [ ] Update dashboard page to Server Component
- [ ] Implement parallel data fetching
- [ ] Add Suspense boundaries
- [ ] Test: Dashboard shows real stats and active routine

### Phase 2F: Workouts Domain

- [ ] Create workouts types, schemas, actions
- [ ] Create active-session-store (Zustand for UI state)
- [ ] Create workouts hooks with optimistic updates
- [ ] Update active workout page with real logic
- [ ] Implement auto-save mechanism
- [ ] Test: Start, log sets, complete session, auto-save works

### Phase 2G: Polish

- [ ] Add loading.tsx to all routes
- [ ] Add error.tsx to all routes
- [ ] Test error scenarios
- [ ] Test offline scenarios
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit
- [ ] Add toast notifications for errors

---

## Summary

This Next.js 15 App Router architecture plan provides:

**✅ Clear RSC/Client Boundaries**: Server Components by default, Client Components only when necessary
**✅ Server Actions Pattern**: Mandatory session validation, structured error responses, cache revalidation
**✅ React Query Integration**: Automatic caching, optimistic updates, background refetching
**✅ NextAuth v5**: Session management, middleware-based route protection
**✅ Form Handling**: useActionState for simple forms, React Hook Form for complex forms
**✅ Caching Strategy**: revalidatePath for mutations, stale-time configuration for React Query
**✅ Performance Optimizations**: Parallel fetching, Suspense streaming, prefetching, dynamic imports
**✅ Migration Steps**: Clear week-by-week plan from Phase 1 UI to Phase 2 logic

**Integration with Domain Architect Plan**:
- All Server Actions follow the pattern defined in domain-architect plan
- React Query hooks use the designs from domain-architect plan
- Optimistic updates pattern matches workout session auto-save requirements
- Business rules enforced at Server Action level

**Ready for Implementation**: Parent agent can now execute this plan, starting with Phase 2A (Foundation).

---

**Next Steps**:
1. Parent agent reviews this plan
2. Begin implementation with Phase 2A (Foundation setup)
3. Proceed sequentially through phases
4. Test each phase before moving to next
5. Final integration and polish in Phase 2G
