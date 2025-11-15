/**
 * Workout Splits Domain - Server Actions
 *
 * Server-side actions for workout splits system.
 * All mutations and data fetching for workout splits.
 *
 * Follows critical constraints:
 * - Server Actions for all mutations
 * - Session validation required
 * - Zod schema validation
 * - Path revalidation after mutations
 */

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import type { ExerciseCategory, TrainingFocus } from '@prisma/client';
import {
  workoutAssessmentInputSchema,
  setDataInputSchema,
  finalizeWorkoutInputSchema,
  getWeightHistorySchema,
  startWorkoutSessionSchema,
  toggleExerciseCompletionSchema,
  updateSplitSchema
} from './schema';
import {
  generateWorkoutSplits,
  validateSplitGenerationParams
} from './lib/split-generator';
import type {
  WorkoutAssessmentWithSplits,
  SplitWithProgress,
  ExerciseWeightHistory,
  WorkoutCompletionDates,
  CreateAssessmentResponse,
  GetActiveAssessmentResponse,
  GetCurrentSplitResponse,
  GetWeightHistoryResponse,
  FinalizeWorkoutResponse,
  ServerActionResponse
} from './types';

// ============================================================================
// ASSESSMENT ACTIONS
// ============================================================================

/**
 * Create Workout Assessment and Generate Splits
 *
 * Creates a new workout assessment based on user preferences and
 * automatically generates workout splits using the split generation algorithm.
 *
 * @param formData - Form data containing frequency and trainingFocus
 * @returns Assessment with generated splits
 */
export async function createWorkoutSplitsFromAssessment(
  formData: FormData
): Promise<CreateAssessmentResponse> {
  try {
    // 1. Validate session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized. Please log in.'
      };
    }

    // 2. Parse and validate input
    const rawData = {
      frequency: Number(formData.get('frequency')),
      trainingFocus: formData.get('trainingFocus') as TrainingFocus
    };

    const validation = workoutAssessmentInputSchema.safeParse(rawData);

    if (!validation.success) {
      return {
        success: false,
        error: 'Invalid input data',
        validationErrors: validation.error.flatten().fieldErrors
      };
    }

    const { frequency, trainingFocus } = validation.data;

    // 3. Validate split generation parameters
    const genValidation = validateSplitGenerationParams(
      frequency,
      trainingFocus
    );
    if (!genValidation.isValid) {
      return {
        success: false,
        error: genValidation.error
      };
    }

    // 4. Deactivate any existing active assessments
    await prisma.workoutAssessment.updateMany({
      where: {
        userId: session.user.id,
        isActive: true
      },
      data: {
        isActive: false
      }
    });

    // 5. Generate splits using algorithm
    const generatedSplits = generateWorkoutSplits(frequency, trainingFocus);

    // 6. Create assessment with splits in a transaction
    const assessment = await prisma.workoutAssessment.create({
      data: {
        userId: session.user.id,
        frequency,
        trainingFocus,
        isActive: true,
        currentSplitIndex: 0,
        splits: {
          create: await Promise.all(
            generatedSplits.map(async split => ({
              name: split.name,
              subtitle: split.subtitle,
              splitLetter: split.splitLetter,
              order: split.order,
              exercises: {
                create: await Promise.all(
                  split.exercises.map(async ex => {
                    // Find or create exercise
                    const exercise = await prisma.exercise.upsert({
                      where: {
                        name_userId: {
                          name: ex.exerciseName,
                          userId: session.user.id
                        }
                      },
                      update: {},
                      create: {
                        name: ex.exerciseName,
                        category: ex.category as ExerciseCategory,
                        isPredefined: true,
                        userId: session.user.id
                      }
                    });

                    return {
                      exerciseId: exercise.id,
                      order: ex.order,
                      targetSets: ex.targetSets,
                      targetReps: ex.targetReps,
                      restSeconds: ex.restSeconds,
                      notes: ex.notes
                    };
                  })
                )
              }
            }))
          )
        }
      },
      include: {
        splits: {
          include: {
            exercises: {
              include: {
                exercise: true
              },
              orderBy: {
                order: 'asc'
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    // 7. Revalidate paths
    revalidatePath('/my-workout');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: assessment as WorkoutAssessmentWithSplits
    };
  } catch (error) {
    console.error('Error creating workout assessment:', error);
    return {
      success: false,
      error: 'Failed to create workout assessment. Please try again.'
    };
  }
}

/**
 * Get Active Assessment
 *
 * Fetches the user's currently active workout assessment with all splits.
 *
 * @returns Active assessment or null if none exists
 */
export async function getActiveAssessment(): Promise<GetActiveAssessmentResponse> {
  try {
    // 1. Validate session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized. Please log in.'
      };
    }

    // 2. Fetch active assessment
    const assessment = await prisma.workoutAssessment.findFirst({
      where: {
        userId: session.user.id,
        isActive: true
      },
      include: {
        splits: {
          include: {
            exercises: {
              include: {
                exercise: true
              },
              orderBy: {
                order: 'asc'
              }
            },
            _count: {
              select: {
                exercises: true,
                workoutSessions: true
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    return {
      success: true,
      data: assessment as WorkoutAssessmentWithSplits | null
    };
  } catch (error) {
    console.error('Error fetching active assessment:', error);
    return {
      success: false,
      error: 'Failed to fetch assessment. Please try again.'
    };
  }
}

// ============================================================================
// SPLIT ACTIONS
// ============================================================================

/**
 * Get Current Workout Split
 *
 * Fetches the current split that the user should perform next,
 * based on the circular progression logic.
 *
 * @returns Current split with progress information
 */
export async function getCurrentWorkoutSplit(): Promise<GetCurrentSplitResponse> {
  try {
    // 1. Validate session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized. Please log in.'
      };
    }

    // 2. Get active assessment
    const assessment = await prisma.workoutAssessment.findFirst({
      where: {
        userId: session.user.id,
        isActive: true
      },
      include: {
        splits: {
          include: {
            exercises: {
              include: {
                exercise: true
              },
              orderBy: {
                order: 'asc'
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!assessment) {
      return {
        success: false,
        error: 'No active assessment found. Please complete the pre-assessment.'
      };
    }

    // 3. Get current split based on currentSplitIndex
    const currentSplit = assessment.splits[assessment.currentSplitIndex];

    if (!currentSplit) {
      return {
        success: false,
        error: 'Current split not found.'
      };
    }

    // 4. Check if there's an active workout session for this split
    const activeSession = await prisma.workoutSession.findFirst({
      where: {
        userId: session.user.id,
        splitId: currentSplit.id,
        status: 'IN_PROGRESS'
      },
      include: {
        exercises: {
          include: {
            sets: true
          }
        }
      }
    });

    // 5. Build progress data
    const totalExercises = currentSplit.exercises.length;
    let completedExercises = 0;

    if (activeSession) {
      // Count completed exercises based on workout session
      completedExercises = activeSession.exercises.filter(ex =>
        ex.sets.some(set => set.isCompleted)
      ).length;
    }

    const completionPercentage =
      totalExercises > 0
        ? Math.round((completedExercises / totalExercises) * 100)
        : 0;

    // 6. Build split with progress
    const splitWithProgress: SplitWithProgress = {
      ...currentSplit,
      exercises: currentSplit.exercises.map(splitEx => ({
        ...splitEx,
        isCompleted:
          activeSession?.exercises.some(
            ex =>
              ex.exerciseId === splitEx.exerciseId &&
              ex.sets.some(s => s.isCompleted)
          ) || false
      })),
      completionPercentage,
      totalExercises,
      completedExercises,
      isCurrentSplit: true
    };

    return {
      success: true,
      data: splitWithProgress
    };
  } catch (error) {
    console.error('Error fetching current workout split:', error);
    return {
      success: false,
      error: 'Failed to fetch current workout split. Please try again.'
    };
  }
}

/**
 * Get Workout Split with Progress
 *
 * Fetches a specific split by ID with progress information.
 *
 * @param splitId - ID of the split to fetch
 * @returns Split with progress data
 */
export async function getWorkoutSplitWithProgress(
  splitId: string
): Promise<GetCurrentSplitResponse> {
  try {
    // 1. Validate session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized. Please log in.'
      };
    }

    // 2. Fetch split
    const split = await prisma.workoutSplit.findUnique({
      where: {
        id: splitId
      },
      include: {
        exercises: {
          include: {
            exercise: true
          },
          orderBy: {
            order: 'asc'
          }
        },
        assessment: true
      }
    });

    if (!split) {
      return {
        success: false,
        error: 'Split not found.'
      };
    }

    // 3. Verify ownership
    if (split.assessment.userId !== session.user.id) {
      return {
        success: false,
        error: 'Unauthorized. This split does not belong to you.'
      };
    }

    // 4. Check for active session
    const activeSession = await prisma.workoutSession.findFirst({
      where: {
        userId: session.user.id,
        splitId: split.id,
        status: 'IN_PROGRESS'
      },
      include: {
        exercises: {
          include: {
            sets: true
          }
        }
      }
    });

    // 5. Calculate progress
    const totalExercises = split.exercises.length;
    let completedExercises = 0;

    if (activeSession) {
      completedExercises = activeSession.exercises.filter(ex =>
        ex.sets.some(set => set.isCompleted)
      ).length;
    }

    const completionPercentage =
      totalExercises > 0
        ? Math.round((completedExercises / totalExercises) * 100)
        : 0;

    // 6. Build response
    const splitWithProgress: SplitWithProgress = {
      ...split,
      exercises: split.exercises.map(splitEx => ({
        ...splitEx,
        isCompleted:
          activeSession?.exercises.some(
            ex =>
              ex.exerciseId === splitEx.exerciseId &&
              ex.sets.some(s => s.isCompleted)
          ) || false
      })),
      completionPercentage,
      totalExercises,
      completedExercises,
      isCurrentSplit: split.order === split.assessment.currentSplitIndex
    };

    return {
      success: true,
      data: splitWithProgress
    };
  } catch (error) {
    console.error('Error fetching workout split:', error);
    return {
      success: false,
      error: 'Failed to fetch workout split. Please try again.'
    };
  }
}

// ============================================================================
// WORKOUT SESSION ACTIONS
// ============================================================================

/**
 * Start Workout Session
 *
 * Creates a new workout session for a split.
 *
 * @param formData - Form data containing splitId and assessmentId
 * @returns Created session ID
 */
export async function startWorkoutSession(
  formData: FormData
): Promise<ServerActionResponse<{ sessionId: string }>> {
  try {
    // 1. Validate session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized. Please log in.'
      };
    }

    // 2. Parse and validate input
    const rawData = {
      splitId: formData.get('splitId') as string,
      assessmentId: formData.get('assessmentId') as string
    };

    const validation = startWorkoutSessionSchema.safeParse(rawData);

    if (!validation.success) {
      return {
        success: false,
        error: 'Invalid input data',
        validationErrors: validation.error.flatten().fieldErrors
      };
    }

    const { splitId, assessmentId } = validation.data;

    // 3. Check if there's already an active session for this split
    const existingSession = await prisma.workoutSession.findFirst({
      where: {
        userId: session.user.id,
        splitId,
        status: 'IN_PROGRESS'
      }
    });

    if (existingSession) {
      return {
        success: true,
        data: { sessionId: existingSession.id }
      };
    }

    // 4. Create new workout session
    const workoutSession = await prisma.workoutSession.create({
      data: {
        userId: session.user.id,
        splitId,
        assessmentId,
        status: 'IN_PROGRESS',
        startedAt: new Date()
      }
    });

    // 5. Revalidate paths
    revalidatePath('/my-workout');
    revalidatePath(`/my-workout/splits/${splitId}`);

    return {
      success: true,
      data: { sessionId: workoutSession.id }
    };
  } catch (error) {
    console.error('Error starting workout session:', error);
    return {
      success: false,
      error: 'Failed to start workout session. Please try again.'
    };
  }
}

/**
 * Record Set Data
 *
 * Records weight and reps for a set in the current workout session.
 *
 * @param sessionId - ID of the active workout session
 * @param formData - Form data containing exerciseId, weight, reps, notes
 * @returns Success response
 */
export async function recordSetData(
  sessionId: string,
  formData: FormData
): Promise<ServerActionResponse<void>> {
  try {
    // 1. Validate session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized. Please log in.'
      };
    }

    // 2. Parse and validate input
    const rawData = {
      exerciseId: formData.get('exerciseId') as string,
      weight: Number(formData.get('weight')),
      reps: Number(formData.get('reps')),
      notes: formData.get('notes') as string | undefined
    };

    const validation = setDataInputSchema.safeParse(rawData);

    if (!validation.success) {
      return {
        success: false,
        error: 'Invalid input data',
        validationErrors: validation.error.flatten().fieldErrors
      };
    }

    const { exerciseId, weight, reps, notes } = validation.data;

    // 3. Verify session ownership
    const workoutSession = await prisma.workoutSession.findUnique({
      where: { id: sessionId }
    });

    if (!workoutSession || workoutSession.userId !== session.user.id) {
      return {
        success: false,
        error: 'Unauthorized. This session does not belong to you.'
      };
    }

    if (workoutSession.status !== 'IN_PROGRESS') {
      return {
        success: false,
        error: 'This workout session is not active.'
      };
    }

    // 4. Find or create WorkoutExercise
    let workoutExercise = await prisma.workoutExercise.findFirst({
      where: {
        workoutSessionId: sessionId,
        exerciseId
      },
      include: {
        sets: true
      }
    });

    if (!workoutExercise) {
      // Create workout exercise
      const exerciseCount = await prisma.workoutExercise.count({
        where: { workoutSessionId: sessionId }
      });

      workoutExercise = await prisma.workoutExercise.create({
        data: {
          workoutSessionId: sessionId,
          exerciseId,
          order: exerciseCount + 1
        },
        include: {
          sets: true
        }
      });
    }

    // 5. Create workout set
    const setNumber = workoutExercise.sets.length + 1;

    await prisma.workoutSet.create({
      data: {
        workoutExerciseId: workoutExercise.id,
        setNumber,
        weight,
        reps,
        isCompleted: true,
        completedAt: new Date(),
        notes
      }
    });

    // 6. Revalidate paths
    revalidatePath('/my-workout');
    revalidatePath(`/my-workout/splits/${workoutSession.splitId}`);

    return {
      success: true
    };
  } catch (error) {
    console.error('Error recording set data:', error);
    return {
      success: false,
      error: 'Failed to record set data. Please try again.'
    };
  }
}

/**
 * Finalize Workout
 *
 * Completes the workout session, updates weight history, and advances to next split.
 *
 * @param formData - Form data containing splitId, sessionId, duration, rating, notes
 * @returns Response with next split information
 */
export async function finalizeWorkout(
  formData: FormData
): Promise<FinalizeWorkoutResponse> {
  try {
    // 1. Validate session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized. Please log in.'
      };
    }

    // 2. Parse and validate input
    const rawData = {
      splitId: formData.get('splitId') as string,
      sessionId: formData.get('sessionId') as string,
      duration: formData.get('duration')
        ? Number(formData.get('duration'))
        : undefined,
      rating: formData.get('rating')
        ? Number(formData.get('rating'))
        : undefined,
      notes: formData.get('notes') as string | undefined
    };

    const validation = finalizeWorkoutInputSchema.safeParse(rawData);

    if (!validation.success) {
      return {
        success: false,
        error: 'Invalid input data',
        validationErrors: validation.error.flatten().fieldErrors
      };
    }

    const { splitId, sessionId, duration, rating, notes } = validation.data;

    // 3. Verify session ownership and status
    const workoutSession = await prisma.workoutSession.findUnique({
      where: { id: sessionId },
      include: {
        exercises: {
          include: {
            sets: true,
            exercise: true
          }
        },
        split: {
          include: {
            assessment: true
          }
        }
      }
    });

    if (!workoutSession || workoutSession.userId !== session.user.id) {
      return {
        success: false,
        error: 'Unauthorized. This session does not belong to you.'
      };
    }

    if (workoutSession.status !== 'IN_PROGRESS') {
      return {
        success: false,
        error: 'This workout session is not active.'
      };
    }

    // 4. Calculate duration if not provided
    const completedAt = new Date();
    const actualDuration =
      duration ||
      Math.floor(
        (completedAt.getTime() - workoutSession.startedAt.getTime()) / 1000
      );

    // 5. Update workout session to completed
    await prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        completedAt,
        duration: actualDuration,
        rating,
        notes
      }
    });

    // 6. Create weight history entries
    for (const exercise of workoutSession.exercises) {
      if (exercise.sets.length > 0) {
        const completedSets = exercise.sets.filter(s => s.isCompleted);
        if (completedSets.length > 0) {
          // Calculate average weight and reps
          const avgWeight =
            completedSets.reduce((sum, s) => sum + s.weight, 0) /
            completedSets.length;
          const avgReps = Math.round(
            completedSets.reduce((sum, s) => sum + s.reps, 0) /
              completedSets.length
          );

          await prisma.weightHistory.create({
            data: {
              userId: session.user.id,
              exerciseId: exercise.exerciseId,
              weight: avgWeight,
              reps: avgReps,
              sets: completedSets.length,
              workoutSessionId: sessionId,
              completedAt
            }
          });
        }
      }
    }

    // 7. Advance to next split (circular progression)
    const assessment = workoutSession.split!.assessment;
    const totalSplits = await prisma.workoutSplit.count({
      where: { assessmentId: assessment.id }
    });

    const nextSplitIndex = (assessment.currentSplitIndex + 1) % totalSplits;

    await prisma.workoutAssessment.update({
      where: { id: assessment.id },
      data: {
        currentSplitIndex: nextSplitIndex
      }
    });

    // 8. Get next split
    const nextSplit = await prisma.workoutSplit.findFirst({
      where: {
        assessmentId: assessment.id,
        order: nextSplitIndex
      }
    });

    // 9. Revalidate paths
    revalidatePath('/my-workout');
    revalidatePath(`/my-workout/splits/${splitId}`);
    revalidatePath('/dashboard');

    return {
      success: true,
      data: {
        sessionId,
        nextSplitId: nextSplit!.id,
        completedAt
      }
    };
  } catch (error) {
    console.error('Error finalizing workout:', error);
    return {
      success: false,
      error: 'Failed to finalize workout. Please try again.'
    };
  }
}

// ============================================================================
// WEIGHT HISTORY ACTIONS
// ============================================================================

/**
 * Get Weight History
 *
 * Fetches weight history for a specific exercise.
 *
 * @param exerciseId - ID of the exercise
 * @param limit - Number of history entries to fetch (default: 5)
 * @returns Weight history with trend analysis
 */
export async function getWeightHistory(
  exerciseId: string,
  limit: number = 5
): Promise<GetWeightHistoryResponse> {
  try {
    // 1. Validate session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized. Please log in.'
      };
    }

    // 2. Validate input
    const validation = getWeightHistorySchema.safeParse({ exerciseId, limit });

    if (!validation.success) {
      return {
        success: false,
        error: 'Invalid input data',
        validationErrors: validation.error.flatten().fieldErrors
      };
    }

    // 3. Fetch exercise
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId }
    });

    if (!exercise) {
      return {
        success: false,
        error: 'Exercise not found.'
      };
    }

    // 4. Fetch weight history
    const entries = await prisma.weightHistory.findMany({
      where: {
        userId: session.user.id,
        exerciseId
      },
      include: {
        exercise: true,
        workoutSession: true
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: limit
    });

    // 5. Calculate trend
    let trend: 'increasing' | 'decreasing' | 'stable' | 'insufficient_data' =
      'insufficient_data';

    if (entries.length >= 3) {
      const weights = entries.map(e => e.weight).reverse(); // oldest to newest
      const firstHalf = weights.slice(0, Math.floor(weights.length / 2));
      const secondHalf = weights.slice(Math.floor(weights.length / 2));

      const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const avgSecond =
        secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

      const difference = avgSecond - avgFirst;
      const percentChange = (difference / avgFirst) * 100;

      if (percentChange > 5) {
        trend = 'increasing';
      } else if (percentChange < -5) {
        trend = 'decreasing';
      } else {
        trend = 'stable';
      }
    }

    // 6. Calculate statistics
    const weights = entries.map(e => e.weight);
    const latestWeight = weights.length > 0 ? weights[0] : null;
    const maxWeight = weights.length > 0 ? Math.max(...weights) : null;
    const avgWeight =
      weights.length > 0
        ? weights.reduce((a, b) => a + b, 0) / weights.length
        : null;

    const history: ExerciseWeightHistory = {
      exerciseId,
      exerciseName: exercise.name,
      entries,
      trend,
      latestWeight,
      maxWeight,
      avgWeight
    };

    return {
      success: true,
      data: history
    };
  } catch (error) {
    console.error('Error fetching weight history:', error);
    return {
      success: false,
      error: 'Failed to fetch weight history. Please try again.'
    };
  }
}

// ============================================================================
// CALENDAR ACTIONS
// ============================================================================

/**
 * Get Workout Completion Dates
 *
 * Fetches dates when workouts were completed for calendar display.
 *
 * @param startDate - Start date for date range
 * @param endDate - End date for date range
 * @returns Workout completion dates with streak information
 */
export async function getWorkoutCompletionDates(
  startDate: Date,
  endDate: Date
): Promise<ServerActionResponse<WorkoutCompletionDates>> {
  try {
    // 1. Validate session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized. Please log in.'
      };
    }

    // 2. Fetch completed workout sessions in date range
    const sessions = await prisma.workoutSession.findMany({
      where: {
        userId: session.user.id,
        status: 'COMPLETED',
        completedAt: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        completedAt: true
      },
      orderBy: {
        completedAt: 'desc'
      }
    });

    // 3. Extract unique dates (ignore time)
    const dateSet = new Set<string>();
    sessions.forEach(s => {
      if (s.completedAt) {
        const dateStr = s.completedAt.toISOString().split('T')[0];
        dateSet.add(dateStr);
      }
    });

    const dates = Array.from(dateSet).map(d => new Date(d));

    // 4. Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortedDates = dates.sort((a, b) => b.getTime() - a.getTime());

    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i]);
      date.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === i) {
        currentStreak++;
      } else {
        break;
      }
    }

    // 5. Calculate longest streak (simplified)
    const longestStreak = currentStreak;

    return {
      success: true,
      data: {
        dates,
        currentStreak,
        longestStreak,
        totalWorkouts: dates.length
      }
    };
  } catch (error) {
    console.error('Error fetching workout completion dates:', error);
    return {
      success: false,
      error: 'Failed to fetch workout completion dates. Please try again.'
    };
  }
}

/**
 * Toggle Exercise Completion
 *
 * Marks an exercise as completed or uncompleted by creating/updating a WorkoutSet.
 * This allows users to check off exercises during an active workout session.
 *
 * @param formData - Form data containing splitExerciseId and isCompleted
 * @returns Success response
 */
export async function toggleExerciseCompletion(
  formData: FormData
): Promise<ServerActionResponse> {
  try {
    // 1. Validate session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized. Please log in.'
      };
    }

    // 2. Parse and validate input
    const rawData = {
      splitExerciseId: formData.get('splitExerciseId') as string,
      isCompleted: formData.get('isCompleted') === 'true'
    };

    const validation = toggleExerciseCompletionSchema.safeParse(rawData);

    if (!validation.success) {
      return {
        success: false,
        error: 'Invalid input data',
        validationErrors: validation.error.flatten().fieldErrors
      };
    }

    const { splitExerciseId, isCompleted } = validation.data;

    // 3. Get split exercise with split and assessment info
    const splitExercise = await prisma.splitExercise.findUnique({
      where: { id: splitExerciseId },
      include: {
        split: {
          include: {
            assessment: true
          }
        },
        exercise: true
      }
    });

    if (!splitExercise) {
      return {
        success: false,
        error: 'Split exercise not found'
      };
    }

    // 4. Verify assessment belongs to user
    if (splitExercise.split.assessment.userId !== session.user.id) {
      return {
        success: false,
        error: 'Unauthorized access to this exercise'
      };
    }

    // 5. Find active session for this split
    const activeSession = await prisma.workoutSession.findFirst({
      where: {
        splitId: splitExercise.splitId,
        userId: session.user.id,
        status: 'IN_PROGRESS'
      },
      include: {
        exercises: {
          include: {
            sets: true
          }
        }
      }
    });

    if (!activeSession) {
      return {
        success: false,
        error: 'No active workout session found. Please start a workout first.'
      };
    }

    // 6. Find or create WorkoutExercise for this exercise in the session
    let workoutExercise = activeSession.exercises.find(
      ex => ex.exerciseId === splitExercise.exerciseId
    );

    if (!workoutExercise) {
      // Create WorkoutExercise if it doesn't exist
      workoutExercise = await prisma.workoutExercise.create({
        data: {
          workoutSessionId: activeSession.id,
          exerciseId: splitExercise.exerciseId,
          order: activeSession.exercises.length + 1,
          restSeconds: splitExercise.restSeconds,
          notes: null
        },
        include: {
          sets: true
        }
      });
    }

    // 7. Toggle completion by creating/updating a set
    if (isCompleted) {
      // Mark as completed: create a default set if none exist
      const existingSet = workoutExercise.sets[0];

      if (!existingSet) {
        await prisma.workoutSet.create({
          data: {
            workoutExerciseId: workoutExercise.id,
            setNumber: 1,
            weight: 0,
            reps: 0,
            isCompleted: true,
            completedAt: new Date()
          }
        });
      } else if (!existingSet.isCompleted) {
        await prisma.workoutSet.update({
          where: { id: existingSet.id },
          data: {
            isCompleted: true,
            completedAt: new Date()
          }
        });
      }
    } else {
      // Mark as uncompleted: delete all sets or mark first set as incomplete
      const existingSet = workoutExercise.sets[0];

      if (existingSet) {
        await prisma.workoutSet.update({
          where: { id: existingSet.id },
          data: {
            isCompleted: false,
            completedAt: null
          }
        });
      }
    }

    // 8. Revalidate paths
    revalidatePath(`/my-workout/splits/${splitExercise.splitId}`);
    revalidatePath('/my-workout');

    return {
      success: true
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error toggling exercise completion:', error);
    return {
      success: false,
      error: 'Failed to update exercise completion. Please try again.'
    };
  }
}

/**
 * Update Workout Split
 *
 * Updates split name and subtitle.
 * Allows users to customize their workout splits.
 *
 * @param formData - Form data containing splitId, name, and subtitle
 * @returns Success response
 */
export async function updateWorkoutSplit(
  formData: FormData
): Promise<ServerActionResponse> {
  try {
    // 1. Validate session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized. Please log in.'
      };
    }

    // 2. Parse and validate input
    const rawData = {
      splitId: formData.get('splitId') as string,
      name: formData.get('name') as string,
      subtitle: formData.get('subtitle') as string | null
    };

    const validation = updateSplitSchema.safeParse({
      ...rawData,
      subtitle: rawData.subtitle || undefined
    });

    if (!validation.success) {
      return {
        success: false,
        error: 'Invalid input data',
        validationErrors: validation.error.flatten().fieldErrors
      };
    }

    const { splitId, name, subtitle } = validation.data;

    // 3. Verify split belongs to user
    const split = await prisma.workoutSplit.findUnique({
      where: { id: splitId },
      include: {
        assessment: true
      }
    });

    if (!split) {
      return {
        success: false,
        error: 'Workout split not found'
      };
    }

    if (split.assessment.userId !== session.user.id) {
      return {
        success: false,
        error: 'Unauthorized access to this split'
      };
    }

    // 4. Update split
    await prisma.workoutSplit.update({
      where: { id: splitId },
      data: {
        name,
        subtitle: subtitle || null
      }
    });

    // 5. Revalidate paths
    revalidatePath(`/my-workout/splits/${splitId}`);
    revalidatePath('/my-workout');

    return {
      success: true
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating workout split:', error);
    return {
      success: false,
      error: 'Failed to update workout split. Please try again.'
    };
  }
}
