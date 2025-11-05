'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authTextMap } from '@/domains/auth/auth.text-map';

/**
 * Password Recovery Page
 * Allows users to request a password reset via email
 * UI-only implementation (no business logic)
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Placeholder handlers (UI-only phase)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Business logic will be added in Phase 2
    // eslint-disable-next-line no-console
    console.log('Password recovery requested for:', email);
    setIsSubmitted(true);
  };

  const handleResend = () => {
    // Business logic will be added in Phase 2
    // eslint-disable-next-line no-console
    console.log('Resend requested for:', email);
  };

  // Success State - Email Sent
  if (isSubmitted) {
    return (
      <div className="space-y-6">
        {/* Success Message */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Mail
              className="h-6 w-6 text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            {authTextMap.passwordRecovery.success.heading}
          </h2>
        </div>

        {/* Email Confirmation */}
        <Alert>
          <AlertDescription className="text-center">
            <p className="mb-2 text-gray-700 dark:text-gray-300">
              {authTextMap.passwordRecovery.success.message}
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-50">
              {email}
            </p>
          </AlertDescription>
        </Alert>

        {/* Resend Option */}
        <div className="text-center">
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            {authTextMap.passwordRecovery.success.notReceived}
          </p>
          <Button
            variant="link"
            onClick={handleResend}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400"
          >
            {authTextMap.passwordRecovery.success.resend}
          </Button>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-500 dark:hover:text-blue-400"
          >
            <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
            {authTextMap.passwordRecovery.backToLogin}
          </Link>
        </div>
      </div>
    );
  }

  // Default State - Request Form
  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          {authTextMap.passwordRecovery.heading}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {authTextMap.passwordRecovery.instructions}
        </p>
      </div>

      {/* Password Recovery Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        role="form"
        aria-label="Password recovery form"
      >
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">
            {authTextMap.passwordRecovery.email.label}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={authTextMap.passwordRecovery.email.placeholder}
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          {authTextMap.passwordRecovery.submit}
        </Button>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-500 dark:hover:text-blue-400"
          >
            <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
            {authTextMap.passwordRecovery.backToLogin}
          </Link>
        </div>
      </form>
    </div>
  );
}
