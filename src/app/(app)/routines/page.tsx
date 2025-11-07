'use client';

import Link from 'next/link';
import { Plus, Dumbbell, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/molecules/empty-state';
import { RoutineCard } from '@/domains/routines/components/routine-card';
import { routinesTextMap } from '@/domains/routines/routines.text-map';
import {
  useRoutines,
  useActivateRoutine,
  useDeleteRoutine,
  useArchiveRoutine
} from '@/domains/routines/hooks/use-routines';
import { Alert } from '@/components/ui/alert';
import { useState } from 'react';

/**
 * Routines List Page
 * View all workout routines and create new ones
 * Connected to real data with React Query
 */
export default function RoutinesPage() {
  const text = routinesTextMap.routines;
  const [error, setError] = useState<string | null>(null);

  // Fetch routines (excludes archived)
  const { data: routines, isLoading, error: fetchError } = useRoutines(false);

  // Mutations
  const activateMutation = useActivateRoutine();
  const deleteMutation = useDeleteRoutine();
  const archiveMutation = useArchiveRoutine();

  const hasRoutines = routines && routines.length > 0;

  const handleActivate = async (id: string) => {
    try {
      setError(null);
      await activateMutation.mutateAsync(id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to activate routine'
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete routine');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      setError(null);
      await archiveMutation.mutateAsync(id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to archive routine'
      );
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Show error state
  if (fetchError) {
    return (
      <Alert variant="destructive">
        Failed to load routines. Please try again later.
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
          {text.heading}
        </h1>
        <Button size="lg" asChild>
          <Link href="/routines/new">
            <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
            {text.create}
          </Link>
        </Button>
      </div>

      {/* Error Alert */}
      {error && <Alert variant="destructive">{error}</Alert>}

      {/* Routines Grid */}
      {hasRoutines ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {routines.map(routine => {
            // Calculate stats from routine data (using divisions instead of days)
            const totalDivisions = routine.divisions.length;
            const totalExercises = routine.divisions.reduce(
              (sum, division) => sum + division.exercises.length,
              0
            );

            return (
              <RoutineCard
                key={routine.id}
                id={routine.id}
                name={routine.name}
                days={totalDivisions}
                exercises={totalExercises}
                isActive={routine.isActive}
                onActivate={() => handleActivate(routine.id)}
                onDelete={() => handleDelete(routine.id)}
                onArchive={() => handleArchive(routine.id)}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Dumbbell}
          heading={text.empty.heading}
          message={text.empty.message}
          action={{
            label: text.empty.action,
            onClick: () => {
              window.location.href = '/routines/new';
            }
          }}
        />
      )}
    </div>
  );
}
