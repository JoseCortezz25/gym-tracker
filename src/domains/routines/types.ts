// Routines Domain Types

import type {
  Routine,
  TrainingDivision,
  DivisionExercise
} from '@prisma/client';

// Domain Types

export type { Routine, TrainingDivision, DivisionExercise };

// Extended Types

export type DivisionExerciseWithDetails = DivisionExercise & {
  exercise: {
    id: string;
    name: string;
    category: string;
  };
};

export type TrainingDivisionWithExercises = TrainingDivision & {
  exercises: DivisionExerciseWithDetails[];
};

export type RoutineWithDivisions = Routine & {
  divisions: TrainingDivisionWithExercises[];
};

// Load History Types (NEW)

export type ExerciseLoadHistory = {
  exerciseId: string;
  exerciseName: string;
  workouts: {
    date: Date;
    sets: {
      weight: number;
      reps: number;
      volume: number; // weight * reps
    }[];
    totalVolume: number;
    maxWeight: number;
    maxReps: number;
  }[];
  personalRecords: {
    maxWeight: number;
    maxWeightDate: Date;
    maxReps: number;
    maxRepsDate: Date;
    maxVolume: number;
    maxVolumeDate: Date;
  };
};

// API Response Types

export type RoutinesResponse =
  | {
      success: true;
      data: RoutineWithDivisions[];
    }
  | {
      success: false;
      error: string;
    };

export type RoutineResponse =
  | {
      success: true;
      data: RoutineWithDivisions;
    }
  | {
      success: false;
      error: string;
    };

export type RoutineMutationResponse =
  | {
      success: true;
      data: Routine;
    }
  | {
      success: false;
      error: string;
    };

export type DivisionResponse =
  | {
      success: true;
      data: TrainingDivision;
    }
  | {
      success: false;
      error: string;
    };

export type DivisionExerciseResponse =
  | {
      success: true;
      data: DivisionExercise;
    }
  | {
      success: false;
      error: string;
    };

export type LoadHistoryResponse =
  | {
      success: true;
      data: ExerciseLoadHistory;
    }
  | {
      success: false;
      error: string;
    };
