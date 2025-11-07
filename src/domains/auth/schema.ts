// Auth Domain Validation Schemas
// Shared between client and server for DRY principle

import { z } from 'zod';

// Validation Rules (from PRD 8.1)

const emailValidation = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address');

const passwordValidation = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Login Schema

export const loginSchema = z.object({
  email: emailValidation,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
});

export type LoginInput = z.infer<typeof loginSchema>;

// Register Schema

export const registerSchema = z
  .object({
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    name: z.string().optional()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// Password Reset Request Schema

export const passwordResetRequestSchema = z.object({
  email: emailValidation
});

export type PasswordResetRequestInput = z.infer<
  typeof passwordResetRequestSchema
>;

// Password Reset Confirm Schema

export const passwordResetConfirmSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: passwordValidation,
    confirmPassword: z.string().min(1, 'Please confirm your password')
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

export type PasswordResetConfirmInput = z.infer<
  typeof passwordResetConfirmSchema
>;

// Password Requirements Helper (for UI display)

export const passwordRequirements = [
  {
    label: 'At least 8 characters',
    test: (password: string) => password.length >= 8
  },
  {
    label: 'Contains a letter',
    test: (password: string) => /[a-zA-Z]/.test(password)
  },
  {
    label: 'Contains a number',
    test: (password: string) => /[0-9]/.test(password)
  }
] as const;
