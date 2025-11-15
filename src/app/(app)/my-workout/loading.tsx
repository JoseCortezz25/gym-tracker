/**
 * My Workout Loading State
 *
 * Loading skeleton for the workout dashboard.
 */

import { WorkoutSplitsSkeleton } from '@/domains/workout-splits/components/molecules/workout-splits-skeleton';
import { workoutSplitsText } from '@/domains/workout-splits/workout-splits.text-map';

export default function MyWorkoutLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">
          {workoutSplitsText.dashboard.title}
        </h1>
        <p className="text-muted-foreground">
          {workoutSplitsText.dashboard.subtitle}
        </p>
      </div>
      <WorkoutSplitsSkeleton />
    </div>
  );
}
