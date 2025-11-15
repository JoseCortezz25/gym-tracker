'use client';

// React Query hooks for Workouts domain
// Implements optimistic updates for auto-save functionality

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getActiveWorkoutSession,
  getWorkoutSession,
  getRecentWorkouts,
  startWorkout,
  logSet,
  completeWorkout,
  cancelWorkout
} from '../actions';
import type {
  StartWorkoutInput,
  CompleteWorkoutInput,
  CancelWorkoutInput,
  LogSetInput
} from '../schema';
import type { WorkoutSessionWithDetails, WorkoutSet } from '../types';

// Query Keys

export const workoutKeys = {
  all: ['workouts'] as const,
  active: () => [...workoutKeys.all, 'active'] as const,
  details: () => [...workoutKeys.all, 'detail'] as const,
  detail: (id: string) => [...workoutKeys.details(), id] as const,
  recent: (limit: number) => [...workoutKeys.all, 'recent', limit] as const
};

// Queries

/**
 * Get active workout session
 * Stale time: 30 seconds (real-time updates needed)
 */
export function useActiveWorkout() {
  return useQuery({
    queryKey: workoutKeys.active(),
    queryFn: async () => {
      const result = await getActiveWorkoutSession();
      if (!result.success) {
        // No active workout is not an error, return null
        if (result.error === 'No active workout session found') {
          return null;
        }
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 30 * 1000 // 30 seconds
  });
}

/**
 * Get workout session by ID
 */
export function useWorkout(id: string | null) {
  return useQuery({
    queryKey: workoutKeys.detail(id || ''),
    queryFn: async () => {
      if (!id) return null;

      const result = await getWorkoutSession(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!id,
    staleTime: 30 * 1000 // 30 seconds
  });
}

/**
 * Get recent workouts (for history)
 */
export function useRecentWorkouts(limit = 10) {
  return useQuery({
    queryKey: workoutKeys.recent(limit),
    queryFn: async () => {
      const result = await getRecentWorkouts(limit);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 2 * 60 * 1000 // 2 minutes
  });
}

// Mutations

/**
 * Start workout session
 * Business Rule: Only 1 active workout at a time
 */
export function useStartWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: StartWorkoutInput) => {
      const result = await startWorkout(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate active workout and dashboard
      queryClient.invalidateQueries({ queryKey: workoutKeys.active() });
      queryClient.invalidateQueries({ queryKey: ['stats', 'dashboard'] });
    }
  });
}

/**
 * Log set with optimistic updates (auto-save)
 * This is the critical path for auto-save functionality
 */
export function useLogSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LogSetInput) => {
      const result = await logSet(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    // Optimistic update: Update cache immediately before server responds
    onMutate: async (newSet: LogSetInput) => {
      // Cancel outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: workoutKeys.active() });

      // Snapshot the previous value
      const previousWorkout =
        queryClient.getQueryData<WorkoutSessionWithDetails>(
          workoutKeys.active()
        );

      // Optimistically update cache
      if (previousWorkout) {
        queryClient.setQueryData<WorkoutSessionWithDetails>(
          workoutKeys.active(),
          old => {
            if (!old) return old;

            return {
              ...old,
              exercises: old.exercises.map(ex => {
                if (ex.id === newSet.workoutExerciseId) {
                  // Find if set exists
                  const existingSetIndex = ex.sets.findIndex(
                    s => s.setNumber === newSet.setNumber
                  );

                  const newSetData: WorkoutSet = {
                    id:
                      existingSetIndex >= 0
                        ? ex.sets[existingSetIndex].id
                        : 'temp-' + Date.now(),
                    workoutExerciseId: newSet.workoutExerciseId,
                    setNumber: newSet.setNumber,
                    weight: newSet.weight,
                    reps: newSet.reps,
                    isCompleted: newSet.isCompleted,
                    completedAt: newSet.isCompleted ? new Date() : null,
                    notes: newSet.notes || null
                  };

                  const updatedSets =
                    existingSetIndex >= 0
                      ? ex.sets.map((s, i) =>
                          i === existingSetIndex ? newSetData : s
                        )
                      : [...ex.sets, newSetData];

                  return {
                    ...ex,
                    sets: updatedSets
                  };
                }
                return ex;
              })
            };
          }
        );
      }

      // Return context with snapshot
      return { previousWorkout };
    },
    // If mutation fails, rollback to snapshot
    onError: (err, newSet, context) => {
      if (context?.previousWorkout) {
        queryClient.setQueryData(workoutKeys.active(), context.previousWorkout);
      }
    },
    // Always refetch after error or success to sync with server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.active() });
    }
  });
}

/**
 * Complete workout
 */
export function useCompleteWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CompleteWorkoutInput) => {
      const result = await completeWorkout(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate all workout-related queries
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
      queryClient.invalidateQueries({ queryKey: ['stats', 'dashboard'] });
    }
  });
}

/**
 * Cancel workout
 */
export function useCancelWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CancelWorkoutInput) => {
      const result = await cancelWorkout(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate active workout and dashboard
      queryClient.invalidateQueries({ queryKey: workoutKeys.active() });
      queryClient.invalidateQueries({ queryKey: ['stats', 'dashboard'] });
    }
  });
}
