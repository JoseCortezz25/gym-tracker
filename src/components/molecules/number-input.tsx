'use client';

import { forwardRef } from 'react';
import type { ComponentProps } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface NumberInputProps
  extends Omit<ComponentProps<'input'>, 'type' | 'onChange'> {
  /**
   * Current value
   */
  value?: number | string;
  /**
   * Callback when value changes
   */
  onChange?: (value: number) => void;
  /**
   * Minimum allowed value
   */
  min?: number;
  /**
   * Maximum allowed value
   */
  max?: number;
  /**
   * Step increment/decrement amount
   */
  step?: number;
  /**
   * ID for accessibility
   */
  id: string;
}

/**
 * Number Input Molecule
 * Input with +/- buttons for quick adjustments
 * Optimized for touch targets (56px buttons)
 * Used for weight and reps in active workout
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    { id, value = 0, onChange, min = 0, max, step = 1, className, ...props },
    ref
  ) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;

    const handleIncrement = () => {
      const newValue = numValue + step;
      if (max !== undefined && newValue > max) return;
      onChange?.(newValue);
    };

    const handleDecrement = () => {
      const newValue = numValue - step;
      if (newValue < min) return;
      onChange?.(newValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value) || 0;
      if (max !== undefined && newValue > max) return;
      if (newValue < min) return;
      onChange?.(newValue);
    };

    return (
      <div className="flex items-center gap-2">
        {/* Decrement Button */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-14 w-14 shrink-0"
          onClick={handleDecrement}
          disabled={numValue <= min}
          aria-label={`Decrease ${props['aria-label'] || 'value'}`}
        >
          <Minus className="h-5 w-5" aria-hidden="true" />
        </Button>

        {/* Number Input */}
        <Input
          ref={ref}
          id={id}
          type="number"
          value={numValue}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          className={`h-14 text-center text-lg font-semibold ${className || ''}`}
          {...props}
        />

        {/* Increment Button */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-14 w-14 shrink-0"
          onClick={handleIncrement}
          disabled={max !== undefined && numValue >= max}
          aria-label={`Increase ${props['aria-label'] || 'value'}`}
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';
