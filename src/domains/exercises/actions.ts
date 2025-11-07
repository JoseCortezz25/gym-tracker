'use server';

// Exercises Domain Server Actions

import { auth } from '@/lib/auth';
import { exercisesRepository } from './repository';
import { prisma } from '@/lib/db';
import {
  exerciseFiltersSchema,
  createCustomExerciseSchema,
  type ExerciseFiltersInput
} from './schema';
import type { ExercisesResponse, ExerciseResponse } from './types';

// Get All Exercises (Predefined + User Custom)

export async function getAllExercises(
  filters?: unknown
): Promise<ExercisesResponse> {
  try {
    const session = await auth();

    // Parse filters
    const validatedFilters = filters
      ? exerciseFiltersSchema.safeParse(filters)
      : { success: true as const, data: {} as ExerciseFiltersInput };

    if (!validatedFilters.success) {
      return {
        success: false,
        error: 'Invalid filters'
      };
    }

    const { category, search, isPredefined } = validatedFilters.data;

    // Complex filtering logic still needs direct Prisma access
    // TODO: Consider moving complex query logic to repository
    // Build where clause
    type WhereClause = {
      category?: typeof category;
      name?: { contains: string; mode: 'insensitive' };
      isPredefined?: boolean;
      userId?: string;
      OR?: Array<{ isPredefined: boolean; userId?: string }>;
    };

    const where: WhereClause = {};

    // Filter by category
    if (category) {
      where.category = category;
    }

    // Filter by search term
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      };
    }

    // Filter by predefined/custom
    if (isPredefined !== undefined) {
      if (isPredefined) {
        where.isPredefined = true;
      } else {
        // Show only user's custom exercises - requires authentication
        if (!session?.user) {
          return {
            success: false,
            error: 'Authentication required to view custom exercises'
          };
        }
        where.isPredefined = false;
        where.userId = session.user.id;
      }
    } else {
      // Show predefined + user's custom exercises
      // Allow unauthenticated users to see predefined exercises only
      if (session?.user) {
        where.OR = [
          { isPredefined: true },
          { isPredefined: false, userId: session.user.id }
        ];
      } else {
        // Not authenticated: only show predefined exercises
        where.isPredefined = true;
      }
    }

    // Fetch exercises
    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }]
    });

    return {
      success: true,
      exercises
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Get exercises error:', error);
    return {
      success: false,
      error: 'Failed to fetch exercises'
    };
  }
}

// Get Exercise by ID

export async function getExerciseById(id: string): Promise<ExerciseResponse> {
  try {
    const exercise = await exercisesRepository.findById(id);

    if (!exercise) {
      return {
        success: false,
        error: 'Exercise not found'
      };
    }

    return {
      success: true,
      exercise
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Get exercise error:', error);
    return {
      success: false,
      error: 'Failed to fetch exercise'
    };
  }
}

// Create Custom Exercise

export async function createCustomExercise(
  input: unknown
): Promise<ExerciseResponse> {
  try {
    // 1. Authentication required
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }

    // 2. Validate input
    const validated = createCustomExerciseSchema.safeParse(input);

    if (!validated.success) {
      return {
        success: false,
        error: 'Invalid input',
        errors: validated.error.flatten().fieldErrors
      };
    }

    const { name, category, description } = validated.data;

    // 3. Check if exercise with same name already exists for user
    const existingExercise = await prisma.exercise.findUnique({
      where: {
        // eslint-disable-next-line camelcase
        name_userId: {
          name,
          userId: session.user.id
        }
      }
    });

    if (existingExercise) {
      return {
        success: false,
        error: 'You already have an exercise with this name'
      };
    }

    // 4. Create exercise via repository
    const exercise = await exercisesRepository.create({
      name,
      category,
      description,
      userId: session.user.id
    });

    return {
      success: true,
      exercise,
      message: 'Custom exercise created successfully'
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Create custom exercise error:', error);
    return {
      success: false,
      error: 'Failed to create exercise'
    };
  }
}

// Delete Custom Exercise

export async function deleteCustomExercise(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Authentication required
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }

    // 2. Check if exercise exists and belongs to user
    const exercise = await exercisesRepository.findById(id);

    if (!exercise) {
      return {
        success: false,
        error: 'Exercise not found'
      };
    }

    if (exercise.isPredefined) {
      return {
        success: false,
        error: 'Cannot delete predefined exercises'
      };
    }

    if (exercise.userId !== session.user.id) {
      return {
        success: false,
        error: 'You can only delete your own exercises'
      };
    }

    // 3. Check if exercise is in use (in routines or workouts)
    const inUseInRoutines = await prisma.divisionExercise.findFirst({
      where: { exerciseId: id }
    });

    if (inUseInRoutines) {
      return {
        success: false,
        error: 'Cannot delete exercise that is used in routines'
      };
    }

    const inUseInWorkouts = await prisma.workoutExercise.findFirst({
      where: { exerciseId: id }
    });

    if (inUseInWorkouts) {
      return {
        success: false,
        error: 'Cannot delete exercise that is used in workout history'
      };
    }

    // 4. Delete exercise via repository
    await exercisesRepository.delete(id, session.user.id);

    return {
      success: true
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Delete custom exercise error:', error);
    return {
      success: false,
      error: 'Failed to delete exercise'
    };
  }
}
