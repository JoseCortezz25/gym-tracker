# Domain Plan: Workout Set Notes & Enhanced Tracking

**Session ID**: `workout_enhancements_001`
**Domain**: Workouts
**Created**: 2025-11-10
**Agent**: domain-architect (manual)

## Overview

Add per-set notes functionality and rest timer support to workout tracking system.

---

## Database Schema Changes

### 1. Add Notes to WorkoutSet Model

**File**: `prisma/schema.prisma`

```prisma
model WorkoutSet {
  id                  String    @id @default(cuid())
  setNumber           Int       // 1, 2, 3...
  weight              Float     // Weight in kg
  reps                Int       // Number of repetitions
  isCompleted         Boolean   @default(false)
  completedAt         DateTime?
  notes               String?   @db.Text // NEW: Per-set notes

  // Relations
  workoutExerciseId   String
  workoutExercise     WorkoutExercise @relation(fields: [workoutExerciseId], references: [id], onDelete: Cascade)

  @@unique([workoutExerciseId, setNumber])
  @@index([workoutExerciseId])
  @@map("workout_sets")
}
```

**Migration Command**:
```bash
prisma migrate dev --name add_workout_set_notes
```

**Expected SQL**:
```sql
-- AlterTable
ALTER TABLE "workout_sets" ADD COLUMN "notes" TEXT;
```

**Data Safety**: Migration is additive only, no data loss risk.

---

## Validation Schema Updates

### 2. Update Zod Schemas

**File**: `src/domains/workouts/schema.ts`

```typescript
// Existing schema
export const logSetSchema = z.object({
  workoutExerciseId: z.string().cuid(),
  setNumber: z.number().int().positive(),
  weight: z.number().nonnegative(),
  reps: z.number().int().positive(),
  notes: z.string().max(500).optional(), // NEW: Max 500 chars
});

export type LogSetInput = z.infer<typeof logSetSchema>;
```

**Validation Rules**:
- Notes are optional (undefined or null allowed)
- Max 500 characters (prevents abuse)
- Whitespace trimmed automatically
- Empty strings treated as null

---

## Repository Layer Updates

### 3. Update Repository Methods

**File**: `src/domains/workouts/repository.ts`

**Add to logSet method**:

```typescript
async logSet(data: LogSetInput): Promise<WorkoutSet> {
  return this.prisma.workoutSet.upsert({
    where: {
      workoutExerciseId_setNumber: {
        workoutExerciseId: data.workoutExerciseId,
        setNumber: data.setNumber,
      },
    },
    create: {
      workoutExerciseId: data.workoutExerciseId,
      setNumber: data.setNumber,
      weight: data.weight,
      reps: data.reps,
      notes: data.notes || null, // NEW
      isCompleted: true,
      completedAt: new Date(),
    },
    update: {
      weight: data.weight,
      reps: data.reps,
      notes: data.notes || null, // NEW
      isCompleted: true,
      completedAt: new Date(),
    },
  });
}
```

**No other repository methods need changes** - notes field will automatically be included in queries.

---

## Server Actions Updates

### 4. Update logSet Action

**File**: `src/domains/workouts/actions.ts`

```typescript
'use server';

export async function logSet(data: LogSetInput): Promise<WorkoutSetResponse> {
  try {
    // Existing auth check
    const session = await getServerSession();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Validation with NEW notes field
    const parsed = logSetSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: 'Invalid input' };
    }

    // Repository call (unchanged, accepts notes now)
    const workoutSet = await workoutsRepository.logSet(parsed.data);

    revalidatePath('/workout/active');
    return { success: true, data: workoutSet };
  } catch (error) {
    console.error('Error logging set:', error);
    return { success: false, error: 'Failed to log set' };
  }
}
```

**No signature changes needed** - `LogSetInput` type automatically updated from Zod schema.

---

## TypeScript Types Updates

### 5. Update Domain Types

**File**: `src/domains/workouts/types.ts`

**No manual changes needed** - Types are inferred from Prisma:

```typescript
import type { WorkoutSet } from '@prisma/client';

// WorkoutSet type now automatically includes:
// {
//   id: string;
//   setNumber: number;
//   weight: number;
//   reps: number;
//   isCompleted: boolean;
//   completedAt: Date | null;
//   notes: string | null;  // NEW - auto-included after migration
//   workoutExerciseId: string;
// }
```

**After migration, run**:
```bash
prisma generate
```

This regenerates Prisma Client with updated types.

---

## Text Map Updates

### 6. Add Text for Set Notes UI

**File**: `src/domains/workouts/workouts.text-map.ts`

```typescript
export const workoutsTextMap = {
  // ... existing content

  setLogging: {
    notesLabel: 'Notes (optional)',
    notesPlaceholder: 'How did this set feel? Form cues, etc.',
    weightLabel: 'Weight (kg)',
    repsLabel: 'Reps',
    completeButton: 'Complete Set',
    expandLabel: 'Expand to add details',
    collapseLabel: 'Collapse'
  },

  restTimer: {
    title: 'Rest Timer',
    countdown: '{seconds}s remaining',
    skipButton: 'Skip Rest',
    readyMessage: 'Ready for next set!',
    audioNotification: 'Rest period complete'
  },

  errors: {
    setLogging: {
      invalidWeight: 'Weight must be a positive number',
      invalidReps: 'Reps must be a positive whole number',
      notesTooLong: 'Notes must be 500 characters or less',
      saveFailed: 'Failed to save set. Please try again.'
    }
  }
} as const;
```

---

## Business Rules

### Core Business Logic

1. **Set Notes**:
   - Optional field (users can skip)
   - Persist across sessions
   - Displayed in workout history
   - Max 500 characters
   - Support line breaks (textarea)

2. **Rest Timer**:
   - Source: `DivisionExercise.restSeconds` from routine
   - Triggered: After completing a set (if more sets remain)
   - Countdown: Visual display in MM:SS format
   - Actions: Wait, Skip Rest
   - Completion: Audio/visual cue + auto-focus next set
   - Default: 90 seconds if not configured

3. **Set Completion Flow**:
   ```
   User expands set row
   → Enters weight, reps, optional notes
   → Clicks "Complete Set"
   → Optimistic update (instant UI feedback)
   → Server action saves to DB
   → On success: Mark complete, show rest timer
   → On failure: Revert UI, show error, allow retry
   ```

4. **Data Validation**:
   - Weight: >= 0 (allow 0 for bodyweight)
   - Reps: > 0 (must have at least 1 rep)
   - Notes: <= 500 chars
   - All validated on client AND server

---

## Migration Steps

### Step-by-Step Implementation

1. **Update Prisma Schema**:
   ```bash
   # Add notes field to WorkoutSet model
   # Run migration
   pnpm prisma migrate dev --name add_workout_set_notes
   ```

2. **Generate Prisma Client**:
   ```bash
   pnpm prisma generate
   ```

3. **Update Validation Schema** (`schema.ts`):
   - Add `notes` field to `logSetSchema`

4. **Update Repository** (`repository.ts`):
   - Add `notes` to create/update in `logSet` method

5. **Update Text Maps** (`workouts.text-map.ts`):
   - Add `setLogging.*` and `restTimer.*` keys

6. **Verify Types**:
   - Run `pnpm tsc --noEmit` to check types compile

7. **Test Migration**:
   - Start dev server
   - Verify existing workout data loads
   - Test creating new set with notes
   - Test creating set without notes (should be null)

---

## Backward Compatibility

### Handling Existing Data

**Existing Sets (before migration)**:
- `notes` field will be `null`
- UI should gracefully handle null (show empty textarea)
- No migration of old data needed

**New Sets (after migration)**:
- User can optionally add notes
- If notes field empty/undefined, save as `null`
- Display null notes as empty (not "null" string)

---

## Success Criteria

- [ ] Migration adds `notes` column to `workout_sets` table
- [ ] `notes` field is nullable (TEXT type)
- [ ] Zod schema validates notes (optional, max 500 chars)
- [ ] Repository `logSet` accepts and saves notes
- [ ] Prisma types include `notes: string | null`
- [ ] Text map includes all new UI strings
- [ ] Existing workout data loads without errors
- [ ] New sets can be created with or without notes
- [ ] TypeScript compiles without errors
- [ ] Build succeeds

---

## Files to Modify

1. `prisma/schema.prisma` - Add notes field
2. `src/domains/workouts/schema.ts` - Add notes to Zod schema
3. `src/domains/workouts/repository.ts` - Add notes to logSet method
4. `src/domains/workouts/workouts.text-map.ts` - Add UI text
5. `src/domains/workouts/types.ts` - No changes (auto-generated)

**Total**: 4 files modified + 1 migration file created

---

## Testing Checklist

- [ ] Migration runs without errors
- [ ] Existing sets display correctly (notes = null)
- [ ] New set with notes saves successfully
- [ ] New set without notes saves successfully (null)
- [ ] Notes persist across page refreshes
- [ ] Notes display in workout history
- [ ] 500+ char notes are rejected (validation)
- [ ] Empty string notes are saved as null
- [ ] Optimistic updates work with notes
- [ ] Error states display correctly

---

## Next Steps for Parent Agent

1. Run Prisma migration
2. Update schema, repository, and text map files
3. Verify build succeeds
4. Coordinate with UX designer for UI implementation
5. Implement expandable set row component
6. Implement rest timer component
7. Test end-to-end workflow

---

**Plan Status**: Ready for execution
