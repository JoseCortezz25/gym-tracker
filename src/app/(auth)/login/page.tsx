'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert } from '@/components/ui/alert';
import { PasswordInput } from '@/domains/auth/molecules/password-input';
import { authTextMap } from '@/domains/auth/auth.text-map';
import { loginSchema, type LoginInput } from '@/domains/auth/schema';
import { loginUser } from '@/domains/auth/actions';

/**
 * Login Page
 * Authentication page for existing users
 */
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setError(null);
      const result = await loginUser(data);

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
          {authTextMap.login.heading}
        </h2>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <p className="text-sm">{error}</p>
        </Alert>
      )}

      {/* Login Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        role="form"
        aria-label="Login form"
      >
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">{authTextMap.login.email.label}</Label>
          <Input
            {...register('email')}
            id="email"
            type="email"
            placeholder={authTextMap.login.email.placeholder}
            autoComplete="email"
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">{authTextMap.login.password.label}</Label>
          <PasswordInput
            {...register('password')}
            id="password"
            placeholder={authTextMap.login.password.placeholder}
            autoComplete="current-password"
            aria-invalid={errors.password ? 'true' : 'false'}
          />
          {errors.password && (
            <p className="text-sm text-red-600 dark:text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" {...register('rememberMe')} />
          <Label
            htmlFor="remember"
            className="text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {authTextMap.login.rememberMe.label}
          </Label>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : authTextMap.login.submit}
        </Button>

        {/* Forgot Password Link */}
        <div className="text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-500 dark:hover:text-blue-400"
          >
            {authTextMap.login.forgotPassword}
          </Link>
        </div>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
              or
            </span>
          </div>
        </div>

        {/* Register Link */}
        <div className="space-y-2 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {authTextMap.login.noAccount}
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/register">{authTextMap.login.register}</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
