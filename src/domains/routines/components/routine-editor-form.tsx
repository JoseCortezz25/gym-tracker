'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useForm,
  useFieldArray,
  UseFormRegister,
  Control,
  FieldErrors
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { ExerciseSelector } from './exercise-selector';
import {
  useCreateRoutine,
  useUpdateRoutine,
  useAddDivision,
  useAddExercise
} from '../hooks/use-routines';
import type { Exercise } from '@prisma/client';

const routineEditorSchema = z.object({
  name: z.string().min(1, 'Routine name is required').max(100),
  days: z
    .array(
      z.object({
        name: z.string().min(1, 'Division name is required').max(50),
        exercises: z
          .array(
            z.object({
              exerciseId: z.string().cuid('Invalid exercise'),
              exerciseName: z.string(), // For display only
              targetSets: z.number().int().min(1).max(20),
              targetReps: z.string().regex(/^(\d+(-\d+)?|AMRAP)$/i),
              targetWeight: z.number().min(0).optional(),
              restSeconds: z.number().int().min(0).max(600).optional(),
              notes: z.string().max(500).optional()
            })
          )
          .min(1, 'At least one exercise is required')
      })
    )
    .min(1, 'At least one division is required')
});

type RoutineEditorFormData = z.infer<typeof routineEditorSchema>;

interface RoutineEditorFormProps {
  editMode?: boolean;
  routine?: {
    id: string;
    name: string;
    divisions: Array<{
      id: string;
      name: string;
      order: number;
      exercises: Array<{
        id: string;
        exerciseId: string;
        order: number;
        targetSets: number;
        targetReps: string;
        targetWeight?: number | null;
        restSeconds?: number | null;
        notes?: string | null;
        exercise: {
          id: string;
          name: string;
        };
      }>;
    }>;
  };
}

export function RoutineEditorForm({
  editMode = false,
  routine
}: RoutineEditorFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'basic' | 'days'>(
    editMode ? 'days' : 'basic'
  );

  // Mutations
  const createRoutine = useCreateRoutine();
  const updateRoutineMutation = useUpdateRoutine();
  const addDivision = useAddDivision();
  const addExercise = useAddExercise();

  // Form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<RoutineEditorFormData>({
    resolver: zodResolver(routineEditorSchema),
    defaultValues:
      editMode && routine
        ? {
            name: routine.name,
            days: routine.divisions.map(division => ({
              name: division.name,
              exercises: division.exercises.map(ex => ({
                exerciseId: ex.exerciseId,
                exerciseName: ex.exercise.name,
                targetSets: ex.targetSets,
                targetReps: ex.targetReps,
                targetWeight: ex.targetWeight || undefined,
                restSeconds: ex.restSeconds || undefined,
                notes: ex.notes || undefined
              }))
            }))
          }
        : {
            name: '',
            days: []
          }
  });

  const {
    fields: dayFields,
    append: appendDay,
    remove: removeDay
  } = useFieldArray({
    control,
    name: 'days'
  });

  // Handlers

  const onSubmit = async (data: RoutineEditorFormData) => {
    try {
      setError(null);

      if (editMode && routine) {
        // Edit mode: Update routine name
        await updateRoutineMutation.mutateAsync({
          id: routine.id,
          name: data.name
        });

        // Note: For simplicity, we're only updating the routine name in edit mode
        // Full edit functionality (add/remove/update days and exercises) would require
        // additional mutations and diff logic to determine what changed

        // Success: redirect to routines page
        router.push('/routines');
      } else {
        // Create mode: Create new routine
        const newRoutine = await createRoutine.mutateAsync({ name: data.name });

        // Step 2: Add divisions sequentially
        for (let i = 0; i < data.days.length; i++) {
          const division = data.days[i];
          const createdDivision = await addDivision.mutateAsync({
            routineId: newRoutine.id,
            name: division.name,
            description: '', // TODO: Add description field to form
            frequency: 3, // TODO: Add frequency field to form (default 3x per week)
            order: i + 1
          });

          // Step 3: Add exercises to division
          for (let j = 0; j < division.exercises.length; j++) {
            const exercise = division.exercises[j];
            await addExercise.mutateAsync({
              divisionId: createdDivision.id,
              exerciseId: exercise.exerciseId,
              order: j + 1,
              targetSets: exercise.targetSets,
              targetReps: exercise.targetReps,
              targetWeight: exercise.targetWeight,
              restSeconds: exercise.restSeconds,
              videoId: null, // TODO: Add video field to form
              notes: exercise.notes
            });
          }
        }

        // Success: redirect to routines page
        router.push('/routines');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${editMode ? 'update' : 'create'} routine`
      );
    }
  };

  const handleAddDay = () => {
    appendDay({
      name: '',
      exercises: []
    });
  };

  // Render

  if (currentStep === 'basic') {
    return (
      <div className="mx-auto max-w-2xl">
        <form
          onSubmit={e => {
            e.preventDefault();
            setCurrentStep('days');
          }}
          className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          {error && <Alert variant="destructive">{error}</Alert>}

          {/* Routine Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Routine Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., Push-Pull-Legs"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Next: Add Days
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && <Alert variant="destructive">{error}</Alert>}

        {/* Routine Name Display */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Routine Name
          </p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            {watch('name')}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep('basic')}
            className="mt-2"
          >
            Edit Name
          </Button>
        </div>

        {/* Training Divisions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
              Training Divisions
            </h2>
            <Button type="button" onClick={handleAddDay} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Division
            </Button>
          </div>

          {dayFields.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">
                No divisions added yet. Click "Add Division" to start building
                your routine.
              </p>
            </div>
          )}

          {dayFields.map((field, dayIndex) => (
            <DayEditor
              key={field.id}
              dayIndex={dayIndex}
              register={register}
              control={control}
              errors={errors}
              onRemove={() => removeDay(dayIndex)}
            />
          ))}
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 border-t border-gray-200 pt-6 dark:border-gray-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || dayFields.length === 0}
            className="ml-auto"
          >
            {isSubmitting ? 'Creating...' : 'Create Routine'}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Day Editor Component

function DayEditor({
  dayIndex,
  register,
  control,
  errors,
  onRemove
}: {
  dayIndex: number;
  register: UseFormRegister<RoutineEditorFormData>;
  control: Control<RoutineEditorFormData>;
  errors: FieldErrors<RoutineEditorFormData>;
  onRemove: () => void;
}) {
  const {
    fields: exerciseFields,
    append: appendExercise,
    remove: removeExercise
  } = useFieldArray({
    control,
    name: `days.${dayIndex}.exercises`
  });

  const [showExerciseSelector, setShowExerciseSelector] = useState(false);

  const handleAddExercise = (exercise: Exercise) => {
    appendExercise({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      targetSets: 3,
      targetReps: '8-12',
      targetWeight: undefined,
      restSeconds: 90,
      notes: ''
    });
    setShowExerciseSelector(false);
  };

  // Get list of already added exercise IDs to exclude from selector
  const addedExerciseIds = exerciseFields.map(field => {
    // TypeScript workaround for useFieldArray type inference
    const fieldWithExercise = field as unknown as { exerciseId: string };
    return fieldWithExercise.exerciseId;
  });

  const dayErrors = errors.days?.[dayIndex];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Division Header */}
      <div className="mb-4 flex items-start gap-4">
        <div className="flex-1 space-y-4">
          {/* Division Name */}
          <div>
            <Label htmlFor={`days.${dayIndex}.name`}>Division Name</Label>
            <Input
              id={`days.${dayIndex}.name`}
              {...register(`days.${dayIndex}.name`)}
              placeholder="e.g., Push Day, Upper Body"
              className={dayErrors?.name ? 'border-red-500' : ''}
            />
            {dayErrors?.name && (
              <p className="mt-1 text-sm text-red-600">
                {dayErrors.name.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Exercises */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Exercises</Label>
          <Button
            type="button"
            onClick={() => setShowExerciseSelector(true)}
            size="sm"
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Exercise
          </Button>
        </div>

        {exerciseFields.length === 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No exercises added yet
          </p>
        )}

        {exerciseFields.map((field, exerciseIndex) => (
          <div
            key={field.id}
            className="flex items-center gap-2 rounded-md border border-gray-200 p-3 dark:border-gray-700"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-50">
                {field.exerciseName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {field.targetSets} sets × {field.targetReps} reps
                {field.restSeconds && ` • ${field.restSeconds}s rest`}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeExercise(exerciseIndex)}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Exercise Selector */}
      {showExerciseSelector && (
        <div className="mt-4">
          <ExerciseSelector
            onSelect={handleAddExercise}
            onCancel={() => setShowExerciseSelector(false)}
            excludeIds={addedExerciseIds}
          />
        </div>
      )}
    </div>
  );
}
