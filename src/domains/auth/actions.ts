'use server';

// Auth Domain Server Actions
// Following Server Actions pattern: validation + authorization + logic + persistence

import { hash, compare } from 'bcryptjs';
import { signIn, signOut } from '@/lib/auth';
import { authRepository } from './repository';
import {
  loginSchema,
  registerSchema,
  passwordResetRequestSchema,
  passwordResetConfirmSchema
} from './schema';
import type { AuthResponse, PasswordResetResponse, SafeUser } from './types';

// ============================================================================
// Helper Functions
// ============================================================================

function createSafeUser(user: {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}): SafeUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLoginAt: user.lastLoginAt
  };
}

// ============================================================================
// Register User
// ============================================================================

export async function registerUser(input: unknown): Promise<AuthResponse> {
  try {
    // 1. Validate input
    const validated = registerSchema.safeParse(input);

    if (!validated.success) {
      return {
        success: false,
        error: 'Invalid input',
        errors: validated.error.flatten().fieldErrors
      };
    }

    const { email, password, name } = validated.data;

    // 2. Check if user already exists
    const existingUser = await authRepository.findByEmail(email);

    if (existingUser) {
      return {
        success: false,
        error: 'An account with this email already exists'
      };
    }

    // 3. Hash password
    const passwordHash = await hash(password, 12);

    // 4. Create user
    const user = await authRepository.create({
      email,
      passwordHash,
      name: name ?? (undefined as string | undefined)
    });

    // 5. Auto-login after registration
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    // Check if sign in was successful
    if (result?.error) {
      return {
        success: false,
        error:
          'Account created but failed to sign in. Please try logging in manually.'
      };
    }

    // 6. Return success
    return {
      success: true,
      user: createSafeUser(user),
      message: 'Account created successfully'
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Register error:', error);
    return {
      success: false,
      error: 'Failed to create account. Please try again.'
    };
  }
}

// ============================================================================
// Login User
// ============================================================================

export async function loginUser(input: unknown): Promise<AuthResponse> {
  try {
    // 1. Validate input
    const validated = loginSchema.safeParse(input);

    if (!validated.success) {
      return {
        success: false,
        error: 'Invalid input',
        errors: validated.error.flatten().fieldErrors
      };
    }

    const { email, password } = validated.data;

    // 2. Find user
    const user = await authRepository.findByEmail(email);

    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // 3. Verify password
    const isPasswordValid = await compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // 4. Update last login
    await authRepository.updateLastLogin(user.id);

    // 5. Sign in with NextAuth
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    if (result?.error) {
      return {
        success: false,
        error: 'Failed to sign in. Please try again.'
      };
    }

    // 6. Return success
    return {
      success: true,
      user: createSafeUser(user),
      message: 'Logged in successfully'
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Failed to sign in. Please try again.'
    };
  }
}

// ============================================================================
// Logout User
// ============================================================================

export async function logoutUser(): Promise<{ success: boolean }> {
  try {
    await signOut({ redirect: false });
    return { success: true };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Logout error:', error);
    return { success: false };
  }
}

// ============================================================================
// Request Password Reset (DUMMY - See technical-debt.md)
// ============================================================================

export async function requestPasswordReset(
  input: unknown
): Promise<PasswordResetResponse> {
  try {
    // 1. Validate input
    const validated = passwordResetRequestSchema.safeParse(input);

    if (!validated.success) {
      return {
        success: false,
        error: 'Invalid email address'
      };
    }

    const { email } = validated.data;

    // 2. Check if user exists
    const user = await authRepository.findByEmail(email);

    // Always return success to prevent email enumeration
    // In production, we would send an email here

    // TODO: Implement real email sending (see technical-debt.md)
    // For now, just log the token (DEVELOPMENT ONLY)
    if (user && process.env.NODE_ENV === 'development') {
      const resetToken = `dummy-token-${user.id}-${Date.now()}`;
      console.log('Password reset token:', resetToken);
      console.log(
        'Reset URL:',
        `http://localhost:3000/reset-password?token=${resetToken}`
      );
    }

    return {
      success: true,
      message:
        'If an account exists with this email, you will receive a password reset link.'
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Password reset request error:', error);
    return {
      success: false,
      error: 'Failed to process request. Please try again.'
    };
  }
}

// ============================================================================
// Confirm Password Reset (DUMMY - See technical-debt.md)
// ============================================================================

export async function confirmPasswordReset(
  input: unknown
): Promise<PasswordResetResponse> {
  try {
    // 1. Validate input
    const validated = passwordResetConfirmSchema.safeParse(input);

    if (!validated.success) {
      return {
        success: false,
        error: 'Invalid input'
      };
    }

    // TODO: Implement real token validation and password update
    // For now, return error indicating feature is not implemented

    return {
      success: false,
      error:
        'Password reset feature is not yet implemented. Please contact support.'
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Password reset confirm error:', error);
    return {
      success: false,
      error: 'Failed to reset password. Please try again.'
    };
  }
}
