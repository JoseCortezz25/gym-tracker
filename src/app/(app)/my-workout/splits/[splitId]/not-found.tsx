/**
 * Split Not Found Page
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { workoutSplitsText } from '@/domains/workout-splits/workout-splits.text-map';

export default function SplitNotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <h2 className="mb-4 text-2xl font-bold">
          {workoutSplitsText.errors.splitNotFound}
        </h2>
        <p className="text-muted-foreground mb-6">
          La división de entrenamiento que buscas no existe o fue eliminada.
        </p>
        <Button asChild>
          <Link href="/my-workout">Volver a Mi Entrenamiento</Link>
        </Button>
      </div>
    </div>
  );
}
