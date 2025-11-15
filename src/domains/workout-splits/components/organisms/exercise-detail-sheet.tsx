/**
 * Exercise Detail Sheet Component
 *
 * Modal/sheet displaying exercise details, including:
 * - Description
 * - Video (future)
 * - Image (future)
 * - Target sets/reps
 * - Weight history
 *
 * Client Component for interactivity.
 */

'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Target, Clock } from 'lucide-react';
import {
  workoutSplitsText,
  getWorkoutSplitsText
} from '../../workout-splits.text-map';
import { WeightHistoryList } from '../molecules/weight-history-list';
import { WeightSuggestionCard } from '../molecules/weight-suggestion-card';
import { YouTubePlayer } from '../atoms/youtube-player';
import { useWeightHistory } from '../../hooks/use-weight-history';
import type { SplitExerciseWithCompletion } from '../../types';

interface ExerciseDetailSheetProps {
  exercise: SplitExerciseWithCompletion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExerciseDetailSheet({
  exercise,
  open,
  onOpenChange
}: ExerciseDetailSheetProps) {
  const { data: weightHistory, isLoading } = useWeightHistory(
    exercise?.exerciseId ?? '',
    5,
    open && !!exercise
  );

  if (!exercise) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl">
            {getWorkoutSplitsText('exerciseDetail.title', {
              name: exercise.exercise.name
            })}
          </SheetTitle>
          {exercise.exercise.category && (
            <SheetDescription>
              {getWorkoutSplitsText('exerciseDetail.category', {
                category: exercise.exercise.category
              })}
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Target Section */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              <h3 className="font-semibold">
                {workoutSplitsText.exerciseDetail.targetTitle}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="px-3 py-1.5 text-base">
                {getWorkoutSplitsText('exerciseDetail.targetSets', {
                  sets: exercise.targetSets
                })}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1.5 text-base">
                {getWorkoutSplitsText('exerciseDetail.targetReps', {
                  reps: exercise.targetReps
                })}
              </Badge>
              {exercise.restSeconds && (
                <Badge variant="outline" className="px-3 py-1.5 text-base">
                  <Clock className="mr-1 h-3 w-3" />
                  {getWorkoutSplitsText('exerciseDetail.targetRest', {
                    seconds: exercise.restSeconds
                  })}
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          {exercise.exercise.description && (
            <>
              <Separator />
              <div>
                <h3 className="mb-2 font-semibold">
                  {workoutSplitsText.exerciseDetail.description}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {exercise.exercise.description}
                </p>
              </div>
            </>
          )}

          {/* Notes */}
          {exercise.notes && (
            <>
              <Separator />
              <div>
                <h3 className="mb-2 font-semibold">
                  {workoutSplitsText.exerciseDetail.notesLabel}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {exercise.notes}
                </p>
              </div>
            </>
          )}

          {/* Weight History */}
          <Separator />
          <div>
            <h3 className="mb-3 font-semibold">
              {workoutSplitsText.exerciseDetail.historyTitle}
            </h3>
            {isLoading ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground text-sm">
                  {workoutSplitsText.loading.history}
                </p>
              </div>
            ) : weightHistory ? (
              <div className="space-y-4">
                {/* Progressive Overload Suggestion */}
                <WeightSuggestionCard history={weightHistory} />

                {/* History List */}
                <WeightHistoryList history={weightHistory} limit={5} />
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground text-sm">
                  {workoutSplitsText.exerciseDetail.historyEmpty}
                </p>
              </div>
            )}
          </div>

          {/* Video Section */}
          {exercise.videoId && (
            <>
              <Separator />
              <div>
                <h3 className="mb-3 font-semibold">
                  {workoutSplitsText.exerciseDetail.videoTitle}
                </h3>
                <YouTubePlayer
                  videoId={exercise.videoId}
                  title={`Video tutorial: ${exercise.exercise.name}`}
                />
              </div>
            </>
          )}

          {/* Image Section */}
          {exercise.imageUrl && (
            <>
              <Separator />
              <div>
                <h3 className="mb-3 font-semibold">Imagen de referencia</h3>
                <div className="bg-muted relative aspect-square overflow-hidden rounded-lg">
                  <img
                    src={exercise.imageUrl}
                    alt={getWorkoutSplitsText('exerciseDetail.imageAlt', {
                      name: exercise.exercise.name
                    })}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
