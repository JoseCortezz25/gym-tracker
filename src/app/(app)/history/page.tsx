'use client';

import { useState } from 'react';
import { Calendar, Dumbbell, Loader2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { EmptyState } from '@/components/molecules/empty-state';
import { useRecentWorkouts } from '@/domains/workouts/hooks/use-workouts';
import type { WorkoutSessionWithDetails } from '@/domains/workouts/types';

/**
 * History Page
 * View past workout sessions with details
 */
export default function HistoryPage() {
  const [selectedWorkout, setSelectedWorkout] =
    useState<WorkoutSessionWithDetails | null>(null);
  const [limit] = useState(20);

  // Fetch recent workouts
  const { data: workouts, isLoading, error } = useRecentWorkouts(limit);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        Failed to load workout history. Please try again later.
      </Alert>
    );
  }

  // Empty state
  if (!workouts || workouts.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
          Workout History
        </h1>
        <EmptyState
          icon={Dumbbell}
          heading="No Workouts Yet"
          message="Complete your first workout to see it here"
          customAction={
            <Button size="lg" asChild>
              <a href="/workout/active">Start Workout</a>
            </Button>
          }
        />
      </div>
    );
  }

  // Show workout detail modal
  if (selectedWorkout) {
    return (
      <WorkoutDetailView
        workout={selectedWorkout}
        onClose={() => setSelectedWorkout(null)}
      />
    );
  }

  // Main history list
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Workout History
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {workouts.length} workout{workouts.length !== 1 ? 's' : ''}{' '}
            completed
          </p>
        </div>
      </div>

      {/* Workouts List */}
      <div className="space-y-4">
        {workouts.map(workout => (
          <WorkoutHistoryCard
            key={workout.id}
            workout={workout}
            onClick={() => setSelectedWorkout(workout)}
          />
        ))}
      </div>
    </div>
  );
}

// Workout History Card Component

interface WorkoutHistoryCardProps {
  workout: WorkoutSessionWithDetails;
  onClick: () => void;
}

function WorkoutHistoryCard({ workout, onClick }: WorkoutHistoryCardProps) {
  // Calculate stats
  const totalVolume = workout.exercises.reduce(
    (sum, ex) =>
      sum +
      ex.sets
        .filter(s => s.isCompleted)
        .reduce((setSum, set) => setSum + set.weight * set.reps, 0),
    0
  );

  // Format date
  const completedDate = workout.completedAt
    ? new Date(workout.completedAt)
    : new Date(workout.startedAt);
  const formattedDate = completedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  const formattedTime = completedDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Format duration
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition-all hover:border-blue-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-600"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {workout.routine?.name || 'Custom Workout'}
          </h3>
          <p className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="mr-1 h-4 w-4" />
            {formattedDate} • {formattedTime}
          </p>
        </div>
        {workout.rating && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-lg ${
                  i < workout.rating!
                    ? 'text-yellow-500'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              >
                ★
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
            {formatDuration(workout.duration)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Exercises</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
            {workout.exercises.length}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Volume</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
            {totalVolume.toFixed(0)} kg
          </p>
        </div>
      </div>

      {/* Notes preview */}
      {workout.notes && (
        <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {workout.notes}
        </p>
      )}
    </button>
  );
}

// Workout Detail View Component

interface WorkoutDetailViewProps {
  workout: WorkoutSessionWithDetails;
  onClose: () => void;
}

function WorkoutDetailView({ workout, onClose }: WorkoutDetailViewProps) {
  // Calculate stats
  const totalSets = workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter(s => s.isCompleted).length,
    0
  );
  const totalVolume = workout.exercises.reduce(
    (sum, ex) =>
      sum +
      ex.sets
        .filter(s => s.isCompleted)
        .reduce((setSum, set) => setSum + set.weight * set.reps, 0),
    0
  );

  // Format date
  const completedDate = workout.completedAt
    ? new Date(workout.completedAt)
    : new Date(workout.startedAt);
  const formattedDate = completedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Format duration
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hrs > 0
      ? `${hrs}h ${mins}m ${secs}s`
      : mins > 0
        ? `${mins}m ${secs}s`
        : `${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={onClose} className="mb-4">
          ← Back to History
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
          {workout.routine?.name || 'Custom Workout'}
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">{formattedDate}</p>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Duration"
          value={formatDuration(workout.duration)}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Exercises"
          value={workout.exercises.length.toString()}
          icon={<Dumbbell className="h-5 w-5" />}
        />
        <StatCard
          label="Total Sets"
          value={totalSets.toString()}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Volume"
          value={`${totalVolume.toFixed(0)} kg`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Rating */}
      {workout.rating && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            Rating
          </p>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-2xl ${
                  i < workout.rating!
                    ? 'text-yellow-500'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {workout.notes && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Notes</p>
          <p className="text-gray-900 dark:text-gray-50">{workout.notes}</p>
        </div>
      )}

      {/* Exercises */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
          Exercises
        </h2>
        {workout.exercises.map((exercise, index) => (
          <div
            key={exercise.id}
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-50">
              {index + 1}. {exercise.exercise.name}
            </h3>

            {/* Sets Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left dark:border-gray-700">
                    <th className="pb-2 font-medium text-gray-600 dark:text-gray-400">
                      Set
                    </th>
                    <th className="pb-2 font-medium text-gray-600 dark:text-gray-400">
                      Weight
                    </th>
                    <th className="pb-2 font-medium text-gray-600 dark:text-gray-400">
                      Reps
                    </th>
                    <th className="pb-2 font-medium text-gray-600 dark:text-gray-400">
                      Volume
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {exercise.sets
                    .filter(s => s.isCompleted)
                    .map(set => (
                      <tr
                        key={set.id}
                        className="border-b border-gray-100 dark:border-gray-800"
                      >
                        <td className="py-2 text-gray-900 dark:text-gray-50">
                          {set.setNumber}
                        </td>
                        <td className="py-2 text-gray-900 dark:text-gray-50">
                          {set.weight} kg
                        </td>
                        <td className="py-2 text-gray-900 dark:text-gray-50">
                          {set.reps}
                        </td>
                        <td className="py-2 text-gray-900 dark:text-gray-50">
                          {(set.weight * set.reps).toFixed(0)} kg
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper component
function StatCard({
  label,
  value,
  icon
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-50">
            {value}
          </p>
        </div>
        <div className="text-blue-600 dark:text-blue-400">{icon}</div>
      </div>
    </div>
  );
}
