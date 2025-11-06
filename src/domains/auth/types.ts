// Auth Domain Types
// Following domain-driven design with clear type definitions

import type { User } from '@prisma/client';

// ============================================================================
// User Types
// ============================================================================

export type { User };

export type SafeUser = Omit<User, 'passwordHash'>;

// ============================================================================
// Credentials Types
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================================================
// Server Action Response Types
// ============================================================================

export interface AuthSuccessResponse {
  success: true;
  user: SafeUser;
  message?: string;
}

export interface AuthErrorResponse {
  success: false;
  error: string;
  errors?: Record<string, string[]>;
}

export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;

export interface PasswordResetSuccessResponse {
  success: true;
  message: string;
}

export interface PasswordResetErrorResponse {
  success: false;
  error: string;
}

export type PasswordResetResponse =
  | PasswordResetSuccessResponse
  | PasswordResetErrorResponse;
