'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/domains/auth/molecules/password-input';
import { PasswordRequirements } from '@/domains/auth/molecules/password-requirements';
import { authTextMap } from '@/domains/auth/auth.text-map';

/**
 * Register Page
 * Account creation page for new users
 * UI-only implementation (no business logic)
 */
export default function RegisterPage() {
  const [password, setPassword] = useState('');

  // Placeholder handler (UI-only phase)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Business logic will be added in Phase 2
    // eslint-disable-next-line no-console
    console.log('Register form submitted');
  };

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          {authTextMap.register.heading}
        </h2>
      </div>

      {/* Register Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        role="form"
        aria-label="Register form"
      >
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">{authTextMap.register.email.label}</Label>
          <Input
            id="email"
            type="email"
            placeholder={authTextMap.register.email.placeholder}
            autoComplete="email"
            required
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">
            {authTextMap.register.password.label}
          </Label>
          <PasswordInput
            id="password"
            placeholder={authTextMap.register.password.placeholder}
            autoComplete="new-password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
            aria-describedby="password-requirements"
          />
        </div>

        {/* Password Requirements */}
        <div id="password-requirements">
          <PasswordRequirements password={password} />
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirm-password">
            {authTextMap.register.confirmPassword.label}
          </Label>
          <PasswordInput
            id="confirm-password"
            placeholder={authTextMap.register.confirmPassword.placeholder}
            autoComplete="new-password"
            required
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          {authTextMap.register.submit}
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
