'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, Play, Timer, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StarRating } from '@/components/molecules/star-rating';
import {
  useActiveWorkout,
  useStartWorkout,
  useLogSet,
  useCompleteWorkout
} from '@/domains/workouts/hooks/use-workouts';
import { SetRowExpandable } from '@/domains/workouts/components/set-row-expandable';
import { RestTimerModal } from '@/domains/workouts/components/rest-timer-modal';

/**
 * Active Workout Page
 * Real-time workout recording with auto-save, optimistic updates, and rest timer
 */
export default function ActiveWorkoutPage() {
  const router = useRouter();

  // State
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Rest timer state
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [currentRestSeconds, setCurrentRestSeconds] = useState(0);
  const [nextSetInfo, setNextSetInfo] = useState<{
    exerciseId: string;
    setNumber: number;
  } | null>(null);

  // Queries & Mutations
  const { data: workout, isLoading, error: fetchError } = useActiveWorkout();
  const startWorkout = useStartWorkout();
  const logSetMutation = useLogSet();
  const completeWorkout = useCompleteWorkout();

  // Timer state (elapsed time)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Start timer when workout is active
  useEffect(() => {
    if (!workout) return;

    const startTime = new Date(workout.startedAt).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [workout]);

  // Format elapsed time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hrs > 0
      ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs
          .toString()
          .padStart(2, '0')}`
      : `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress
  const calculateProgress = () => {
    if (!workout || workout.exercises.length === 0) return 0;

    const totalSets = workout.exercises.reduce(
      (sum, ex) => sum + ex.sets.length,
      0
    );
    const completedSets = workout.exercises.reduce(
      (sum, ex) => sum + ex.sets.filter(s => s.isCompleted).length,
      0
    );

    return totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  };

  // Handlers
  const handleStartWorkout = async () => {
    try {
      setError(null);
      await startWorkout.mutateAsync({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start workout');
    }
  };

  const handleSetComplete = async (
    exerciseId: string,
    setNumber: number,
    data: { weight: number; reps: number; notes?: string }
  ) => {
    try {
      setError(null);

      // Log the set with notes
      await logSetMutation.mutateAsync({
        workoutExerciseId: exerciseId,
        setNumber,
        weight: data.weight,
        reps: data.reps,
        notes: data.notes,
        isCompleted: true
      });

      // Find the exercise and check if more sets remain
      const exercise = workout?.exercises.find(e => e.id === exerciseId);
      if (!exercise) return;

      const nextSetNumber = setNumber + 1;
      const hasMoreSets = exercise.sets.some(
        s => s.setNumber === nextSetNumber && !s.isCompleted
      );

      // Show rest timer if configured and more sets remain
      // TODO: Get restSeconds from DivisionExercise through workout data
      const restSeconds = 90; // Default 90 seconds, should come from exercise config

      if (hasMoreSets && restSeconds > 0) {
        setCurrentRestSeconds(restSeconds);
        setNextSetInfo({ exerciseId, setNumber: nextSetNumber });
        setShowRestTimer(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log set');
    }
  };

  const handleRestTimerComplete = () => {
    // Auto-scroll to next set
    if (nextSetInfo) {
      const nextSetElement = document.querySelector(
        `[data-set-id="${nextSetInfo.exerciseId}-${nextSetInfo.setNumber}"]`
      );
      if (nextSetElement) {
        nextSetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Try to expand the next set automatically
        const button = nextSetElement.querySelector('button');
        if (button) {
          setTimeout(() => {
            button.click();
          }, 300);
        }
      }
    }
    setNextSetInfo(null);
  };

  const handleCompleteWorkout = async () => {
    if (!workout) return;

    try {
      setError(null);
      await completeWorkout.mutateAsync({
        sessionId: workout.id,
        rating: rating || undefined,
        notes: notes || undefined
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to complete workout'
      );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <Alert variant="destructive">
        Failed to load active workout. Please try again later.
      </Alert>
    );
  }

  // No active workout - show start button
  if (!workout) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="space-y-4 text-center">
          <Play className="text-muted-foreground mx-auto h-12 w-12" />
          <div>
            <h2 className="text-xl font-semibold">No Active Workout</h2>
            <p className="text-muted-foreground mt-1">
              Start a new workout session to begin tracking
            </p>
          </div>
          <Button
            size="lg"
            onClick={handleStartWorkout}
            disabled={startWorkout.isPending}
          >
            {startWorkout.isPending ? 'Starting...' : 'Start Workout'}
          </Button>
          {error && (
            <Alert variant="destructive" className="mt-4">
              {error}
            </Alert>
          )}
        </div>
      </div>
    );
  }

  // Completion Modal
  if (showCompletionModal) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="bg-primary/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full">
            <Check className="text-primary h-10 w-10" />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold">Great Workout!</h1>
            <p className="text-muted-foreground mt-2">How did it go?</p>
          </div>

          {/* Stats Summary */}
          <div className="bg-muted space-y-2 rounded-lg border p-4">
            <p className="text-muted-foreground">
              Duration:{' '}
              <span className="font-semibold">
                {formatTime(elapsedSeconds)}
              </span>
            </p>
            <p className="text-muted-foreground">
              Exercises:{' '}
              <span className="font-semibold">{workout.exercises.length}</span>
            </p>
          </div>

          {/* Rating */}
          <div>
            <Label className="mb-2 block">Rate this workout</Label>
            <div className="flex justify-center">
              <StarRating value={rating} onChange={setRating} size={40} />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="workout-notes">Notes (optional)</Label>
            <Input
              id="workout-notes"
              placeholder="How did you feel?"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {error && <Alert variant="destructive">{error}</Alert>}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCompletionModal(false)}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleCompleteWorkout}
              disabled={completeWorkout.isPending}
              className="flex-1"
            >
              {completeWorkout.isPending ? 'Saving...' : 'Finish Workout'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Active workout screen
  const progress = calculateProgress();

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Exit
          </Link>
        </Button>
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Timer className="h-5 w-5" />
          {formatTime(elapsedSeconds)}
        </div>
      </div>

      {error && <Alert variant="destructive">{error}</Alert>}

      {/* Progress */}
      <div className="space-y-2">
        <div className="text-muted-foreground flex justify-between text-sm">
          <span>Overall Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Routine Info */}
      {workout.routine && (
        <div className="bg-muted rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Routine</p>
          <p className="font-semibold">{workout.routine.name}</p>
        </div>
      )}

      {/* Exercises List */}
      <div className="space-y-6">
        {workout.exercises.length === 0 ? (
          <div className="border-muted rounded-lg border-2 border-dashed p-8 text-center">
            <p className="text-muted-foreground">
              No exercises added yet. Add exercises to start tracking.
            </p>
          </div>
        ) : (
          workout.exercises.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onSetComplete={handleSetComplete}
              isLoading={logSetMutation.isPending}
            />
          ))
        )}
      </div>

      {/* Rest Timer Modal */}
      <RestTimerModal
        isOpen={showRestTimer}
        onOpenChange={setShowRestTimer}
        restSeconds={currentRestSeconds}
        onComplete={handleRestTimerComplete}
      />

      {/* Complete Workout Button */}
      <div className="bg-background fixed right-0 bottom-0 left-0 border-t p-4">
        <div className="mx-auto max-w-7xl">
          <Button
            size="lg"
            className="w-full"
            onClick={() => setShowCompletionModal(true)}
          >
            Complete Workout
          </Button>
        </div>
      </div>
    </div>
  );
}

// Exercise Card Component - Refactored

interface ExerciseCardProps {
  exercise: {
    id: string;
    exercise: {
      name: string;
    };
    sets: Array<{
      setNumber: number;
      weight: number;
      reps: number;
      notes?: string;
      isCompleted: boolean;
    }>;
  };
  onSetComplete: (
    exerciseId: string,
    setNumber: number,
    data: { weight: number; reps: number; notes?: string }
  ) => Promise<void>;
  isLoading?: boolean;
}

function ExerciseCard({
  exercise,
  onSetComplete,
  isLoading
}: ExerciseCardProps) {
  const [localSets, setLocalSets] = useState(exercise.sets);

  // Sync with server data when it changes
  useEffect(() => {
    setLocalSets(exercise.sets);
  }, [exercise.sets]);

  const handleAddSet = () => {
    const newSetNumber = localSets.length + 1;
    setLocalSets([
      ...localSets,
      {
        setNumber: newSetNumber,
        weight: localSets[localSets.length - 1]?.weight || 0,
        reps: localSets[localSets.length - 1]?.reps || 0,
        isCompleted: false
      }
    ]);
  };

  const handleComplete = async (
    setNumber: number,
    data: { weight: number; reps: number; notes?: string }
  ) => {
    await onSetComplete(exercise.id, setNumber, data);
  };

  return (
    <div className="bg-card space-y-3 rounded-lg border p-4 shadow-sm">
      {/* Exercise Header */}
      <h3 className="text-lg font-semibold">{exercise.exercise.name}</h3>

      {/* Sets - Using Expandable Rows */}
      <div className="space-y-2">
        {localSets.map((set, idx) => (
          <div
            key={set.setNumber}
            data-set-id={`${exercise.id}-${set.setNumber}`}
          >
            <SetRowExpandable
              set={set}
              onComplete={data => handleComplete(set.setNumber, data)}
              isLoading={isLoading}
              previousSet={idx > 0 ? localSets[idx - 1] : undefined}
            />
          </div>
        ))}
      </div>

      {/* Add Set Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleAddSet}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Set
      </Button>
    </div>
  );
}
