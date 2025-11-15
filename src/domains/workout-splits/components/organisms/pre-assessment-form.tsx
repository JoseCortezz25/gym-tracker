/**
 * Pre-Assessment Form Component
 *
 * Multi-step form for workout assessment.
 * Client Component with React Hook Form.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  workoutSplitsText,
  getWorkoutSplitsText
} from '../../workout-splits.text-map';
import { preAssessmentFormSchema } from '../../schema';
import type { WorkoutAssessmentInput, TrainingFocus } from '../../types';
import { useCreateAssessment } from '../../hooks/use-workout-splits';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

type FormStep = 'frequency' | 'focus' | 'preview';

export function PreAssessmentForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>('frequency');

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<WorkoutAssessmentInput>({
    resolver: zodResolver(preAssessmentFormSchema),
    defaultValues: {
      frequency: 3,
      trainingFocus: 'FULL_BODY'
    }
  });

  const createAssessmentMutation = useCreateAssessment();

  const frequency = watch('frequency');
  const trainingFocus = watch('trainingFocus');

  const onSubmit = async (data: WorkoutAssessmentInput) => {
    try {
      await createAssessmentMutation.mutateAsync(data);
      toast.success(workoutSplitsText.preAssessment.successMessage);
      router.push('/my-workout');
    } catch {
      toast.error(workoutSplitsText.preAssessment.errorGeneration);
    }
  };

  const handleNext = () => {
    if (currentStep === 'frequency') {
      setCurrentStep('focus');
    } else if (currentStep === 'focus') {
      setCurrentStep('preview');
    }
  };

  const handleBack = () => {
    if (currentStep === 'focus') {
      setCurrentStep('frequency');
    } else if (currentStep === 'preview') {
      setCurrentStep('focus');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 'frequency' &&
              workoutSplitsText.preAssessment.step1Title}
            {currentStep === 'focus' &&
              workoutSplitsText.preAssessment.step2Title}
            {currentStep === 'preview' &&
              workoutSplitsText.preAssessment.previewTitle}
          </CardTitle>
          <CardDescription>
            {currentStep === 'frequency' &&
              workoutSplitsText.preAssessment.step1Subtitle}
            {currentStep === 'focus' &&
              workoutSplitsText.preAssessment.step2Subtitle}
            {currentStep === 'preview' &&
              getWorkoutSplitsText('preAssessment.previewDescription', {
                count: frequency
              })}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Frequency */}
          {currentStep === 'frequency' && (
            <div className="space-y-4">
              <Label htmlFor="frequency">
                {workoutSplitsText.preAssessment.frequencyLabel}
              </Label>
              <RadioGroup
                value={String(frequency)}
                onValueChange={value => setValue('frequency', Number(value))}
                className="grid grid-cols-2 gap-4"
              >
                {[3, 4, 5, 6].map(days => (
                  <div key={days}>
                    <RadioGroupItem
                      value={String(days)}
                      id={`freq-${days}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`freq-${days}`}
                      className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary flex cursor-pointer flex-col items-center justify-center rounded-md border-2 p-4"
                    >
                      <span className="mb-1 text-2xl font-bold">{days}</span>
                      <span className="text-sm">días</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.frequency && (
                <p className="text-destructive text-sm">
                  {errors.frequency.message}
                </p>
              )}
            </div>
          )}

          {/* Step 2: Training Focus */}
          {currentStep === 'focus' && (
            <div className="space-y-4">
              <Label>{workoutSplitsText.preAssessment.focusLabel}</Label>
              <RadioGroup
                value={trainingFocus}
                onValueChange={value =>
                  setValue('trainingFocus', value as TrainingFocus)
                }
                className="space-y-3"
              >
                {[
                  {
                    value: 'LEGS',
                    label: workoutSplitsText.preAssessment.focusLegs,
                    description:
                      workoutSplitsText.preAssessment.focusLegsDescription
                  },
                  {
                    value: 'ARMS',
                    label: workoutSplitsText.preAssessment.focusArms,
                    description:
                      workoutSplitsText.preAssessment.focusArmsDescription
                  },
                  {
                    value: 'FULL_BODY',
                    label: workoutSplitsText.preAssessment.focusFullBody,
                    description:
                      workoutSplitsText.preAssessment.focusFullBodyDescription
                  },
                  {
                    value: 'CORE',
                    label: workoutSplitsText.preAssessment.focusCore,
                    description:
                      workoutSplitsText.preAssessment.focusCoreDescription
                  }
                ].map(option => (
                  <div key={option.value}>
                    <RadioGroupItem
                      value={option.value}
                      id={`focus-${option.value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`focus-${option.value}`}
                      className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary flex cursor-pointer flex-col rounded-md border-2 p-4"
                    >
                      <span className="mb-1 font-semibold">{option.label}</span>
                      <span className="text-muted-foreground text-sm">
                        {option.description}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.trainingFocus && (
                <p className="text-destructive text-sm">
                  {errors.trainingFocus.message}
                </p>
              )}
            </div>
          )}

          {/* Step 3: Preview */}
          {currentStep === 'preview' && (
            <div className="space-y-4">
              <div className="bg-muted space-y-3 rounded-lg p-4">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Frecuencia
                  </p>
                  <p className="text-lg font-semibold">
                    {frequency} días por semana
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Enfoque
                  </p>
                  <p className="text-lg font-semibold">
                    {trainingFocus === 'LEGS' &&
                      workoutSplitsText.preAssessment.focusLegs}
                    {trainingFocus === 'ARMS' &&
                      workoutSplitsText.preAssessment.focusArms}
                    {trainingFocus === 'FULL_BODY' &&
                      workoutSplitsText.preAssessment.focusFullBody}
                    {trainingFocus === 'CORE' &&
                      workoutSplitsText.preAssessment.focusCore}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Divisiones
                  </p>
                  <p className="text-lg font-semibold">
                    {frequency} divisiones (A, B, C...)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3">
            {currentStep !== 'frequency' && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                {workoutSplitsText.preAssessment.buttonBack}
              </Button>
            )}

            {currentStep !== 'preview' ? (
              <Button type="button" onClick={handleNext} className="flex-1">
                {workoutSplitsText.preAssessment.buttonNext}
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={createAssessmentMutation.isPending}
                className="flex-1"
              >
                {createAssessmentMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {workoutSplitsText.preAssessment.buttonGenerating}
                  </>
                ) : (
                  workoutSplitsText.preAssessment.buttonGenerate
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
