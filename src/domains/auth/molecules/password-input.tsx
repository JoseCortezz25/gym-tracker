'use client';

import { forwardRef, useState } from 'react';
import type { ComponentProps } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface PasswordInputProps
  extends Omit<ComponentProps<'input'>, 'type'> {
  /**
   * ID for the input element (required for accessibility)
   */
  id: string;
}

/**
 * Password Input Molecule
 * Composes Input component with show/hide password toggle
 * Used in login, register, and password recovery flows
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ id, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(prev => !prev);
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          id={id}
          type={showPassword ? 'text' : 'password'}
          className={className}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-500" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500" aria-hidden="true" />
          )}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
