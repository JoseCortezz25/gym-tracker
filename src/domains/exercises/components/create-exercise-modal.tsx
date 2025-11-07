'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { exercisesTextMap } from '../exercises.text-map';
import { useCreateCustomExercise } from '../hooks/use-exercises';
import {
  createCustomExerciseSchema,
  type CreateCustomExerciseInput
} from '../schema';
import { ExerciseCategory } from '@prisma/client';

interface CreateExerciseModalProps {
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
}

export function CreateExerciseModal({
  onClose,
  onSuccess,
  onError
}: CreateExerciseModalProps) {
  const text = exercisesTextMap.createExercise;
  const categoryText = exercisesTextMap.exercises.categories;
  const [localError, setLocalError] = useState<string | null>(null);

  const createMutation = useCreateCustomExercise();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<CreateCustomExerciseInput>({
    resolver: zodResolver(createCustomExerciseSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  const selectedCategory = watch('category');

  const onSubmit = async (data: CreateCustomExerciseInput) => {
    try {
      setLocalError(null);
      await createMutation.mutateAsync(data);
      onSuccess(text.success);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : text.error.generic;
      setLocalError(errorMessage);
      onError(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            {text.title}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {localError && <Alert variant="destructive">{localError}</Alert>}

          {/* Exercise Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{text.name.label}</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder={text.name.placeholder}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">{text.category.label}</Label>
            <Select
              value={selectedCategory}
              onValueChange={value =>
                setValue('category', value as ExerciseCategory)
              }
            >
              <SelectTrigger
                className={errors.category ? 'border-red-500' : ''}
              >
                <SelectValue placeholder={text.category.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ExerciseCategory).map(category => (
                  <SelectItem key={category} value={category}>
                    {categoryText[category]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{text.description.label}</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder={text.description.placeholder}
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              {text.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Creating...' : text.submit}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
