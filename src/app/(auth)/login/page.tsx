'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { PasswordInput } from '@/domains/auth/molecules/password-input';
import { authTextMap } from '@/domains/auth/auth.text-map';

/**
 * Login Page
 * Authentication page for existing users
 * UI-only implementation (no business logic)
 */
export default function LoginPage() {
  // Placeholder handlers (UI-only phase)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Business logic will be added in Phase 2
    // eslint-disable-next-line no-console
    console.log('Login form submitted');
  };

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          {authTextMap.login.heading}
        </h2>
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        role="form"
        aria-label="Login form"
      >
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">{authTextMap.login.email.label}</Label>
          <Input
            id="email"
            type="email"
            placeholder={authTextMap.login.email.placeholder}
            autoComplete="email"
            required
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">{authTextMap.login.password.label}</Label>
          <PasswordInput
            id="password"
            placeholder={authTextMap.login.password.placeholder}
            autoComplete="current-password"
            required
          />
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label
            htmlFor="remember"
            className="text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {authTextMap.login.rememberMe.label}
          </Label>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          {authTextMap.login.submit}
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
