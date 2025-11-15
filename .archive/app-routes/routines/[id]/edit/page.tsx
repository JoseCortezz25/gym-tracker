'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { RoutineEditorForm } from '@/domains/routines/components/routine-editor-form';
import { useRoutine } from '@/domains/routines/hooks/use-routines';

/**
 * Edit Routine Page
 * Form to edit an existing workout routine
 */
export default function EditRoutinePage() {
  const params = useParams();
  const router = useRouter();
  const routineId = params.id as string;

  // Fetch routine data
  const { data: routine, isLoading, error } = useRoutine(routineId);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Error state
  if (error || !routine) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Alert variant="destructive">
          {error
            ? 'Failed to load routine. Please try again.'
            : 'Routine not found.'}
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Edit Routine
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Update {routine.name}
          </p>
        </div>
      </div>

      {/* Routine Editor Form with prefilled data */}
      <RoutineEditorForm editMode routine={routine} />
    </div>
  );
}
