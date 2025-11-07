'use client';

import { useState } from 'react';
import { Plus, Dumbbell, Loader2, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/molecules/empty-state';
import { Alert } from '@/components/ui/alert';
import { exercisesTextMap } from '@/domains/exercises/exercises.text-map';
import {
  useExercises,
  useDeleteCustomExercise
} from '@/domains/exercises/hooks/use-exercises';
import { ExerciseCategory } from '@prisma/client';
import { CreateExerciseModal } from '@/domains/exercises/components/create-exercise-modal';

/**
 * Exercises Management Page
 * View all exercises (predefined + custom) and create new custom exercises
 */
export default function ExercisesPage() {
  const text = exercisesTextMap.exercises;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<
    ExerciseCategory | undefined
  >();
  const [typeFilter, setTypeFilter] = useState<'all' | 'predefined' | 'custom'>(
    'all'
  );

  // Build filters object
  const filters = {
    search: searchQuery || undefined,
    category: categoryFilter,
    isPredefined: typeFilter === 'all' ? undefined : typeFilter === 'predefined'
  };

  // Fetch exercises with filters
  const {
    data: exercises,
    isLoading,
    error: fetchError
  } = useExercises(filters);

  // Delete mutation
  const deleteMutation = useDeleteCustomExercise();

  const hasExercises = exercises && exercises.length > 0;

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(`${text.delete.confirm.title}\n\n${text.delete.confirm.message}`)
    ) {
      return;
    }

    try {
      setError(null);
      await deleteMutation.mutateAsync(id);
      setSuccess(`"${name}" ${text.delete.success}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : text.delete.error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Show error state
  if (fetchError) {
    return (
      <Alert variant="destructive">
        Failed to load exercises. Please try again later.
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
          {text.heading}
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {text.subheading}
        </p>
      </div>

      {/* Alerts */}
      {error && <Alert variant="destructive">{error}</Alert>}
      {success && <Alert>{success}</Alert>}

      {/* Filters and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder={text.search.placeholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Create Button */}
        <Button size="lg" onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
          {text.create}
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {/* Type Filter */}
        <Button
          variant={typeFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTypeFilter('all')}
        >
          {text.filters.all}
        </Button>
        <Button
          variant={typeFilter === 'predefined' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTypeFilter('predefined')}
        >
          {text.filters.predefined}
        </Button>
        <Button
          variant={typeFilter === 'custom' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTypeFilter('custom')}
        >
          {text.filters.custom}
        </Button>

        <div className="mx-2 border-l border-gray-300 dark:border-gray-700" />

        {/* Category Filter */}
        <Button
          variant={!categoryFilter ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCategoryFilter(undefined)}
        >
          {text.categories.all}
        </Button>
        {Object.values(ExerciseCategory).map(category => (
          <Button
            key={category}
            variant={categoryFilter === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter(category)}
          >
            {text.categories[category]}
          </Button>
        ))}
      </div>

      {/* Exercises Grid */}
      {hasExercises ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.map(exercise => (
            <div
              key={exercise.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                      {exercise.name}
                    </h3>
                    {exercise.isPredefined && (
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {text.card.predefined}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {text.categories[exercise.category]}
                  </p>
                  {exercise.description && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {exercise.description}
                    </p>
                  )}
                </div>

                {/* Delete button for custom exercises */}
                {!exercise.isPredefined && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(exercise.id, exercise.name)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Dumbbell}
          heading={text.empty.heading}
          message={text.empty.message}
          action={{
            label: text.empty.action,
            onClick: () => setShowCreateModal(true)
          }}
        />
      )}

      {/* Create Exercise Modal */}
      {showCreateModal && (
        <CreateExerciseModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={message => {
            setShowCreateModal(false);
            setSuccess(message);
            setTimeout(() => setSuccess(null), 3000);
          }}
          onError={setError}
        />
      )}
    </div>
  );
}
