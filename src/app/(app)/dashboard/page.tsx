import Link from 'next/link';
import { Flame, Calendar, Trophy, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/molecules/stat-card';
import { EmptyState } from '@/components/molecules/empty-state';
import { workoutsTextMap } from '@/domains/workouts/workouts.text-map';

/**
 * Dashboard Page
 * Central hub showing activity summary and quick access to start training
 * UI-only implementation (mock data)
 */
export default function DashboardPage() {
  const text = workoutsTextMap.dashboard;

  // Mock data (will be replaced with real data in Phase 2)
  const mockStats = {
    streak: 5,
    weeklyWorkouts: 3,
    totalWorkouts: 24
  };

  const hasActiveRoutine = true; // Mock
  const hasWorkouts = false; // Mock - set to true to see recent activity

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
          value={mockStats.streak}
          label={text.stats.streak.label}
          iconColor="text-orange-600"
          ariaLabel={text.stats.streak.ariaLabel.replace(
            '{count}',
            String(mockStats.streak)
          )}
        />
        <StatCard
          icon={Calendar}
          value={mockStats.weeklyWorkouts}
          label={text.stats.weeklyWorkouts.label}
          iconColor="text-blue-600"
          ariaLabel={text.stats.weeklyWorkouts.ariaLabel.replace(
            '{count}',
            String(mockStats.weeklyWorkouts)
          )}
        />
        <StatCard
          icon={Trophy}
          value={mockStats.totalWorkouts}
          label={text.stats.totalWorkouts.label}
          iconColor="text-green-600"
          ariaLabel={text.stats.totalWorkouts.ariaLabel.replace(
            '{count}',
            String(mockStats.totalWorkouts)
          )}
        />
      </div>

      {/* Train Today Section */}
      {hasActiveRoutine ? (
        <div className="rounded-xl border-2 border-blue-600 bg-blue-50 p-6 dark:bg-blue-950">
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-50">
            {text.trainToday.heading}
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Push Day • 6 exercises
          </p>
          <Button
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto"
          >
            {text.trainToday.button}
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 dark:border-gray-700">
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            {text.trainToday.noRoutine}
          </p>
          <Button variant="outline" size="lg" asChild>
            <Link href="/routines">{text.trainToday.setRoutine}</Link>
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
            {/* Mock recent workout cards would go here */}
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
                <Link href="/routines">My Routines</Link>
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
