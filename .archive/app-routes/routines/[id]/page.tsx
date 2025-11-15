'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Play, Loader2, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { routinesTextMap } from '@/domains/routines/routines.text-map';
import { useRoutine } from '@/domains/routines/hooks/use-routines';
import { ExerciseCategory } from '@prisma/client';

/**
 * Routine Detail Page
 * View full routine details with all divisions and exercises
 */
export default function RoutineDetailPage() {
  const params = useParams();
  const routineId = params.id as string;
  const text = routinesTextMap.routineDetail;

  // Track completed exercises (by divisionExercise.id)
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(
    new Set()
  );

  // Fetch routine details
  const { data: routine, isLoading, error: fetchError } = useRoutine(routineId);

  // Toggle exercise completion
  const toggleExerciseComplete = (exerciseId: string) => {
    setCompletedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
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
  if (fetchError || !routine) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/routines">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Routine Not Found
          </h1>
        </div>
        <Alert variant="destructive">
          Failed to load routine details. Please try again later.
        </Alert>
      </div>
    );
  }

  // Calculate stats
  const totalDivisions = routine.divisions.length;
  const totalExercises = routine.divisions.reduce(
    (sum, division) => sum + division.exercises.length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/routines">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                {routine.name}
              </h1>
              {routine.isActive && (
                <Badge variant="default" className="text-sm">
                  {text.active.badge}
                </Badge>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {totalDivisions} {totalDivisions === 1 ? 'division' : 'divisions'}{' '}
              • {totalExercises} total exercises
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/routines/${routine.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              {text.edit}
            </Link>
          </Button>
          {routine.isActive && (
            <Button size="sm" asChild>
              <Link href="/workout/active">
                <Play className="mr-2 h-4 w-4" />
                {text.startWorkout}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Divisions */}
      <div className="space-y-6">
        {routine.divisions.length === 0 ? (
          <Alert>
            This routine has no training divisions yet. Edit the routine to add
            divisions.
          </Alert>
        ) : (
          routine.divisions.map((division, index) => {
            // Calculate completion for this division
            const completedInDivision = division.exercises.filter(ex =>
              completedExercises.has(ex.id)
            ).length;
            const totalInDivision = division.exercises.length;
            const progressPercentage =
              totalInDivision > 0
                ? Math.round((completedInDivision / totalInDivision) * 100)
                : 0;

            return (
              <div
                key={division.id}
                className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Division Header */}
                <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                        Division {index + 1}: {division.name}
                      </h2>
                      {division.description && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {division.description}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Frequency: {division.frequency}x per week
                      </p>

                      {/* Progress bar */}
                      {totalInDivision > 0 && (
                        <div className="mt-3">
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              Progress: {completedInDivision} of{' '}
                              {totalInDivision} completed
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-gray-50">
                              {progressPercentage}%
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-full bg-green-500 transition-all duration-300 dark:bg-green-600"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <Badge variant="outline" className="ml-4">
                      {division.exercises.length}{' '}
                      {division.exercises.length === 1
                        ? 'exercise'
                        : 'exercises'}
                    </Badge>
                  </div>
                </div>

                {/* Exercises */}
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {division.exercises.length === 0 ? (
                    <div className="p-6 text-center text-gray-600 dark:text-gray-400">
                      No exercises in this division yet
                    </div>
                  ) : (
                    division.exercises.map(
                      (divisionExercise, exerciseIndex) => {
                        const isCompleted = completedExercises.has(
                          divisionExercise.id
                        );

                        return (
                          <div key={divisionExercise.id} className="p-4">
                            <div className="flex items-start gap-4">
                              {/* Checkbox */}
                              <div className="pt-1">
                                <Checkbox
                                  checked={isCompleted}
                                  onCheckedChange={() =>
                                    toggleExerciseComplete(divisionExercise.id)
                                  }
                                  className="h-5 w-5"
                                />
                              </div>

                              {/* Exercise Number */}
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                                  isCompleted
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                }`}
                              >
                                {exerciseIndex + 1}
                              </div>

                              {/* Exercise Details */}
                              <div
                                className={`flex-1 transition-opacity ${isCompleted ? 'opacity-60' : 'opacity-100'}`}
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                                      {divisionExercise.exercise.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {getCategoryLabel(
                                        divisionExercise.exercise.category
                                      )}
                                    </p>
                                  </div>
                                  {divisionExercise.videoId && (
                                    <Button variant="ghost" size="sm" asChild>
                                      <a
                                        href={`https://youtube.com/watch?v=${divisionExercise.videoId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Video className="mr-2 h-4 w-4" />
                                        Watch
                                      </a>
                                    </Button>
                                  )}
                                </div>

                                {/* Training Parameters */}
                                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                      Sets:
                                    </span>{' '}
                                    <span className="text-gray-600 dark:text-gray-400">
                                      {divisionExercise.targetSets}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                      Reps:
                                    </span>{' '}
                                    <span className="text-gray-600 dark:text-gray-400">
                                      {divisionExercise.targetReps}
                                    </span>
                                  </div>
                                  {divisionExercise.targetWeight && (
                                    <div>
                                      <span className="font-medium text-gray-700 dark:text-gray-300">
                                        Weight:
                                      </span>{' '}
                                      <span className="text-gray-600 dark:text-gray-400">
                                        {divisionExercise.targetWeight} kg
                                      </span>
                                    </div>
                                  )}
                                  {divisionExercise.restSeconds && (
                                    <div>
                                      <span className="font-medium text-gray-700 dark:text-gray-300">
                                        Rest:
                                      </span>{' '}
                                      <span className="text-gray-600 dark:text-gray-400">
                                        {divisionExercise.restSeconds}s
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Notes */}
                                {divisionExercise.notes && (
                                  <div className="mt-3 rounded-md bg-gray-50 p-3 dark:bg-gray-800/50">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                      <span className="font-medium">
                                        Notes:
                                      </span>{' '}
                                      {divisionExercise.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Helper function to get category label
function getCategoryLabel(category: string): string {
  const categories: Record<string, string> = {
    [ExerciseCategory.CHEST]: 'Chest',
    [ExerciseCategory.BACK]: 'Back',
    [ExerciseCategory.LEGS]: 'Legs',
    [ExerciseCategory.SHOULDERS]: 'Shoulders',
    [ExerciseCategory.ARMS]: 'Arms',
    [ExerciseCategory.CORE]: 'Core',
    [ExerciseCategory.CARDIO]: 'Cardio'
  };
  return categories[category] || category;
}
