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

/**
 * Active Workout Page
 * Real-time workout recording with auto-save and optimistic updates
 */
export default function ActiveWorkoutPage() {
  const router = useRouter();

  // State
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

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
      ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
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

  const handleLogSet = async (
    exerciseId: string,
    setNumber: number,
    weight: number,
    reps: number
  ) => {
    try {
      setError(null);
      await logSetMutation.mutateAsync({
        workoutExerciseId: exerciseId,
        setNumber,
        weight,
        reps,
        isCompleted: true
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log set');
    }
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
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
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
          <Play className="mx-auto h-12 w-12 text-gray-400" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
              No Active Workout
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
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
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              Great Workout!
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              How did it go?
            </p>
          </div>

          {/* Stats Summary */}
          <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-gray-600 dark:text-gray-400">
              Duration:{' '}
              <span className="font-semibold text-gray-900 dark:text-gray-50">
                {formatTime(elapsedSeconds)}
              </span>
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Exercises:{' '}
              <span className="font-semibold text-gray-900 dark:text-gray-50">
                {workout.exercises.length}
              </span>
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
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-50">
          <Timer className="h-5 w-5" />
          {formatTime(elapsedSeconds)}
        </div>
      </div>

      {error && <Alert variant="destructive">{error}</Alert>}

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Overall Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Routine Info */}
      {workout.routine && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Routine</p>
          <p className="font-semibold text-gray-900 dark:text-gray-50">
            {workout.routine.name}
          </p>
        </div>
      )}

      {/* Exercises List */}
      <div className="space-y-4">
        {workout.exercises.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              No exercises added yet. Add exercises to start tracking.
            </p>
          </div>
        ) : (
          workout.exercises.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onLogSet={handleLogSet}
            />
          ))
        )}
      </div>

      {/* Complete Workout Button */}
      <div className="fixed right-0 bottom-0 left-0 border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
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

// Exercise Card Component

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
      isCompleted: boolean;
    }>;
  };
  onLogSet: (
    exerciseId: string,
    setNumber: number,
    weight: number,
    reps: number
  ) => Promise<void>;
}

function ExerciseCard({ exercise, onLogSet }: ExerciseCardProps) {
  const [sets, setSets] = useState(
    exercise.sets.length > 0
      ? exercise.sets
      : [{ setNumber: 1, weight: 0, reps: 0, isCompleted: false }]
  );

  const handleAddSet = () => {
    setSets([
      ...sets,
      { setNumber: sets.length + 1, weight: 0, reps: 0, isCompleted: false }
    ]);
  };

  const handleUpdateSet = (
    index: number,
    field: 'weight' | 'reps',
    value: number
  ) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setSets(newSets);
  };

  const handleCompleteSet = async (index: number) => {
    const set = sets[index];
    await onLogSet(exercise.id, set.setNumber, set.weight, set.reps);

    const newSets = [...sets];
    newSets[index] = { ...newSets[index], isCompleted: true };
    setSets(newSets);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Exercise Header */}
      <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-50">
        {exercise.exercise.name}
      </h3>

      {/* Sets Table */}
      <div className="space-y-2">
        <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="w-8">Set</div>
          <div>Weight (kg)</div>
          <div>Reps</div>
          <div className="w-16"></div>
        </div>

        {sets.map((set, index) => (
          <div
            key={index}
            className={`grid grid-cols-[auto_1fr_1fr_auto] gap-3 ${
              set.isCompleted ? 'opacity-50' : ''
            }`}
          >
            <div className="flex w-8 items-center font-semibold text-gray-900 dark:text-gray-50">
              {set.setNumber}
            </div>
            <Input
              type="number"
              value={set.weight}
              onChange={e =>
                handleUpdateSet(index, 'weight', Number(e.target.value))
              }
              disabled={set.isCompleted}
              min={0}
              step={2.5}
            />
            <Input
              type="number"
              value={set.reps}
              onChange={e =>
                handleUpdateSet(index, 'reps', Number(e.target.value))
              }
              disabled={set.isCompleted}
              min={0}
            />
            <Button
              size="sm"
              onClick={() => handleCompleteSet(index)}
              disabled={set.isCompleted || set.weight === 0 || set.reps === 0}
              variant={set.isCompleted ? 'outline' : 'default'}
            >
              {set.isCompleted ? <Check className="h-4 w-4" /> : 'Log'}
            </Button>
          </div>
        ))}
      </div>

      {/* Add Set Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleAddSet}
        className="mt-3 w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Set
      </Button>
    </div>
  );
}
