// Exercises Repository - Data access layer for exercises
// Follows Repository Pattern (architecture-patterns.md Section 4.1)

import { prisma } from '@/lib/db';
import type { Exercise, ExerciseCategory } from '@prisma/client';

export const exercisesRepository = {
  /**
   * Get all exercises (predefined + user custom exercises)
   * @param userId - Optional: If provided, includes user's custom exercises
   */
  async findAll(userId?: string): Promise<Exercise[]> {
    return prisma.exercise.findMany({
      where: {
        OR: [
          { isPredefined: true }, // All predefined exercises
          { userId: userId ?? undefined } // User's custom exercises (if userId provided)
        ]
      },
      orderBy: [{ isPredefined: 'desc' }, { name: 'asc' }]
    });
  },

  /**
   * Get exercises by category
   */
  async findByCategory(
    category: ExerciseCategory,
    userId?: string
  ): Promise<Exercise[]> {
    return prisma.exercise.findMany({
      where: {
        category,
        OR: [{ isPredefined: true }, { userId: userId ?? undefined }]
      },
      orderBy: [{ isPredefined: 'desc' }, { name: 'asc' }]
    });
  },

  /**
   * Get exercise by ID
   */
  async findById(id: string): Promise<Exercise | null> {
    return prisma.exercise.findUnique({
      where: { id }
    });
  },

  /**
   * Create custom exercise (user-specific)
   */
  async create(data: {
    name: string;
    category: ExerciseCategory;
    description?: string;
    userId: string;
  }): Promise<Exercise> {
    return prisma.exercise.create({
      data: {
        ...data,
        isPredefined: false
      }
    });
  },

  /**
   * Update custom exercise (only user's own exercises)
   */
  async update(
    id: string,
    userId: string,
    data: {
      name?: string;
      category?: ExerciseCategory;
      description?: string;
    }
  ): Promise<Exercise> {
    return prisma.exercise.update({
      where: {
        id,
        userId, // Ensure user owns this exercise
        isPredefined: false // Can't update predefined exercises
      },
      data
    });
  },

  /**
   * Delete custom exercise (only user's own exercises)
   */
  async delete(id: string, userId: string): Promise<Exercise> {
    return prisma.exercise.delete({
      where: {
        id,
        userId, // Ensure user owns this exercise
        isPredefined: false // Can't delete predefined exercises
      }
    });
  },

  /**
   * Create predefined exercise (system only)
   */
  async createPredefined(data: {
    name: string;
    category: ExerciseCategory;
    description?: string;
  }): Promise<Exercise> {
    return prisma.exercise.create({
      data: {
        ...data,
        isPredefined: true,
        userId: null
      }
    });
  }
};
