'use client';

// React Query hooks for Stats domain

import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../actions';

// Query Keys

export const statsKeys = {
  all: ['stats'] as const,
  dashboard: () => [...statsKeys.all, 'dashboard'] as const
};

// Queries

/**
 * Get dashboard statistics
 * Stale time: 1 minute (stats update frequently with workouts)
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: statsKeys.dashboard(),
    queryFn: async () => {
      const result = await getDashboardStats();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 60 * 1000 // 1 minute
  });
}
