// Workouts Domain Types

import type {
  WorkoutSession,
  WorkoutExercise,
  WorkoutSet,
  WorkoutStatus
} from '@prisma/client';

// Domain Types

export type { WorkoutSession, WorkoutExercise, WorkoutSet, WorkoutStatus };

// Extended Types

export type WorkoutSetWithDetails = WorkoutSet;

export type WorkoutExerciseWithDetails = WorkoutExercise & {
  exercise: {
    id: string;
    name: string;
    category: string;
  };
  sets: WorkoutSet[];
};

export type WorkoutSessionWithDetails = WorkoutSession & {
  routine: {
    id: string;
    name: string;
  } | null;
  exercises: WorkoutExerciseWithDetails[];
};

// API Response Types

export type WorkoutSessionResponse =
  | {
      success: true;
      data: WorkoutSessionWithDetails;
    }
  | {
      success: false;
      error: string;
    };

export type WorkoutSessionsResponse =
  | {
      success: true;
      data: WorkoutSessionWithDetails[];
    }
  | {
      success: false;
      error: string;
    };

export type WorkoutMutationResponse =
  | {
      success: true;
      data: WorkoutSession;
    }
  | {
      success: false;
      error: string;
    };

export type WorkoutSetResponse =
  | {
      success: true;
      data: WorkoutSet;
    }
  | {
      success: false;
      error: string;
    };
