/**
 * Workout Splits View Component
 *
 * Main view displaying all workout splits with current progress.
 * Client Component for interactivity.
 */

'use client';

import { WorkoutSplitCard } from '../molecules/workout-split-card';
import { WorkoutCalendar } from '../molecules/workout-calendar';
import {
  workoutSplitsText,
  getWorkoutSplitsText
} from '../../workout-splits.text-map';
import type { WorkoutAssessmentWithSplits } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentMonthCalendar } from '../../hooks/use-workout-calendar';
import { Flame, Dumbbell } from 'lucide-react';

interface WorkoutSplitsViewProps {
  assessment: WorkoutAssessmentWithSplits;
}

export function WorkoutSplitsView({ assessment }: WorkoutSplitsViewProps) {
  const currentSplitIndex = assessment.currentSplitIndex;
  const splits = assessment.splits;
  const { data: calendarData } = useCurrentMonthCalendar();

  if (splits.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          {workoutSplitsText.empty.noSplits}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <Flame className="h-4 w-4 text-orange-500" />
              {workoutSplitsText.dashboard.streakLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {getWorkoutSplitsText('dashboard.streakValue', {
                count: calendarData?.currentStreak ?? 0
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <Dumbbell className="h-4 w-4" />
              {workoutSplitsText.dashboard.totalWorkoutsLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {getWorkoutSplitsText('dashboard.totalWorkoutsValue', {
                count: calendarData?.totalWorkouts ?? 0
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Frecuencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {assessment.frequency} días/semana
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Split cards grid */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Tus Divisiones de Entrenamiento
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {splits.map((split, index) => (
            <WorkoutSplitCard
              key={split.id}
              split={split}
              isCurrent={index === currentSplitIndex}
              isCompleted={false} // TODO: Calculate based on last session
              completionPercentage={0} // TODO: Calculate from active session
            />
          ))}
        </div>
      </div>

      {/* Calendar section */}
      <div>
        <WorkoutCalendar />
      </div>
    </div>
  );
}
