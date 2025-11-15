/**
 * Weight Suggestion Card Component
 *
 * Displays progressive overload suggestions based on weight history.
 * Molecule component for intelligent recommendations.
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import type { ExerciseWeightHistory } from '../../types';

interface WeightSuggestionCardProps {
  history: ExerciseWeightHistory;
}

export function WeightSuggestionCard({ history }: WeightSuggestionCardProps) {
  if (!history.latestWeight || history.entries.length < 2) {
    return null;
  }

  const getSuggestion = (): {
    type: 'increase' | 'maintain' | 'plateau';
    message: string;
    suggestedWeight?: number;
    icon: React.ReactNode;
    variant: 'default' | 'secondary' | 'destructive';
  } => {
    const { latestWeight, maxWeight, trend, entries } = history;

    // Check for plateau (same weight for 3+ sessions)
    const lastThreeWeights = entries.slice(0, 3).map(e => e.weight);
    const isPlateaued =
      lastThreeWeights.length >= 3 &&
      lastThreeWeights.every(w => w === lastThreeWeights[0]);

    if (isPlateaued) {
      const increment = latestWeight * 0.025; // 2.5% increase
      const suggestedWeight = Math.round((latestWeight + increment) * 2) / 2; // Round to nearest 0.5kg

      return {
        type: 'plateau',
        message: `Detectamos estancamiento. Intenta aumentar a ${suggestedWeight}kg para progresar.`,
        suggestedWeight,
        icon: <AlertCircle className="h-4 w-4" />,
        variant: 'destructive'
      };
    }

    // Suggest increase if trend is stable and hitting target reps consistently
    if (trend === 'stable' && latestWeight >= (maxWeight ?? 0) * 0.95) {
      const increment = latestWeight * 0.05; // 5% increase
      const suggestedWeight = Math.round((latestWeight + increment) * 2) / 2;

      return {
        type: 'increase',
        message: `¡Vas muy bien! Considera aumentar a ${suggestedWeight}kg en tu próxima sesión.`,
        suggestedWeight,
        icon: <TrendingUp className="h-4 w-4 text-green-600" />,
        variant: 'default'
      };
    }

    // Encourage if increasing
    if (trend === 'increasing') {
      return {
        type: 'maintain',
        message: '¡Excelente progreso! Sigue así para continuar mejorando.',
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        variant: 'secondary'
      };
    }

    return {
      type: 'maintain',
      message: 'Mantén el peso actual y enfócate en la técnica perfecta.',
      icon: <Lightbulb className="h-4 w-4" />,
      variant: 'secondary'
    };
  };

  const suggestion = getSuggestion();

  return (
    <Card className="border-primary/20 bg-primary/5 border-2">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{suggestion.icon}</div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <Badge variant={suggestion.variant} className="text-xs">
                {suggestion.type === 'increase' && 'Sugerencia de Progreso'}
                {suggestion.type === 'plateau' && 'Estancamiento Detectado'}
                {suggestion.type === 'maintain' && 'Sigue Así'}
              </Badge>
            </div>
            <p className="text-sm font-medium">{suggestion.message}</p>
            {suggestion.suggestedWeight && (
              <p className="text-muted-foreground mt-1 text-xs">
                Incremento recomendado:{' '}
                <span className="font-semibold">
                  +
                  {(suggestion.suggestedWeight - history.latestWeight).toFixed(
                    1
                  )}
                  kg
                </span>
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
