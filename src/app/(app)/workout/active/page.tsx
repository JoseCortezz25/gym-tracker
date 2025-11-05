'use client';

import { useState } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { NumberInput } from '@/components/molecules/number-input';
import { StarRating } from '@/components/molecules/star-rating';
import { workoutsTextMap } from '@/domains/workouts/workouts.text-map';

/**
 * Active Workout Page
 * Real-time workout recording interface
 * UI-only implementation (simplified version)
 */
export default function ActiveWorkoutPage() {
  const text = workoutsTextMap.workout;

  // Mock state (will be replaced with real state management in Phase 2)
  const [weight, setWeight] = useState(60);
  const [reps, setReps] = useState(10);
  const [isComplete, setIsComplete] = useState(false);
  const [rating, setRating] = useState(0);

  const handleCompleteSet = () => {
    // eslint-disable-next-line no-console
    console.log('Set completed:', { weight, reps });
    // Business logic will be added in Phase 2
  };

  const handleFinishWorkout = () => {
    // eslint-disable-next-line no-console
    console.log('Workout finished with rating:', rating);
    setIsComplete(true);
  };

  // Completion screen
  if (isComplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <Check
              className="h-10 w-10 text-green-600 dark:text-green-400"
              aria-hidden="true"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              {text.summary.heading}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {text.summary.congratulations}
            </p>
          </div>

          <div className="space-y-2 text-gray-600 dark:text-gray-400">
            <p>{text.summary.duration.replace('{time}', '45:32')}</p>
            <p>{text.summary.exercises.replace('{count}', '6')}</p>
            <p>{text.summary.volume.replace('{volume}', '2,850')}</p>
          </div>

          <div>
            <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
              {text.summary.rating.label}
            </p>
            <div className="flex justify-center">
              <StarRating value={rating} onChange={setRating} size={40} />
            </div>
          </div>

          <Button size="lg" className="w-full" asChild>
            <Link href="/dashboard">{text.summary.viewDetails}</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Active workout screen
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            {text.active.exit}
          </Link>
        </Button>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {text.active.timer}: 00:15:32
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {text.active.progress
            .replace('{current}', '1')
            .replace('{total}', '6')}
        </p>
        <Progress value={16.67} className="h-2" />
      </div>

      {/* Exercise Info */}
      <div className="rounded-lg bg-white p-6 dark:bg-gray-900">
        <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-50">
          Bench Press
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {text.active.target
            .replace('{sets}', '3')
            .replace('{reps}', '10')
            .replace('{weight}', '60')}
        </p>
      </div>

      {/* Set Input */}
      <div className="rounded-lg bg-white p-6 dark:bg-gray-900">
        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-50">
          {text.active.set.replace('{number}', '1')}
        </h3>

        <div className="space-y-4">
          {/* Weight Input */}
          <div>
            <label
              htmlFor="weight"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {text.active.weight.label}
            </label>
            <NumberInput
              id="weight"
              value={weight}
              onChange={setWeight}
              min={0}
              step={2.5}
              aria-label="Weight"
            />
          </div>

          {/* Reps Input */}
          <div>
            <label
              htmlFor="reps"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {text.active.reps.label}
            </label>
            <NumberInput
              id="reps"
              value={reps}
              onChange={setReps}
              min={0}
              step={1}
              aria-label="Reps"
            />
          </div>

          {/* Complete Set Button */}
          <Button
            onClick={handleCompleteSet}
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {text.active.complete}
          </Button>
        </div>
      </div>

      {/* Finish Workout Button (temporary for demo) */}
      <Button
        onClick={handleFinishWorkout}
        variant="outline"
        className="w-full"
      >
        {text.active.finish}
      </Button>
    </div>
  );
}
