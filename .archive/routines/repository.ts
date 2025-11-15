// Routines Repository - Data access layer for routines
// Follows Repository Pattern (architecture-patterns.md Section 4.1)

import { prisma } from '@/lib/db';
import type {
  Routine,
  TrainingDivision,
  DivisionExercise
} from '@prisma/client';
import type {
  RoutineWithDivisions,
  TrainingDivisionWithExercises,
  ExerciseLoadHistory
} from './types';

// Repository

export const routinesRepository = {
  // -------------------------------------------------------------------------
  // Routine Operations
  // -------------------------------------------------------------------------

  async findAll(
    userId: string,
    includeArchived = false
  ): Promise<RoutineWithDivisions[]> {
    return prisma.routine.findMany({
      where: {
        userId,
        ...(includeArchived ? {} : { isArchived: false })
      },
      include: {
        divisions: {
          include: {
            exercises: {
              include: {
                exercise: {
                  select: {
                    id: true,
                    name: true,
                    category: true
                  }
                }
              },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: [{ isActive: 'desc' }, { updatedAt: 'desc' }]
    });
  },

  async findActive(userId: string): Promise<RoutineWithDivisions | null> {
    return prisma.routine.findFirst({
      where: {
        userId,
        isActive: true,
        isArchived: false
      },
      include: {
        divisions: {
          include: {
            exercises: {
              include: {
                exercise: {
                  select: {
                    id: true,
                    name: true,
                    category: true
                  }
                }
              },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });
  },

  async findById(
    id: string,
    userId: string
  ): Promise<RoutineWithDivisions | null> {
    return prisma.routine.findFirst({
      where: {
        id,
        userId
      },
      include: {
        divisions: {
          include: {
            exercises: {
              include: {
                exercise: {
                  select: {
                    id: true,
                    name: true,
                    category: true
                  }
                }
              },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });
  },

  async create(data: { name: string; userId: string }): Promise<Routine> {
    return prisma.routine.create({
      data
    });
  },

  async update(
    id: string,
    userId: string,
    data: { name?: string }
  ): Promise<Routine> {
    return prisma.routine.update({
      where: {
        id,
        userId
      },
      data
    });
  },

  async activate(id: string, userId: string): Promise<Routine> {
    return prisma.$transaction(async tx => {
      await tx.routine.updateMany({
        where: { userId },
        data: { isActive: false }
      });

      return tx.routine.update({
        where: { id, userId },
        data: { isActive: true }
      });
    });
  },

  async archive(id: string, userId: string): Promise<Routine> {
    return prisma.routine.update({
      where: { id, userId },
      data: {
        isActive: false,
        isArchived: true
      }
    });
  },

  async delete(id: string, userId: string): Promise<Routine> {
    const routine = await prisma.routine.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: { workoutSessions: true }
        }
      }
    });

    if (!routine) {
      throw new Error('Routine not found');
    }

    if (routine._count.workoutSessions > 0) {
      throw new Error(
        'Cannot delete routine with workout history. Archive it instead.'
      );
    }

    return prisma.routine.delete({
      where: { id, userId }
    });
  },

  // -------------------------------------------------------------------------
  // Training Division Operations (NEW)
  // -------------------------------------------------------------------------

  async addDivision(data: {
    routineId: string;
    name: string;
    description?: string;
    frequency: number;
    order: number;
  }): Promise<TrainingDivision> {
    if (data.frequency < 1 || data.frequency > 7) {
      throw new Error('Frequency must be between 1 and 7');
    }

    return prisma.trainingDivision.create({
      data
    });
  },

  async updateDivision(
    id: string,
    data: {
      name?: string;
      description?: string | null;
      frequency?: number;
      order?: number;
    }
  ): Promise<TrainingDivision> {
    if (
      data.frequency !== undefined &&
      (data.frequency < 1 || data.frequency > 7)
    ) {
      throw new Error('Frequency must be between 1 and 7');
    }

    return prisma.trainingDivision.update({
      where: { id },
      data
    });
  },

  async deleteDivision(id: string): Promise<TrainingDivision> {
    return prisma.trainingDivision.delete({
      where: { id }
    });
  },

  async findDivisionById(
    id: string
  ): Promise<TrainingDivisionWithExercises | null> {
    return prisma.trainingDivision.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                category: true
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });
  },

  // -------------------------------------------------------------------------
  // Division Exercise Operations (NEW)
  // -------------------------------------------------------------------------

  async addExercise(data: {
    divisionId: string;
    exerciseId: string;
    order: number;
    targetSets: number;
    targetReps: string;
    targetWeight?: number;
    restSeconds?: number;
    videoId?: string | null;
    notes?: string;
  }): Promise<DivisionExercise> {
    // Validate videoId if provided
    if (data.videoId && data.videoId.length !== 11) {
      throw new Error('YouTube video ID must be exactly 11 characters');
    }

    return prisma.divisionExercise.create({
      data
    });
  },

  async updateExercise(
    id: string,
    data: {
      order?: number;
      targetSets?: number;
      targetReps?: string;
      targetWeight?: number;
      restSeconds?: number;
      videoId?: string | null;
      notes?: string;
    }
  ): Promise<DivisionExercise> {
    // Validate videoId if provided
    if (data.videoId && data.videoId.length !== 11) {
      throw new Error('YouTube video ID must be exactly 11 characters');
    }

    return prisma.divisionExercise.update({
      where: { id },
      data
    });
  },

  async removeExercise(id: string): Promise<DivisionExercise> {
    return prisma.divisionExercise.delete({
      where: { id }
    });
  },

  // -------------------------------------------------------------------------
  // Load History Operations (NEW)
  // -------------------------------------------------------------------------

  async getExerciseLoadHistory(
    userId: string,
    exerciseId: string,
    limit = 10
  ): Promise<ExerciseLoadHistory | null> {
    // Get exercise info
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      select: { id: true, name: true }
    });

    if (!exercise) {
      return null;
    }

    // Get workout sessions with this exercise
    const workoutExercises = await prisma.workoutExercise.findMany({
      where: {
        exerciseId,
        workoutSession: {
          userId,
          status: 'COMPLETED'
        }
      },
      include: {
        sets: {
          where: { isCompleted: true },
          orderBy: { setNumber: 'asc' }
        },
        workoutSession: {
          select: {
            completedAt: true
          }
        }
      },
      orderBy: {
        workoutSession: {
          completedAt: 'desc'
        }
      },
      take: limit
    });

    // Calculate metrics for each workout
    const workouts = workoutExercises
      .filter(we => we.workoutSession.completedAt)
      .map(we => {
        const sets = we.sets.map(set => ({
          weight: set.weight,
          reps: set.reps,
          volume: set.weight * set.reps
        }));

        const totalVolume = sets.reduce((sum, set) => sum + set.volume, 0);
        const maxWeight = Math.max(...sets.map(s => s.weight), 0);
        const maxReps = Math.max(...sets.map(s => s.reps), 0);

        return {
          date: we.workoutSession.completedAt!,
          sets,
          totalVolume,
          maxWeight,
          maxReps
        };
      });

    if (workouts.length === 0) {
      return {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        workouts: [],
        personalRecords: {
          maxWeight: 0,
          maxWeightDate: new Date(),
          maxReps: 0,
          maxRepsDate: new Date(),
          maxVolume: 0,
          maxVolumeDate: new Date()
        }
      };
    }

    // Calculate personal records
    const allWeights = workouts.flatMap(w =>
      w.sets.map(s => ({ weight: s.weight, date: w.date }))
    );
    const allReps = workouts.flatMap(w =>
      w.sets.map(s => ({ reps: s.reps, date: w.date }))
    );
    const allVolumes = workouts.map(w => ({
      volume: w.totalVolume,
      date: w.date
    }));

    const maxWeightRecord = allWeights.reduce(
      (max, curr) => (curr.weight > max.weight ? curr : max),
      { weight: 0, date: new Date() }
    );

    const maxRepsRecord = allReps.reduce(
      (max, curr) => (curr.reps > max.reps ? curr : max),
      { reps: 0, date: new Date() }
    );

    const maxVolumeRecord = allVolumes.reduce(
      (max, curr) => (curr.volume > max.volume ? curr : max),
      { volume: 0, date: new Date() }
    );

    return {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      workouts,
      personalRecords: {
        maxWeight: maxWeightRecord.weight,
        maxWeightDate: maxWeightRecord.date,
        maxReps: maxRepsRecord.reps,
        maxRepsDate: maxRepsRecord.date,
        maxVolume: maxVolumeRecord.volume,
        maxVolumeDate: maxVolumeRecord.date
      }
    };
  },

  // -------------------------------------------------------------------------
  // Utility Operations
  // -------------------------------------------------------------------------

  async hasWorkoutSessions(routineId: string): Promise<boolean> {
    const count = await prisma.workoutSession.count({
      where: { routineId }
    });
    return count > 0;
  }
};
