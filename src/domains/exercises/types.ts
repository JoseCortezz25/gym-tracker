// Exercises Domain Types

import type { Exercise, ExerciseCategory } from '@prisma/client';

// ============================================================================
// Exercise Types
// ============================================================================

export type { Exercise, ExerciseCategory };

// ============================================================================
// Filter Types
// ============================================================================

export interface ExerciseFilters {
  category?: ExerciseCategory;
  search?: string;
  isPredefined?: boolean;
}

// ============================================================================
// Server Action Response Types
// ============================================================================

export interface ExercisesSuccessResponse {
  success: true;
  exercises: Exercise[];
}

export interface ExerciseSuccessResponse {
  success: true;
  exercise: Exercise;
  message?: string;
}

export interface ExerciseErrorResponse {
  success: false;
  error: string;
  errors?: Record<string, string[]>;
}

export type ExercisesResponse =
  | ExercisesSuccessResponse
  | ExerciseErrorResponse;

export type ExerciseResponse = ExerciseSuccessResponse | ExerciseErrorResponse;
