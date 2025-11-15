/**
 * Workout Split Card Component
 *
 * Card displaying a workout split with progress and actions.
 */

'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SplitBadge } from '../atoms/split-badge';
import {
  workoutSplitsText,
  getWorkoutSplitsText
} from '../../workout-splits.text-map';
import type { WorkoutSplitWithExercises } from '../../types';
import { cn } from '@/lib/utils';

interface WorkoutSplitCardProps {
  split: WorkoutSplitWithExercises;
  isCurrent: boolean;
  isCompleted: boolean;
  completionPercentage?: number;
}

export function WorkoutSplitCard({
  split,
  isCurrent,
  isCompleted,
  completionPercentage = 0
}: WorkoutSplitCardProps) {
  const exerciseCount = split.exercises.length;

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md',
        isCurrent && 'border-primary border-2 shadow-lg',
        isCompleted && 'opacity-75'
      )}
    >
      <CardHeader>
        <div className="mb-2 flex items-center justify-between">
          <SplitBadge letter={split.splitLetter} />
          {isCurrent && (
            <Badge variant="default" className="bg-primary">
              {workoutSplitsText.dashboard.currentBadge}
            </Badge>
          )}
          {isCompleted && (
            <Badge variant="secondary">
              {workoutSplitsText.dashboard.completedBadge}
            </Badge>
          )}
        </div>

        <CardTitle className="text-xl">{split.name}</CardTitle>
        {split.subtitle && <CardDescription>{split.subtitle}</CardDescription>}

        <div className="text-muted-foreground mt-2 text-sm">
          {getWorkoutSplitsText('dashboard.splitCardProgress', {
            completed: Math.floor((completionPercentage / 100) * exerciseCount),
            total: exerciseCount
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Action button */}
        <Button
          asChild
          className="w-full"
          variant={isCurrent ? 'default' : 'outline'}
        >
          <Link href={`/my-workout/splits/${split.id}`}>
            {isCurrent
              ? completionPercentage > 0
                ? workoutSplitsText.dashboard.splitCardButtonResume
                : workoutSplitsText.dashboard.splitCardButton
              : workoutSplitsText.dashboard.splitCardButtonView}
          </Link>
        </Button>

        {/* Last completed info */}
        {split._count && split._count.workoutSessions > 0 && (
          <p className="text-muted-foreground text-center text-xs">
            {getWorkoutSplitsText('dashboard.lastCompleted', {
              date: 'hace 2 días' // TODO: Calculate actual date
            })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
