'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { useExercises } from '@/domains/exercises/hooks/use-exercises';
import type { Exercise } from '@prisma/client';

interface ExerciseSelectorProps {
  onSelect: (exercise: Exercise) => void;
  onCancel: () => void;
  excludeIds?: string[]; // IDs of exercises already added
}

export function ExerciseSelector({
  onSelect,
  onCancel,
  excludeIds = []
}: ExerciseSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Fetch all exercises (predefined + user custom)
  const { data: exercises, isLoading, error } = useExercises();

  // Filter exercises
  const filteredExercises = exercises?.filter(exercise => {
    // Exclude already added exercises
    if (excludeIds.includes(exercise.id)) return false;

    // Filter by category
    if (selectedCategory !== 'ALL' && exercise.category !== selectedCategory) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      return exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return true;
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Select Exercise
        </h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-4 space-y-3">
        {/* Search */}
        <div>
          <Label htmlFor="exercise-search">Search</Label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="exercise-search"
              type="text"
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <Label htmlFor="category-filter">Category</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              <SelectItem value="CHEST">Chest</SelectItem>
              <SelectItem value="BACK">Back</SelectItem>
              <SelectItem value="LEGS">Legs</SelectItem>
              <SelectItem value="SHOULDERS">Shoulders</SelectItem>
              <SelectItem value="ARMS">Arms</SelectItem>
              <SelectItem value="CORE">Core</SelectItem>
              <SelectItem value="CARDIO">Cardio</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Exercise List */}
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {isLoading && (
          <p className="py-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Loading exercises...
          </p>
        )}

        {error && (
          <p className="py-4 text-center text-sm text-red-600">
            Failed to load exercises
          </p>
        )}

        {!isLoading && !error && filteredExercises?.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-600 dark:text-gray-400">
            No exercises found
          </p>
        )}

        {filteredExercises?.map(exercise => (
          <button
            key={exercise.id}
            type="button"
            onClick={() => onSelect(exercise)}
            className="w-full rounded-md border border-gray-200 bg-white p-3 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-50">
                  {exercise.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {exercise.category}
                  {!exercise.isPredefined && (
                    <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                      Custom
                    </span>
                  )}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {filteredExercises?.length || 0} exercises available
        </p>
      </div>
    </div>
  );
}
