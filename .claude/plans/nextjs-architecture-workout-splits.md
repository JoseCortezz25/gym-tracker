# Workout Splits System - Next.js 15 Architecture Plan

**Created**: 2025-11-13
**Session**: `workout-splits-20251113_200040`
**Type**: Next.js App Router Architecture
**Complexity**: High

## 1. Feature Overview

**Feature**: Workout Splits & Training Division System Refactoring
**Purpose**: Replace the current routine system with a comprehensive workout splits system including pre-assessment, workout divisions, habit tracking calendar, and detailed exercise tracking with weight history.

**User Flow**:
1. New user completes pre-assessment (frequency + training focus)
2. System generates workout splits based on assessment
3. User lands on "My Workout" dashboard showing all splits
4. User selects a workout split to view exercises
5. User tracks each exercise with sets, reps, weights, and notes
6. User completes workout and advances to next split
7. Calendar shows training history and habit tracking

---

## 2. Routing Structure

### 2.1 New Routes to Create

#### Route: `/my-workout`

**File**: `app/(app)/my-workout/page.tsx`
**Type**: Server Component (default)
**Purpose**: Main dashboard showing all workout splits, current/next workout, and calendar widget
**Dynamic**: No
**Layout Needed**: No (uses existing `(app)` layout)
**Route Group**: `(app)` (authenticated routes)
**Why**: Part of the authenticated app experience, shares header/sidebar with existing routes

**Server Component Rationale**:
- Fetches user's workout splits directly from database
- Renders initial state server-side for SEO and performance
- Passes data to client components for interactivity (calendar widget, completion indicators)

**Data Fetching Strategy**:
```typescript
// ✅ Server Component - Direct data fetch
export default async function MyWorkoutPage() {
  const session = await auth();
  const workoutSplits = await getWorkoutSplitsRepository().findByUserId(session.user.id);
  const completionHistory = await getWorkoutHistoryRepository().findRecentByUserId(session.user.id);

  return (
    <Suspense fallback={<WorkoutSplitsSkeleton />}>
      <WorkoutSplitsView
        splits={workoutSplits}
        completionHistory={completionHistory}
      />
    </Suspense>
  );
}
```

**Client Components Needed**:
- `<WorkoutSplitCard />` - Interactive card showing split status, completion indicator
- `<CalendarWidget />` - Habit tracking calendar (needs client-side date selection, hover states)
- `<NextWorkoutCTA />` - "Start Workout" button with loading state

---

#### Route: `/my-workout/assessment`

**File**: `app/(app)/my-workout/assessment/page.tsx`
**Type**: Client Component (needs form interactivity)
**Purpose**: Pre-assessment flow for new users (frequency + training focus selection)
**Dynamic**: No
**Layout Needed**: No
**Route Group**: `(app)`

**Why Client Component**:
- Multi-step form with local state management
- Form validation and error handling
- Interactive frequency/focus selection (button groups, radio groups)
- Progress indicator between steps

**Data Flow**:
```typescript
'use client';

import { useActionState } from 'react';
import { createWorkoutSplitsFromAssessment } from '@/domains/workout-splits/actions';

export default function AssessmentPage() {
  const [state, formAction] = useActionState(createWorkoutSplitsFromAssessment, null);
  const [currentStep, setCurrentStep] = useState(1);

  // Form state for frequency and training focus
  // Submit calls Server Action to generate splits
}
```

**Server Action Integration**:
- `createWorkoutSplitsFromAssessment(formData)` - Generates splits based on assessment
- Validates session
- Creates WorkoutSplit entities
- Redirects to `/my-workout` upon completion

---

#### Route: `/my-workout/splits/[splitId]`

**File**: `app/(app)/my-workout/splits/[splitId]/page.tsx`
**Type**: Server Component with Client Components for interactivity
**Purpose**: Workout split detail view showing exercises with checkboxes
**Dynamic**: Yes (dynamic segment: `[splitId]`)
**Layout Needed**: No
**Route Group**: `(app)`

**Server Component Rationale**:
- Fetches workout split details and exercises from database
- Renders exercise list server-side
- SEO-friendly for sharing workout splits

**Data Fetching Strategy**:
```typescript
// ✅ Server Component - Direct data fetch
export default async function WorkoutSplitDetailPage({
  params
}: {
  params: { splitId: string }
}) {
  const session = await auth();
  const workoutSplit = await getWorkoutSplitsRepository().findById(params.splitId);

  // Authorization check
  if (workoutSplit.userId !== session.user.id) {
    redirect('/my-workout');
  }

  const exercises = await getExercisesRepository().findBySplitId(params.splitId);

  return (
    <Suspense fallback={<ExerciseListSkeleton />}>
      <WorkoutSplitHeader split={workoutSplit} />
      <ExerciseChecklistView
        exercises={exercises}
        splitId={params.splitId}
      />
      <FinalizeWorkoutButton splitId={params.splitId} />
    </Suspense>
  );
}
```

**Client Components Needed**:
- `<ExerciseChecklistItem />` - Checkbox for each exercise (optimistic updates)
- `<FinalizeWorkoutButton />` - Validates all exercises checked, calls Server Action
- `<WorkoutProgressBar />` - Shows completion percentage

**Server Actions**:
- `toggleExerciseCompletion(exerciseId, isCompleted)` - Mark exercise as done
- `finalizeWorkout(splitId)` - Validates completion, records date, advances to next split

---

#### Route: `/my-workout/splits/[splitId]/exercises/[exerciseId]`

**File**: `app/(app)/my-workout/splits/[splitId]/exercises/[exerciseId]/page.tsx`
**Type**: Server Component with Client Components for weight tracking
**Purpose**: Exercise detail view with description, video, sets/reps, weight input, history
**Dynamic**: Yes (dynamic segments: `[splitId]`, `[exerciseId]`)
**Layout Needed**: No
**Route Group**: `(app)`

**Server Component Rationale**:
- Fetches exercise details (description, video, image)
- Fetches weight history from previous sessions
- SEO-friendly for exercise catalog

**Data Fetching Strategy**:
```typescript
// ✅ Server Component - Direct data fetch
export default async function ExerciseDetailPage({
  params
}: {
  params: { splitId: string; exerciseId: string }
}) {
  const session = await auth();

  const [exercise, weightHistory] = await Promise.all([
    getExercisesRepository().findById(params.exerciseId),
    getWeightHistoryRepository().findByExerciseAndUser(params.exerciseId, session.user.id)
  ]);

  return (
    <Suspense fallback={<ExerciseDetailSkeleton />}>
      <ExerciseHeader exercise={exercise} />
      <ExerciseMedia videoUrl={exercise.videoUrl} imageUrl={exercise.imageUrl} />
      <SetRepsDisplay sets={exercise.sets} reps={exercise.reps} />
      <WeightInputForm exerciseId={params.exerciseId} />
      <WeightHistoryChart data={weightHistory} />
    </Suspense>
  );
}
```

**Client Components Needed**:
- `<ExerciseMedia />` - YouTube video embed (needs client-side video player)
- `<WeightInputForm />` - Input for current session weight (form state, validation)
- `<WeightHistoryChart />` - Line chart showing weight progression (interactive chart library)

**Server Actions**:
- `recordWeightForExercise(exerciseId, weight, date)` - Records weight for current session
- Validates session and authorization

---

#### Route: `/my-workout/calendar` (Optional - Separate Calendar View)

**File**: `app/(app)/my-workout/calendar/page.tsx`
**Type**: Server Component with Client Calendar Component
**Purpose**: Full-page calendar view showing workout completion history (habit tracker)
**Dynamic**: No
**Layout Needed**: No
**Route Group**: `(app)`

**Note**: This route is OPTIONAL. The calendar widget may be sufficient on the main `/my-workout` page. If users need a detailed calendar view, create this route.

**Data Fetching Strategy**:
```typescript
// ✅ Server Component - Direct data fetch
export default async function WorkoutCalendarPage() {
  const session = await auth();
  const completionHistory = await getWorkoutHistoryRepository().findByUserId(session.user.id);

  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <CalendarView completionHistory={completionHistory} />
    </Suspense>
  );
}
```

**Client Component Needed**:
- `<CalendarView />` - Full calendar with date selection, hover states, modal for day details

---

### 2.2 Existing Routes to Modify

#### Route: `/dashboard`

**File**: `app/(app)/dashboard/page.tsx`
**Change**: Update "Train Today" section to link to `/my-workout` instead of `/workout/active`
**Reason**: New workout splits system replaces the old routine-based workflow

**Modification**:
```typescript
// OLD:
<Link href="/workout/active">{text.trainToday.button}</Link>

// NEW:
<Link href="/my-workout">{text.trainToday.button}</Link>
```

**Additional Change**: Update dashboard stats to show:
- Current workout split (instead of "active routine")
- Next workout split to perform
- Weekly workout completion (from calendar data)

---

#### Route: `/workout/active` (Potentially Deprecated)

**File**: `app/(app)/workout/active/page.tsx`
**Change**: Consider deprecating this route or refactoring to work with new workout splits
**Decision Required**: Confirm with business analyst and domain architect

**Options**:
1. **Keep and Refactor**: Update to work with workout splits instead of routines
2. **Deprecate**: Redirect to `/my-workout/splits/[splitId]` when user starts a workout
3. **Hybrid**: Use for ad-hoc workouts, `/my-workout` for split-based training

**Recommendation**: Wait for domain architect's plan before making final decision.

---

## 3. Server Component Architecture

### 3.1 Page Components (Server Components by default)

#### `/my-workout/page.tsx` (Server Component)

**File**: `app/(app)/my-workout/page.tsx`
**Component Type**: ✅ Server Component (NO "use client")

```typescript
// ✅ Server Component - can fetch data directly
import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { getWorkoutSplitsRepository } from '@/domains/workout-splits/repositories';
import { getWorkoutHistoryRepository } from '@/domains/workout-history/repositories';
import { WorkoutSplitsView } from '@/domains/workout-splits/components/organisms/workout-splits-view';
import { WorkoutSplitsSkeleton } from '@/domains/workout-splits/components/molecules/workout-splits-skeleton';

// ✅ Can be async
export default async function MyWorkoutPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // ✅ Direct data fetching in Server Component
  const [workoutSplits, completionHistory] = await Promise.all([
    getWorkoutSplitsRepository().findByUserId(session.user.id),
    getWorkoutHistoryRepository().findRecentByUserId(session.user.id, 30)
  ]);

  // Check if user needs to complete pre-assessment
  if (!workoutSplits || workoutSplits.length === 0) {
    redirect('/my-workout/assessment');
  }

  return (
    <div className="space-y-8">
      <h1>My Workout</h1>

      {/* ✅ Suspense for async children */}
      <Suspense fallback={<WorkoutSplitsSkeleton />}>
        <WorkoutSplitsView
          splits={workoutSplits}
          completionHistory={completionHistory}
        />
      </Suspense>
    </div>
  );
}

// ✅ Metadata for SEO
export const metadata: Metadata = {
  title: 'My Workout - Gym Tracker',
  description: 'Track your workout splits and training progress',
};
```

**Data Fetching**: ✅ Direct in Server Component
**Why Server Component**:
- SEO benefits (workout splits are indexable)
- Direct database access via repository pattern
- No client-side loading states for initial data
- Faster initial page load

---

#### `/my-workout/splits/[splitId]/page.tsx` (Server Component)

**File**: `app/(app)/my-workout/splits/[splitId]/page.tsx`
**Component Type**: ✅ Server Component (NO "use client")

```typescript
// ✅ Server Component - direct fetch
import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { getWorkoutSplitsRepository } from '@/domains/workout-splits/repositories';
import { getExercisesRepository } from '@/domains/exercises/repositories';
import { WorkoutSplitHeader } from '@/domains/workout-splits/components/organisms/workout-split-header';
import { ExerciseChecklistView } from '@/domains/workout-splits/components/organisms/exercise-checklist-view';
import { ExerciseListSkeleton } from '@/domains/workout-splits/components/molecules/exercise-list-skeleton';

export default async function WorkoutSplitDetailPage({
  params
}: {
  params: { splitId: string }
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // ✅ Direct data fetching
  const workoutSplit = await getWorkoutSplitsRepository().findById(params.splitId);

  // Authorization check
  if (!workoutSplit || workoutSplit.userId !== session.user.id) {
    notFound(); // 404 page
  }

  const exercises = await getExercisesRepository().findBySplitId(params.splitId);

  return (
    <div className="space-y-6">
      <WorkoutSplitHeader split={workoutSplit} />

      <Suspense fallback={<ExerciseListSkeleton />}>
        <ExerciseChecklistView
          exercises={exercises}
          splitId={params.splitId}
        />
      </Suspense>
    </div>
  );
}

// ✅ Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const split = await getWorkoutSplitsRepository().findById(params.splitId);

  return {
    title: `${split.name} - My Workout`,
    description: `${split.exerciseCount} exercises in ${split.name}`,
  };
}
```

**Data Fetching**: ✅ Direct in Server Component
**Why Server Component**:
- Dynamic route with server-side data fetching
- Authorization check server-side
- SEO-friendly (split details indexable)

---

#### `/my-workout/splits/[splitId]/exercises/[exerciseId]/page.tsx` (Server Component)

**File**: `app/(app)/my-workout/splits/[splitId]/exercises/[exerciseId]/page.tsx`
**Component Type**: ✅ Server Component (NO "use client")

```typescript
// ✅ Server Component - direct fetch
import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { getExercisesRepository } from '@/domains/exercises/repositories';
import { getWeightHistoryRepository } from '@/domains/weight-history/repositories';
import { ExerciseDetailView } from '@/domains/exercises/components/organisms/exercise-detail-view';
import { ExerciseDetailSkeleton } from '@/domains/exercises/components/molecules/exercise-detail-skeleton';

export default async function ExerciseDetailPage({
  params
}: {
  params: { splitId: string; exerciseId: string }
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // ✅ Parallel data fetching
  const [exercise, weightHistory] = await Promise.all([
    getExercisesRepository().findById(params.exerciseId),
    getWeightHistoryRepository().findByExerciseAndUser(
      params.exerciseId,
      session.user.id,
      { limit: 10 }
    )
  ]);

  if (!exercise) {
    notFound();
  }

  return (
    <Suspense fallback={<ExerciseDetailSkeleton />}>
      <ExerciseDetailView
        exercise={exercise}
        weightHistory={weightHistory}
        splitId={params.splitId}
      />
    </Suspense>
  );
}

// ✅ Dynamic metadata with exercise details
export async function generateMetadata({ params }): Promise<Metadata> {
  const exercise = await getExercisesRepository().findById(params.exerciseId);

  return {
    title: `${exercise.name} - Exercise Details`,
    description: exercise.description,
  };
}
```

**Data Fetching**: ✅ Direct in Server Component
**Why Server Component**:
- Exercise details are SEO-friendly
- Direct database access for exercise data and weight history
- Faster initial load with server-rendered content

---

### 3.2 Client Components (when necessary)

#### `<WorkoutSplitCard />` (Client Component)

**File**: `app/(app)/my-workout/_components/workout-split-card.tsx` OR `src/domains/workout-splits/components/molecules/workout-split-card.tsx`
**Component Type**: ❌ Client Component (needs "use client")

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { cn } from '@/lib/class-names';

interface WorkoutSplitCardProps {
  split: {
    id: string;
    name: string;
    exerciseCount: number;
    isCompleted: boolean;
    isCurrent: boolean;
  };
}

export function WorkoutSplitCard({ split }: WorkoutSplitCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/my-workout/splits/${split.id}`}
      className={cn(
        "block p-6 rounded-lg border-2 transition-all",
        split.isCompleted && "border-green-500 bg-green-50",
        split.isCurrent && "border-blue-500 bg-blue-50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{split.name}</h3>
          <p className="text-sm text-gray-600">{split.exerciseCount} exercises</p>
        </div>

        {split.isCompleted && (
          <Check className="h-6 w-6 text-green-600" />
        )}
      </div>

      {split.isCurrent && (
        <div className="mt-4">
          <span className="text-sm font-medium text-blue-600">Next Workout</span>
        </div>
      )}
    </Link>
  );
}
```

**Why Client Component**:
- [x] Event handlers (onMouseEnter, onMouseLeave for hover effect)
- [x] Uses useState for hover state
- [x] Interactive card with visual feedback

**Note**: Keep as leaf node - receives data from parent Server Component.

---

#### `<CalendarWidget />` (Client Component)

**File**: `src/domains/workout-history/components/organisms/calendar-widget.tsx`
**Component Type**: ❌ Client Component (needs "use client")

```typescript
'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import type { WorkoutCompletionHistory } from '@/domains/workout-history/types';

interface CalendarWidgetProps {
  completionHistory: WorkoutCompletionHistory[];
}

export function CalendarWidget({ completionHistory }: CalendarWidgetProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Mark dates with completed workouts
  const completedDates = completionHistory.map(h => new Date(h.completedAt));

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Training Calendar</h3>

      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        modifiers={{
          completed: completedDates
        }}
        modifiersStyles={{
          completed: {
            backgroundColor: 'var(--color-green-100)',
            color: 'var(--color-green-800)',
            fontWeight: 'bold'
          }
        }}
      />

      {selectedDate && (
        <div className="mt-4">
          {/* Show workout details for selected date */}
        </div>
      )}
    </div>
  );
}
```

**Why Client Component**:
- [x] Uses useState for selected date
- [x] Interactive calendar with date selection
- [x] Event handlers for date clicks

---

#### `<ExerciseChecklistItem />` (Client Component)

**File**: `src/domains/workout-splits/components/molecules/exercise-checklist-item.tsx`
**Component Type**: ❌ Client Component (needs "use client")

```typescript
'use client';

import { useState, useTransition } from 'react';
import { Check } from 'lucide-react';
import { toggleExerciseCompletion } from '@/domains/workout-splits/actions';
import { cn } from '@/lib/class-names';

interface ExerciseChecklistItemProps {
  exercise: {
    id: string;
    name: string;
    sets: number;
    reps: number;
    isCompleted: boolean;
  };
  splitId: string;
}

export function ExerciseChecklistItem({ exercise, splitId }: ExerciseChecklistItemProps) {
  // Optimistic UI state
  const [isCompleted, setIsCompleted] = useState(exercise.isCompleted);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    // Optimistic update
    setIsCompleted(!isCompleted);

    // Server Action call
    startTransition(async () => {
      try {
        await toggleExerciseCompletion(exercise.id, !isCompleted);
      } catch (error) {
        // Revert optimistic update on error
        setIsCompleted(isCompleted);
      }
    });
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all",
        isCompleted && "bg-green-50 border-green-500",
        isPending && "opacity-50"
      )}
      onClick={handleToggle}
    >
      <div
        className={cn(
          "w-6 h-6 rounded border-2 flex items-center justify-center",
          isCompleted ? "bg-green-600 border-green-600" : "border-gray-300"
        )}
      >
        {isCompleted && <Check className="h-4 w-4 text-white" />}
      </div>

      <div className="flex-1">
        <h4 className="font-medium">{exercise.name}</h4>
        <p className="text-sm text-gray-600">{exercise.sets} sets × {exercise.reps} reps</p>
      </div>
    </div>
  );
}
```

**Why Client Component**:
- [x] Uses useState for optimistic UI
- [x] Uses useTransition for Server Action
- [x] Event handlers (onClick)
- [x] Interactive checkbox with visual feedback

---

#### `<WeightInputForm />` (Client Component)

**File**: `src/domains/exercises/components/molecules/weight-input-form.tsx`
**Component Type**: ❌ Client Component (needs "use client")

```typescript
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { recordWeightForExercise } from '@/domains/weight-history/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Weight'}
    </Button>
  );
}

interface WeightInputFormProps {
  exerciseId: string;
}

export function WeightInputForm({ exerciseId }: WeightInputFormProps) {
  const [state, formAction] = useActionState(recordWeightForExercise, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="exerciseId" value={exerciseId} />

      <div>
        <Label htmlFor="weight">Weight (lbs)</Label>
        <Input
          id="weight"
          name="weight"
          type="number"
          step="0.1"
          required
        />
      </div>

      <SubmitButton />

      {state?.message && (
        <p className={state.success ? "text-green-600" : "text-red-600"}>
          {state.message}
        </p>
      )}
    </form>
  );
}
```

**Why Client Component**:
- [x] Uses useActionState for Server Action
- [x] Uses useFormStatus for pending state
- [x] Form with client-side interactivity

---

#### `<FinalizeWorkoutButton />` (Client Component)

**File**: `src/domains/workout-splits/components/molecules/finalize-workout-button.tsx`
**Component Type**: ❌ Client Component (needs "use client")

```typescript
'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { finalizeWorkout } from '@/domains/workout-splits/actions';
import { Button } from '@/components/ui/button';

interface FinalizeWorkoutButtonProps {
  splitId: string;
  allExercisesCompleted: boolean;
}

export function FinalizeWorkoutButton({
  splitId,
  allExercisesCompleted
}: FinalizeWorkoutButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleFinalize = () => {
    startTransition(async () => {
      const result = await finalizeWorkout(splitId);

      if (result.success) {
        router.push('/my-workout');
      }
    });
  };

  return (
    <Button
      size="lg"
      onClick={handleFinalize}
      disabled={!allExercisesCompleted || isPending}
      className="w-full"
    >
      {isPending ? 'Finalizing...' : 'Finalize Workout'}
    </Button>
  );
}
```

**Why Client Component**:
- [x] Uses useTransition for Server Action
- [x] Uses useRouter for navigation
- [x] Event handlers (onClick)
- [x] Client-side validation (disabled state)

---

## 4. Layouts and Templates

### Root Layout (no modifications needed)

**File**: `app/layout.tsx`
**Type**: Server Component
**Changes**: None required for workout splits feature

The existing root layout handles:
- HTML structure
- Global styles
- Metadata
- Providers (React Query, Auth, etc.)

---

### App Layout (existing - no modifications)

**File**: `app/(app)/layout.tsx`
**Type**: Client Component (existing)
**Changes**: None required

The existing `(app)` layout provides:
- Header with navigation
- Sidebar (desktop)
- Sheet drawer (mobile)
- Main content area

All new workout split routes will inherit this layout.

---

### Nested Layout (NOT NEEDED)

**Decision**: Do NOT create a nested layout for `/my-workout/*` routes.

**Reason**:
- All routes share the same `(app)` layout
- No unique UI elements needed across all workout split routes
- Avoid unnecessary layout nesting

---

## 5. Loading and Error States

### Loading UI

#### `/my-workout/loading.tsx`

**File**: `app/(app)/my-workout/loading.tsx`
**Purpose**: Streaming loading state for main workout page

```typescript
// ✅ Server Component
import { WorkoutSplitsSkeleton } from '@/domains/workout-splits/components/molecules/workout-splits-skeleton';

export default function MyWorkoutLoading() {
  return (
    <div className="space-y-8">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" /> {/* Title skeleton */}
      <WorkoutSplitsSkeleton />
    </div>
  );
}
```

**When shown**: While `page.tsx` is loading (automatic with Suspense)

---

#### `/my-workout/splits/[splitId]/loading.tsx`

**File**: `app/(app)/my-workout/splits/[splitId]/loading.tsx`
**Purpose**: Loading state for split detail page

```typescript
// ✅ Server Component
import { ExerciseListSkeleton } from '@/domains/workout-splits/components/molecules/exercise-list-skeleton';

export default function WorkoutSplitDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
      <ExerciseListSkeleton />
    </div>
  );
}
```

---

#### `/my-workout/splits/[splitId]/exercises/[exerciseId]/loading.tsx`

**File**: `app/(app)/my-workout/splits/[splitId]/exercises/[exerciseId]/loading.tsx`
**Purpose**: Loading state for exercise detail page

```typescript
// ✅ Server Component
import { ExerciseDetailSkeleton } from '@/domains/exercises/components/molecules/exercise-detail-skeleton';

export default function ExerciseDetailLoading() {
  return <ExerciseDetailSkeleton />;
}
```

---

### Error Boundary

#### `/my-workout/error.tsx`

**File**: `app/(app)/my-workout/error.tsx`
**Purpose**: Catch and handle errors in workout split routes

```typescript
'use client'; // ❌ Must be Client Component

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

export default function MyWorkoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('My Workout Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="max-w-md space-y-4 text-center">
        <Alert variant="destructive">
          <h2 className="text-lg font-semibold">Something went wrong!</h2>
          <p className="mt-2">{error.message || 'Failed to load workout data.'}</p>
        </Alert>

        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
```

---

#### `/my-workout/splits/[splitId]/error.tsx`

**File**: `app/(app)/my-workout/splits/[splitId]/error.tsx`
**Purpose**: Error boundary for split detail pages

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

export default function WorkoutSplitDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Workout Split Error:', error);
  }, [error]);

  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <h2 className="text-lg font-semibold">Failed to load workout split</h2>
        <p className="mt-2">{error.message}</p>
      </Alert>

      <div className="flex gap-4">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" onClick={() => router.push('/my-workout')}>
          Back to My Workout
        </Button>
      </div>
    </div>
  );
}
```

---

## 6. Data Fetching Strategy

### Server Component Fetch (Preferred - Default Strategy)

**All page routes use direct Server Component fetching via Repository Pattern**:

```typescript
// ✅ Direct fetch in Server Component
export default async function MyWorkoutPage() {
  const session = await auth();

  // ✅ Repository pattern (NO direct database imports in pages)
  const splits = await getWorkoutSplitsRepository().findByUserId(session.user.id);

  return <WorkoutSplitsView splits={splits} />;
}
```

**Cache Strategy**:
- **Default**: `force-cache` (cache indefinitely for static data)
- **Dynamic routes**: `no-store` (fresh on every request)
- **Revalidation**: Use `revalidate: 60` for data that changes occasionally

**Example with cache control**:
```typescript
export const revalidate = 60; // Revalidate every 60 seconds

export default async function MyWorkoutPage() {
  const splits = await fetch(`/api/workout-splits`, {
    cache: 'no-store' // Always fresh data
  });

  return <WorkoutSplitsView splits={splits} />;
}
```

---

### Client Component Fetch (when needed - NOT for this feature)

**NOTE**: For the workout splits feature, we do NOT need client-side data fetching with React Query. All data is fetched server-side.

**React Query is NOT needed for**:
- Initial page data (fetched server-side)
- Static exercise data (fetched server-side)
- Weight history (fetched server-side)

**React Query COULD be used for** (if needed in future):
- Real-time updates (e.g., collaborative workouts)
- Polling for live data
- Background refetching

**For now**: Stick to Server Components + Server Actions for all data operations.

---

## 7. Server Actions Integration

### Form with Server Action (Assessment Flow)

**Page** (Client Component):
```typescript
'use client';

import { useActionState } from 'react';
import { createWorkoutSplitsFromAssessment } from '@/domains/workout-splits/actions';

export default function AssessmentPage() {
  const [state, formAction] = useActionState(createWorkoutSplitsFromAssessment, null);

  return (
    <form action={formAction}>
      <input name="frequency" type="number" required />
      <select name="trainingFocus" required>
        <option value="full-body">Full Body</option>
        <option value="upper-lower">Upper/Lower</option>
        <option value="push-pull-legs">Push/Pull/Legs</option>
      </select>
      <button type="submit">Generate Splits</button>

      {state?.error && <p className="text-red-600">{state.error}</p>}
    </form>
  );
}
```

**Server Action**:
```typescript
// domains/workout-splits/actions.ts
'use server';

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getWorkoutSplitsRepository } from './repositories';
import { assessmentSchema } from './schema';

export async function createWorkoutSplitsFromAssessment(
  prevState: any,
  formData: FormData
) {
  // ✅ Mandatory session validation
  const session = await auth();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  // Validate input
  const result = assessmentSchema.safeParse({
    frequency: parseInt(formData.get('frequency') as string),
    trainingFocus: formData.get('trainingFocus')
  });

  if (!result.success) {
    return { error: 'Invalid input' };
  }

  // Generate workout splits
  const splits = await getWorkoutSplitsRepository().createFromAssessment(
    session.user.id,
    result.data
  );

  // Redirect to my-workout page
  redirect('/my-workout');
}
```

---

### Client Component with Server Action (Exercise Checklist)

```typescript
'use client';

import { useTransition } from 'react';
import { toggleExerciseCompletion } from '@/domains/workout-splits/actions';

export function ExerciseChecklistItem({ exercise }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleExerciseCompletion(exercise.id, !exercise.isCompleted);
    });
  };

  return (
    <div onClick={handleToggle}>
      {/* Checkbox UI */}
    </div>
  );
}
```

**Server Action**:
```typescript
// domains/workout-splits/actions.ts
'use server';

import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { getWorkoutSplitsRepository } from './repositories';

export async function toggleExerciseCompletion(
  exerciseId: string,
  isCompleted: boolean
) {
  // ✅ Mandatory session validation
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // Update exercise completion status
  await getWorkoutSplitsRepository().updateExerciseCompletion(
    exerciseId,
    isCompleted
  );

  // ✅ Revalidate the split detail page
  revalidatePath('/my-workout/splits/[splitId]', 'page');

  return { success: true };
}
```

---

### Server Action for Finalizing Workout

```typescript
// domains/workout-splits/actions.ts
'use server';

import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { getWorkoutSplitsRepository } from './repositories';
import { getWorkoutHistoryRepository } from '@/domains/workout-history/repositories';

export async function finalizeWorkout(splitId: string) {
  // ✅ Mandatory session validation
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // Get split and verify all exercises completed
  const split = await getWorkoutSplitsRepository().findById(splitId);

  if (!split || split.userId !== session.user.id) {
    throw new Error('Unauthorized');
  }

  const allCompleted = split.exercises.every(e => e.isCompleted);

  if (!allCompleted) {
    return {
      success: false,
      error: 'Please complete all exercises before finalizing'
    };
  }

  // Record workout completion
  await getWorkoutHistoryRepository().create({
    userId: session.user.id,
    splitId: split.id,
    completedAt: new Date()
  });

  // Advance to next split
  await getWorkoutSplitsRepository().advanceToNextSplit(session.user.id, splitId);

  // ✅ Revalidate affected pages
  revalidatePath('/my-workout', 'page');
  revalidatePath('/dashboard', 'page');

  return { success: true };
}
```

---

## 8. Middleware for Route Protection

**File**: `src/middleware.ts` (EXISTING - Update required)

**Current State**: Middleware already protects `(app)` routes and redirects unauthenticated users to `/login`.

**Required Changes**:
1. Add `/my-workout` and subroutes to protected routes (already covered by existing matcher)
2. NO special role-based protection needed (all authenticated users can access)

**Current Middleware (NO CHANGES NEEDED)**:
```typescript
// middleware.ts
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/login', '/register', '/forgot-password'];
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  const session = await auth();

  // Redirect logged-in users away from auth pages
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login
  if (!session && !isPublicRoute) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
```

**Result**: All `/my-workout/*` routes are already protected by existing middleware. No changes needed.

---

## 9. Metadata and SEO

### Static Metadata (Assessment Page)

```typescript
// app/(app)/my-workout/assessment/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workout Assessment - Gym Tracker',
  description: 'Complete your workout assessment to generate personalized training splits',
  robots: 'noindex, nofollow' // Don't index assessment page
};

export default function AssessmentPage() {
  // Component
}
```

---

### Dynamic Metadata (Split Detail Page)

```typescript
// app/(app)/my-workout/splits/[splitId]/page.tsx
import type { Metadata } from 'next';
import { getWorkoutSplitsRepository } from '@/domains/workout-splits/repositories';

export async function generateMetadata({
  params
}: {
  params: { splitId: string }
}): Promise<Metadata> {
  const split = await getWorkoutSplitsRepository().findById(params.splitId);

  if (!split) {
    return {
      title: 'Split Not Found - Gym Tracker'
    };
  }

  return {
    title: `${split.name} - My Workout`,
    description: `${split.exerciseCount} exercises in ${split.name}. Track your progress.`,
    openGraph: {
      title: split.name,
      description: `${split.exerciseCount} exercises`,
      type: 'website'
    }
  };
}

export default async function WorkoutSplitDetailPage({ params }) {
  // Component
}
```

---

### Dynamic Metadata (Exercise Detail Page)

```typescript
// app/(app)/my-workout/splits/[splitId]/exercises/[exerciseId]/page.tsx
import type { Metadata } from 'next';
import { getExercisesRepository } from '@/domains/exercises/repositories';

export async function generateMetadata({
  params
}: {
  params: { exerciseId: string }
}): Promise<Metadata> {
  const exercise = await getExercisesRepository().findById(params.exerciseId);

  if (!exercise) {
    return {
      title: 'Exercise Not Found - Gym Tracker'
    };
  }

  return {
    title: `${exercise.name} - Exercise Details`,
    description: exercise.description || `Learn how to perform ${exercise.name}`,
    openGraph: {
      title: exercise.name,
      description: exercise.description,
      images: exercise.imageUrl ? [exercise.imageUrl] : [],
      type: 'article'
    }
  };
}

export default async function ExerciseDetailPage({ params }) {
  // Component
}
```

---

## 10. Route Groups and Organization

### Current Route Groups (Existing)

```
app/
├── (auth)/              # Authentication routes
│   ├── login/
│   ├── register/
│   └── forgot-password/
│
└── (app)/               # Authenticated app routes
    ├── dashboard/
    ├── routines/
    ├── exercises/
    ├── history/
    └── workout/
```

### New Routes in `(app)` Group

**Adding to existing `(app)` route group**:

```
app/
└── (app)/
    └── my-workout/
        ├── page.tsx                    # Main workout splits view
        ├── loading.tsx                 # Loading state
        ├── error.tsx                   # Error boundary
        ├── assessment/
        │   └── page.tsx               # Pre-assessment flow
        └── splits/
            └── [splitId]/
                ├── page.tsx           # Split detail
                ├── loading.tsx        # Split loading
                ├── error.tsx          # Split error
                └── exercises/
                    └── [exerciseId]/
                        ├── page.tsx   # Exercise detail
                        └── loading.tsx
```

**Why `(app)` Group**:
- Shares authenticated layout (header, sidebar)
- Consistent navigation structure
- Already protected by middleware
- No new route group needed

---

### Parallel Routes (NOT NEEDED)

**Decision**: Do NOT use parallel routes for this feature.

**Reason**:
- No need to show multiple pages simultaneously
- Linear navigation flow (list → detail → exercise)
- Simple parent-child routing is sufficient

---

### Intercepting Routes (NOT NEEDED)

**Decision**: Do NOT use intercepting routes for this feature.

**Potential Future Use**:
- Modal view for exercise details (instead of full page)
- Quick workout preview modal

**For now**: Use standard routing. Evaluate intercepting routes in future iterations if modal UX is desired.

---

## 11. Files to Create

### Pages

#### `app/(app)/my-workout/page.tsx`
**Purpose**: Main workout splits dashboard
**Type**: Server Component
**Exports**: `export default async function MyWorkoutPage()`

#### `app/(app)/my-workout/loading.tsx`
**Purpose**: Loading state for main page
**Type**: Server Component
**Exports**: `export default function MyWorkoutLoading()`

#### `app/(app)/my-workout/error.tsx`
**Purpose**: Error boundary for main page
**Type**: Client Component (must be)
**Exports**: `export default function MyWorkoutError()`

#### `app/(app)/my-workout/assessment/page.tsx`
**Purpose**: Pre-assessment flow
**Type**: Client Component (form interactivity)
**Exports**: `export default function AssessmentPage()`

#### `app/(app)/my-workout/splits/[splitId]/page.tsx`
**Purpose**: Workout split detail view
**Type**: Server Component
**Exports**: `export default async function WorkoutSplitDetailPage()`

#### `app/(app)/my-workout/splits/[splitId]/loading.tsx`
**Purpose**: Loading state for split detail
**Type**: Server Component
**Exports**: `export default function WorkoutSplitDetailLoading()`

#### `app/(app)/my-workout/splits/[splitId]/error.tsx`
**Purpose**: Error boundary for split detail
**Type**: Client Component
**Exports**: `export default function WorkoutSplitDetailError()`

#### `app/(app)/my-workout/splits/[splitId]/exercises/[exerciseId]/page.tsx`
**Purpose**: Exercise detail view
**Type**: Server Component
**Exports**: `export default async function ExerciseDetailPage()`

#### `app/(app)/my-workout/splits/[splitId]/exercises/[exerciseId]/loading.tsx`
**Purpose**: Loading state for exercise detail
**Type**: Server Component
**Exports**: `export default function ExerciseDetailLoading()`

---

### Route-Specific Components (Optional - if needed)

#### `app/(app)/my-workout/_components/workout-split-card.tsx` (Optional)
**Purpose**: Card component for workout splits (route-specific)
**Type**: Client Component
**Exports**: Named export `export function WorkoutSplitCard()`

**Note**: Alternatively, place in `src/domains/workout-splits/components/molecules/workout-split-card.tsx` for better organization.

---

### Domain Components (Recommended Location)

**All workout split components should be in**:
```
src/domains/workout-splits/components/
├── atoms/
├── molecules/
│   ├── workout-split-card.tsx
│   ├── exercise-checklist-item.tsx
│   ├── finalize-workout-button.tsx
│   ├── workout-splits-skeleton.tsx
│   └── exercise-list-skeleton.tsx
└── organisms/
    ├── workout-splits-view.tsx
    ├── exercise-checklist-view.tsx
    └── workout-split-header.tsx
```

**Exercise components**:
```
src/domains/exercises/components/
├── molecules/
│   ├── weight-input-form.tsx
│   ├── exercise-detail-skeleton.tsx
│   └── set-reps-display.tsx
└── organisms/
    ├── exercise-detail-view.tsx
    ├── exercise-media.tsx
    └── weight-history-chart.tsx
```

**Workout history components**:
```
src/domains/workout-history/components/
└── organisms/
    └── calendar-widget.tsx
```

---

## 12. Files to Modify

### `app/(app)/dashboard/page.tsx`

**Change**: Update "Train Today" section to link to `/my-workout` instead of `/workout/active`

**Current**:
```typescript
<Link href="/workout/active">{text.trainToday.button}</Link>
```

**New**:
```typescript
<Link href="/my-workout">{text.trainToday.button}</Link>
```

**Additional Changes**:
- Update stats to show current workout split (instead of "active routine")
- Fetch next workout split to perform
- Display weekly workout completion from calendar data

**Data Fetching Changes**:
```typescript
// Add to dashboard page
const [stats, nextWorkoutSplit] = await Promise.all([
  useDashboardStats(),
  getWorkoutSplitsRepository().findNextWorkoutForUser(session.user.id)
]);
```

---

### `src/middleware.ts` (NO CHANGES NEEDED)

**Status**: Existing middleware already protects `/my-workout/*` routes.
**No modifications required**.

---

### Navigation Links (If Sidebar/Header Includes Routines)

**File**: `src/components/organisms/app-sidebar.tsx` (or similar)

**Change**: Add "My Workout" link to navigation menu

**Current**:
```typescript
<NavLink href="/dashboard">Dashboard</NavLink>
<NavLink href="/routines">Routines</NavLink>
<NavLink href="/exercises">Exercises</NavLink>
<NavLink href="/history">History</NavLink>
```

**New**:
```typescript
<NavLink href="/dashboard">Dashboard</NavLink>
<NavLink href="/my-workout">My Workout</NavLink>
<NavLink href="/routines">Routines</NavLink>
<NavLink href="/exercises">Exercises</NavLink>
<NavLink href="/history">History</NavLink>
```

---

## 13. Implementation Steps

1. ✅ **Create route structure**:
   - `app/(app)/my-workout/page.tsx`
   - `app/(app)/my-workout/assessment/page.tsx`
   - `app/(app)/my-workout/splits/[splitId]/page.tsx`
   - `app/(app)/my-workout/splits/[splitId]/exercises/[exerciseId]/page.tsx`

2. ✅ **Add loading states**:
   - `loading.tsx` for each route segment
   - Skeleton components in domains

3. ✅ **Add error boundaries**:
   - `error.tsx` for each route segment

4. ✅ **Create Server Components** (pages):
   - Fetch data via Repository Pattern
   - Pass data to Client Components via props
   - Add Suspense boundaries

5. ✅ **Create Client Components** (interactivity):
   - `<WorkoutSplitCard />` with hover states
   - `<CalendarWidget />` with date selection
   - `<ExerciseChecklistItem />` with optimistic UI
   - `<WeightInputForm />` with form validation
   - `<FinalizeWorkoutButton />` with loading state

6. ✅ **Implement Server Actions**:
   - `createWorkoutSplitsFromAssessment()` - Generate splits
   - `toggleExerciseCompletion()` - Mark exercise done
   - `finalizeWorkout()` - Complete workout
   - `recordWeightForExercise()` - Save weight history

7. ✅ **Add metadata for SEO**:
   - Static metadata for main pages
   - Dynamic metadata for split/exercise detail pages

8. ✅ **Update dashboard page**:
   - Link to `/my-workout` instead of `/workout/active`
   - Update stats to show workout splits data

9. ✅ **Update navigation**:
   - Add "My Workout" link to sidebar/header

10. ✅ **Test routes and data flow**:
    - Verify Server Component data fetching
    - Test Server Actions and optimistic updates
    - Validate loading and error states
    - Check metadata rendering

---

## 14. Component Placement Strategy

### Server Components (prefer)

**Location**: Directly in `app/(app)/my-workout/**/page.tsx`

**Example**:
```typescript
// app/(app)/my-workout/page.tsx
export default async function MyWorkoutPage() {
  const splits = await getWorkoutSplitsRepository().findByUserId(userId);

  return <WorkoutSplitsView splits={splits} />;
}
```

---

### Client Components

**Route-specific** (OPTIONAL - use sparingly):
- `app/(app)/my-workout/_components/` - Components ONLY used in this route

**Reusable** (RECOMMENDED):
- `src/domains/workout-splits/components/` - Workout split components
- `src/domains/exercises/components/` - Exercise components
- `src/domains/workout-history/components/` - Calendar/history components

**UI primitives**:
- `src/components/ui/` - shadcn components (Button, Input, Calendar, etc.)
- `src/components/atoms/` - Basic UI atoms
- `src/components/molecules/` - Composed UI molecules
- `src/components/organisms/` - Complex UI organisms

---

### Rule of Thumb

- ✅ **Keep Client Components as leaf nodes** (receive data from parent Server Component)
- ✅ **Server Components at top of tree** (pages, layouts)
- ✅ **Pass data down from Server to Client Components via props**

**Example Tree**:
```
MyWorkoutPage (Server Component)
└── WorkoutSplitsView (Server Component)
    ├── WorkoutSplitCard (Client Component - leaf) ← Interactive
    ├── WorkoutSplitCard (Client Component - leaf)
    └── CalendarWidget (Client Component - leaf) ← Interactive
```

---

## 15. Performance Considerations

### Streaming and Suspense

**Strategy**: Wrap slow components in Suspense for progressive rendering

```typescript
export default async function MyWorkoutPage() {
  return (
    <div>
      {/* Fast: Render immediately */}
      <h1>My Workout</h1>

      {/* Slow: Wrap in Suspense */}
      <Suspense fallback={<WorkoutSplitsSkeleton />}>
        <WorkoutSplitsView />
      </Suspense>

      {/* Slow: Separate Suspense boundary */}
      <Suspense fallback={<CalendarSkeleton />}>
        <CalendarWidget />
      </Suspense>
    </div>
  );
}
```

**Benefits**:
- Fast Time to First Byte (TTFB)
- Progressive rendering (show UI as data loads)
- Better perceived performance

---

### Code Splitting

**Client Components are automatically code-split**:
- Each Client Component is a separate JS bundle
- Only loaded when needed

**Use dynamic imports for heavy components** (if needed):
```typescript
import dynamic from 'next/dynamic';

const WeightHistoryChart = dynamic(
  () => import('@/domains/exercises/components/organisms/weight-history-chart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false // Don't render chart server-side (heavy charting library)
  }
);
```

**When to use dynamic imports**:
- Heavy charting libraries (Chart.js, Recharts)
- Video players (YouTube embed)
- Rich text editors
- Large third-party libraries

**For workout splits feature**:
- ✅ Dynamic import for `<WeightHistoryChart />` (uses charting library)
- ✅ Dynamic import for YouTube video player (if using third-party library)
- ❌ NO dynamic import for simple components (forms, buttons, cards)

---

### Caching Strategy

**Pages** (Server Components):
- **Static pages**: `force-cache` (default) - Cached indefinitely
- **Dynamic pages with auth**: `no-store` - Fresh on every request
- **Revalidation**: `revalidate: 60` - Revalidate every 60 seconds

**Example**:
```typescript
// app/(app)/my-workout/page.tsx
export const revalidate = 60; // Revalidate every 60 seconds

export default async function MyWorkoutPage() {
  const splits = await getWorkoutSplitsRepository().findByUserId(userId);
  return <WorkoutSplitsView splits={splits} />;
}
```

**Server Actions**:
- Use `revalidatePath()` to invalidate cache after mutations
- Use `revalidateTag()` for fine-grained cache control

**Example**:
```typescript
// domains/workout-splits/actions.ts
'use server';

export async function finalizeWorkout(splitId: string) {
  // Update database
  await getWorkoutSplitsRepository().finalizeWorkout(splitId);

  // ✅ Invalidate affected pages
  revalidatePath('/my-workout');
  revalidatePath('/dashboard');

  return { success: true };
}
```

---

### Image Optimization

**Exercise images and thumbnails**:
- Use Next.js `<Image />` component for automatic optimization
- Lazy load images below the fold

**Example**:
```typescript
import Image from 'next/image';

<Image
  src={exercise.imageUrl}
  alt={exercise.name}
  width={600}
  height={400}
  loading="lazy"
  placeholder="blur"
  blurDataURL="/placeholder.jpg"
/>
```

---

## 16. Important Notes

### Critical Constraints Compliance

⚠️ **Default to Server Components** (no "use client" unless necessary)
- ✅ All pages are Server Components
- ✅ Client Components only for interactivity (forms, checkboxes, calendar)

⚠️ **Suspense is mandatory** for async operations
- ✅ All async Server Components wrapped in Suspense
- ✅ Loading states provided with `loading.tsx`

⚠️ **Server Actions for mutations** (no client fetch/axios)
- ✅ All mutations use Server Actions
- ✅ No direct fetch/axios calls in Client Components

💡 **Use route groups** for organization without URL changes
- ✅ `(app)` route group for authenticated routes
- ✅ No additional route groups needed

💡 **Middleware for auth** (don't rely on client-side checks)
- ✅ Middleware protects all `/my-workout/*` routes
- ✅ Session validation in Server Actions
- ✅ Authorization checks in Server Components

📝 **Add metadata** for SEO on all public pages
- ✅ Static metadata for main pages
- ✅ Dynamic metadata for split/exercise detail pages

🎯 **Keep Client Components small** and at leaf nodes
- ✅ Client Components are leaf nodes (WorkoutSplitCard, CalendarWidget, etc.)
- ✅ Server Components at top of tree (pages, views)

---

### Repository Pattern (CRITICAL)

**ALWAYS use Repository Pattern for data access**:

❌ **NEVER**:
```typescript
import { db } from '@/lib/db';

export default async function MyWorkoutPage() {
  const splits = await db.workoutSplit.findMany({ where: { userId } });
}
```

✅ **ALWAYS**:
```typescript
import { getWorkoutSplitsRepository } from '@/domains/workout-splits/repositories';

export default async function MyWorkoutPage() {
  const splits = await getWorkoutSplitsRepository().findByUserId(userId);
}
```

**Benefits**:
- Abstraction layer for data access
- Easier to test (mock repositories)
- Business logic encapsulation
- Database-agnostic

---

### Named Exports (CRITICAL)

**Pages and layouts** (Next.js requirement):
```typescript
// ✅ Default export for pages (Next.js allows it)
export default function MyWorkoutPage() {}
```

**All other components**:
```typescript
// ✅ Named exports
export function WorkoutSplitCard() {}
export function CalendarWidget() {}
```

---

### Text Externalization (CRITICAL)

**NEVER hardcode text strings**:

❌ **NEVER**:
```typescript
<h1>My Workout</h1>
<p>Select a workout split to begin training</p>
```

✅ **ALWAYS use text maps**:
```typescript
import { workoutSplitsTextMap } from '@/domains/workout-splits/workout-splits.text-map';

const text = workoutSplitsTextMap.myWorkoutPage;

<h1>{text.heading}</h1>
<p>{text.description}</p>
```

---

## 17. Coordination with Other Agents

### Domain Architect (DEPENDENCY)

**Receives from Domain Architect**:
- `WorkoutSplit` entity and schema
- `PreAssessment` entity and schema
- `WorkoutHistory` entity and schema
- `ExerciseWeightHistory` entity and schema
- Repository interfaces and implementations
- Server Actions signatures

**Provides to Domain Architect**:
- Route structure for repository planning
- Data fetching requirements per page
- Authorization requirements per route

**Integration Points**:
- Pages call repositories defined by Domain Architect
- Server Actions use domain business logic
- Components use domain types and schemas

---

### UX Designer (DEPENDENCY)

**Receives from UX Designer**:
- User flows and wireframes
- Component hierarchy and layout
- Interactive elements and states
- Calendar widget design

**Provides to UX Designer**:
- Route structure and navigation flow
- Server vs Client Component boundaries
- Data flow from pages to components

---

### shadcn Builder (DEPENDENCY)

**Receives from shadcn Builder**:
- UI component selection (Calendar, Checkbox, Progress, etc.)
- Component usage examples
- Form components

**Uses in Pages**:
- `<Calendar />` for CalendarWidget
- `<Checkbox />` for ExerciseChecklistItem
- `<Progress />` for WorkoutProgressBar
- `<Button />`, `<Input />`, `<Label />` for forms

---

### Business Analyst (INFORMATIONAL)

**Receives from Business Analyst**:
- Feature requirements
- Business rules
- User flow definitions

**Confirms with Business Analyst**:
- Route structure aligns with user flows
- Pre-assessment flow implementation
- Workout completion and advancement logic

---

## 18. Next Steps

### Immediate Next Steps (After This Plan)

1. **Domain Architect**: Design domain models, repositories, and Server Actions
2. **UX Designer**: Design user flows, wireframes, and component hierarchy
3. **shadcn Builder**: Select UI components (Calendar, Checkbox, Progress, etc.)

### Implementation Order (After All Plans Complete)

1. Create route structure (directories and `page.tsx` files)
2. Implement Server Components with data fetching (use mock data initially)
3. Add loading states (`loading.tsx`) and error boundaries (`error.tsx`)
4. Implement Server Actions (domain architect's actions)
5. Create Client Components for interactivity
6. Integrate Server Actions with Client Components
7. Add metadata for SEO
8. Update dashboard and navigation links
9. Test end-to-end flow
10. Code review (code-reviewer agent)

---

## 19. Questions for Clarification

### For Business Analyst

1. **Pre-assessment**: Should users be able to re-take the assessment and regenerate splits?
2. **Workout completion**: What happens if user wants to skip a workout split?
3. **Weight history**: How many previous sessions should be shown by default?
4. **Calendar**: Should calendar show only completed workouts, or also scheduled/planned workouts?

### For Domain Architect

1. **Repository pattern**: Which repositories need to be created (WorkoutSplits, WorkoutHistory, ExerciseWeightHistory)?
2. **Server Actions**: Which actions are needed beyond the ones listed in this plan?
3. **Data relationships**: How do WorkoutSplits relate to existing Routine/Workout entities?
4. **Migration**: Should existing workout data be migrated to new split-based system?

### For UX Designer

1. **Calendar widget**: Should it be on the main `/my-workout` page, or a separate `/my-workout/calendar` page?
2. **Exercise detail**: Should it be a full page or a modal/drawer?
3. **Pre-assessment**: Single-page form or multi-step wizard?
4. **Mobile experience**: Any mobile-specific considerations for workout tracking?

---

## Summary

This Next.js 15 architecture plan provides:

✅ **Complete route structure** for workout splits system
✅ **Server Component-first approach** (RSC by default)
✅ **Strategic use of Client Components** (only when necessary)
✅ **Server Actions for all mutations** (no client-side fetch)
✅ **Suspense boundaries** for async operations
✅ **Loading and error states** for all routes
✅ **Metadata for SEO** (static and dynamic)
✅ **Repository Pattern integration** (no direct DB access)
✅ **Middleware protection** (already in place)
✅ **Performance optimizations** (streaming, code splitting, caching)
✅ **Coordination plan** with other specialized agents

**Total Routes Created**: 4 main routes + 1 optional calendar route
**Total Loading States**: 4 `loading.tsx` files
**Total Error Boundaries**: 2 `error.tsx` files
**Total Client Components**: ~7 (WorkoutSplitCard, CalendarWidget, ExerciseChecklistItem, WeightInputForm, FinalizeWorkoutButton, ExerciseMedia, WeightHistoryChart)
**Total Server Components**: 4 pages + supporting view components

**Architecture Complexity**: High (multi-level dynamic routing, parallel data fetching, optimistic UI updates)
**Implementation Effort**: Medium-High (well-structured with clear component boundaries)
