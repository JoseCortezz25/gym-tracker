'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { workoutsTextMap } from '../workouts.text-map';
import { cn } from '@/lib/utils';

interface SetData {
  setNumber: number;
  weight: number;
  reps: number;
  notes?: string;
  isCompleted: boolean;
}

interface SetRowExpandableProps {
  set: SetData;
  onComplete: (data: { weight: number; reps: number; notes?: string }) => void;
  isLoading?: boolean;
  previousSet?: { weight: number; reps: number };
}

export const SetRowExpandable = ({
  set,
  onComplete,
  isLoading = false,
  previousSet
}: SetRowExpandableProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [weight, setWeight] = useState(set.weight || previousSet?.weight || 0);
  const [reps, setReps] = useState(set.reps || previousSet?.reps || 0);
  const [notes, setNotes] = useState(set.notes || '');

  const handleComplete = () => {
    onComplete({ weight, reps, notes: notes.trim() || undefined });
    setIsOpen(false);
  };

  const isValid = weight >= 0 && reps > 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div
        className={cn(
          'rounded-lg border transition-all duration-200',
          set.isCompleted && 'bg-muted/30 opacity-60',
          isOpen && 'ring-primary ring-2'
        )}
      >
        {/* Collapsed Row */}
        <CollapsibleTrigger asChild>
          <button
            className="hover:bg-muted/50 flex w-full items-center justify-between px-4 py-3 transition-colors"
            disabled={set.isCompleted || isLoading}
          >
            <div className="flex flex-1 items-center gap-4">
              {/* Set Number */}
              <div className="w-16 text-left font-semibold">
                {workoutsTextMap.workout.active.set.replace(
                  '{number}',
                  set.setNumber.toString()
                )}
              </div>

              {/* Weight */}
              <div className="flex-1 text-left">
                {set.isCompleted ? (
                  <span className="font-medium">{weight} kg</span>
                ) : (
                  <span className="text-muted-foreground text-sm">
                    {previousSet
                      ? `Last: ${previousSet.weight} kg`
                      : 'Tap to log'}
                  </span>
                )}
              </div>

              {/* Reps */}
              <div className="flex-1 text-left">
                {set.isCompleted ? (
                  <span className="font-medium">{reps} reps</span>
                ) : (
                  <span className="text-muted-foreground text-sm">
                    {previousSet ? `Last: ${previousSet.reps} reps` : '—'}
                  </span>
                )}
              </div>

              {/* Status Icon */}
              <div className="w-10">
                {set.isCompleted ? (
                  <Check className="text-primary" size={20} />
                ) : isOpen ? (
                  <ChevronUp className="text-muted-foreground" size={20} />
                ) : (
                  <ChevronDown className="text-muted-foreground" size={20} />
                )}
              </div>
            </div>
          </button>
        </CollapsibleTrigger>

        {/* Expanded Form */}
        <CollapsibleContent>
          <div className="space-y-4 border-t px-4 pt-2 pb-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Weight Input */}
              <div className="space-y-2">
                <Label htmlFor={`weight-${set.setNumber}`}>
                  {workoutsTextMap.workout.active.weight.label}
                </Label>
                <Input
                  id={`weight-${set.setNumber}`}
                  type="number"
                  min="0"
                  step="0.5"
                  value={weight}
                  onChange={e => setWeight(parseFloat(e.target.value) || 0)}
                  placeholder={
                    workoutsTextMap.workout.active.weight.placeholder
                  }
                  className="text-lg"
                  autoFocus
                />
              </div>

              {/* Reps Input */}
              <div className="space-y-2">
                <Label htmlFor={`reps-${set.setNumber}`}>
                  {workoutsTextMap.workout.active.reps.label}
                </Label>
                <Input
                  id={`reps-${set.setNumber}`}
                  type="number"
                  min="1"
                  max="999"
                  value={reps}
                  onChange={e => setReps(parseInt(e.target.value) || 0)}
                  placeholder={workoutsTextMap.workout.active.reps.placeholder}
                  className="text-lg"
                />
              </div>
            </div>

            {/* Notes Input */}
            <div className="space-y-2">
              <Label htmlFor={`notes-${set.setNumber}`}>
                {workoutsTextMap.workout.active.setNotes.label}
              </Label>
              <Textarea
                id={`notes-${set.setNumber}`}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={
                  workoutsTextMap.workout.active.setNotes.placeholder
                }
                rows={2}
                maxLength={500}
                className="resize-none"
              />
              <p className="text-muted-foreground text-right text-xs">
                {notes.length}/500
              </p>
            </div>

            {/* Complete Button */}
            <Button
              onClick={handleComplete}
              disabled={!isValid || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                'Saving...'
              ) : (
                <>
                  <Check className="mr-2" size={18} />
                  {workoutsTextMap.workout.active.complete}
                </>
              )}
            </Button>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
