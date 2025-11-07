'use server';

// Routines Domain Server Actions
// Following Server Actions pattern: validation + authorization + logic + persistence

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { routinesRepository } from './repository';
import {
  createRoutineSchema,
  updateRoutineSchema,
  createDivisionSchema,
  updateDivisionSchema,
  addDivisionExerciseSchema,
  updateDivisionExerciseSchema
} from './schema';
import type {
  RoutinesResponse,
  RoutineResponse,
  RoutineMutationResponse,
  DivisionResponse,
  DivisionExerciseResponse,
  LoadHistoryResponse
} from './types';

// Get All Routines

export async function getAllRoutines(
  includeArchived = false
): Promise<RoutinesResponse> {
  try {
    // 1. Session validation (mandatory)
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Fetch routines
    const routines = await routinesRepository.findAll(
      session.user.id,
      includeArchived
    );

    return { success: true, data: routines };
  } catch (error) {
    console.error('Error fetching routines:', error);
    return { success: false, error: 'Failed to fetch routines' };
  }
}

// Get Active Routine

export async function getActiveRoutine(): Promise<RoutineResponse> {
  try {
    // 1. Session validation (mandatory)
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Fetch active routine
    const routine = await routinesRepository.findActive(session.user.id);

    if (!routine) {
      return { success: false, error: 'No active routine found' };
    }

    return { success: true, data: routine };
  } catch (error) {
    console.error('Error fetching active routine:', error);
    return { success: false, error: 'Failed to fetch active routine' };
  }
}

// Get Routine by ID

export async function getRoutineById(id: string): Promise<RoutineResponse> {
  try {
    // 1. Session validation (mandatory)
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Fetch routine
    const routine = await routinesRepository.findById(id, session.user.id);

    if (!routine) {
      return { success: false, error: 'Routine not found' };
    }

    return { success: true, data: routine };
  } catch (error) {
    console.error('Error fetching routine:', error);
    return { success: false, error: 'Failed to fetch routine' };
  }
}

// Create Routine

export async function createRoutine(
  input: unknown
): Promise<RoutineMutationResponse> {
  try {
    // 1. Session validation (mandatory)
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Input validation
    const validated = createRoutineSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || 'Invalid input'
      };
    }

    const { name } = validated.data;

    // 3. Create routine
    const routine = await routinesRepository.create({
      name,
      userId: session.user.id
    });

    // 4. Cache revalidation
    revalidatePath('/routines');
    revalidatePath('/dashboard');

    return { success: true, data: routine };
  } catch (error) {
    console.error('Error creating routine:', error);
    return { success: false, error: 'Failed to create routine' };
  }
}

// Update Routine

export async function updateRoutine(
  input: unknown
): Promise<RoutineMutationResponse> {
  try {
    // 1. Session validation (mandatory)
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Input validation
    const validated = updateRoutineSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || 'Invalid input'
      };
    }

    const { id, name } = validated.data;

    // 3. Update routine
    const routine = await routinesRepository.update(id, session.user.id, {
      name
    });

    // 4. Cache revalidation
    revalidatePath('/routines');
    revalidatePath('/dashboard');

    return { success: true, data: routine };
  } catch (error) {
    console.error('Error updating routine:', error);
    return { success: false, error: 'Failed to update routine' };
  }
}

// Activate Routine
// Business Rule: Only 1 active routine at a time

export async function activateRoutine(
  routineId: string
): Promise<RoutineMutationResponse> {
  try {
    // 1. Session validation (mandatory)
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Activate routine (repository handles deactivating others)
    const routine = await routinesRepository.activate(
      routineId,
      session.user.id
    );

    // 3. Cache revalidation
    revalidatePath('/routines');
    revalidatePath('/dashboard');

    return { success: true, data: routine };
  } catch (error) {
    console.error('Error activating routine:', error);
    return { success: false, error: 'Failed to activate routine' };
  }
}

// Archive Routine
// Business Rule: Archive instead of delete if has workout history

export async function archiveRoutine(
  routineId: string
): Promise<RoutineMutationResponse> {
  try {
    // 1. Session validation (mandatory)
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Archive routine
    const routine = await routinesRepository.archive(
      routineId,
      session.user.id
    );

    // 3. Cache revalidation
    revalidatePath('/routines');
    revalidatePath('/dashboard');

    return { success: true, data: routine };
  } catch (error) {
    console.error('Error archiving routine:', error);
    return { success: false, error: 'Failed to archive routine' };
  }
}

// Delete Routine
// Business Rule: Only if no workout sessions exist

export async function deleteRoutine(
  routineId: string
): Promise<RoutineMutationResponse> {
  try {
    // 1. Session validation (mandatory)
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Delete routine (repository checks workout sessions)
    const routine = await routinesRepository.delete(routineId, session.user.id);

    // 3. Cache revalidation
    revalidatePath('/routines');
    revalidatePath('/dashboard');

    return { success: true, data: routine };
  } catch (error) {
    console.error('Error deleting routine:', error);

    // Handle specific business rule error
    if (error instanceof Error && error.message.includes('workout history')) {
      return {
        success: false,
        error: 'Cannot delete routine with workout history. Archive it instead.'
      };
    }

    return { success: false, error: 'Failed to delete routine' };
  }
}

// Add Training Division (NEW)

export async function addTrainingDivision(
  input: unknown
): Promise<DivisionResponse> {
  try {
    // 1. Session validation (mandatory)
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Input validation
    const validated = createDivisionSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || 'Invalid input'
      };
    }

    const { routineId, name, description, frequency, order } = validated.data;

    // 3. Verify user owns the routine
    const routine = await routinesRepository.findById(
      routineId,
      session.user.id
    );
    if (!routine) {
      return { success: false, error: 'Routine not found' };
    }

    // 4. Add division
    const division = await routinesRepository.addDivision({
      routineId,
      name,
      description,
      frequency,
      order
    });

    // 5. Cache revalidation
    revalidatePath('/routines');

    return { success: true, data: division };
  } catch (error) {
    console.error('Error adding training division:', error);
    return { success: false, error: 'Failed to add training division' };
  }
}

// Update Training Division (NEW)

export async function updateTrainingDivision(
  input: unknown
): Promise<DivisionResponse> {
  try {
    // 1. Session validation (mandatory)
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Input validation
    const validated = updateDivisionSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || 'Invalid input'
      };
    }

    const { id, ...updates } = validated.data;

    // 3. Update division
    const division = await routinesRepository.updateDivision(id, updates);

    // 4. Cache revalidation
    revalidatePath('/routines');

    return { success: true, data: division };
  } catch (error) {
    console.error('Error updating training division:', error);
    return { success: false, error: 'Failed to update training division' };
  }
}

// Delete Training Division (NEW)

export async function deleteTrainingDivision(
  divisionId: string
): Promise<DivisionResponse> {
  try {
    // 1. Session validation (mandatory)
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Delete division
    const division = await routinesRepository.deleteDivision(divisionId);

    // 3. Cache revalidation
    revalidatePath('/routines');

    return { success: true, data: division };
  } catch (error) {
    console.error('Error deleting training division:', error);
    return { success: false, error: 'Failed to delete training division' };
  }
}

// Add Exercise to Division (UPDATED)
// Business Rule: No duplicate exercises in division

export async function addDivisionExercise(
  input: unknown
): Promise<DivisionExerciseResponse> {
  try {
    // 1. Session validation (mandatory)
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Input validation
    const validated = addDivisionExerciseSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || 'Invalid input'
      };
    }

    const {
      divisionId,
      exerciseId,
      order,
      targetSets,
      targetReps,
      targetWeight,
      restSeconds,
      videoId,
      notes
    } = validated.data;

    // 3. Add exercise (Prisma enforces unique constraint for duplicates)
    const exercise = await routinesRepository.addExercise({
      divisionId,
      exerciseId,
      order,
      targetSets,
      targetReps,
      targetWeight,
      restSeconds,
      videoId,
      notes
    });

    // 4. Cache revalidation
    revalidatePath('/routines');

    return { success: true, data: exercise };
  } catch (error) {
    console.error('Error adding division exercise:', error);

    // Handle duplicate exercise error
    if (
      error instanceof Error &&
      error.message.includes('Unique constraint failed')
    ) {
      return {
        success: false,
        error: 'This exercise is already in this division'
      };
    }

    return { success: false, error: 'Failed to add exercise to division' };
  }
}

// Update Division Exercise (UPDATED)

export async function updateDivisionExercise(
  input: unknown
): Promise<DivisionExerciseResponse> {
  try {
    // 1. Session validation (mandatory)
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Input validation
    const validated = updateDivisionExerciseSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || 'Invalid input'
      };
    }

    const { id, ...updates } = validated.data;

    // 3. Update exercise
    const exercise = await routinesRepository.updateExercise(id, updates);

    // 4. Cache revalidation
    revalidatePath('/routines');

    return { success: true, data: exercise };
  } catch (error) {
    console.error('Error updating division exercise:', error);
    return { success: false, error: 'Failed to update division exercise' };
  }
}

// Remove Exercise from Division (UPDATED)

export async function removeDivisionExercise(
  exerciseId: string
): Promise<DivisionExerciseResponse> {
  try {
    // 1. Session validation (mandatory)
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Remove exercise
    const exercise = await routinesRepository.removeExercise(exerciseId);

    // 3. Cache revalidation
    revalidatePath('/routines');

    return { success: true, data: exercise };
  } catch (error) {
    console.error('Error removing division exercise:', error);
    return { success: false, error: 'Failed to remove exercise from division' };
  }
}

// Get Exercise Load History (NEW)

export async function getExerciseLoadHistory(
  exerciseId: string,
  limit = 10
): Promise<LoadHistoryResponse> {
  try {
    // 1. Session validation (mandatory)
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Fetch load history
    const history = await routinesRepository.getExerciseLoadHistory(
      session.user.id,
      exerciseId,
      limit
    );

    if (!history) {
      return { success: false, error: 'Exercise not found' };
    }

    return { success: true, data: history };
  } catch (error) {
    console.error('Error fetching load history:', error);
    return { success: false, error: 'Failed to fetch load history' };
  }
}
