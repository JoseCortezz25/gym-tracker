// Exercises Domain Validation Schemas

import { z } from 'zod';
import { ExerciseCategory } from '@prisma/client';

// ============================================================================
// Exercise Category Enum
// ============================================================================

export const exerciseCategorySchema = z.nativeEnum(ExerciseCategory);

// ============================================================================
// Exercise Filters Schema
// ============================================================================

export const exerciseFiltersSchema = z.object({
  category: exerciseCategorySchema.optional(),
  search: z.string().optional(),
  isPredefined: z.boolean().optional()
});

export type ExerciseFiltersInput = z.infer<typeof exerciseFiltersSchema>;

// ============================================================================
// Create Custom Exercise Schema
// ============================================================================

export const createCustomExerciseSchema = z.object({
  name: z
    .string()
    .min(2, 'Exercise name must be at least 2 characters')
    .max(100, 'Exercise name must be less than 100 characters'),
  category: exerciseCategorySchema,
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
});

export type CreateCustomExerciseInput = z.infer<
  typeof createCustomExerciseSchema
>;
