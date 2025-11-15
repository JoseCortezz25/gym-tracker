/**
 * Workout Splits Domain - Weight History Hooks
 *
 * Custom hooks for fetching and managing exercise weight history.
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getWeightHistory, recordSetData } from '../actions';
import type { ExerciseWeightHistory } from '../types';
import { Exercise } from '@prisma/client';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const weightHistoryKeys = {
  all: ['weight-history'] as const,
  exercise: (exerciseId: string) =>
    [...weightHistoryKeys.all, 'exercise', exerciseId] as const
};

// ============================================================================
// WEIGHT HISTORY HOOKS
// ============================================================================

/**
 * Hook: Get Weight History
 *
 * Fetches weight history for a specific exercise.
 * Includes trend analysis and statistics.
 *
 * @param exerciseId - ID of the exercise
 * @param limit - Number of history entries to fetch (default: 5)
 * @param enabled - Whether the query should run (default: true)
 * @returns Query result with weight history data
 */
export function useWeightHistory(
  exerciseId: string | undefined,
  limit: number = 5,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: exerciseId
      ? [...weightHistoryKeys.exercise(exerciseId), limit]
      : ['weight-history', 'undefined', limit],
    queryFn: async () => {
      if (!exerciseId) {
        throw new Error('Exercise ID is required');
      }

      const response = await getWeightHistory(exerciseId, limit);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch weight history');
      }

      return response.data;
    },
    enabled: enabled && !!exerciseId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false // Weight history doesn't change often
  });
}

/**
 * Hook: Record Set
 *
 * Mutation hook to record weight and reps for a set.
 * Invalidates weight history queries on success.
 *
 * @returns Mutation result with mutate function
 */
export function useRecordSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      sessionId: string;
      exerciseId: string;
      weight: number;
      reps: number;
      notes?: string;
    }) => {
      const formData = new FormData();
      formData.append('exerciseId', data.exerciseId);
      formData.append('weight', String(data.weight));
      formData.append('reps', String(data.reps));
      if (data.notes) {
        formData.append('notes', data.notes);
      }

      const response = await recordSetData(data.sessionId, formData);

      if (!response.success) {
        throw new Error(response.error || 'Failed to record set');
      }

      return response.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate weight history for this exercise
      queryClient.invalidateQueries({
        queryKey: weightHistoryKeys.exercise(variables.exerciseId)
      });

      // Invalidate split progress
      queryClient.invalidateQueries({ queryKey: ['workout-splits', 'splits'] });
    }
  });
}

/**
 * Hook: Optimistic Set Recording
 *
 * Records a set with optimistic UI updates.
 * Updates local cache immediately, then syncs with server.
 *
 * @returns Mutation result with optimistic updates
 */
export function useOptimisticRecordSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      sessionId: string;
      exerciseId: string;
      weight: number;
      reps: number;
      notes?: string;
    }) => {
      const formData = new FormData();
      formData.append('exerciseId', data.exerciseId);
      formData.append('weight', String(data.weight));
      formData.append('reps', String(data.reps));
      if (data.notes) {
        formData.append('notes', data.notes);
      }

      const response = await recordSetData(data.sessionId, formData);

      if (!response.success) {
        throw new Error(response.error || 'Failed to record set');
      }

      return response.data;
    },
    onMutate: async newSet => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: weightHistoryKeys.exercise(newSet.exerciseId)
      });

      // Snapshot previous value
      const previousHistory = queryClient.getQueryData<ExerciseWeightHistory>(
        weightHistoryKeys.exercise(newSet.exerciseId)
      );

      // Optimistically update the cache
      if (previousHistory) {
        queryClient.setQueryData<ExerciseWeightHistory>(
          weightHistoryKeys.exercise(newSet.exerciseId),
          old => {
            if (!old) return old;

            return {
              ...old,
              latestWeight: newSet.weight,
              entries: [
                {
                  id: 'optimistic',
                  weight: newSet.weight,
                  reps: newSet.reps,
                  sets: 1,
                  completedAt: new Date(),
                  userId: '',
                  exerciseId: newSet.exerciseId,
                  workoutSessionId: newSet.sessionId,
                  exercise: old.entries[0]?.exercise || ({} as Exercise),
                  workoutSession: null
                },
                ...old.entries
              ]
            };
          }
        );
      }

      // Return context for rollback
      return { previousHistory };
    },
    onError: (_error, newSet, context) => {
      // Rollback on error
      if (context?.previousHistory) {
        queryClient.setQueryData(
          weightHistoryKeys.exercise(newSet.exerciseId),
          context.previousHistory
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      // Refetch to ensure server state
      queryClient.invalidateQueries({
        queryKey: weightHistoryKeys.exercise(variables.exerciseId)
      });
    }
  });
}
