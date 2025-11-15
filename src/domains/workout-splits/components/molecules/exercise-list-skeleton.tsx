/**
 * Exercise List Loading Skeleton
 *
 * Loading state for exercise list in split detail.
 */

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ExerciseListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div>
        <Skeleton className="mb-2 h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Progress skeleton */}
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="mb-2 h-2 w-full" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>

      {/* Exercise list skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <div className="flex-1">
                  <Skeleton className="mb-2 h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Button skeleton */}
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
