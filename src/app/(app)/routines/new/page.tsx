'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoutineEditorForm } from '@/domains/routines/components/routine-editor-form';

/**
 * Create New Routine Page
 * Form to create a new workout routine with days and exercises
 */
export default function NewRoutinePage() {
  const router = useRouter();

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
            Create New Routine
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Build your custom workout routine
          </p>
        </div>
      </div>

      {/* Routine Editor Form */}
      <RoutineEditorForm />
    </div>
  );
}
