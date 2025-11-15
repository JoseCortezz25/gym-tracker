# Domain Architecture Plan: Workout Splits System

**Plan ID**: `domain-architecture-workout-splits`
**Session ID**: `workout-splits-20251113_200040`
**Created**: 2025-11-13
**Agent**: domain-architect
**Status**: Ready for Implementation

---

## Executive Summary

This plan defines the complete domain architecture for the workout splits system refactoring, including entity models, business logic, repository patterns, Server Actions, state management strategy, and database schema modifications. The architecture extends the existing Routine/TrainingDivision system with new pre-assessment capabilities, circular progression logic, weight history tracking, and habit calendar integration.

**Key Architectural Decisions**:
- **Extend, not replace**: Leverage existing `TrainingDivision` and `WorkoutSession` models with new fields
- **New domain**: Create `workout-splits` domain separate from `routines` domain
- **Server Actions pattern**: All data access through Server Actions (no traditional repositories)
- **React Query for server data**: Weight history, splits, sessions
- **Denormalized weight history**: Separate table for fast "last N sessions" queries
- **Circular progression**: Stored in user-level assessment record

---

## 1. Entity Definitions

### 1.1 New Entities

#### **WorkoutAssessment** (NEW)

Stores user's pre-assessment responses and current split progression state.

**TypeScript Interface**:
```typescript
// src/domains/workout-splits/types.ts

export enum TrainingFocus {
  LEGS_LOWER_BODY = 'LEGS_LOWER_BODY',
  ARMS_UPPER_BODY = 'ARMS_UPPER_BODY',
  FULL_BODY_BALANCED = 'FULL_BODY_BALANCED',
  CORE_FUNCTIONAL = 'CORE_FUNCTIONAL'
}

export interface WorkoutAssessment {
  id: string;
  userId: string;
  frequency: number; // 3-6 days per week
  trainingFocus: TrainingFocus;
  currentSplitIndex: number; // 0-based index for circular progression (0 = Split A)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Zod Schema**:
```typescript
// src/domains/workout-splits/schema.ts

import { z } from 'zod';

export const trainingFocusEnum = z.enum([
  'LEGS_LOWER_BODY',
  'ARMS_UPPER_BODY',
  'FULL_BODY_BALANCED',
  'CORE_FUNCTIONAL'
]);

export const workoutAssessmentSchema = z.object({
  frequency: z.number().int().min(3).max(6),
  trainingFocus: trainingFocusEnum
});

export type WorkoutAssessmentInput = z.infer<typeof workoutAssessmentSchema>;
```

**Prisma Schema**:
```prisma
// Add to prisma/schema.prisma

enum TrainingFocus {
  LEGS_LOWER_BODY
  ARMS_UPPER_BODY
  FULL_BODY_BALANCED
  CORE_FUNCTIONAL
}

model WorkoutAssessment {
  id                String        @id @default(cuid())
  frequency         Int           // 3-6 days per week
  trainingFocus     TrainingFocus
  currentSplitIndex Int           @default(0) // 0-based index for circular progression
  isActive          Boolean       @default(true)
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  // Relations
  userId            String
  user              User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  splits            WorkoutSplit[]

  @@unique([userId, isActive]) // Only one active assessment per user
  @@index([userId, isActive])
  @@map("workout_assessments")
}
```

---

#### **WorkoutSplit** (NEW - extends TrainingDivision concept)

Represents a single workout split (Split A, B, C, etc.) with completion tracking.

**TypeScript Interface**:
```typescript
// src/domains/workout-splits/types.ts

export interface WorkoutSplit {
  id: string;
  name: string; // "Split A", "Split B", etc.
  subtitle: string; // "Lower Body Focus", "Push Exercises", etc.
  splitLetter: string; // "A", "B", "C", etc.
  order: number; // 0-based order (0 = Split A)
  assessmentId: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  exercises: SplitExercise[];
}

export interface SplitWithProgress extends WorkoutSplit {
  totalExercises: number;
  completedExercises: number;
  isCurrent: boolean;
  lastCompletedAt?: Date;
}
```

**Zod Schema**:
```typescript
// src/domains/workout-splits/schema.ts

export const workoutSplitSchema = z.object({
  name: z.string().min(1).max(50),
  subtitle: z.string().min(1).max(100),
  splitLetter: z.string().length(1).regex(/^[A-F]$/),
  order: z.number().int().min(0).max(5)
});
```

**Prisma Schema**:
```prisma
model WorkoutSplit {
  id           String   @id @default(cuid())
  name         String   // "Split A", "Split B"
  subtitle     String   // "Lower Body Focus"
  splitLetter  String   @db.VarChar(1) // "A", "B", "C"
  order        Int      // 0-based order
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  assessmentId String
  assessment   WorkoutAssessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)

  exercises    SplitExercise[]
  sessions     WorkoutSession[] // Sessions that used this split

  @@unique([assessmentId, splitLetter])
  @@index([assessmentId])
  @@map("workout_splits")
}
```

---

#### **SplitExercise** (NEW - similar to DivisionExercise)

Links exercises to workout splits with ordering and target parameters.

**TypeScript Interface**:
```typescript
// src/domains/workout-splits/types.ts

export interface SplitExercise {
  id: string;
  splitId: string;
  exerciseId: string;
  order: number;
  targetSets: number;
  targetReps: string; // "8-12", "10", "AMRAP"
  targetWeight?: number;
  restSeconds?: number;
  videoId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  exercise: Exercise;
}

export interface SplitExerciseWithCompletion extends SplitExercise {
  isCompleted: boolean; // Derived from current session
}
```

**Zod Schema**:
```typescript
// src/domains/workout-splits/schema.ts

export const splitExerciseSchema = z.object({
  exerciseId: z.string().cuid(),
  order: z.number().int().min(0),
  targetSets: z.number().int().min(1).max(10),
  targetReps: z.string().min(1).max(20), // "8-12", "10", "AMRAP"
  targetWeight: z.number().positive().optional(),
  restSeconds: z.number().int().min(0).max(600).optional(),
  videoId: z.string().length(11).optional(), // YouTube video ID
  notes: z.string().max(500).optional()
});
```

**Prisma Schema**:
```prisma
model SplitExercise {
  id           String   @id @default(cuid())
  order        Int      // Order within split
  targetSets   Int      // Target number of sets
  targetReps   String   // "8-12", "10", "AMRAP"
  targetWeight Float?   // Target weight in kg
  restSeconds  Int?     // Rest time between sets
  videoId      String?  @db.VarChar(11) // YouTube video ID
  notes        String?  @db.Text
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  splitId      String
  split        WorkoutSplit @relation(fields: [splitId], references: [id], onDelete: Cascade)

  exerciseId   String
  exercise     Exercise @relation(fields: [exerciseId], references: [id], onDelete: Restrict)

  @@unique([splitId, exerciseId])
  @@index([splitId])
  @@index([exerciseId])
  @@map("split_exercises")
}
```

---

#### **WeightHistory** (NEW - denormalized for performance)

Denormalized table for fast weight history queries (last N sessions per exercise).

**TypeScript Interface**:
```typescript
// src/domains/workout-splits/types.ts

export interface WeightHistoryEntry {
  id: string;
  exerciseId: string;
  userId: string;
  sessionId: string;
  weight: number;
  reps: number;
  setNumber: number;
  completedAt: Date;

  // Relations
  exercise: Exercise;
}

export interface ExerciseWeightHistory {
  exerciseId: string;
  exerciseName: string;
  history: WeightHistoryEntry[];
  lastWeight?: number;
  lastReps?: number;
  trend?: 'increasing' | 'decreasing' | 'stable';
}
```

**Zod Schema**:
```typescript
// src/domains/workout-splits/schema.ts

export const weightHistorySchema = z.object({
  weight: z.number().positive(),
  reps: z.number().int().min(1).max(100),
  setNumber: z.number().int().min(1).max(10)
});
```

**Prisma Schema**:
```prisma
model WeightHistory {
  id          String   @id @default(cuid())
  weight      Float    // Weight in kg
  reps        Int      // Reps completed
  setNumber   Int      // Which set (1, 2, 3...)
  completedAt DateTime @default(now())

  // Relations
  exerciseId  String
  exercise    Exercise @relation(fields: [exerciseId], references: [id], onDelete: Cascade)

  userId      String
  user        User @relation(fields: [userId], references: [id], onDelete: Cascade)

  sessionId   String
  session     WorkoutSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@index([exerciseId, userId, completedAt(sort: Desc)]) // Fast "last N sessions" query
  @@index([userId, completedAt(sort: Desc)])
  @@map("weight_history")
}
```

---

### 1.2 Modified Entities

#### **WorkoutSession** (MODIFIED)

Add fields to link sessions to workout splits and assessments.

**New Fields**:
```prisma
model WorkoutSession {
  // ... existing fields ...

  // NEW FIELDS
  splitId       String?
  split         WorkoutSplit? @relation(fields: [splitId], references: [id], onDelete: SetNull)

  assessmentId  String?
  assessment    WorkoutAssessment? @relation(fields: [assessmentId], references: [id], onDelete: SetNull)

  weightHistory WeightHistory[] // NEW relation

  // ... existing relations ...

  @@index([userId, splitId])
  @@index([assessmentId])
}
```

**Migration Strategy**: Add nullable fields, backfill later if needed.

---

#### **User** (MODIFIED)

Add relation to WorkoutAssessment and WeightHistory.

**New Relations**:
```prisma
model User {
  // ... existing fields ...

  workoutAssessments WorkoutAssessment[]
  weightHistory      WeightHistory[]

  // ... existing relations ...
}
```

---

#### **Exercise** (MODIFIED)

Add relation to SplitExercise and WeightHistory.

**New Relations**:
```prisma
model Exercise {
  // ... existing fields ...

  splitExercises SplitExercise[]
  weightHistory  WeightHistory[]

  // ... existing relations ...
}
```

---

## 2. Business Logic

### 2.1 Split Generation Algorithm

**Function**: `generateWorkoutSplits(assessment: WorkoutAssessmentInput, userId: string): Promise<WorkoutSplit[]>`

**Algorithm**:

```typescript
// Pseudo-code for split generation

function generateWorkoutSplits(
  frequency: number,
  trainingFocus: TrainingFocus,
  userId: string
): WorkoutSplit[] {
  const splits: WorkoutSplit[] = [];
  const splitLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  // Step 1: Determine split structure based on focus
  const splitStructure = getSplitStructure(frequency, trainingFocus);

  // Step 2: Get exercise pool for focus
  const exercisePool = getExercisePoolByFocus(trainingFocus);

  // Step 3: Create splits
  for (let i = 0; i < frequency; i++) {
    const splitLetter = splitLetters[i];
    const splitConfig = splitStructure[i];

    const split: WorkoutSplit = {
      name: `Split ${splitLetter}`,
      subtitle: splitConfig.subtitle,
      splitLetter: splitLetter,
      order: i,
      exercises: distributeExercises(exercisePool, splitConfig.focusAreas, i)
    };

    splits.push(split);
  }

  return splits;
}

// Example split structure for LEGS_LOWER_BODY focus with 4 days
function getSplitStructure(frequency: number, focus: TrainingFocus) {
  const structures = {
    LEGS_LOWER_BODY: {
      3: [
        { subtitle: 'Quad Dominant', focusAreas: ['QUADS', 'CORE'] },
        { subtitle: 'Hip Dominant', focusAreas: ['HAMSTRINGS', 'GLUTES'] },
        { subtitle: 'Upper Body', focusAreas: ['CHEST', 'BACK', 'SHOULDERS'] }
      ],
      4: [
        { subtitle: 'Quad Focus', focusAreas: ['QUADS'] },
        { subtitle: 'Hip & Hamstring', focusAreas: ['HAMSTRINGS', 'GLUTES'] },
        { subtitle: 'Upper Push', focusAreas: ['CHEST', 'SHOULDERS'] },
        { subtitle: 'Upper Pull & Core', focusAreas: ['BACK', 'CORE'] }
      ],
      // ... more configurations
    },
    // ... other focus types
  };

  return structures[focus][frequency];
}

// Distribute exercises across splits
function distributeExercises(
  exercisePool: Exercise[],
  focusAreas: ExerciseCategory[],
  splitIndex: number
): SplitExercise[] {
  // Filter exercises by focus areas
  const relevantExercises = exercisePool.filter(ex =>
    focusAreas.includes(ex.category)
  );

  // Select 5-8 exercises based on:
  // - Compound movements first (e.g., squats, deadlifts)
  // - Progressive overload-friendly exercises
  // - Variety across muscle groups

  const selectedExercises = selectExercises(relevantExercises, splitIndex);

  // Map to SplitExercise with order, target sets/reps
  return selectedExercises.map((ex, index) => ({
    exerciseId: ex.id,
    order: index,
    targetSets: determineTargetSets(ex),
    targetReps: determineTargetReps(ex),
    restSeconds: determineRestTime(ex)
  }));
}
```

**Business Rules**:
- Each split has 5-8 exercises (BR-2.3)
- Compound exercises prioritized
- Balanced volume distribution across week
- Progressive overload-friendly exercise selection

---

### 2.2 Circular Progression Logic

**Function**: `advanceToNextSplit(assessmentId: string): Promise<void>`

**Algorithm**:

```typescript
async function advanceToNextSplit(assessmentId: string): Promise<void> {
  // Step 1: Get current assessment
  const assessment = await getAssessment(assessmentId);

  // Step 2: Get total split count
  const totalSplits = assessment.frequency;

  // Step 3: Calculate next index (circular)
  const nextIndex = (assessment.currentSplitIndex + 1) % totalSplits;

  // Step 4: Update assessment with next index
  await updateAssessment(assessmentId, { currentSplitIndex: nextIndex });
}

// Get current split
async function getCurrentSplit(assessmentId: string): Promise<WorkoutSplit | null> {
  const assessment = await getAssessment(assessmentId);
  const splits = await getSplitsByAssessment(assessmentId);

  return splits.find(split => split.order === assessment.currentSplitIndex) || null;
}
```

**Example Progression** (4-day split):
- Initial: `currentSplitIndex = 0` (Split A)
- After first workout: `currentSplitIndex = 1` (Split B)
- After second workout: `currentSplitIndex = 2` (Split C)
- After third workout: `currentSplitIndex = 3` (Split D)
- After fourth workout: `currentSplitIndex = 0` (Split A - circular)

---

### 2.3 Completion Validation Rules

**Function**: `validateWorkoutCompletion(sessionId: string): Promise<ValidationResult>`

**Validation Rules**:

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

async function validateWorkoutCompletion(sessionId: string): Promise<ValidationResult> {
  const session = await getWorkoutSession(sessionId);
  const exercises = await getWorkoutExercises(sessionId);
  const errors: string[] = [];
  const warnings: string[] = [];

  // Rule 1: All exercises must have at least 1 completed set
  const exercisesWithNoSets = exercises.filter(ex =>
    ex.sets.filter(set => set.isCompleted).length === 0
  );

  if (exercisesWithNoSets.length > 0) {
    errors.push(`${exercisesWithNoSets.length} exercises have no completed sets`);
  }

  // Rule 2: Warn if session duration is < 15 min or > 180 min
  const duration = session.duration || 0;
  if (duration < 900) { // 15 min
    warnings.push('Workout seems very short (< 15 min)');
  } else if (duration > 10800) { // 3 hours
    warnings.push('Workout seems very long (> 3 hours)');
  }

  // Rule 3: Warn if less than 50% of target sets completed
  const totalTargetSets = exercises.reduce((sum, ex) => sum + ex.targetSets, 0);
  const completedSets = exercises.reduce((sum, ex) =>
    sum + ex.sets.filter(s => s.isCompleted).length, 0
  );

  if (completedSets < totalTargetSets * 0.5) {
    warnings.push('Less than 50% of target sets completed');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
```

**Business Rules**:
- At least 1 completed set per exercise (BR-3.2)
- Optional: Warn if workout too short/long
- Optional: Warn if low completion rate

---

### 2.4 Weight History Aggregation

**Function**: `getWeightHistoryForExercise(exerciseId: string, userId: string, limit: number): Promise<ExerciseWeightHistory>`

**Algorithm**:

```typescript
async function getWeightHistoryForExercise(
  exerciseId: string,
  userId: string,
  limit: number = 5
): Promise<ExerciseWeightHistory> {
  // Query denormalized WeightHistory table
  const history = await db.weightHistory.findMany({
    where: {
      exerciseId,
      userId
    },
    orderBy: {
      completedAt: 'desc'
    },
    take: limit * 10, // Get more to group by session
    include: {
      exercise: true,
      session: {
        select: {
          id: true,
          completedAt: true
        }
      }
    }
  });

  // Group by session, take top set per session
  const sessionGroups = groupBySession(history);
  const topSetsPerSession = sessionGroups.map(group =>
    group.reduce((max, entry) => entry.weight > max.weight ? entry : max)
  );

  // Take last N sessions
  const recentHistory = topSetsPerSession.slice(0, limit);

  // Calculate trend
  const trend = calculateTrend(recentHistory);

  return {
    exerciseId,
    exerciseName: history[0]?.exercise.name || '',
    history: recentHistory,
    lastWeight: recentHistory[0]?.weight,
    lastReps: recentHistory[0]?.reps,
    trend
  };
}

function calculateTrend(history: WeightHistoryEntry[]): 'increasing' | 'decreasing' | 'stable' {
  if (history.length < 2) return 'stable';

  const recent = history.slice(0, 2);
  const older = history.slice(-2);

  const recentAvg = recent.reduce((sum, e) => sum + e.weight, 0) / recent.length;
  const olderAvg = older.reduce((sum, e) => sum + e.weight, 0) / older.length;

  const diff = recentAvg - olderAvg;

  if (diff > 2.5) return 'increasing'; // 2.5kg improvement
  if (diff < -2.5) return 'decreasing';
  return 'stable';
}
```

**Performance Considerations**:
- Index on `(exerciseId, userId, completedAt DESC)` for fast queries
- Denormalized table avoids complex joins
- Limit to last N sessions (default 5)

---

## 3. Server Actions (Data Access Layer)

Following the project's architecture pattern, **Server Actions replace traditional repositories**. All data access and mutations are performed through Server Actions with built-in validation, authorization, and error handling.

### 3.1 Pre-Assessment Actions

**File**: `src/domains/workout-splits/actions.ts`

```typescript
'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { workoutAssessmentSchema } from './schema';
import { generateWorkoutSplits } from './lib/split-generator';

/**
 * Create workout splits from pre-assessment
 * Generates N splits based on frequency and training focus
 */
export async function createWorkoutSplitsFromAssessment(
  prevState: any,
  formData: FormData
) {
  // 1. Authentication
  const session = await auth();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  // 2. Validation
  const validatedFields = workoutAssessmentSchema.safeParse({
    frequency: parseInt(formData.get('frequency') as string),
    trainingFocus: formData.get('trainingFocus')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const { frequency, trainingFocus } = validatedFields.data;

  try {
    // 3. Deactivate existing assessments
    await db.workoutAssessment.updateMany({
      where: {
        userId: session.user.id,
        isActive: true
      },
      data: {
        isActive: false
      }
    });

    // 4. Create new assessment
    const assessment = await db.workoutAssessment.create({
      data: {
        userId: session.user.id,
        frequency,
        trainingFocus,
        currentSplitIndex: 0,
        isActive: true
      }
    });

    // 5. Generate splits with exercises
    const splits = await generateWorkoutSplits(
      frequency,
      trainingFocus,
      session.user.id
    );

    // 6. Create splits in database
    for (const split of splits) {
      await db.workoutSplit.create({
        data: {
          assessmentId: assessment.id,
          name: split.name,
          subtitle: split.subtitle,
          splitLetter: split.splitLetter,
          order: split.order,
          exercises: {
            create: split.exercises
          }
        }
      });
    }

    // 7. Revalidate
    revalidatePath('/my-workout');

    return {
      success: true,
      assessmentId: assessment.id,
      splitCount: splits.length
    };
  } catch (error) {
    console.error('Failed to create assessment:', error);
    return { error: 'Failed to create workout plan' };
  }
}

/**
 * Get active assessment for current user
 */
export async function getActiveAssessment() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  return await db.workoutAssessment.findFirst({
    where: {
      userId: session.user.id,
      isActive: true
    },
    include: {
      splits: {
        include: {
          exercises: {
            include: {
              exercise: true
            },
            orderBy: {
              order: 'asc'
            }
          }
        },
        orderBy: {
          order: 'asc'
        }
      }
    }
  });
}
```

---

### 3.2 Workout Split Actions

```typescript
/**
 * Get workout split with exercises and completion status
 */
export async function getWorkoutSplitWithProgress(splitId: string) {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  // Get split with exercises
  const split = await db.workoutSplit.findFirst({
    where: {
      id: splitId,
      assessment: {
        userId: session.user.id
      }
    },
    include: {
      exercises: {
        include: {
          exercise: true
        },
        orderBy: {
          order: 'asc'
        }
      },
      sessions: {
        where: {
          status: 'COMPLETED'
        },
        orderBy: {
          completedAt: 'desc'
        },
        take: 1,
        select: {
          completedAt: true
        }
      }
    }
  });

  if (!split) return null;

  // Check if this is the current split
  const assessment = await db.workoutAssessment.findFirst({
    where: {
      splits: {
        some: {
          id: splitId
        }
      }
    }
  });

  const isCurrent = assessment?.currentSplitIndex === split.order;

  return {
    ...split,
    totalExercises: split.exercises.length,
    completedExercises: 0, // Will be calculated from active session
    isCurrent,
    lastCompletedAt: split.sessions[0]?.completedAt
  };
}

/**
 * Get current workout split (based on currentSplitIndex)
 */
export async function getCurrentWorkoutSplit() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const assessment = await db.workoutAssessment.findFirst({
    where: {
      userId: session.user.id,
      isActive: true
    },
    include: {
      splits: {
        include: {
          exercises: {
            include: {
              exercise: true
            },
            orderBy: {
              order: 'asc'
            }
          }
        },
        orderBy: {
          order: 'asc'
        }
      }
    }
  });

  if (!assessment) return null;

  const currentSplit = assessment.splits[assessment.currentSplitIndex];

  return currentSplit;
}
```

---

### 3.3 Workout Session Actions

```typescript
/**
 * Start a new workout session for a split
 */
export async function startWorkoutSession(splitId: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  // Verify split belongs to user
  const split = await db.workoutSplit.findFirst({
    where: {
      id: splitId,
      assessment: {
        userId: session.user.id
      }
    },
    include: {
      assessment: true,
      exercises: {
        include: {
          exercise: true
        },
        orderBy: {
          order: 'asc'
        }
      }
    }
  });

  if (!split) {
    return { error: 'Split not found' };
  }

  try {
    // Create workout session
    const workoutSession = await db.workoutSession.create({
      data: {
        userId: session.user.id,
        splitId: split.id,
        assessmentId: split.assessmentId,
        status: 'IN_PROGRESS',
        exercises: {
          create: split.exercises.map((ex, index) => ({
            exerciseId: ex.exerciseId,
            order: index,
            restSeconds: ex.restSeconds,
            notes: ex.notes
          }))
        }
      },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: true
          }
        }
      }
    });

    revalidatePath('/my-workout');

    return {
      success: true,
      sessionId: workoutSession.id
    };
  } catch (error) {
    console.error('Failed to start session:', error);
    return { error: 'Failed to start workout' };
  }
}

/**
 * Finalize workout session
 * - Validates completion
 * - Advances to next split
 * - Updates weight history
 */
export async function finalizeWorkout(sessionId: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  // Get session with exercises and sets
  const workoutSession = await db.workoutSession.findFirst({
    where: {
      id: sessionId,
      userId: session.user.id
    },
    include: {
      exercises: {
        include: {
          sets: true
        }
      },
      split: {
        include: {
          assessment: true
        }
      }
    }
  });

  if (!workoutSession) {
    return { error: 'Session not found' };
  }

  if (workoutSession.status === 'COMPLETED') {
    return { error: 'Session already completed' };
  }

  // Validation
  const validation = await validateWorkoutCompletion(sessionId);
  if (!validation.isValid) {
    return {
      error: 'Workout incomplete',
      details: validation.errors
    };
  }

  try {
    // Calculate duration
    const duration = Math.floor(
      (new Date().getTime() - workoutSession.startedAt.getTime()) / 1000
    );

    // Update session status
    await db.workoutSession.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        duration
      }
    });

    // Update weight history (denormalized)
    for (const exercise of workoutSession.exercises) {
      for (const set of exercise.sets) {
        if (set.isCompleted) {
          await db.weightHistory.create({
            data: {
              exerciseId: exercise.exerciseId,
              userId: session.user.id,
              sessionId: sessionId,
              weight: set.weight,
              reps: set.reps,
              setNumber: set.setNumber,
              completedAt: set.completedAt || new Date()
            }
          });
        }
      }
    }

    // Advance to next split
    if (workoutSession.split?.assessment) {
      const totalSplits = workoutSession.split.assessment.frequency;
      const nextIndex = (workoutSession.split.assessment.currentSplitIndex + 1) % totalSplits;

      await db.workoutAssessment.update({
        where: { id: workoutSession.split.assessmentId },
        data: {
          currentSplitIndex: nextIndex
        }
      });
    }

    revalidatePath('/my-workout');

    return {
      success: true,
      warnings: validation.warnings
    };
  } catch (error) {
    console.error('Failed to finalize workout:', error);
    return { error: 'Failed to complete workout' };
  }
}
```

---

### 3.4 Weight Tracking Actions

```typescript
/**
 * Record weight and reps for a set
 */
export async function recordSetData(
  setId: string,
  weight: number,
  reps: number
) {
  const session = await auth();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  // Validate ownership
  const set = await db.workoutSet.findFirst({
    where: {
      id: setId,
      workoutExercise: {
        workoutSession: {
          userId: session.user.id
        }
      }
    }
  });

  if (!set) {
    return { error: 'Set not found' };
  }

  try {
    await db.workoutSet.update({
      where: { id: setId },
      data: {
        weight,
        reps,
        isCompleted: true,
        completedAt: new Date()
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to record set:', error);
    return { error: 'Failed to save set data' };
  }
}

/**
 * Get weight history for an exercise (last N sessions)
 */
export async function getWeightHistory(
  exerciseId: string,
  limit: number = 5
) {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const history = await db.weightHistory.findMany({
    where: {
      exerciseId,
      userId: session.user.id
    },
    orderBy: {
      completedAt: 'desc'
    },
    take: limit * 10, // Get more to group by session
    include: {
      exercise: {
        select: {
          name: true
        }
      },
      session: {
        select: {
          id: true,
          completedAt: true
        }
      }
    }
  });

  // Group by session
  const sessionMap = new Map<string, typeof history>();

  for (const entry of history) {
    const sessionId = entry.sessionId;
    if (!sessionMap.has(sessionId)) {
      sessionMap.set(sessionId, []);
    }
    sessionMap.get(sessionId)!.push(entry);
  }

  // Take top set per session
  const topSets = Array.from(sessionMap.values())
    .map(sets => sets.reduce((max, entry) =>
      entry.weight > max.weight ? entry : max
    ))
    .slice(0, limit);

  return {
    exerciseId,
    exerciseName: history[0]?.exercise.name || '',
    history: topSets,
    lastWeight: topSets[0]?.weight,
    lastReps: topSets[0]?.reps
  };
}
```

---

### 3.5 Calendar Actions

```typescript
/**
 * Get workout completion dates for calendar
 */
export async function getWorkoutCompletionDates(
  startDate?: Date,
  endDate?: Date
) {
  const session = await auth();
  if (!session?.user) {
    return [];
  }

  const where: any = {
    userId: session.user.id,
    status: 'COMPLETED',
    completedAt: {
      not: null
    }
  };

  if (startDate && endDate) {
    where.completedAt = {
      gte: startDate,
      lte: endDate
    };
  }

  const completedSessions = await db.workoutSession.findMany({
    where,
    select: {
      completedAt: true,
      split: {
        select: {
          name: true,
          splitLetter: true
        }
      }
    },
    orderBy: {
      completedAt: 'desc'
    }
  });

  return completedSessions.map(session => ({
    date: session.completedAt!,
    splitName: session.split?.name,
    splitLetter: session.split?.splitLetter
  }));
}
```

---

## 4. State Management Strategy

### 4.1 Server State (React Query)

**Use React Query for ALL server data** (follows critical constraint #7).

**React Query Hooks**:

**File**: `src/domains/workout-splits/hooks/use-workout-splits.ts`

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getActiveAssessment,
  getCurrentWorkoutSplit,
  getWorkoutSplitWithProgress,
  startWorkoutSession,
  finalizeWorkout,
  getWeightHistory,
  getWorkoutCompletionDates
} from '../actions';

/**
 * Get active assessment with all splits
 */
export function useActiveAssessment() {
  return useQuery({
    queryKey: ['workout-assessment', 'active'],
    queryFn: getActiveAssessment,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

/**
 * Get current workout split
 */
export function useCurrentWorkoutSplit() {
  return useQuery({
    queryKey: ['workout-split', 'current'],
    queryFn: getCurrentWorkoutSplit,
    staleTime: 2 * 60 * 1000 // 2 minutes
  });
}

/**
 * Get specific split with progress
 */
export function useWorkoutSplit(splitId: string) {
  return useQuery({
    queryKey: ['workout-split', splitId],
    queryFn: () => getWorkoutSplitWithProgress(splitId),
    enabled: !!splitId
  });
}

/**
 * Get weight history for exercise
 */
export function useWeightHistory(exerciseId: string, limit: number = 5) {
  return useQuery({
    queryKey: ['weight-history', exerciseId, limit],
    queryFn: () => getWeightHistory(exerciseId, limit),
    enabled: !!exerciseId,
    staleTime: 10 * 60 * 1000 // 10 minutes
  });
}

/**
 * Get calendar completion dates
 */
export function useWorkoutCalendar(startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: ['workout-calendar', startDate, endDate],
    queryFn: () => getWorkoutCompletionDates(startDate, endDate),
    staleTime: 5 * 60 * 1000
  });
}

/**
 * Start workout session mutation
 */
export function useStartWorkoutSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startWorkoutSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-split'] });
    }
  });
}

/**
 * Finalize workout mutation
 */
export function useFinalizeWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finalizeWorkout,
    onSuccess: () => {
      // Invalidate all workout-related queries
      queryClient.invalidateQueries({ queryKey: ['workout-split'] });
      queryClient.invalidateQueries({ queryKey: ['workout-assessment'] });
      queryClient.invalidateQueries({ queryKey: ['workout-calendar'] });
      queryClient.invalidateQueries({ queryKey: ['weight-history'] });
    }
  });
}
```

**Why React Query?**
- ✅ Automatic caching and background refetching
- ✅ Automatic loading and error states
- ✅ Optimistic updates support
- ✅ Request deduplication
- ✅ Perfect for server state (follows critical constraints)

---

### 4.2 Client/UI State (Zustand - ONLY for UI)

**Use Zustand ONLY for UI state** (NOT server data).

**File**: `src/domains/workout-splits/stores/workout-ui-store.ts`

```typescript
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorkoutUIStore {
  // Calendar collapse state
  isCalendarCollapsed: boolean;
  toggleCalendar: () => void;

  // Exercise detail sheet open/close
  selectedExerciseId: string | null;
  openExerciseDetail: (exerciseId: string) => void;
  closeExerciseDetail: () => void;

  // Active workout session ID (in-progress)
  activeSessionId: string | null;
  setActiveSessionId: (sessionId: string | null) => void;
}

export const useWorkoutUIStore = create<WorkoutUIStore>()(
  persist(
    (set) => ({
      isCalendarCollapsed: false,
      toggleCalendar: () => set(state => ({
        isCalendarCollapsed: !state.isCalendarCollapsed
      })),

      selectedExerciseId: null,
      openExerciseDetail: (exerciseId) => set({ selectedExerciseId: exerciseId }),
      closeExerciseDetail: () => set({ selectedExerciseId: null }),

      activeSessionId: null,
      setActiveSessionId: (sessionId) => set({ activeSessionId: sessionId })
    }),
    {
      name: 'workout-ui-storage',
      partialize: (state) => ({
        isCalendarCollapsed: state.isCalendarCollapsed,
        activeSessionId: state.activeSessionId
      })
    }
  )
);
```

**Important**: This store is ONLY for UI state. Never use Zustand for workout data, splits, or weight history.

---

### 4.3 Form State (React Hook Form)

**Use React Hook Form for pre-assessment form**.

**File**: `src/domains/workout-splits/components/organisms/pre-assessment-form.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workoutAssessmentSchema } from '../../schema';
import type { WorkoutAssessmentInput } from '../../types';

export function PreAssessmentForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<WorkoutAssessmentInput>({
    resolver: zodResolver(workoutAssessmentSchema)
  });

  const onSubmit = async (data: WorkoutAssessmentInput) => {
    // Convert to FormData and call Server Action
    const formData = new FormData();
    formData.append('frequency', data.frequency.toString());
    formData.append('trainingFocus', data.trainingFocus);

    const result = await createWorkoutSplitsFromAssessment(null, formData);

    if (result.success) {
      // Navigate to dashboard
      window.location.href = '/my-workout';
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

---

## 5. Migration Strategy

### 5.1 Migration from Routine to WorkoutSplit

**Goal**: Preserve existing user data while transitioning to new system.

**Approach**: Phased migration with grace period.

**Phase 1: Additive (No Breaking Changes)**
- Add new tables: `WorkoutAssessment`, `WorkoutSplit`, `SplitExercise`, `WeightHistory`
- Add nullable fields to `WorkoutSession`: `splitId`, `assessmentId`
- Keep existing `Routine`, `TrainingDivision`, `DivisionExercise` tables
- Both systems coexist

**Phase 2: Migration Prompt**
- Show in-app banner for existing users: "Upgrade to Workout Splits"
- Provide migration wizard:
  1. Analyze existing routine structure
  2. Suggest pre-assessment values based on routine
  3. Map `TrainingDivision` → `WorkoutSplit`
  4. Map `DivisionExercise` → `SplitExercise`
  5. Link historical `WorkoutSession` records to new splits (best-effort)

**Phase 3: Backfill Weight History**
- Background job to populate `WeightHistory` from existing `WorkoutSet` records
- SQL query:
```sql
INSERT INTO weight_history (exercise_id, user_id, session_id, weight, reps, set_number, completed_at)
SELECT
  we.exercise_id,
  ws.user_id,
  ws.id,
  wset.weight,
  wset.reps,
  wset.set_number,
  wset.completed_at
FROM workout_sets wset
JOIN workout_exercises we ON wset.workout_exercise_id = we.id
JOIN workout_sessions ws ON we.workout_session_id = ws.id
WHERE wset.is_completed = true
  AND wset.completed_at IS NOT NULL;
```

**Phase 4: Deprecation (after 60 days)**
- Hide "Routines" tab from navigation
- Mark `Routine` system as deprecated
- Keep data intact (no deletion)
- Archive old routines

**Rollback Strategy**:
- Keep both systems active during grace period
- If issues arise, toggle feature flag to revert to Routine system
- New data created in WorkoutSplit system is preserved

---

### 5.2 Migration Script

**File**: `scripts/migrate-routines-to-splits.ts`

```typescript
import { db } from '@/lib/db';

async function migrateUserRoutineToSplits(userId: string) {
  // Get active routine
  const routine = await db.routine.findFirst({
    where: {
      userId,
      isActive: true
    },
    include: {
      divisions: {
        include: {
          exercises: {
            include: {
              exercise: true
            }
          }
        }
      }
    }
  });

  if (!routine) {
    console.log(`No active routine for user ${userId}`);
    return;
  }

  // Infer assessment from routine
  const frequency = routine.divisions.length;
  const trainingFocus = inferTrainingFocus(routine.divisions);

  // Create assessment
  const assessment = await db.workoutAssessment.create({
    data: {
      userId,
      frequency: Math.min(Math.max(frequency, 3), 6),
      trainingFocus,
      currentSplitIndex: 0,
      isActive: true
    }
  });

  // Migrate divisions to splits
  for (const division of routine.divisions) {
    const split = await db.workoutSplit.create({
      data: {
        assessmentId: assessment.id,
        name: `Split ${String.fromCharCode(65 + division.order)}`, // A, B, C...
        subtitle: division.description || division.name,
        splitLetter: String.fromCharCode(65 + division.order),
        order: division.order
      }
    });

    // Migrate exercises
    for (const divExercise of division.exercises) {
      await db.splitExercise.create({
        data: {
          splitId: split.id,
          exerciseId: divExercise.exerciseId,
          order: divExercise.order,
          targetSets: divExercise.targetSets,
          targetReps: divExercise.targetReps,
          targetWeight: divExercise.targetWeight,
          restSeconds: divExercise.restSeconds,
          videoId: divExercise.videoId,
          notes: divExercise.notes
        }
      });
    }
  }

  // Archive old routine
  await db.routine.update({
    where: { id: routine.id },
    data: {
      isActive: false,
      isArchived: true
    }
  });

  console.log(`Migrated user ${userId} successfully`);
}

function inferTrainingFocus(divisions: any[]): string {
  // Simple heuristic: count exercises by category
  const categoryCount = new Map<string, number>();

  for (const division of divisions) {
    for (const ex of division.exercises) {
      const category = ex.exercise.category;
      categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
    }
  }

  const topCategory = Array.from(categoryCount.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  if (topCategory === 'LEGS') return 'LEGS_LOWER_BODY';
  if (topCategory === 'ARMS' || topCategory === 'CHEST' || topCategory === 'SHOULDERS') {
    return 'ARMS_UPPER_BODY';
  }
  if (topCategory === 'CORE') return 'CORE_FUNCTIONAL';

  return 'FULL_BODY_BALANCED';
}
```

---

## 6. Database Considerations

### 6.1 Indexes for Performance

**Critical Indexes**:

```prisma
// WorkoutAssessment
@@unique([userId, isActive]) // Fast lookup for active assessment
@@index([userId, isActive])

// WorkoutSplit
@@unique([assessmentId, splitLetter]) // Unique split letters per assessment
@@index([assessmentId]) // Fast lookup by assessment

// SplitExercise
@@unique([splitId, exerciseId]) // No duplicate exercises per split
@@index([splitId]) // Fast lookup by split
@@index([exerciseId]) // Fast lookup for exercise usage

// WeightHistory (CRITICAL)
@@index([exerciseId, userId, completedAt(sort: Desc)]) // Fast "last N sessions" query
@@index([userId, completedAt(sort: Desc)]) // Fast user history

// WorkoutSession
@@index([userId, splitId]) // Fast session lookup by split
@@index([assessmentId]) // Fast session lookup by assessment
```

**Query Performance Targets**:
- Get active assessment: < 50ms
- Get current split with exercises: < 100ms
- Get weight history (5 sessions): < 50ms
- Get calendar dates (90 days): < 100ms

---

### 6.2 Denormalization Strategy

**WeightHistory Table (Denormalized)**

**Why denormalize?**
- Avoid complex joins across `WorkoutSession` → `WorkoutExercise` → `WorkoutSet`
- Fast queries for "last N sessions per exercise"
- Optimized for read-heavy workload (users check history often)

**Trade-offs**:
- ✅ 10x faster queries for weight history
- ✅ Simple index: `(exerciseId, userId, completedAt DESC)`
- ❌ Duplicate data (weight, reps stored twice)
- ❌ Must maintain consistency (write to both `WorkoutSet` and `WeightHistory`)

**Consistency Strategy**:
- Write to `WeightHistory` in `finalizeWorkout` Server Action
- Validate with background job (nightly check for missing entries)

---

### 6.3 Cascading Deletes

**Delete Cascade Rules**:

```prisma
// If User deleted → cascade delete all assessments, weight history
WorkoutAssessment: onDelete: Cascade
WeightHistory: onDelete: Cascade

// If Assessment deleted → cascade delete splits
WorkoutSplit: onDelete: Cascade

// If Split deleted → cascade delete split exercises
SplitExercise: onDelete: Cascade

// If Session deleted → cascade delete weight history
WeightHistory (sessionId): onDelete: Cascade

// If Exercise deleted → RESTRICT (prevent deletion if used in splits)
SplitExercise (exerciseId): onDelete: Restrict
```

**Rationale**:
- User deletion: Full cleanup (GDPR compliance)
- Assessment deletion: Remove entire workout plan
- Exercise deletion: Prevent if used (data integrity)

---

## 7. Text Externalization

**All user-facing text MUST be externalized** (critical constraint).

**File**: `src/domains/workout-splits/workout-splits.text-map.ts`

```typescript
export const workoutSplitsText = {
  // Pre-assessment
  assessment: {
    title: 'Create Your Workout Plan',
    subtitle: 'Answer a few questions to get started',
    frequencyLabel: 'How many days per week can you train?',
    frequencyHint: 'Choose between 3-6 days for best results',
    focusLabel: "What's your training priority?",
    focusOptions: {
      LEGS_LOWER_BODY: 'Legs & Lower Body',
      ARMS_UPPER_BODY: 'Arms & Upper Body',
      FULL_BODY_BALANCED: 'Full Body Balanced',
      CORE_FUNCTIONAL: 'Core & Functional'
    },
    submitButton: 'Generate My Workout Plan',
    submitting: 'Creating your plan...'
  },

  // Dashboard
  dashboard: {
    title: 'My Workout',
    currentBadge: 'CURRENT',
    nextBadge: 'NEXT',
    completedBadge: 'COMPLETED',
    exerciseCount: (count: number) => `${count} exercise${count !== 1 ? 's' : ''}`,
    lastCompleted: (date: Date) => `Last: ${date.toLocaleDateString()}`,
    startWorkout: 'Start Workout',
    continueWorkout: 'Continue Workout'
  },

  // Split detail
  splitDetail: {
    title: (letter: string) => `Split ${letter}`,
    progress: (completed: number, total: number) => `${completed} of ${total} exercises`,
    checkboxLabel: (name: string) => `Mark ${name} as complete`,
    finalizeButton: 'Finalize Workout',
    finalizeDisabled: 'Complete all exercises first',
    finalizing: 'Saving workout...'
  },

  // Exercise detail
  exerciseDetail: {
    title: 'Exercise Details',
    targetSets: (sets: number) => `${sets} set${sets !== 1 ? 's' : ''}`,
    targetReps: (reps: string) => `${reps} reps`,
    weightLabel: 'Weight (kg)',
    repsLabel: 'Reps',
    notesLabel: 'Notes',
    weightHistory: 'Weight History',
    noHistory: 'Complete this exercise to start tracking progress',
    lastSession: (weight: number, reps: number) => `Last: ${weight}kg × ${reps} reps`,
    trend: {
      increasing: 'Increasing',
      decreasing: 'Decreasing',
      stable: 'Stable'
    }
  },

  // Calendar
  calendar: {
    title: 'Training Calendar',
    toggle: 'Show/Hide Calendar',
    completedDay: (splitLetter: string) => `Completed Split ${splitLetter}`,
    noWorkouts: 'No workouts this month'
  },

  // Errors
  errors: {
    loadFailed: 'Failed to load workout data',
    saveFailed: 'Failed to save workout',
    unauthorized: 'Please log in to continue',
    notFound: 'Workout not found'
  },

  // Success messages
  success: {
    workoutCompleted: 'Workout completed!',
    planCreated: 'Workout plan created successfully',
    setRecorded: 'Set recorded'
  }
};
```

---

## 8. Implementation Phases

### Phase 1: Database Schema & Core Entities (Week 1)
- [ ] Create Prisma schema migrations
- [ ] Add new models: `WorkoutAssessment`, `WorkoutSplit`, `SplitExercise`, `WeightHistory`
- [ ] Modify `WorkoutSession`, `User`, `Exercise` models
- [ ] Run migrations
- [ ] Create TypeScript types and Zod schemas

### Phase 2: Server Actions & Business Logic (Week 2)
- [ ] Implement pre-assessment Server Actions
- [ ] Implement split generation algorithm
- [ ] Implement workout session Server Actions
- [ ] Implement weight tracking Server Actions
- [ ] Implement calendar Server Actions
- [ ] Create validation functions

### Phase 3: React Query Hooks & State Management (Week 3)
- [ ] Create React Query hooks for all data fetching
- [ ] Create Zustand store for UI state only
- [ ] Create custom hooks for business logic
- [ ] Test optimistic updates

### Phase 4: Migration Tools (Week 4)
- [ ] Create migration script (Routine → WorkoutSplit)
- [ ] Create weight history backfill script
- [ ] Test migration on staging data
- [ ] Create rollback procedures

---

## 9. Success Metrics

### Performance Metrics
- Get active assessment: < 50ms (p95)
- Get current split: < 100ms (p95)
- Weight history query: < 50ms (p95)
- Finalize workout: < 500ms (p95)

### Data Integrity Metrics
- 100% weight history entries have matching WorkoutSet
- 0% orphaned SplitExercise records
- 100% WorkoutSession records linked to valid splits

### User Metrics
- 90%+ complete pre-assessment (business requirement)
- 80%+ complete first workout (business requirement)
- 75%+ view weight history (business requirement)

---

## 10. Next Steps

**For Parent Agent**:

1. **Review this plan** with product owner/team
2. **Execute Phase 1** (Database Schema):
   - Create Prisma migration files
   - Run migrations on development database
   - Generate Prisma client

3. **Execute Phase 2** (Server Actions):
   - Implement Server Actions in `src/domains/workout-splits/actions.ts`
   - Implement split generation logic in `src/domains/workout-splits/lib/split-generator.ts`
   - Create validation functions

4. **Execute Phase 3** (React Query):
   - Create hooks in `src/domains/workout-splits/hooks/`
   - Create UI store in `src/domains/workout-splits/stores/`

5. **Execute Phase 4** (Migration):
   - Test migration script
   - Prepare rollback plan

6. **Hand off to nextjs-builder** to implement:
   - Route structure: `/my-workout`, `/my-workout/splits/[splitId]`
   - Server Components for pages
   - Client Components for interactive elements

---

## Appendix A: Complete Prisma Schema Additions

```prisma
// Add to prisma/schema.prisma

enum TrainingFocus {
  LEGS_LOWER_BODY
  ARMS_UPPER_BODY
  FULL_BODY_BALANCED
  CORE_FUNCTIONAL
}

model WorkoutAssessment {
  id                String        @id @default(cuid())
  frequency         Int
  trainingFocus     TrainingFocus
  currentSplitIndex Int           @default(0)
  isActive          Boolean       @default(true)
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  userId            String
  user              User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  splits            WorkoutSplit[]
  sessions          WorkoutSession[]

  @@unique([userId, isActive])
  @@index([userId, isActive])
  @@map("workout_assessments")
}

model WorkoutSplit {
  id           String   @id @default(cuid())
  name         String
  subtitle     String
  splitLetter  String   @db.VarChar(1)
  order        Int
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  assessmentId String
  assessment   WorkoutAssessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)

  exercises    SplitExercise[]
  sessions     WorkoutSession[]

  @@unique([assessmentId, splitLetter])
  @@index([assessmentId])
  @@map("workout_splits")
}

model SplitExercise {
  id           String   @id @default(cuid())
  order        Int
  targetSets   Int
  targetReps   String
  targetWeight Float?
  restSeconds  Int?
  videoId      String?  @db.VarChar(11)
  notes        String?  @db.Text
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  splitId      String
  split        WorkoutSplit @relation(fields: [splitId], references: [id], onDelete: Cascade)

  exerciseId   String
  exercise     Exercise @relation(fields: [exerciseId], references: [id], onDelete: Restrict)

  @@unique([splitId, exerciseId])
  @@index([splitId])
  @@index([exerciseId])
  @@map("split_exercises")
}

model WeightHistory {
  id          String   @id @default(cuid())
  weight      Float
  reps        Int
  setNumber   Int
  completedAt DateTime @default(now())

  exerciseId  String
  exercise    Exercise @relation(fields: [exerciseId], references: [id], onDelete: Cascade)

  userId      String
  user        User @relation(fields: [userId], references: [id], onDelete: Cascade)

  sessionId   String
  session     WorkoutSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@index([exerciseId, userId, completedAt(sort: Desc)])
  @@index([userId, completedAt(sort: Desc)])
  @@map("weight_history")
}

// Modify existing models (add relations)

model User {
  // ... existing fields ...
  workoutAssessments WorkoutAssessment[]
  weightHistory      WeightHistory[]
}

model Exercise {
  // ... existing fields ...
  splitExercises SplitExercise[]
  weightHistory  WeightHistory[]
}

model WorkoutSession {
  // ... existing fields ...

  splitId       String?
  split         WorkoutSplit? @relation(fields: [splitId], references: [id], onDelete: SetNull)

  assessmentId  String?
  assessment    WorkoutAssessment? @relation(fields: [assessmentId], references: [id], onDelete: SetNull)

  weightHistory WeightHistory[]

  @@index([userId, splitId])
  @@index([assessmentId])
}
```

---

**End of Domain Architecture Plan**
