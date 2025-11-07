// Workouts Repository - Data access layer for workout sessions
// Follows Repository Pattern (architecture-patterns.md Section 4.1)

import { prisma } from '@/lib/db';
import type {
  WorkoutSession,
  WorkoutExercise,
  WorkoutSet,
  WorkoutStatus
} from '@prisma/client';

// Types

export type WorkoutSessionWithDetails = WorkoutSession & {
  routine: {
    id: string;
    name: string;
  } | null;
  exercises: (WorkoutExercise & {
    exercise: {
      id: string;
      name: string;
      category: string;
    };
    sets: WorkoutSet[];
  })[];
};

// Repository

export const workoutsRepository = {
  /**
   * Get active workout session for a user
   * Business Rule: Only 1 active workout session at a time (PRD 9.3.1)
   */
  async findActive(userId: string): Promise<WorkoutSessionWithDetails | null> {
    return prisma.workoutSession.findFirst({
      where: {
        userId,
        status: 'IN_PROGRESS'
      },
      include: {
        routine: {
          select: {
            id: true,
            name: true
          }
        },
        exercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                category: true
              }
            },
            sets: {
              orderBy: { setNumber: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });
  },

  /**
   * Get workout session by ID
   */
  async findById(
    id: string,
    userId: string
  ): Promise<WorkoutSessionWithDetails | null> {
    return prisma.workoutSession.findFirst({
      where: {
        id,
        userId // Ensure user owns this session
      },
      include: {
        routine: {
          select: {
            id: true,
            name: true
          }
        },
        exercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                category: true
              }
            },
            sets: {
              orderBy: { setNumber: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });
  },

  /**
   * Get recent workout sessions (for history)
   */
  async findRecent(
    userId: string,
    limit = 10,
    status?: WorkoutStatus
  ): Promise<WorkoutSessionWithDetails[]> {
    return prisma.workoutSession.findMany({
      where: {
        userId,
        ...(status ? { status } : {})
      },
      include: {
        routine: {
          select: {
            id: true,
            name: true
          }
        },
        exercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                category: true
              }
            },
            sets: {
              orderBy: { setNumber: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { startedAt: 'desc' },
      take: limit
    });
  },

  /**
   * Start a new workout session
   */
  async create(data: {
    userId: string;
    routineId?: string;
  }): Promise<WorkoutSession> {
    return prisma.workoutSession.create({
      data
    });
  },

  /**
   * Update workout session
   */
  async update(
    id: string,
    userId: string,
    data: {
      status?: WorkoutStatus;
      completedAt?: Date;
      duration?: number;
      rating?: number;
      notes?: string;
    }
  ): Promise<WorkoutSession> {
    return prisma.workoutSession.update({
      where: { id, userId },
      data
    });
  },

  /**
   * Add exercise to workout session
   */
  async addExercise(data: {
    workoutSessionId: string;
    exerciseId: string;
    order: number;
    notes?: string;
  }): Promise<WorkoutExercise> {
    return prisma.workoutExercise.create({
      data
    });
  },

  /**
   * Update workout exercise
   */
  async updateExercise(
    id: string,
    data: {
      order?: number;
      notes?: string;
    }
  ): Promise<WorkoutExercise> {
    return prisma.workoutExercise.update({
      where: { id },
      data
    });
  },

  /**
   * Remove exercise from workout session
   */
  async removeExercise(id: string): Promise<WorkoutExercise> {
    return prisma.workoutExercise.delete({
      where: { id }
    });
  },

  /**
   * Log a set (create or update)
   * Auto-save mechanism (PRD US-4.2)
   */
  async logSet(data: {
    workoutExerciseId: string;
    setNumber: number;
    weight: number;
    reps: number;
    isCompleted: boolean;
  }): Promise<WorkoutSet> {
    const uniqueConstraint = {
      workoutExerciseId: data.workoutExerciseId,
      setNumber: data.setNumber
    };

    return prisma.workoutSet.upsert({
      where: {
        // Prisma auto-generates this field name from @@unique([workoutExerciseId, setNumber])
        // eslint-disable-next-line camelcase
        workoutExerciseId_setNumber: uniqueConstraint
      },
      create: {
        ...data,
        completedAt: data.isCompleted ? new Date() : null
      },
      update: {
        weight: data.weight,
        reps: data.reps,
        isCompleted: data.isCompleted,
        completedAt: data.isCompleted ? new Date() : null
      }
    });
  },

  /**
   * Get sets for a workout exercise
   */
  async getSetsForExercise(workoutExerciseId: string): Promise<WorkoutSet[]> {
    return prisma.workoutSet.findMany({
      where: { workoutExerciseId },
      orderBy: { setNumber: 'asc' }
    });
  },

  /**
   * Delete a set
   */
  async deleteSet(id: string): Promise<WorkoutSet> {
    return prisma.workoutSet.delete({
      where: { id }
    });
  },

  /**
   * Complete workout session
   * Calculate duration and mark as completed
   */
  async complete(
    id: string,
    userId: string,
    data: { rating?: number; notes?: string }
  ): Promise<WorkoutSession> {
    const session = await prisma.workoutSession.findFirst({
      where: { id, userId }
    });

    if (!session) {
      throw new Error('Workout session not found');
    }

    const duration = Math.floor(
      (new Date().getTime() - session.startedAt.getTime()) / 1000
    );

    return prisma.workoutSession.update({
      where: { id, userId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        duration,
        rating: data.rating,
        notes: data.notes
      }
    });
  },

  /**
   * Cancel workout session
   */
  async cancel(id: string, userId: string): Promise<WorkoutSession> {
    return prisma.workoutSession.update({
      where: { id, userId },
      data: {
        status: 'CANCELLED',
        completedAt: new Date()
      }
    });
  }
};
