/**
 * Workout Split Detail Page
 *
 * Shows exercises in a split and allows workout tracking.
 * Server Component that fetches split data.
 */

import { Suspense } from 'react';
import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getWorkoutSplitWithProgress } from '@/domains/workout-splits/actions';
import { SplitDetailView } from '@/domains/workout-splits/components/organisms/split-detail-view';
import { ExerciseListSkeleton } from '@/domains/workout-splits/components/molecules/exercise-list-skeleton';
import { workoutSplitsText } from '@/domains/workout-splits/workout-splits.text-map';

interface SplitPageProps {
  params: Promise<{
    splitId: string;
  }>;
}

export async function generateMetadata({ params }: SplitPageProps) {
  const { splitId } = await params;
  const response = await getWorkoutSplitWithProgress(splitId);

  if (!response.success || !response.data) {
    return {
      title: workoutSplitsText.errors.splitNotFound
    };
  }

  const split = response.data;

  return {
    title: `${workoutSplitsText.splitDetail.title
      .replace('{{letter}}', split.splitLetter)
      .replace('{{name}}', split.name)}`,
    description: split.subtitle || workoutSplitsText.splitDetail.subtitle
  };
}

export default async function SplitDetailPage({ params }: SplitPageProps) {
  // 1. Verify authentication
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  // 2. Fetch split data
  const { splitId } = await params;
  const splitResponse = await getWorkoutSplitWithProgress(splitId);

  // 3. Handle not found
  if (!splitResponse.success || !splitResponse.data) {
    notFound();
  }

  const split = splitResponse.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ExerciseListSkeleton />}>
        <SplitDetailView split={split} />
      </Suspense>
    </div>
  );
}
