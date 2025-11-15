/**
 * Workout Splits Domain - React Query Hooks
 *
 * Custom hooks for fetching and mutating workout splits data.
 * Uses React Query for caching, background refetching, and optimistic updates.
 *
 * Follows critical constraint: React Query for ALL server data (NOT Zustand)
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getActiveAssessment,
  getCurrentWorkoutSplit,
  getWorkoutSplitWithProgress,
  createWorkoutSplitsFromAssessment,
  startWorkoutSession,
  finalizeWorkout,
  toggleExerciseCompletion,
  updateWorkoutSplit
} from '../actions';
import type {
  WorkoutAssessmentWithSplits,
  SplitWithProgress,
  WorkoutAssessmentInput
} from '../types';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const workoutSplitsKeys = {
  all: ['workout-splits'] as const,
  assessment: () => [...workoutSplitsKeys.all, 'assessment'] as const,
  activeAssessment: () =>
    [...workoutSplitsKeys.assessment(), 'active'] as const,
  splits: () => [...workoutSplitsKeys.all, 'splits'] as const,
  split: (id: string) => [...workoutSplitsKeys.splits(), id] as const,
  currentSplit: () => [...workoutSplitsKeys.splits(), 'current'] as const,
  sessions: () => [...workoutSplitsKeys.all, 'sessions'] as const,
  session: (id: string) => [...workoutSplitsKeys.sessions(), id] as const
};

// ============================================================================
// ASSESSMENT HOOKS
// ============================================================================

/**
 * Hook: Get Active Assessment
 *
 * Fetches the user's currently active workout assessment with all splits.
 * Automatically refetches in the background to keep data fresh.
 *
 * @returns Query result with assessment data
 */
export function useActiveAssessment() {
  return useQuery({
    queryKey: workoutSplitsKeys.activeAssessment(),
    queryFn: async () => {
      const response = await getActiveAssessment();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch active assessment');
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });
}

/**
 * Hook: Create Assessment
 *
 * Mutation hook to create a new workout assessment and generate splits.
 * Invalidates assessment queries on success.
 *
 * @returns Mutation result with mutate function
 */
export function useCreateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WorkoutAssessmentInput) => {
      const formData = new FormData();
      formData.append('frequency', String(data.frequency));
      formData.append('trainingFocus', data.trainingFocus);

      const response = await createWorkoutSplitsFromAssessment(formData);

      if (!response.success) {
        throw new Error(response.error || 'Failed to create assessment');
      }

      return response.data;
    },
    onSuccess: data => {
      // Invalidate and refetch assessment queries
      queryClient.invalidateQueries({
        queryKey: workoutSplitsKeys.assessment()
      });
      queryClient.invalidateQueries({ queryKey: workoutSplitsKeys.splits() });

      // Set the new assessment in cache
      queryClient.setQueryData(workoutSplitsKeys.activeAssessment(), data);
    }
  });
}

// ============================================================================
// SPLIT HOOKS
// ============================================================================

/**
 * Hook: Get Current Workout Split
 *
 * Fetches the current split that the user should perform next.
 * Includes progress information and completion status.
 *
 * @returns Query result with current split data
 */
export function useCurrentWorkoutSplit() {
  return useQuery({
    queryKey: workoutSplitsKeys.currentSplit(),
    queryFn: async () => {
      const response = await getCurrentWorkoutSplit();
      if (!response.success) {
        throw new Error(
          response.error || 'Failed to fetch current workout split'
        );
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });
}

/**
 * Hook: Get Workout Split with Progress
 *
 * Fetches a specific split by ID with progress information.
 *
 * @param splitId - ID of the split to fetch
 * @param enabled - Whether the query should run (default: true)
 * @returns Query result with split data
 */
export function useWorkoutSplit(
  splitId: string | undefined,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: splitId
      ? workoutSplitsKeys.split(splitId)
      : ['workout-splits', 'split', 'undefined'],
    queryFn: async () => {
      if (!splitId) {
        throw new Error('Split ID is required');
      }

      const response = await getWorkoutSplitWithProgress(splitId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch workout split');
      }
      return response.data;
    },
    enabled: enabled && !!splitId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true
  });
}

// ============================================================================
// WORKOUT SESSION HOOKS
// ============================================================================

/**
 * Hook: Start Workout Session
 *
 * Mutation hook to start a new workout session for a split.
 * Invalidates split and session queries on success.
 *
 * @returns Mutation result with mutate function
 */
export function useStartWorkoutSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { splitId: string; assessmentId: string }) => {
      const formData = new FormData();
      formData.append('splitId', data.splitId);
      formData.append('assessmentId', data.assessmentId);

      const response = await startWorkoutSession(formData);

      if (!response.success) {
        throw new Error(response.error || 'Failed to start workout session');
      }

      return response.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate split queries to reflect new session
      queryClient.invalidateQueries({
        queryKey: workoutSplitsKeys.split(variables.splitId)
      });
      queryClient.invalidateQueries({
        queryKey: workoutSplitsKeys.currentSplit()
      });
      queryClient.invalidateQueries({ queryKey: workoutSplitsKeys.sessions() });
    }
  });
}

/**
 * Hook: Finalize Workout
 *
 * Mutation hook to complete a workout session and advance to next split.
 * Invalidates all relevant queries on success.
 *
 * @returns Mutation result with mutate function
 */
export function useFinalizeWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      splitId: string;
      sessionId: string;
      duration?: number;
      rating?: number;
      notes?: string;
    }) => {
      const formData = new FormData();
      formData.append('splitId', data.splitId);
      formData.append('sessionId', data.sessionId);
      if (data.duration !== undefined) {
        formData.append('duration', String(data.duration));
      }
      if (data.rating !== undefined) {
        formData.append('rating', String(data.rating));
      }
      if (data.notes) {
        formData.append('notes', data.notes);
      }

      const response = await finalizeWorkout(formData);

      if (!response.success) {
        throw new Error(response.error || 'Failed to finalize workout');
      }

      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate all workout-related queries
      queryClient.invalidateQueries({
        queryKey: workoutSplitsKeys.assessment()
      });
      queryClient.invalidateQueries({ queryKey: workoutSplitsKeys.splits() });
      queryClient.invalidateQueries({
        queryKey: workoutSplitsKeys.split(variables.splitId)
      });
      queryClient.invalidateQueries({
        queryKey: workoutSplitsKeys.currentSplit()
      });
      queryClient.invalidateQueries({ queryKey: workoutSplitsKeys.sessions() });

      // Invalidate the next split
      if (data) {
        queryClient.invalidateQueries({
          queryKey: workoutSplitsKeys.split(data.nextSplitId)
        });
      }
    }
  });
}

/**
 * Hook: Toggle Exercise Completion
 *
 * Mutation hook to mark an exercise as completed or uncompleted.
 * Uses optimistic updates for instant UI feedback.
 *
 * @returns Mutation result with mutate function
 */
export function useToggleExerciseCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      splitExerciseId: string;
      splitId: string;
      isCompleted: boolean;
    }) => {
      const formData = new FormData();
      formData.append('splitExerciseId', data.splitExerciseId);
      formData.append('isCompleted', String(data.isCompleted));

      const response = await toggleExerciseCompletion(formData);

      if (!response.success) {
        throw new Error(
          response.error || 'Failed to toggle exercise completion'
        );
      }

      return response.data;
    },
    onMutate: async variables => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: workoutSplitsKeys.split(variables.splitId)
      });

      // Snapshot previous value
      const previousSplit = queryClient.getQueryData<SplitWithProgress>(
        workoutSplitsKeys.split(variables.splitId)
      );

      // Optimistically update
      queryClient.setQueryData<SplitWithProgress | undefined>(
        workoutSplitsKeys.split(variables.splitId),
        old => {
          if (!old) return old;

          const updatedExercises = old.exercises.map(ex =>
            ex.id === variables.splitExerciseId
              ? { ...ex, isCompleted: variables.isCompleted }
              : ex
          );

          const completedCount = updatedExercises.filter(
            ex => ex.isCompleted
          ).length;
          const completionPercentage = Math.round(
            (completedCount / updatedExercises.length) * 100
          );

          return {
            ...old,
            exercises: updatedExercises,
            completedExercises: completedCount,
            completionPercentage
          };
        }
      );

      return { previousSplit };
    },
    onError: (_error, variables, context) => {
      // Rollback on error
      if (context?.previousSplit) {
        queryClient.setQueryData(
          workoutSplitsKeys.split(variables.splitId),
          context.previousSplit
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: workoutSplitsKeys.split(variables.splitId)
      });
    }
  });
}

/**
 * Hook: Update Workout Split
 *
 * Mutation hook to update split name and subtitle.
 * Invalidates queries on success.
 *
 * @returns Mutation result with mutate function
 */
export function useUpdateWorkoutSplit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      splitId: string;
      name: string;
      subtitle?: string;
    }) => {
      const formData = new FormData();
      formData.append('splitId', data.splitId);
      formData.append('name', data.name);
      if (data.subtitle) {
        formData.append('subtitle', data.subtitle);
      }

      const response = await updateWorkoutSplit(formData);

      if (!response.success) {
        throw new Error(response.error || 'Failed to update workout split');
      }

      return response.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate split and assessment queries
      queryClient.invalidateQueries({
        queryKey: workoutSplitsKeys.split(variables.splitId)
      });
      queryClient.invalidateQueries({
        queryKey: workoutSplitsKeys.assessment()
      });
      queryClient.invalidateQueries({ queryKey: workoutSplitsKeys.splits() });
    }
  });
}

// ============================================================================
// OPTIMISTIC UPDATE HELPERS
// ============================================================================

/**
 * Helper: Optimistic Update Split Progress
 *
 * Updates split progress optimistically while mutation is in flight.
 * Reverts on error.
 *
 * @param queryClient - React Query client
 * @param splitId - ID of the split to update
 * @param updater - Function to update the split data
 */
export function optimisticUpdateSplitProgress(
  queryClient: ReturnType<typeof useQueryClient>,
  splitId: string,
  updater: (
    oldData: SplitWithProgress | undefined
  ) => SplitWithProgress | undefined
) {
  const queryKey = workoutSplitsKeys.split(splitId);

  // Cancel outgoing refetches
  queryClient.cancelQueries({ queryKey });

  // Snapshot previous value
  const previousData = queryClient.getQueryData<SplitWithProgress>(queryKey);

  // Optimistically update
  queryClient.setQueryData<SplitWithProgress | undefined>(queryKey, updater);

  // Return rollback function
  return () => {
    queryClient.setQueryData(queryKey, previousData);
  };
}

/**
 * Helper: Optimistic Update Assessment
 *
 * Updates assessment optimistically while mutation is in flight.
 *
 * @param queryClient - React Query client
 * @param updater - Function to update the assessment data
 */
export function optimisticUpdateAssessment(
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (
    oldData: WorkoutAssessmentWithSplits | null | undefined
  ) => WorkoutAssessmentWithSplits | null | undefined
) {
  const queryKey = workoutSplitsKeys.activeAssessment();

  // Cancel outgoing refetches
  queryClient.cancelQueries({ queryKey });

  // Snapshot previous value
  const previousData =
    queryClient.getQueryData<WorkoutAssessmentWithSplits | null>(queryKey);

  // Optimistically update
  queryClient.setQueryData<WorkoutAssessmentWithSplits | null | undefined>(
    queryKey,
    updater
  );

  // Return rollback function
  return () => {
    queryClient.setQueryData(queryKey, previousData);
  };
}
