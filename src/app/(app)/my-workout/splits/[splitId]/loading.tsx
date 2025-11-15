/**
 * Split Detail Loading State
 */

import { ExerciseListSkeleton } from '@/domains/workout-splits/components/molecules/exercise-list-skeleton';

export default function SplitDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ExerciseListSkeleton />
    </div>
  );
}
