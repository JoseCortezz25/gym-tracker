'use client';

// React Query hooks for Routines domain
// Following critical constraint: React Query for ALL server data (NOT Zustand)

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAllRoutines,
  getActiveRoutine,
  getRoutineById,
  createRoutine,
  updateRoutine,
  activateRoutine,
  archiveRoutine,
  deleteRoutine,
  addTrainingDivision,
  updateTrainingDivision,
  deleteTrainingDivision,
  addDivisionExercise,
  updateDivisionExercise,
  removeDivisionExercise,
  getExerciseLoadHistory
} from '../actions';
import type {
  CreateRoutineInput,
  UpdateRoutineInput,
  CreateDivisionInput,
  UpdateDivisionInput,
  AddDivisionExerciseInput,
  UpdateDivisionExerciseInput
} from '../schema';

// Query Keys

export const routineKeys = {
  all: ['routines'] as const,
  lists: () => [...routineKeys.all, 'list'] as const,
  list: (includeArchived: boolean) =>
    [...routineKeys.lists(), { includeArchived }] as const,
  active: () => [...routineKeys.all, 'active'] as const,
  details: () => [...routineKeys.all, 'detail'] as const,
  detail: (id: string) => [...routineKeys.details(), id] as const,
  loadHistory: (exerciseId: string) => ['loadHistory', exerciseId] as const
};

// Queries

/**
 * Get all routines
 * Stale time: 2 minutes (routines don't change frequently)
 */
export function useRoutines(includeArchived = false) {
  return useQuery({
    queryKey: routineKeys.list(includeArchived),
    queryFn: async () => {
      const result = await getAllRoutines(includeArchived);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 2 * 60 * 1000 // 2 minutes
  });
}

/**
 * Get active routine
 * Stale time: 2 minutes
 */
export function useActiveRoutine() {
  return useQuery({
    queryKey: routineKeys.active(),
    queryFn: async () => {
      const result = await getActiveRoutine();
      if (!result.success) {
        // No active routine is not an error, return null
        if (result.error === 'No active routine found') {
          return null;
        }
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 2 * 60 * 1000 // 2 minutes
  });
}

/**
 * Get routine by ID
 * Stale time: 2 minutes
 */
export function useRoutine(id: string | null) {
  return useQuery({
    queryKey: routineKeys.detail(id || ''),
    queryFn: async () => {
      if (!id) return null;

      const result = await getRoutineById(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000 // 2 minutes
  });
}

/**
 * Get exercise load history
 * Stale time: 5 minutes
 */
export function useLoadHistory(exerciseId: string | null, limit = 10) {
  return useQuery({
    queryKey: routineKeys.loadHistory(exerciseId || ''),
    queryFn: async () => {
      if (!exerciseId) return null;

      const result = await getExerciseLoadHistory(exerciseId, limit);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!exerciseId,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

// Mutations - Routines

/**
 * Create routine
 */
export function useCreateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateRoutineInput) => {
      const result = await createRoutine(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineKeys.lists() });
    }
  });
}

/**
 * Update routine
 */
export function useUpdateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateRoutineInput) => {
      const result = await updateRoutine(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: routineKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: routineKeys.lists() });
    }
  });
}

/**
 * Activate routine
 * Business Rule: Only 1 active routine at a time
 */
export function useActivateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routineId: string) => {
      const result = await activateRoutine(routineId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineKeys.all });
    }
  });
}

/**
 * Archive routine
 */
export function useArchiveRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routineId: string) => {
      const result = await archiveRoutine(routineId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineKeys.all });
    }
  });
}

/**
 * Delete routine
 * Business Rule: Only if no workout sessions exist
 */
export function useDeleteRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routineId: string) => {
      const result = await deleteRoutine(routineId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineKeys.all });
    }
  });
}

// Mutations - Training Divisions (NEW)

/**
 * Add training division
 */
export function useAddDivision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateDivisionInput) => {
      const result = await addTrainingDivision(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: routineKeys.detail(variables.routineId)
      });
      queryClient.invalidateQueries({ queryKey: routineKeys.lists() });
    }
  });
}

/**
 * Update training division
 */
export function useUpdateDivision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateDivisionInput) => {
      const result = await updateTrainingDivision(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineKeys.all });
    }
  });
}

/**
 * Delete training division
 */
export function useDeleteDivision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (divisionId: string) => {
      const result = await deleteTrainingDivision(divisionId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineKeys.all });
    }
  });
}

// Mutations - Division Exercises (UPDATED)

/**
 * Add exercise to division
 * Business Rule: No duplicate exercises in division
 */
export function useAddExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddDivisionExerciseInput) => {
      const result = await addDivisionExercise(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineKeys.all });
    }
  });
}

/**
 * Update division exercise
 */
export function useUpdateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateDivisionExerciseInput) => {
      const result = await updateDivisionExercise(input);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineKeys.all });
    }
  });
}

/**
 * Remove exercise from division
 */
export function useRemoveExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exerciseId: string) => {
      const result = await removeDivisionExercise(exerciseId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineKeys.all });
    }
  });
}
