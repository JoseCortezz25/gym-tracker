import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Auth Layout
 * Centered card layout for authentication pages (login, register, password recovery)
 * Mobile-first responsive design with max-width constraints
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 dark:bg-gray-950">
      <div className="w-full max-w-[420px]">
        {/* App Branding */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Gym Tracker
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Track your progress, achieve your goals
          </p>
        </div>

        {/* Auth Form Card */}
        <Card className="shadow-lg">
          <CardContent className="p-6 sm:p-8">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
