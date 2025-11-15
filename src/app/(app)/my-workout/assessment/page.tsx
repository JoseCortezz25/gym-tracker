/**
 * Pre-Assessment Page
 *
 * Page for users to complete their workout assessment.
 * Client Component with form handling.
 */

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { PreAssessmentForm } from '@/domains/workout-splits/components/organisms/pre-assessment-form';
import { workoutSplitsText } from '@/domains/workout-splits/workout-splits.text-map';

export const metadata = {
  title: workoutSplitsText.preAssessment.title,
  description: workoutSplitsText.preAssessment.subtitle
};

export default async function AssessmentPage() {
  // 1. Verify authentication
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">
          {workoutSplitsText.preAssessment.title}
        </h1>
        <p className="text-muted-foreground">
          {workoutSplitsText.preAssessment.subtitle}
        </p>
      </div>

      <PreAssessmentForm />
    </div>
  );
}
