'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { PasswordInput } from '@/domains/auth/molecules/password-input';
import { PasswordRequirements } from '@/domains/auth/molecules/password-requirements';
import { authTextMap } from '@/domains/auth/auth.text-map';
import { registerSchema, type RegisterInput } from '@/domains/auth/schema';
import { registerUser } from '@/domains/auth/actions';

/**
 * Register Page
 * Account creation page for new users
 */
export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterInput) => {
    try {
      setError(null);
      const result = await registerUser(data);

      if (!result.success) {
        setError(result.error);
        return;
      }

      // Redirect to dashboard on success
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          {authTextMap.register.heading}
        </h2>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <p className="text-sm">{error}</p>
        </Alert>
      )}

      {/* Register Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        role="form"
        aria-label="Register form"
      >
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">{authTextMap.register.email.label}</Label>
          <Input
            {...register('email')}
            id="email"
            type="email"
            placeholder={authTextMap.register.email.placeholder}
            autoComplete="email"
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Name Field (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="name">Name (Optional)</Label>
          <Input
            {...register('name')}
            id="name"
            type="text"
            placeholder="Enter your name"
            autoComplete="name"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">
            {authTextMap.register.password.label}
          </Label>
          <PasswordInput
            {...register('password')}
            id="password"
            placeholder={authTextMap.register.password.placeholder}
            autoComplete="new-password"
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby="password-requirements"
          />
          {errors.password && (
            <p className="text-sm text-red-600 dark:text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Password Requirements */}
        <div id="password-requirements">
          <PasswordRequirements password={password || ''} />
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            {authTextMap.register.confirmPassword.label}
          </Label>
          <PasswordInput
            {...register('confirmPassword')}
            id="confirmPassword"
            placeholder={authTextMap.register.confirmPassword.placeholder}
            autoComplete="new-password"
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 dark:text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : authTextMap.register.submit}
        </Button>

        {/* Login Link */}
        <div className="space-y-2 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {authTextMap.register.hasAccount}{' '}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-500 dark:hover:text-blue-400"
            >
              {authTextMap.register.login}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
