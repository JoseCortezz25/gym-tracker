/**
 * Workout Splits Domain - Calendar Hooks
 *
 * Custom hooks for fetching and managing workout completion calendar data.
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { getWorkoutCompletionDates } from '../actions';
import type { WorkoutCompletionDates } from '../types';
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const calendarKeys = {
  all: ['workout-calendar'] as const,
  month: (year: number, month: number) =>
    [...calendarKeys.all, 'month', year, month] as const,
  year: (year: number) => [...calendarKeys.all, 'year', year] as const,
  range: (startDate: Date, endDate: Date) =>
    [
      ...calendarKeys.all,
      'range',
      startDate.toISOString(),
      endDate.toISOString()
    ] as const
};

// ============================================================================
// CALENDAR HOOKS
// ============================================================================

/**
 * Hook: Get Workout Calendar for Month
 *
 * Fetches workout completion dates for a specific month.
 * Includes streak information and total workout count.
 *
 * @param year - Year (e.g., 2025)
 * @param month - Month (0-11, where 0 is January)
 * @param enabled - Whether the query should run (default: true)
 * @returns Query result with calendar data
 */
export function useWorkoutCalendarMonth(
  year: number,
  month: number,
  enabled: boolean = true
) {
  const startDate = startOfMonth(new Date(year, month));
  const endDate = endOfMonth(new Date(year, month));

  return useQuery({
    queryKey: calendarKeys.month(year, month),
    queryFn: async () => {
      const response = await getWorkoutCompletionDates(startDate, endDate);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch workout calendar');
      }

      return response.data;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true
  });
}

/**
 * Hook: Get Workout Calendar for Year
 *
 * Fetches workout completion dates for an entire year.
 * Useful for annual statistics and visualizations.
 *
 * @param year - Year (e.g., 2025)
 * @param enabled - Whether the query should run (default: true)
 * @returns Query result with calendar data
 */
export function useWorkoutCalendarYear(year: number, enabled: boolean = true) {
  const startDate = startOfYear(new Date(year, 0));
  const endDate = endOfYear(new Date(year, 0));

  return useQuery({
    queryKey: calendarKeys.year(year),
    queryFn: async () => {
      const response = await getWorkoutCompletionDates(startDate, endDate);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch workout calendar');
      }

      return response.data;
    },
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes (year data changes less frequently)
    refetchOnWindowFocus: false
  });
}

/**
 * Hook: Get Workout Calendar for Date Range
 *
 * Fetches workout completion dates for a custom date range.
 *
 * @param startDate - Start date of range
 * @param endDate - End date of range
 * @param enabled - Whether the query should run (default: true)
 * @returns Query result with calendar data
 */
export function useWorkoutCalendarRange(
  startDate: Date,
  endDate: Date,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: calendarKeys.range(startDate, endDate),
    queryFn: async () => {
      const response = await getWorkoutCompletionDates(startDate, endDate);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch workout calendar');
      }

      return response.data;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true
  });
}

/**
 * Hook: Get Current Month Calendar
 *
 * Convenience hook that fetches calendar data for the current month.
 *
 * @returns Query result with current month calendar data
 */
export function useCurrentMonthCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  return useWorkoutCalendarMonth(year, month);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a date has a workout
 *
 * @param date - Date to check
 * @param calendarData - Calendar data from hook
 * @returns True if date has a workout
 */
export function hasWorkoutOnDate(
  date: Date,
  calendarData: WorkoutCompletionDates | undefined
): boolean {
  if (!calendarData) return false;

  const dateString = date.toISOString().split('T')[0];

  return calendarData.dates.some(d => {
    const dString = d.toISOString().split('T')[0];
    return dString === dateString;
  });
}

/**
 * Get workout count for a date
 *
 * @param date - Date to check
 * @param calendarData - Calendar data from hook
 * @returns Number of workouts on date
 */
export function getWorkoutCountOnDate(
  date: Date,
  calendarData: WorkoutCompletionDates | undefined
): number {
  if (!calendarData) return 0;

  const dateString = date.toISOString().split('T')[0];

  return calendarData.dates.filter(d => {
    const dString = d.toISOString().split('T')[0];
    return dString === dateString;
  }).length;
}

/**
 * Get streak status
 *
 * @param calendarData - Calendar data from hook
 * @returns Streak information
 */
export function getStreakStatus(
  calendarData: WorkoutCompletionDates | undefined
): {
  currentStreak: number;
  longestStreak: number;
  isActive: boolean;
} {
  if (!calendarData) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      isActive: false
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const hasWorkoutToday = hasWorkoutOnDate(today, calendarData);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const hasWorkoutYesterday = hasWorkoutOnDate(yesterday, calendarData);

  const isActive = hasWorkoutToday || hasWorkoutYesterday;

  return {
    currentStreak: calendarData.currentStreak,
    longestStreak: calendarData.longestStreak,
    isActive
  };
}
