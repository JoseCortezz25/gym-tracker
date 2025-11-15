'use client';

import Link from 'next/link';
import { Flame, Calendar, Trophy, Dumbbell, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/molecules/stat-card';
import { EmptyState } from '@/components/molecules/empty-state';
import { Alert } from '@/components/ui/alert';
import { workoutsTextMap } from '@/domains/workouts/workouts.text-map';
import { useDashboardStats } from '@/domains/stats/hooks/use-stats';

/**
 * Dashboard Page
 * Central hub showing activity summary and quick access to start training
 * Connected to real data with React Query
 */
export default function DashboardPage() {
  const text = workoutsTextMap.dashboard;

  // Fetch dashboard stats
  const { data: stats, isLoading, error } = useDashboardStats();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Show error state
  if (error || !stats) {
    return (
      <Alert variant="destructive">
        Failed to load dashboard statistics. Please try again later.
      </Alert>
    );
  }

  const hasActiveRoutine = stats.activeRoutine !== null;
  const hasWorkouts = stats.totalWorkouts > 0;

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
          {text.heading}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {text.welcome.replace('{name}', 'User')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Flame}
          value={stats.streak}
          label={text.stats.streak.label}
          iconColor="text-orange-600"
          ariaLabel={text.stats.streak.ariaLabel.replace(
            '{count}',
            String(stats.streak)
          )}
        />
        <StatCard
          icon={Calendar}
          value={stats.weeklyWorkouts}
          label={text.stats.weeklyWorkouts.label}
          iconColor="text-blue-600"
          ariaLabel={text.stats.weeklyWorkouts.ariaLabel.replace(
            '{count}',
            String(stats.weeklyWorkouts)
          )}
        />
        <StatCard
          icon={Trophy}
          value={stats.totalWorkouts}
          label={text.stats.totalWorkouts.label}
          iconColor="text-green-600"
          ariaLabel={text.stats.totalWorkouts.ariaLabel.replace(
            '{count}',
            String(stats.totalWorkouts)
          )}
        />
      </div>

      {/* Train Today Section */}
      {hasActiveRoutine && stats.activeRoutine ? (
        <div className="rounded-xl border-2 border-blue-600 bg-blue-50 p-6 dark:bg-blue-950">
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-50">
            {text.trainToday.heading}
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            {stats.activeRoutine.nextDay
              ? `${stats.activeRoutine.nextDay.name} • ${stats.activeRoutine.nextDay.exerciseCount} exercises`
              : stats.activeRoutine.name}
          </p>
          <Button
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto"
            asChild
          >
            <Link href="/my-workout">{text.trainToday.button}</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 dark:border-gray-700">
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            {text.trainToday.noRoutine}
          </p>
          <Button variant="outline" size="lg" asChild>
            <Link href="/my-workout/assessment">
              {text.trainToday.setRoutine}
            </Link>
          </Button>
        </div>
      )}

      {/* Recent Activity */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            {text.recentActivity.heading}
          </h2>
          {hasWorkouts && (
            <Link
              href="/history"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-500 dark:hover:text-blue-400"
            >
              {text.recentActivity.viewAll}
            </Link>
          )}
        </div>

        {hasWorkouts ? (
          <div className="space-y-4">
            {/* Recent workout cards will be implemented in Phase 2F */}
            <p className="text-gray-600 dark:text-gray-400">
              Recent workouts will appear here
            </p>
          </div>
        ) : (
          <EmptyState
            icon={Dumbbell}
            heading={text.recentActivity.empty}
            message="Create a routine and start your first workout to track your progress"
            customAction={
              <Button size="lg" asChild>
                <Link href="/my-workout">Mi Entrenamiento</Link>
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
