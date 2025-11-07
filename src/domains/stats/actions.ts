'use server';

// Stats Domain Server Actions
// Aggregates statistics from workouts and routines for dashboard

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Types

export type DashboardStats = {
  streak: number; // Current workout streak in days
  weeklyWorkouts: number; // Workouts this week
  totalWorkouts: number; // Total completed workouts
  activeRoutine: {
    id: string;
    name: string;
    nextDay?: {
      name: string;
      exerciseCount: number;
    };
  } | null;
};

export type StatsResponse =
  | {
      success: true;
      data: DashboardStats;
    }
  | {
      success: false;
      error: string;
    };

// Get Dashboard Stats

export async function getDashboardStats(): Promise<StatsResponse> {
  try {
    // 1. Session validation (mandatory)
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const userId = session.user.id;

    // 2. Get total completed workouts
    const totalWorkouts = await prisma.workoutSession.count({
      where: {
        userId,
        status: 'COMPLETED'
      }
    });

    // 3. Get weekly workouts (last 7 days)
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);

    const weeklyWorkouts = await prisma.workoutSession.count({
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: {
          gte: weekStart
        }
      }
    });

    // 4. Calculate streak
    const streak = await calculateStreak(userId);

    // 5. Get active routine with next division info
    const activeRoutine = await prisma.routine.findFirst({
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
                    name: true
                  }
                }
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    const stats: DashboardStats = {
      streak,
      weeklyWorkouts,
      totalWorkouts,
      activeRoutine: activeRoutine
        ? {
            id: activeRoutine.id,
            name: activeRoutine.name,
            nextDay: activeRoutine.divisions[0]
              ? {
                  name: activeRoutine.divisions[0].name,
                  exerciseCount: activeRoutine.divisions[0].exercises.length
                }
              : undefined
          }
        : null
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { success: false, error: 'Failed to fetch dashboard stats' };
  }
}

// Helper: Calculate Workout Streak

async function calculateStreak(userId: string): Promise<number> {
  // Get all completed workouts ordered by completion date descending
  const workouts = await prisma.workoutSession.findMany({
    where: {
      userId,
      status: 'COMPLETED',
      completedAt: {
        not: null
      }
    },
    orderBy: {
      completedAt: 'desc'
    },
    select: {
      completedAt: true
    }
  });

  if (workouts.length === 0) {
    return 0;
  }

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const workout of workouts) {
    if (!workout.completedAt) continue;

    const workoutDate = new Date(workout.completedAt);
    workoutDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // If workout was today or yesterday, continue streak
    if (daysDiff === 0 || daysDiff === 1) {
      streak++;
      currentDate = workoutDate;
    } else {
      // Gap found, streak broken
      break;
    }
  }

  return streak;
}
