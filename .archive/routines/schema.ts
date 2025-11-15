// Routines Domain Validation Schemas
// Shared between client and server for DRY principle

import { z } from 'zod';

// Training Division Schemas (UPDATED)

export const createDivisionSchema = z.object({
  routineId: z.string().cuid('Invalid routine ID'),
  name: z
    .string()
    .min(1, 'Division name is required')
    .max(50, 'Division name must be less than 50 characters')
    .trim(),
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters')
    .trim()
    .optional(),
  frequency: z
    .number()
    .int('Frequency must be a whole number')
    .min(1, 'Frequency must be at least 1 time per week')
    .max(7, 'Frequency cannot exceed 7 times per week'),
  order: z.number().int().min(1, 'Order must be at least 1')
});

export const updateDivisionSchema = z.object({
  id: z.string().cuid('Invalid division ID'),
  name: z
    .string()
    .min(1, 'Division name is required')
    .max(50, 'Division name must be less than 50 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters')
    .trim()
    .optional()
    .nullable(),
  frequency: z
    .number()
    .int('Frequency must be a whole number')
    .min(1, 'Frequency must be at least 1 time per week')
    .max(7, 'Frequency cannot exceed 7 times per week')
    .optional(),
  order: z.number().int().min(1, 'Order must be at least 1').optional()
});

// Routine Schemas (Keep existing)

export const createRoutineSchema = z.object({
  name: z
    .string()
    .min(1, 'Routine name is required')
    .max(100, 'Routine name must be less than 100 characters')
    .trim()
});

export const updateRoutineSchema = z.object({
  id: z.string().cuid('Invalid routine ID'),
  name: z
    .string()
    .min(1, 'Routine name is required')
    .max(100, 'Routine name must be less than 100 characters')
    .trim()
});

// Division Exercise Schemas (UPDATED)

// Target reps validation: allows "8-12", "10", "15-20", "AMRAP"
const targetRepsRegex = /^(\d+(-\d+)?|AMRAP)$/i;

// YouTube video ID validation (11 alphanumeric characters and hyphens/underscores)
const youtubeIdRegex = /^[a-zA-Z0-9_-]{11}$/;

export const addDivisionExerciseSchema = z.object({
  divisionId: z.string().cuid('Invalid division ID'),
  exerciseId: z.string().cuid('Invalid exercise ID'),
  order: z.number().int().min(1, 'Order must be at least 1'),
  targetSets: z
    .number()
    .int()
    .min(1, 'Target sets must be at least 1')
    .max(20, 'Target sets cannot exceed 20'),
  targetReps: z
    .string()
    .regex(
      targetRepsRegex,
      'Target reps must be a number, range (e.g., "8-12"), or "AMRAP"'
    )
    .trim(),
  targetWeight: z
    .number()
    .min(0, 'Target weight cannot be negative')
    .optional(),
  restSeconds: z
    .number()
    .int()
    .min(0, 'Rest time cannot be negative')
    .max(600, 'Rest time cannot exceed 10 minutes')
    .optional(),
  videoId: z
    .string()
    .regex(youtubeIdRegex, 'Invalid YouTube video ID (must be 11 characters)')
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(5000, 'Notes must be less than 5000 characters')
    .trim()
    .optional()
});

export const updateDivisionExerciseSchema = z.object({
  id: z.string().cuid('Invalid exercise ID'),
  order: z.number().int().min(1, 'Order must be at least 1').optional(),
  targetSets: z
    .number()
    .int()
    .min(1, 'Target sets must be at least 1')
    .max(20, 'Target sets cannot exceed 20')
    .optional(),
  targetReps: z
    .string()
    .regex(
      targetRepsRegex,
      'Target reps must be a number, range (e.g., "8-12"), or "AMRAP"'
    )
    .trim()
    .optional(),
  targetWeight: z
    .number()
    .min(0, 'Target weight cannot be negative')
    .optional(),
  restSeconds: z
    .number()
    .int()
    .min(0, 'Rest time cannot be negative')
    .max(600, 'Rest time cannot exceed 10 minutes')
    .optional(),
  videoId: z
    .string()
    .regex(youtubeIdRegex, 'Invalid YouTube video ID (must be 11 characters)')
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(5000, 'Notes must be less than 5000 characters')
    .trim()
    .optional()
});

// YouTube Video URL Helper

/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - Direct video ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

// Type Inference

export type CreateRoutineInput = z.infer<typeof createRoutineSchema>;
export type UpdateRoutineInput = z.infer<typeof updateRoutineSchema>;
export type CreateDivisionInput = z.infer<typeof createDivisionSchema>;
export type UpdateDivisionInput = z.infer<typeof updateDivisionSchema>;
export type AddDivisionExerciseInput = z.infer<
  typeof addDivisionExerciseSchema
>;
export type UpdateDivisionExerciseInput = z.infer<
  typeof updateDivisionExerciseSchema
>;
