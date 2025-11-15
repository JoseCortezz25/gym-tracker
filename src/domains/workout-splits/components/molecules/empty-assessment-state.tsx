/**
 * Empty Assessment State Component
 *
 * Displayed when user has no active workout assessment.
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { workoutSplitsText } from '../../workout-splits.text-map';

export function EmptyAssessmentState() {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {workoutSplitsText.dashboard.emptyTitle}
        </CardTitle>
        <CardDescription>
          {workoutSplitsText.dashboard.emptyDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button asChild size="lg">
          <Link href="/my-workout/assessment">
            {workoutSplitsText.dashboard.emptyButton}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
