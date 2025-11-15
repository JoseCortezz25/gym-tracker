/**
 * Weight History List Component
 *
 * Displays weight history for an exercise with trend indicator.
 * Molecule component showing historical weight entries.
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import {
  workoutSplitsText,
  getWorkoutSplitsText
} from '../../workout-splits.text-map';
import type { ExerciseWeightHistory } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface WeightHistoryListProps {
  history: ExerciseWeightHistory;
  limit?: number;
}

export function WeightHistoryList({
  history,
  limit = 5
}: WeightHistoryListProps) {
  const displayEntries = history.entries.slice(0, limit);

  if (displayEntries.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <Activity className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-sm">
            {workoutSplitsText.exerciseDetail.historyEmpty}
          </p>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = () => {
    switch (history.trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getTrendText = () => {
    switch (history.trend) {
      case 'increasing':
        return workoutSplitsText.exerciseDetail.historyTrendIncreasing;
      case 'decreasing':
        return workoutSplitsText.exerciseDetail.historyTrendDecreasing;
      case 'stable':
        return workoutSplitsText.exerciseDetail.historyTrendStable;
      default:
        return workoutSplitsText.exerciseDetail.historyTrendInsufficient;
    }
  };

  return (
    <div className="space-y-3">
      {/* Trend indicator */}
      {history.trend !== 'insufficient_data' && (
        <div className="flex items-center gap-2 text-sm">
          {getTrendIcon()}
          <span className="font-medium">{getTrendText()}</span>
        </div>
      )}

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3">
        {history.latestWeight !== null && (
          <div className="text-center">
            <p className="text-muted-foreground text-xs">Último</p>
            <p className="text-lg font-bold">{history.latestWeight} kg</p>
          </div>
        )}
        {history.maxWeight !== null && (
          <div className="text-center">
            <p className="text-muted-foreground text-xs">Máximo</p>
            <p className="text-lg font-bold">{history.maxWeight} kg</p>
          </div>
        )}
        {history.avgWeight !== null && (
          <div className="text-center">
            <p className="text-muted-foreground text-xs">Promedio</p>
            <p className="text-lg font-bold">
              {history.avgWeight.toFixed(1)} kg
            </p>
          </div>
        )}
      </div>

      {/* History entries */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">
          Últimas {displayEntries.length} sesiones
        </h4>
        {displayEntries.map((entry, index) => (
          <Card key={entry.id} className={index === 0 ? 'border-primary' : ''}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant={index === 0 ? 'default' : 'outline'}>
                      {getWorkoutSplitsText('exerciseDetail.historyWeight', {
                        weight: entry.weight
                      })}
                    </Badge>
                    <Badge variant="outline">
                      {getWorkoutSplitsText('exerciseDetail.historySets', {
                        sets: entry.sets
                      })}
                    </Badge>
                    <Badge variant="outline">
                      {getWorkoutSplitsText('exerciseDetail.historyReps', {
                        reps: entry.reps
                      })}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(entry.completedAt), {
                      addSuffix: true,
                      locale: es
                    })}
                  </p>
                </div>
                {index === 0 && (
                  <Badge variant="default" className="ml-2">
                    Más reciente
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
