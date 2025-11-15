/**
 * Workout Splits Domain - Zod Validation Schemas
 *
 * Validation schemas for workout splits domain.
 * Used for Server Actions input validation and form validation.
 */

import { z } from 'zod';
import { TrainingFocus } from '@prisma/client';

// ============================================================================
// ENUM SCHEMAS
// ============================================================================

/**
 * Training Focus Schema
 */
export const trainingFocusSchema = z.nativeEnum(TrainingFocus, {
  errorMap: () => ({
    message: 'Invalid training focus. Must be LEGS, ARMS, FULL_BODY, or CORE.'
  })
});

// ============================================================================
// INPUT VALIDATION SCHEMAS
// ============================================================================

/**
 * Workout Assessment Input Schema
 * Validates pre-assessment form data
 */
export const workoutAssessmentInputSchema = z.object({
  frequency: z
    .number({
      required_error: 'Frequency is required',
      invalid_type_error: 'Frequency must be a number'
    })
    .int('Frequency must be a whole number')
    .min(3, 'Frequency must be at least 3 days per week')
    .max(6, 'Frequency must be at most 6 days per week'),

  trainingFocus: trainingFocusSchema
});

export type WorkoutAssessmentInputSchema = z.infer<
  typeof workoutAssessmentInputSchema
>;

/**
 * Set Data Input Schema
 * Validates individual set logging data
 */
export const setDataInputSchema = z.object({
  exerciseId: z.string().cuid('Invalid exercise ID'),

  weight: z
    .number({
      required_error: 'Weight is required',
      invalid_type_error: 'Weight must be a number'
    })
    .nonnegative('Weight must be non-negative')
    .max(500, 'Weight must be less than 500 kg'),

  reps: z
    .number({
      required_error: 'Reps are required',
      invalid_type_error: 'Reps must be a number'
    })
    .int('Reps must be a whole number')
    .positive('Reps must be positive')
    .max(100, 'Reps must be less than 100'),

  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
});

export type SetDataInputSchema = z.infer<typeof setDataInputSchema>;

/**
 * Finalize Workout Input Schema
 * Validates workout completion data
 */
export const finalizeWorkoutInputSchema = z.object({
  splitId: z.string().cuid('Invalid split ID'),

  sessionId: z.string().cuid('Invalid session ID'),

  duration: z
    .number()
    .int('Duration must be a whole number')
    .positive('Duration must be positive')
    .max(14400, 'Duration must be less than 4 hours') // 4 hours in seconds
    .optional(),

  rating: z
    .number()
    .int('Rating must be a whole number')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
    .optional(),

  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
});

export type FinalizeWorkoutInputSchema = z.infer<
  typeof finalizeWorkoutInputSchema
>;

/**
 * Toggle Exercise Completion Schema
 */
export const toggleExerciseCompletionSchema = z.object({
  splitExerciseId: z.string().cuid('Invalid split exercise ID'),
  isCompleted: z.boolean()
});

export type ToggleExerciseCompletionSchema = z.infer<
  typeof toggleExerciseCompletionSchema
>;

/**
 * Update Split Schema
 */
export const updateSplitSchema = z.object({
  splitId: z.string().cuid('Invalid split ID'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  subtitle: z
    .string()
    .max(200, 'Subtitle must be less than 200 characters')
    .optional()
});

export type UpdateSplitSchema = z.infer<typeof updateSplitSchema>;

/**
 * Start Workout Session Schema
 */
export const startWorkoutSessionSchema = z.object({
  splitId: z.string().cuid('Invalid split ID'),
  assessmentId: z.string().cuid('Invalid assessment ID')
});

export type StartWorkoutSessionSchema = z.infer<
  typeof startWorkoutSessionSchema
>;

/**
 * Get Weight History Schema
 */
export const getWeightHistorySchema = z.object({
  exerciseId: z.string().cuid('Invalid exercise ID'),
  limit: z.number().int().positive().max(20).default(5)
});

export type GetWeightHistorySchema = z.infer<typeof getWeightHistorySchema>;

// ============================================================================
// ENTITY VALIDATION SCHEMAS (for server-side validation)
// ============================================================================

/**
 * Workout Split Schema
 * Validates workout split data
 */
export const workoutSplitSchema = z.object({
  name: z
    .string()
    .min(1, 'Split name is required')
    .max(100, 'Split name must be less than 100 characters'),

  subtitle: z
    .string()
    .max(200, 'Subtitle must be less than 200 characters')
    .optional(),

  splitLetter: z
    .string()
    .length(1, 'Split letter must be a single character')
    .regex(/^[A-Z]$/, 'Split letter must be A-Z'),

  order: z
    .number()
    .int('Order must be a whole number')
    .nonnegative('Order must be non-negative')
    .max(6, 'Order must be less than 7'),

  assessmentId: z.string().cuid('Invalid assessment ID')
});

export type WorkoutSplitSchema = z.infer<typeof workoutSplitSchema>;

/**
 * Split Exercise Schema
 * Validates split exercise assignment
 */
export const splitExerciseSchema = z.object({
  splitId: z.string().cuid('Invalid split ID'),

  exerciseId: z.string().cuid('Invalid exercise ID'),

  order: z
    .number()
    .int('Order must be a whole number')
    .positive('Order must be positive')
    .max(20, 'Order must be less than 21'),

  targetSets: z
    .number()
    .int('Target sets must be a whole number')
    .positive('Target sets must be positive')
    .max(10, 'Target sets must be less than 11'),

  targetReps: z
    .string()
    .min(1, 'Target reps are required')
    .max(20, 'Target reps must be less than 20 characters')
    .regex(
      /^(\d+(-\d+)?|AMRAP)$/,
      'Target reps must be a number, range (e.g., 8-12), or AMRAP'
    ),

  targetWeight: z
    .number()
    .nonnegative('Target weight must be non-negative')
    .max(500, 'Target weight must be less than 500 kg')
    .optional()
    .nullable(),

  restSeconds: z
    .number()
    .int('Rest seconds must be a whole number')
    .nonnegative('Rest seconds must be non-negative')
    .max(600, 'Rest seconds must be less than 10 minutes')
    .optional()
    .nullable(),

  videoId: z
    .string()
    .length(11, 'YouTube video ID must be 11 characters')
    .regex(/^[a-zA-Z0-9_-]{11}$/, 'Invalid YouTube video ID format')
    .optional()
    .nullable(),

  imageUrl: z
    .string()
    .url('Invalid image URL')
    .max(500, 'Image URL must be less than 500 characters')
    .optional()
    .nullable(),

  notes: z
    .string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional()
    .nullable()
});

export type SplitExerciseSchema = z.infer<typeof splitExerciseSchema>;

/**
 * Weight History Schema
 * Validates weight history entry
 */
export const weightHistorySchema = z.object({
  userId: z.string().cuid('Invalid user ID'),

  exerciseId: z.string().cuid('Invalid exercise ID'),

  weight: z
    .number()
    .nonnegative('Weight must be non-negative')
    .max(500, 'Weight must be less than 500 kg'),

  reps: z
    .number()
    .int('Reps must be a whole number')
    .positive('Reps must be positive')
    .max(100, 'Reps must be less than 100'),

  sets: z
    .number()
    .int('Sets must be a whole number')
    .positive('Sets must be positive')
    .max(10, 'Sets must be less than 10'),

  workoutSessionId: z
    .string()
    .cuid('Invalid workout session ID')
    .optional()
    .nullable()
});

export type WeightHistorySchema = z.infer<typeof weightHistorySchema>;

// ============================================================================
// FORM SCHEMAS (for React Hook Form)
// ============================================================================

/**
 * Pre-Assessment Form Schema
 * For client-side form validation with React Hook Form
 */
export const preAssessmentFormSchema = workoutAssessmentInputSchema.extend({
  // Additional client-side validation can be added here
  // For example, custom error messages or UI-specific validations
});

export type PreAssessmentFormSchema = z.infer<typeof preAssessmentFormSchema>;

/**
 * Set Logging Form Schema
 * For client-side set logging form
 */
export const setLoggingFormSchema = setDataInputSchema.extend({
  setNumber: z.number().int().positive().max(10),
  workoutExerciseId: z.string().cuid('Invalid workout exercise ID')
});

export type SetLoggingFormSchema = z.infer<typeof setLoggingFormSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate Pre-Assessment Input
 * Helper function for validating pre-assessment data
 */
export function validatePreAssessmentInput(data: unknown) {
  return workoutAssessmentInputSchema.safeParse(data);
}

/**
 * Validate Set Data
 * Helper function for validating set data
 */
export function validateSetData(data: unknown) {
  return setDataInputSchema.safeParse(data);
}

/**
 * Validate Finalize Workout
 * Helper function for validating finalize workout data
 */
export function validateFinalizeWorkout(data: unknown) {
  return finalizeWorkoutInputSchema.safeParse(data);
}
