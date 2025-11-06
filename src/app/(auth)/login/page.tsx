import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert } from '@/components/ui/alert';
import { PasswordInput } from '@/domains/auth/molecules/password-input';
import { authTextMap } from '@/domains/auth/auth.text-map';
import { loginUser } from '@/domains/auth/actions';

/**
 * Login Page - Server Component
 * Simple 2-field form using Server Actions (following critical-constraints.md #1)
 */
export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;

  async function handleLogin(formData: FormData) {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await loginUser({ email, password });

    if (!result.success) {
      // Redirect with error message
      redirect(`/login?error=${encodeURIComponent(result.error)}`);
    }

    // Success - redirect to dashboard
    redirect('/dashboard');
  }

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
        action={handleLogin}
        className="space-y-4"
        role="form"
        aria-label="Login form"
      >
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">{authTextMap.login.email.label}</Label>
          <Input
            id="email"
            name="email"
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
            name="password"
            placeholder={authTextMap.login.password.placeholder}
            autoComplete="current-password"
            required
          />
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
