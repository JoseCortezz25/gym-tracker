'use client';

// React Query hooks for Exercises domain

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAllExercises,
  createCustomExercise,
  deleteCustomExercise
} from '../actions';
import type { CreateCustomExerciseInput } from '../schema';

// Query Keys

export const exerciseKeys = {
  all: ['exercises'] as const,
  lists: () => [...exerciseKeys.all, 'list'] as const,
  list: (filters?: unknown) => [...exerciseKeys.lists(), { filters }] as const
};

// Queries

/**
 * Get all exercises (predefined + user custom)
 * Stale time: 10 minutes (exercises don't change frequently)
 */
export function useExercises(filters?: unknown) {
  return useQuery({
    queryKey: exerciseKeys.list(filters),
    queryFn: async () => {
      const result = await getAllExercises(filters);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.exercises;
    },
    staleTime: 10 * 60 * 1000 // 10 minutes
  });
}

// Mutations

/**
 * Create custom exercise
 */
export function useCreateCustomExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCustomExerciseInput) => {
      const result = await createCustomExercise(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.exercise;
    },
    onSuccess: () => {
      // Invalidate exercises list to refetch
      queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() });
    }
  });
}

/**
 * Delete custom exercise
 */
export function useDeleteCustomExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exerciseId: string) => {
      const result = await deleteCustomExercise(exerciseId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete exercise');
      }
      return;
    },
    onSuccess: () => {
      // Invalidate exercises list to refetch
      queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() });
    }
  });
}
