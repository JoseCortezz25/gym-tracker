/**
 * Workout Splits Domain - Type Definitions
 *
 * TypeScript types and interfaces for the workout splits system.
 * These types represent the domain entities and their relationships.
 */

import type {
  TrainingFocus,
  WorkoutAssessment,
  WorkoutSplit,
  SplitExercise,
  WeightHistory,
  Exercise,
  WorkoutSession
} from '@prisma/client';

// ============================================================================
// CORE DOMAIN TYPES
// ============================================================================

/**
 * Training Focus Options
 * Determines how exercises are distributed across workout splits
 */
export type { TrainingFocus };

export const TRAINING_FOCUS_OPTIONS = [
  'LEGS',
  'ARMS',
  'FULL_BODY',
  'CORE'
] as const;

/**
 * Workout Assessment with related data
 * Represents a user's workout preferences and current progress
 */
export type WorkoutAssessmentWithSplits = WorkoutAssessment & {
  splits: WorkoutSplitWithExercises[];
};

/**
 * Workout Split with exercises and completion data
 */
export type WorkoutSplitWithExercises = WorkoutSplit & {
  exercises: SplitExerciseWithDetails[];
  assessment: WorkoutAssessment;
  _count?: {
    exercises: number;
    workoutSessions: number;
  };
};

/**
 * Split Exercise with full exercise details
 */
export type SplitExerciseWithDetails = SplitExercise & {
  exercise: Exercise;
};

/**
 * Split with progress tracking
 * Includes completion status for current session
 */
export type SplitWithProgress = WorkoutSplit & {
  exercises: SplitExerciseWithCompletion[];
  completionPercentage: number;
  totalExercises: number;
  completedExercises: number;
  isCurrentSplit: boolean;
};

/**
 * Split Exercise with completion status
 */
export type SplitExerciseWithCompletion = SplitExerciseWithDetails & {
  isCompleted: boolean;
  lastWeight?: number;
  lastReps?: number;
  lastCompletedAt?: Date;
};

/**
 * Weight History Entry
 * Represents a single weight history record
 */
export type WeightHistoryEntry = WeightHistory & {
  exercise: Exercise;
  workoutSession?: WorkoutSession | null;
};

/**
 * Exercise Weight History
 * Aggregated weight history for an exercise
 */
export interface ExerciseWeightHistory {
  exerciseId: string;
  exerciseName: string;
  entries: WeightHistoryEntry[];
  trend: 'increasing' | 'decreasing' | 'stable' | 'insufficient_data';
  latestWeight: number | null;
  maxWeight: number | null;
  avgWeight: number | null;
}

/**
 * Workout Completion Dates
 * For habit tracking calendar
 */
export interface WorkoutCompletionDates {
  dates: Date[];
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
}

// ============================================================================
// INPUT TYPES (for forms and mutations)
// ============================================================================

/**
 * Pre-Assessment Form Input
 */
export interface WorkoutAssessmentInput {
  frequency: number; // 3-6 days per week
  trainingFocus: TrainingFocus;
}

/**
 * Split Generation Input
 * Used internally by the split generation algorithm
 */
export interface SplitGenerationInput {
  frequency: number;
  trainingFocus: TrainingFocus;
  userId: string;
}

/**
 * Set Data Input
 * For recording individual set performance
 */
export interface SetDataInput {
  exerciseId: string;
  weight: number;
  reps: number;
  notes?: string;
}

/**
 * Finalize Workout Input
 */
export interface FinalizeWorkoutInput {
  splitId: string;
  sessionId: string;
  duration?: number; // in seconds
  rating?: number; // 1-5
  notes?: string;
}

// ============================================================================
// VALIDATION RESULT TYPES
// ============================================================================

/**
 * Validation Result
 * Standard structure for validation responses
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Completion Validation Result
 * Specific validation for workout completion
 */
export interface CompletionValidationResult extends ValidationResult {
  canFinalize: boolean;
  missingExercises: string[];
  incompleteSets: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Split Letter Type
 * Valid split letters (A-Z)
 */
export type SplitLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

/**
 * Weight History Trend
 */
export type WeightTrend =
  | 'increasing'
  | 'decreasing'
  | 'stable'
  | 'insufficient_data';

/**
 * Workout Split Card Status
 * For UI rendering
 */
export type SplitCardStatus = 'current' | 'completed' | 'upcoming' | 'skipped';

// ============================================================================
// SERVER ACTION RESPONSE TYPES
// ============================================================================

/**
 * Server Action Response
 * Standard response structure for all Server Actions
 */
export interface ServerActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: Record<string, string[]>;
}

/**
 * Create Assessment Response
 */
export type CreateAssessmentResponse =
  ServerActionResponse<WorkoutAssessmentWithSplits>;

/**
 * Get Active Assessment Response
 */
export type GetActiveAssessmentResponse =
  ServerActionResponse<WorkoutAssessmentWithSplits | null>;

/**
 * Get Current Split Response
 */
export type GetCurrentSplitResponse = ServerActionResponse<SplitWithProgress>;

/**
 * Get Weight History Response
 */
export type GetWeightHistoryResponse =
  ServerActionResponse<ExerciseWeightHistory>;

/**
 * Finalize Workout Response
 */
export type FinalizeWorkoutResponse = ServerActionResponse<{
  sessionId: string;
  nextSplitId: string;
  completedAt: Date;
}>;
