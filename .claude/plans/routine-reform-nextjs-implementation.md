# Routine System Reform - Next.js Implementation Plan

**Session ID**: `20251106_220103`
**Created**: 2025-11-06
**Status**: Implementation Planning
**Phase**: Execution Roadmap

---

## 1. Implementation Order

### Phase 1: Foundation (Database + Domain Layer)

1. ✅ Requirements defined
2. ✅ Domain architecture designed
3. ✅ UX/UI architecture designed
4. ⏳ Database migration
5. ⏳ Update repository layer
6. ⏳ Update validation schemas
7. ⏳ Create Server Actions

### Phase 2: Core UI Components

8. ⏳ Build atom components
9. ⏳ Build molecule components
10. ⏳ Build organism components
11. ⏳ Update hooks

### Phase 3: Pages and Routing

12. ⏳ Update routines list page
13. ⏳ Create routine editor page
14. ⏳ Create routine detail page
15. ⏳ Update text maps

### Phase 4: Testing and Polish

16. ⏳ Integration testing
17. ⏳ Manual testing
18. ⏳ Performance optimization
19. ⏳ Accessibility audit

---

## 2. Step-by-Step Implementation

### STEP 1: Database Migration

**Files to modify**:

- `prisma/schema.prisma`
- Create migration files

**Actions**:

1. Update Prisma schema following domain architecture plan
2. Generate migration: `npx prisma migrate dev --name routine_reform`
3. Review generated SQL
4. Test migration on development database
5. Verify data integrity

**Validation**:

```bash
# Check migration was successful
npx prisma studio

# Verify table structure
psql $DATABASE_URL -c "\d training_divisions"
psql $DATABASE_URL -c "\d division_exercises"
```

---

### STEP 2: Update Repository Layer

**File**: `src/domains/routines/repository.ts`

**Actions**:

1. Update type imports (TrainingDivision, DivisionExercise)
2. Update all queries to use new table/column names
3. Add new methods:
   - `addDivision`
   - `updateDivision`
   - `deleteDivision`
   - `getExerciseLoadHistory`
4. Update existing methods to handle new fields

**Critical changes**:

```typescript
// OLD
days: {
  include: {
    exercises: { ... }
  }
}

// NEW
divisions: {
  include: {
    exercises: { ... }
  }
}
```

**Testing**:

```typescript
// Manual test in a script or API route
const routine = await routinesRepository.findById('...', 'userId');
console.log(routine.divisions); // Should work
```

---

### STEP 3: Update Validation Schemas

**File**: `src/domains/routines/schema.ts`

**Actions**:

1. Add `createDivisionSchema`
2. Add `updateDivisionSchema`
3. Update `addDivisionExerciseSchema` (add videoId, increase notes limit)
4. Update `updateDivisionExerciseSchema`
5. Add `extractYouTubeVideoId` helper function
6. Remove old `DayOfWeekEnum` references

**New exports**:

```typescript
export const createDivisionSchema = z.object({ ... });
export const updateDivisionSchema = z.object({ ... });
export function extractYouTubeVideoId(url: string): string | null { ... }
```

---

### STEP 4: Update Types

**File**: `src/domains/routines/types.ts`

**Actions**:

1. Update imports from Prisma
2. Add new type aliases:
   - `TrainingDivision`
   - `DivisionExercise`
3. Update extended types:
   - `DivisionExerciseWithDetails`
   - `TrainingDivisionWithExercises`
   - `RoutineWithDivisions`
4. Add load history types

---

### STEP 5: Create/Update Server Actions

**File**: `src/domains/routines/actions.ts`

**New actions needed**:

```typescript
'use server';

import { auth } from '@/lib/auth';
import { routinesRepository } from './repository';
import {
  createDivisionSchema,
  updateDivisionSchema,
  addDivisionExerciseSchema,
  updateDivisionExerciseSchema
} from './schema';

// Training Division Actions

export async function createDivisionAction(input: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const data = createDivisionSchema.parse(input);

  // Verify user owns this routine
  const routine = await routinesRepository.findById(
    data.routineId,
    session.user.id
  );
  if (!routine) throw new Error('Routine not found');

  const division = await routinesRepository.addDivision(data);

  return { success: true, data: division };
}

export async function updateDivisionAction(input: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const data = updateDivisionSchema.parse(input);

  // TODO: Verify user owns this division (query through routine)

  const division = await routinesRepository.updateDivision(data.id, {
    name: data.name,
    description: data.description,
    frequency: data.frequency,
    order: data.order
  });

  return { success: true, data: division };
}

export async function deleteDivisionAction(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  // TODO: Verify user owns this division

  const division = await routinesRepository.deleteDivision(id);

  return { success: true, data: division };
}

// Division Exercise Actions

export async function addExerciseAction(input: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const data = addDivisionExerciseSchema.parse(input);

  // TODO: Verify user owns this division

  const exercise = await routinesRepository.addExercise(data);

  return { success: true, data: exercise };
}

export async function updateExerciseAction(input: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const data = updateDivisionExerciseSchema.parse(input);

  // TODO: Verify user owns this exercise

  const exercise = await routinesRepository.updateExercise(data.id, {
    order: data.order,
    targetSets: data.targetSets,
    targetReps: data.targetReps,
    targetWeight: data.targetWeight,
    restSeconds: data.restSeconds,
    videoId: data.videoId,
    notes: data.notes
  });

  return { success: true, data: exercise };
}

export async function removeExerciseAction(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  // TODO: Verify user owns this exercise

  const exercise = await routinesRepository.removeExercise(id);

  return { success: true, data: exercise };
}

// Load History Actions

export async function getLoadHistoryAction(exerciseId: string, limit = 10) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const history = await routinesRepository.getExerciseLoadHistory(
    session.user.id,
    exerciseId,
    limit
  );

  if (!history) {
    return { success: false, error: 'Exercise not found' };
  }

  return { success: true, data: history };
}
```

---

### STEP 6: Create React Query Hooks

**File**: `src/domains/routines/hooks/use-routines.ts`

**Update existing hooks and add new ones**:

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getRoutinesAction,
  createRoutineAction,
  updateRoutineAction,
  createDivisionAction,
  updateDivisionAction,
  deleteDivisionAction,
  addExerciseAction,
  updateExerciseAction,
  removeExerciseAction
} from '../actions';

// Existing hooks (keep)
export function useRoutines(includeArchived = false) { ... }
export function useCreateRoutine() { ... }
export function useUpdateRoutine() { ... }

// NEW: Division hooks
export function useCreateDivision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDivisionAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    }
  });
}

export function useUpdateDivision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDivisionAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    }
  });
}

export function useDeleteDivision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDivisionAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    }
  });
}

// NEW: Exercise hooks
export function useAddExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addExerciseAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    }
  });
}

export function useUpdateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExerciseAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    }
  });
}

export function useRemoveExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeExerciseAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    }
  });
}
```

**New file**: `src/domains/routines/hooks/use-load-history.ts`

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { getLoadHistoryAction } from '../actions';

export function useLoadHistory(exerciseId: string | null, limit = 10) {
  return useQuery({
    queryKey: ['load-history', exerciseId, limit],
    queryFn: () => getLoadHistoryAction(exerciseId!, limit),
    enabled: !!exerciseId // Only fetch if exerciseId is provided
  });
}
```

---

### STEP 7: Build Atom Components

**Files to create**:

1. **`src/domains/routines/components/atoms/youtube-embed.tsx`**
   - YouTube iframe embed
   - Props: videoId, width, height, autoplay
   - Error handling for invalid videos

2. **`src/domains/routines/components/atoms/pr-badge.tsx`**
   - Badge showing "PR" or "New PR"
   - Visual indicator (green, bold)

3. **`src/domains/routines/components/atoms/frequency-badge.tsx`**
   - Display "3x/week" badge
   - Color-coded based on frequency

4. **`src/domains/routines/components/atoms/drag-handle.tsx`**
   - Reusable drag handle icon (⋮)
   - Used in lists for reordering

---

### STEP 8: Build Molecule Components

**Files to create**:

1. **`src/domains/routines/components/molecules/division-card.tsx`**
   - Display division in sidebar list
   - Shows name, frequency badge, exercise count
   - Click to select
   - Drag handle for reordering

2. **`src/domains/routines/components/molecules/division-form.tsx`**
   - Form for creating/editing division
   - Fields: name, description, frequency
   - Uses FrequencySelector component
   - React Hook Form + Zod validation

3. **`src/domains/routines/components/molecules/frequency-selector.tsx`**
   - Visual selector for frequency (1-7 buttons)
   - Highlight selected value
   - Mobile-friendly touch targets

4. **`src/domains/routines/components/molecules/video-input.tsx`**
   - Input for YouTube URL
   - Live preview of video
   - Extract video ID automatically
   - Show error for invalid URLs

5. **`src/domains/routines/components/molecules/exercise-config-form.tsx`**
   - Comprehensive exercise configuration form
   - Fields: video, sets, reps, weight, rest, notes
   - React Hook Form + Zod validation
   - Load history preview

6. **`src/domains/routines/components/molecules/exercise-card.tsx`** (UPDATE)
   - Enhanced version of existing card
   - Show video thumbnail if available
   - Show notes preview
   - Edit/delete buttons

7. **`src/domains/routines/components/molecules/load-history-chart.tsx`**
   - Line/bar chart for weight/volume progression
   - Uses Chart.js or similar
   - Props: history data, metric type

8. **`src/domains/routines/components/molecules/load-history-table.tsx`**
   - Table view of workout history
   - Columns: date, sets, reps, weight, volume
   - Highlight PRs

---

### STEP 9: Build Organism Components

**Files to create**:

1. **`src/domains/routines/components/organisms/routine-editor.tsx`**
   - Main container with 3-column layout
   - Manages selected division/exercise state
   - Coordinates child components

2. **`src/domains/routines/components/organisms/division-manager.tsx`**
   - Left sidebar component
   - List of divisions
   - Add division button
   - Drag-and-drop reordering

3. **`src/domains/routines/components/organisms/division-detail-view.tsx`**
   - Main content area
   - Division header with edit button
   - Exercise list
   - Add exercise button

4. **`src/domains/routines/components/organisms/load-history-panel.tsx`**
   - Right sidebar component
   - Chart/table toggle
   - PR indicators
   - Collapsible/closeable

---

### STEP 10: Update Pages

**1. Update `src/app/(app)/routines/page.tsx`**:

- Change references from `days` to `divisions`
- Update stats calculation
- Keep existing UI structure

**2. Create `src/app/(app)/routines/new/page.tsx`**:

```typescript
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { RoutineQuickStart } from '@/domains/routines/components/organisms/routine-quick-start';

export default async function NewRoutinePage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Create New Routine</h1>
      <RoutineQuickStart userId={session.user.id} />
    </div>
  );
}
```

**3. Create `src/app/(app)/routines/[id]/edit/page.tsx`**:

```typescript
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { routinesRepository } from '@/domains/routines/repository';
import { RoutineEditor } from '@/domains/routines/components/organisms/routine-editor';

export default async function EditRoutinePage({
  params
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const routine = await routinesRepository.findById(params.id, session.user.id);

  if (!routine) {
    redirect('/routines');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <RoutineEditor routineId={routine.id} routine={routine} />
    </div>
  );
}
```

**4. Create `src/app/(app)/routines/[id]/page.tsx`**:

```typescript
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { routinesRepository } from '@/domains/routines/repository';
import { RoutineDetailView } from '@/domains/routines/components/organisms/routine-detail-view-page';

export default async function RoutineDetailPage({
  params
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const routine = await routinesRepository.findById(params.id, session.user.id);

  if (!routine) {
    redirect('/routines');
  }

  return <RoutineDetailView routine={routine} />;
}
```

---

### STEP 11: Update Text Maps

**File**: `src/domains/routines/routines.text-map.ts`

Add new text entries:

```typescript
export const routinesTextMap = {
  routines: {
    heading: 'My Routines',
    create: 'Create Routine',
    empty: {
      heading: 'No routines yet',
      message: 'Create your first workout routine to get started',
      action: 'Create First Routine'
    }
  },
  editor: {
    title: 'Routine Editor',
    save: 'Save Changes',
    cancel: 'Cancel',
    divisions: {
      heading: 'Training Divisions',
      add: 'Add Division',
      empty: 'No divisions yet. Add your first training division.'
    },
    exercises: {
      heading: 'Exercises',
      add: 'Add Exercise',
      empty: 'No exercises yet. Add exercises to this division.'
    }
  },
  division: {
    create: 'Create Division',
    edit: 'Edit Division',
    delete: 'Delete Division',
    form: {
      name: 'Division Name',
      namePlaceholder: 'e.g., Push Day, Upper Body',
      description: 'Description (Optional)',
      descriptionPlaceholder: 'Brief description of this training division...',
      frequency: 'Training Frequency',
      frequencyHelp: 'Train this division {count}x per week'
    }
  },
  exercise: {
    add: 'Add Exercise',
    edit: 'Edit Exercise',
    remove: 'Remove Exercise',
    form: {
      video: 'YouTube Video (Optional)',
      videoPlaceholder: 'Paste YouTube URL for form reference',
      sets: 'Sets',
      reps: 'Reps',
      repsPlaceholder: '8-12',
      weight: 'Weight (kg)',
      weightPlaceholder: 'Optional',
      rest: 'Rest Between Sets (seconds)',
      restPlaceholder: '90',
      notes: 'Notes (Optional)',
      notesPlaceholder: 'Form cues, tips, progressions...'
    }
  },
  loadHistory: {
    heading: 'Load History',
    empty: 'No workout history for this exercise yet',
    chart: 'Chart',
    table: 'Table',
    metrics: {
      weight: 'Max Weight',
      volume: 'Total Volume',
      reps: 'Max Reps'
    },
    pr: 'Personal Record',
    latest: 'Latest'
  }
};
```

---

## 3. Testing Strategy

### Unit Tests

- Repository methods
- Validation schemas
- Helper functions (extractYouTubeVideoId)

### Component Tests

- Atom components render correctly
- Molecule components handle user input
- Forms validate properly

### Integration Tests

- Server Actions execute successfully
- React Query hooks update cache
- Navigation flows work

### Manual Testing Checklist

- [ ] Create new routine
- [ ] Add training division
- [ ] Edit division (name, description, frequency)
- [ ] Delete division
- [ ] Add exercise to division
- [ ] Configure exercise (video, sets, reps, weight, rest, notes)
- [ ] Edit exercise
- [ ] Remove exercise
- [ ] View load history
- [ ] Reorder divisions (drag-and-drop)
- [ ] Reorder exercises (drag-and-drop)
- [ ] YouTube video preview works
- [ ] Invalid video URL shows error
- [ ] Load history chart displays correctly
- [ ] Load history table displays correctly
- [ ] PR badges appear for personal records
- [ ] Mobile responsive layout
- [ ] Tablet responsive layout
- [ ] Desktop 3-column layout
- [ ] Form validation errors display
- [ ] Loading states show properly
- [ ] Error states handled gracefully

---

## 4. Deployment Strategy

### Phase 1: Backend Only (Non-Breaking)

1. Deploy database migration
2. Deploy updated repository/schemas/actions
3. Verify no errors in production
4. Old UI still works (accessing `days` from routine)

### Phase 2: UI Components (Gradual)

1. Deploy new components (unused at first)
2. Deploy new pages under feature flag
3. Test with beta users
4. Enable for all users

### Phase 3: Deprecate Old Code

1. Remove old routine editor
2. Remove unused code
3. Clean up imports

---

## 5. Rollback Plan

If critical issues occur:

1. **Revert UI changes** (keep new components, restore old pages)
2. **Keep database changes** (backward compatible)
3. **Monitor errors** in logging service
4. **Fix issues** and redeploy

---

## 6. Success Criteria

✅ All requirements from business analyst met
✅ All tests passing
✅ No performance regressions
✅ Mobile responsive
✅ Accessible (WCAG 2.1 AA)
✅ User acceptance testing passed
✅ Load time < 2 seconds (P95)
✅ No critical bugs in production

---

## 7. Implementation Timeline

**Week 1**:

- Database migration (Step 1)
- Repository + schemas + actions (Steps 2-5)
- Hooks (Step 6)

**Week 2**:

- Atom components (Step 7)
- Molecule components (Step 8)

**Week 3**:

- Organism components (Step 9)
- Pages (Step 10)
- Text maps (Step 11)

**Week 4**:

- Testing (all types)
- Bug fixes
- Polish

**Week 5**:

- User acceptance testing
- Performance optimization
- Documentation

**Total**: 4-5 weeks

---

## 8. Ready to Execute

All planning is complete. Next step:
**Execute STEP 1: Database Migration**

---
