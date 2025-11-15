/**
 * My Workout Dashboard Page
 *
 * Main dashboard showing all workout splits and current workout.
 * Server Component that fetches data on the server.
 */

import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getActiveAssessment } from '@/domains/workout-splits/actions';
import { WorkoutSplitsView } from '@/domains/workout-splits/components/organisms/workout-splits-view';
import { WorkoutSplitsSkeleton } from '@/domains/workout-splits/components/molecules/workout-splits-skeleton';
import { EmptyAssessmentState } from '@/domains/workout-splits/components/molecules/empty-assessment-state';
import { workoutSplitsText } from '@/domains/workout-splits/workout-splits.text-map';

export const metadata = {
  title: workoutSplitsText.dashboard.title,
  description: workoutSplitsText.dashboard.subtitle
};

export default async function MyWorkoutPage() {
  // 1. Verify authentication
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  // 2. Fetch active assessment
  const assessmentResponse = await getActiveAssessment();

  // 3. Handle no active assessment
  if (!assessmentResponse.success || !assessmentResponse.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">
          {workoutSplitsText.dashboard.title}
        </h1>
        <EmptyAssessmentState />
      </div>
    );
  }

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

      <Suspense fallback={<WorkoutSplitsSkeleton />}>
        <WorkoutSplitsView assessment={assessmentResponse.data} />
      </Suspense>
    </div>
  );
}
