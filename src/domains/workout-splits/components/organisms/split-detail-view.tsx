/**
 * Split Detail View Component
 *
 * Displays exercises in a split with tracking functionality.
 * Client Component for interactivity.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, CheckCircle2, Info, Edit } from 'lucide-react';
import { SplitBadge } from '../atoms/split-badge';
import { ExerciseDetailSheet } from './exercise-detail-sheet';
import { EditSplitDialog } from './edit-split-dialog';
import {
  workoutSplitsText,
  getWorkoutSplitsText
} from '../../workout-splits.text-map';
import {
  useStartWorkoutSession,
  useFinalizeWorkout,
  useToggleExerciseCompletion,
  useUpdateWorkoutSplit
} from '../../hooks/use-workout-splits';
import type {
  SplitWithProgress,
  SplitExerciseWithCompletion
} from '../../types';
import { toast } from 'sonner';

interface SplitDetailViewProps {
  split: SplitWithProgress;
}

export function SplitDetailView({ split }: SplitDetailViewProps) {
  const router = useRouter();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [selectedExercise, setSelectedExercise] =
    useState<SplitExerciseWithCompletion | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const startWorkoutMutation = useStartWorkoutSession();
  const finalizeWorkoutMutation = useFinalizeWorkout();
  const toggleExerciseMutation = useToggleExerciseCompletion();
  const updateSplitMutation = useUpdateWorkoutSplit();

  // Track workout duration
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (activeSessionId && sessionStartTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        setElapsedSeconds(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [activeSessionId, sessionStartTime]);

  const handleStartWorkout = async () => {
    try {
      const result = await startWorkoutMutation.mutateAsync({
        splitId: split.id,
        assessmentId: split.assessmentId
      });

      if (result) {
        setActiveSessionId(result.sessionId);
        setSessionStartTime(Date.now());
        setElapsedSeconds(0);
        toast.success(workoutSplitsText.success.workoutStarted);
      }
    } catch {
      toast.error(workoutSplitsText.errors.generic);
    }
  };

  const handleFinalizeWorkout = async () => {
    if (!activeSessionId) return;

    try {
      await finalizeWorkoutMutation.mutateAsync({
        splitId: split.id,
        sessionId: activeSessionId,
        duration: elapsedSeconds
      });

      toast.success(workoutSplitsText.success.workoutFinalized);
      router.push('/my-workout');
    } catch {
      toast.error(workoutSplitsText.errors.generic);
    }
  };

  const handleToggleExercise = async (
    exerciseId: string,
    isCompleted: boolean
  ) => {
    if (!activeSessionId) {
      toast.error(workoutSplitsText.errors.sessionNotFound);
      return;
    }

    try {
      await toggleExerciseMutation.mutateAsync({
        splitExerciseId: exerciseId,
        splitId: split.id,
        isCompleted
      });

      toast.success(
        isCompleted
          ? workoutSplitsText.success.exerciseCompleted
          : workoutSplitsText.success.exerciseUncompleted
      );
    } catch {
      toast.error(workoutSplitsText.errors.generic);
    }
  };

  const handleOpenExerciseDetail = (exercise: SplitExerciseWithCompletion) => {
    setSelectedExercise(exercise);
    setDetailSheetOpen(true);
  };

  const handleSaveSplitChanges = async (data: {
    name: string;
    subtitle?: string;
  }) => {
    try {
      await updateSplitMutation.mutateAsync({
        splitId: split.id,
        name: data.name,
        subtitle: data.subtitle
      });
      toast.success('División actualizada correctamente');
    } catch {
      toast.error('No se pudo actualizar la división');
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  const canFinalize = split.completedExercises === split.totalExercises;

  // Separate exercises into pending and completed
  const pendingExercises = split.exercises.filter(ex => !ex.isCompleted);
  const completedExercises = split.exercises.filter(ex => ex.isCompleted);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/my-workout">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {workoutSplitsText.splitDetail.backButton}
          </Link>
        </Button>

        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SplitBadge letter={split.splitLetter} />
            <h1 className="text-3xl font-bold">
              {getWorkoutSplitsText('splitDetail.title', {
                letter: split.splitLetter,
                name: split.name
              })}
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditDialogOpen(true)}
            disabled={!!activeSessionId}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>

        {split.subtitle && (
          <p className="text-muted-foreground">{split.subtitle}</p>
        )}
      </div>

      {/* Progress card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {workoutSplitsText.splitDetail.progressLabel}
            </CardTitle>
            {activeSessionId && (
              <Badge variant="secondary" className="font-mono text-sm">
                ⏱️ {formatDuration(elapsedSeconds)}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={split.completionPercentage} className="h-2" />
          <p className="text-muted-foreground text-sm">
            {getWorkoutSplitsText('splitDetail.progressValue', {
              completed: split.completedExercises,
              total: split.totalExercises
            })}
          </p>
        </CardContent>
      </Card>

      {split.exercises.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {workoutSplitsText.splitDetail.emptyExercisesTitle}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Pending Exercises */}
          {pendingExercises.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-semibold">
                {workoutSplitsText.splitDetail.exerciseListTitle} (
                {pendingExercises.length})
              </h2>
              <div className="space-y-3">
                {pendingExercises.map(exercise => (
                  <Card
                    key={exercise.id}
                    className="cursor-pointer border-2 transition-all hover:shadow-md"
                    onClick={() => {
                      if (activeSessionId) {
                        handleToggleExercise(exercise.id, true);
                      }
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={false}
                          disabled={!activeSessionId}
                          onCheckedChange={checked => {
                            handleToggleExercise(exercise.id, checked === true);
                          }}
                          className="mt-1"
                          onClick={e => e.stopPropagation()}
                        />
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h3 className="font-semibold">
                              {exercise.exercise.name}
                            </h3>
                          </div>
                          <div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
                            <Badge variant="outline">
                              {getWorkoutSplitsText(
                                'splitDetail.exerciseItemSets',
                                {
                                  sets: exercise.targetSets
                                }
                              )}
                            </Badge>
                            <Badge variant="outline">
                              {getWorkoutSplitsText(
                                'splitDetail.exerciseItemReps',
                                {
                                  reps: exercise.targetReps
                                }
                              )}
                            </Badge>
                            {exercise.restSeconds && (
                              <Badge variant="outline">
                                {getWorkoutSplitsText(
                                  'splitDetail.exerciseItemRest',
                                  {
                                    seconds: exercise.restSeconds
                                  }
                                )}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={e => {
                            e.stopPropagation();
                            handleOpenExerciseDetail(exercise);
                          }}
                          className="shrink-0"
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Completed Exercises */}
          {completedExercises.length > 0 && (
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Ejercicios Completados ({completedExercises.length})
              </h2>
              <div className="space-y-3">
                {completedExercises.map(exercise => (
                  <Card
                    key={exercise.id}
                    className="cursor-pointer border-2 border-green-200 bg-green-50/50 transition-all hover:shadow-md dark:bg-green-950/20"
                    onClick={() => {
                      if (activeSessionId) {
                        handleToggleExercise(exercise.id, false);
                      }
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={true}
                          disabled={!activeSessionId}
                          onCheckedChange={checked => {
                            handleToggleExercise(exercise.id, checked === true);
                          }}
                          className="mt-1"
                          onClick={e => e.stopPropagation()}
                        />
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h3 className="text-muted-foreground font-semibold line-through">
                              {exercise.exercise.name}
                            </h3>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="text-muted-foreground flex flex-wrap gap-2 text-sm opacity-70">
                            <Badge variant="outline">
                              {getWorkoutSplitsText(
                                'splitDetail.exerciseItemSets',
                                {
                                  sets: exercise.targetSets
                                }
                              )}
                            </Badge>
                            <Badge variant="outline">
                              {getWorkoutSplitsText(
                                'splitDetail.exerciseItemReps',
                                {
                                  reps: exercise.targetReps
                                }
                              )}
                            </Badge>
                            {exercise.restSeconds && (
                              <Badge variant="outline">
                                {getWorkoutSplitsText(
                                  'splitDetail.exerciseItemRest',
                                  {
                                    seconds: exercise.restSeconds
                                  }
                                )}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={e => {
                            e.stopPropagation();
                            handleOpenExerciseDetail(exercise);
                          }}
                          className="shrink-0"
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {!activeSessionId ? (
          <Button
            onClick={handleStartWorkout}
            disabled={startWorkoutMutation.isPending}
            size="lg"
            className="w-full"
          >
            {startWorkoutMutation.isPending ? (
              workoutSplitsText.loading.generic
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                {workoutSplitsText.splitDetail.startWorkoutButton}
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleFinalizeWorkout}
            disabled={!canFinalize || finalizeWorkoutMutation.isPending}
            size="lg"
            className="w-full"
            variant={canFinalize ? 'default' : 'secondary'}
          >
            {finalizeWorkoutMutation.isPending ? (
              workoutSplitsText.loading.finalizing
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                {canFinalize
                  ? workoutSplitsText.splitDetail.finalizeWorkoutButton
                  : workoutSplitsText.splitDetail.finalizeWorkoutButtonDisabled}
              </>
            )}
          </Button>
        )}
      </div>

      {/* Exercise Detail Sheet */}
      <ExerciseDetailSheet
        exercise={selectedExercise}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />

      {/* Edit Split Dialog */}
      <EditSplitDialog
        split={split}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveSplitChanges}
      />
    </div>
  );
}
