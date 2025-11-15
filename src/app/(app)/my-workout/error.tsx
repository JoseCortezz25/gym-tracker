/**
 * My Workout Error Boundary
 *
 * Error boundary for the workout dashboard.
 */

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { workoutSplitsText } from '@/domains/workout-splits/workout-splits.text-map';

export default function MyWorkoutError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('My Workout Error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <h2 className="mb-4 text-2xl font-bold">
          {workoutSplitsText.errors.generic}
        </h2>
        <p className="text-muted-foreground mb-6">
          {error.message || 'Ocurrió un error al cargar tu entrenamiento.'}
        </p>
        <Button onClick={reset}>Intentar de nuevo</Button>
      </div>
    </div>
  );
}
