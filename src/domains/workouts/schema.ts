// Workouts Domain Validation Schemas

import { z } from 'zod';

// Workout Session Schemas

export const startWorkoutSchema = z.object({
  routineId: z.string().cuid('Invalid routine ID').optional()
});

export const completeWorkoutSchema = z.object({
  sessionId: z.string().cuid('Invalid session ID'),
  rating: z.number().int().min(1).max(5).optional(),
  notes: z.string().max(500).trim().optional()
});

export const cancelWorkoutSchema = z.object({
  sessionId: z.string().cuid('Invalid session ID')
});

// Workout Exercise Schemas

export const addWorkoutExerciseSchema = z.object({
  workoutSessionId: z.string().cuid('Invalid workout session ID'),
  exerciseId: z.string().cuid('Invalid exercise ID'),
  order: z.number().int().min(1),
  notes: z.string().max(500).trim().optional(),
  restSeconds: z.number().int().min(0).max(600).optional() // 0-10 minutes
});

// Workout Set Schemas

export const logSetSchema = z.object({
  workoutExerciseId: z.string().cuid('Invalid workout exercise ID'),
  setNumber: z.number().int().min(1).max(20),
  weight: z.number().min(0, 'Weight cannot be negative'),
  reps: z.number().int().min(0, 'Reps cannot be negative').max(999),
  notes: z
    .string()
    .max(500, 'Notes must be 500 characters or less')
    .trim()
    .optional(),
  isCompleted: z.boolean().default(false)
});

// Type Inference

export type StartWorkoutInput = z.infer<typeof startWorkoutSchema>;
export type CompleteWorkoutInput = z.infer<typeof completeWorkoutSchema>;
export type CancelWorkoutInput = z.infer<typeof cancelWorkoutSchema>;
export type AddWorkoutExerciseInput = z.infer<typeof addWorkoutExerciseSchema>;
export type LogSetInput = z.infer<typeof logSetSchema>;
