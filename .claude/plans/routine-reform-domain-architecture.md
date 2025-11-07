# Routine System Reform - Domain Architecture Plan

**Session ID**: `20251106_220103`
**Created**: 2025-11-06
**Status**: Architecture Design
**Phase**: Domain Layer Design

---

## 1. Database Schema Changes

### 1.1 Updated Prisma Schema

```prisma
 // ROUTINES DOMAIN - UPDATED

model Routine {
  id         String   @id @default(cuid())
  name       String
  isActive   Boolean  @default(false)
  isArchived Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // Relations
  userId     String
  user       User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  divisions       TrainingDivision[] // RENAMED from 'days'
  workoutSessions WorkoutSession[]

  @@index([userId, isActive])
  @@index([userId, isArchived])
  @@map("routines")
}

// RENAMED: RoutineDay → TrainingDivision
model TrainingDivision {
  id          String   @id @default(cuid())
  name        String   // e.g., "Push Day", "Upper Body"
  description String?  @db.VarChar(200) // NEW: Brief description
  frequency   Int      // NEW: Times per week (1-7), replaces dayOfWeek
  order       Int      // Order within routine (1, 2, 3...)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  routineId String
  routine   Routine @relation(fields: [routineId], references: [id], onDelete: Cascade)

  exercises DivisionExercise[] // RENAMED for clarity

  @@unique([routineId, name]) // NEW: Unique division names per routine
  @@index([routineId])
  @@map("training_divisions")
}

// RENAMED: RoutineExercise → DivisionExercise
model DivisionExercise {
  id           String   @id @default(cuid())
  order        Int      // Order within division (1, 2, 3...)
  targetSets   Int      // Target number of sets
  targetReps   String   // e.g., "8-12", "10", "AMRAP"
  targetWeight Float?   // Target weight in kg (optional)
  restSeconds  Int?     // Rest time between sets (optional)
  videoId      String?  @db.VarChar(11) // NEW: YouTube video ID (11 chars)
  notes        String?  @db.Text // CHANGED: From VarChar to Text for longer notes
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  divisionId String
  division   TrainingDivision @relation(fields: [divisionId], references: [id], onDelete: Cascade)

  exerciseId String
  exercise   Exercise @relation(fields: [exerciseId], references: [id], onDelete: Restrict)

  @@unique([divisionId, exerciseId]) // No duplicate exercises per division
  @@index([divisionId])
  @@index([exerciseId]) // NEW: For load history queries
  @@map("division_exercises")
}

// Exercise model - ADD relation field name update
model Exercise {
  // ... existing fields ...

  divisionExercises DivisionExercise[] // RENAMED from routineExercises
  workoutExercises  WorkoutExercise[]

  // ... rest unchanged ...
}
```

### 1.2 Migration Strategy

#### Phase 1: Add New Columns (Non-Breaking)

```sql
-- Step 1: Add new columns with defaults
ALTER TABLE "routine_days"
  ADD COLUMN "description" VARCHAR(200),
  ADD COLUMN "frequency" INTEGER DEFAULT 1,
  ADD COLUMN "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  ADD COLUMN "updated_at" TIMESTAMP NOT NULL DEFAULT NOW();

ALTER TABLE "routine_exercises"
  ADD COLUMN "video_id" VARCHAR(11),
  ADD COLUMN "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  ADD COLUMN "updated_at" TIMESTAMP NOT NULL DEFAULT NOW();

-- Step 2: Change notes column type
ALTER TABLE "routine_exercises"
  ALTER COLUMN "notes" TYPE TEXT;
```

#### Phase 2: Data Migration

```sql
-- Migrate frequency from dayOfWeek
-- Heuristic: Assume 1x per week for each day initially
-- Users can adjust after migration
UPDATE "routine_days" SET "frequency" = 1;

-- Add unique constraint on routine + division name
-- First, ensure no duplicates exist
WITH duplicates AS (
  SELECT routineId, name, MIN(id) as keep_id
  FROM "routine_days"
  GROUP BY routineId, name
  HAVING COUNT(*) > 1
)
UPDATE "routine_days" rd
SET name = rd.name || ' (' || rd."dayOfWeek" || ')'
WHERE EXISTS (
  SELECT 1 FROM duplicates d
  WHERE d.routineId = rd.routineId
    AND d.name = rd.name
    AND d.keep_id != rd.id
);

ALTER TABLE "routine_days"
  ADD CONSTRAINT "routine_days_routineId_name_key" UNIQUE ("routineId", "name");
```

#### Phase 3: Rename Tables and Columns

```sql
-- Rename tables
ALTER TABLE "routine_days" RENAME TO "training_divisions";
ALTER TABLE "routine_exercises" RENAME TO "division_exercises";

-- Rename column in division_exercises
ALTER TABLE "division_exercises"
  RENAME COLUMN "routineDayId" TO "divisionId";

-- Update indexes
DROP INDEX IF EXISTS "routine_days_routineId_dayOfWeek_key";
CREATE INDEX "training_divisions_routineId_idx" ON "training_divisions"("routineId");

DROP INDEX IF EXISTS "routine_exercises_routineDayId_idx";
CREATE INDEX "division_exercises_divisionId_idx" ON "division_exercises"("divisionId");
CREATE INDEX "division_exercises_exerciseId_idx" ON "division_exercises"("exerciseId");
```

#### Phase 4: Remove Old Columns (Breaking)

```sql
-- Drop dayOfWeek column (no longer needed)
ALTER TABLE "training_divisions" DROP COLUMN "dayOfWeek";

-- Make frequency NOT NULL
ALTER TABLE "training_divisions"
  ALTER COLUMN "frequency" SET NOT NULL;
```

### 1.3 Rollback Strategy

```sql
-- Emergency rollback script
BEGIN;

-- Restore old table names
ALTER TABLE "training_divisions" RENAME TO "routine_days";
ALTER TABLE "division_exercises" RENAME TO "routine_exercises";

-- Restore old column name
ALTER TABLE "routine_exercises"
  RENAME COLUMN "divisionId" TO "routineDayId";

-- Restore dayOfWeek (set all to MONDAY as placeholder)
ALTER TABLE "routine_days"
  ADD COLUMN "dayOfWeek" VARCHAR(20) DEFAULT 'MONDAY';

-- Remove new columns
ALTER TABLE "routine_days"
  DROP COLUMN "description",
  DROP COLUMN "frequency",
  DROP COLUMN "created_at",
  DROP COLUMN "updated_at";

ALTER TABLE "routine_exercises"
  DROP COLUMN "video_id",
  DROP COLUMN "created_at",
  DROP COLUMN "updated_at";

COMMIT;
```

---

## 2. Repository Layer Design

### 2.1 Updated Repository Interface

```typescript
// src/domains/routines/repository.ts

import { prisma } from '@/lib/db';
import type {
  Routine,
  TrainingDivision,
  DivisionExercise
} from '@prisma/client';

// Types

export type DivisionExerciseWithDetails = DivisionExercise & {
  exercise: {
    id: string;
    name: string;
    category: string;
  };
};

export type TrainingDivisionWithExercises = TrainingDivision & {
  exercises: DivisionExerciseWithDetails[];
};

export type RoutineWithDivisions = Routine & {
  divisions: TrainingDivisionWithExercises[];
};

// Load history types
export type ExerciseLoadHistory = {
  exerciseId: string;
  exerciseName: string;
  workouts: {
    date: Date;
    sets: {
      weight: number;
      reps: number;
      volume: number; // weight * reps
    }[];
    totalVolume: number;
    maxWeight: number;
    maxReps: number;
  }[];
  personalRecords: {
    maxWeight: number;
    maxWeightDate: Date;
    maxReps: number;
    maxRepsDate: Date;
    maxVolume: number;
    maxVolumeDate: Date;
  };
};

// Repository

export const routinesRepository = {
  // -------------------------------------------------------------------------
  // Routine Operations (mostly unchanged)
  // -------------------------------------------------------------------------

  async findAll(
    userId: string,
    includeArchived = false
  ): Promise<RoutineWithDivisions[]> {
    return prisma.routine.findMany({
      where: {
        userId,
        ...(includeArchived ? {} : { isArchived: false })
      },
      include: {
        divisions: {
          include: {
            exercises: {
              include: {
                exercise: {
                  select: {
                    id: true,
                    name: true,
                    category: true
                  }
                }
              },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: [{ isActive: 'desc' }, { updatedAt: 'desc' }]
    });
  },

  async findById(
    id: string,
    userId: string
  ): Promise<RoutineWithDivisions | null> {
    return prisma.routine.findFirst({
      where: { id, userId },
      include: {
        divisions: {
          include: {
            exercises: {
              include: {
                exercise: {
                  select: {
                    id: true,
                    name: true,
                    category: true
                  }
                }
              },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });
  },

  async create(data: { name: string; userId: string }): Promise<Routine> {
    return prisma.routine.create({ data });
  },

  async update(
    id: string,
    userId: string,
    data: { name?: string }
  ): Promise<Routine> {
    return prisma.routine.update({
      where: { id, userId },
      data
    });
  },

  async activate(id: string, userId: string): Promise<Routine> {
    return prisma.$transaction(async tx => {
      await tx.routine.updateMany({
        where: { userId },
        data: { isActive: false }
      });
      return tx.routine.update({
        where: { id, userId },
        data: { isActive: true }
      });
    });
  },

  async archive(id: string, userId: string): Promise<Routine> {
    return prisma.routine.update({
      where: { id, userId },
      data: { isActive: false, isArchived: true }
    });
  },

  async delete(id: string, userId: string): Promise<Routine> {
    const routine = await prisma.routine.findFirst({
      where: { id, userId },
      include: {
        _count: { select: { workoutSessions: true } }
      }
    });

    if (!routine) {
      throw new Error('Routine not found');
    }

    if (routine._count.workoutSessions > 0) {
      throw new Error(
        'Cannot delete routine with workout history. Archive it instead.'
      );
    }

    return prisma.routine.delete({
      where: { id, userId }
    });
  },

  // -------------------------------------------------------------------------
  // Training Division Operations (UPDATED)
  // -------------------------------------------------------------------------

  async addDivision(data: {
    routineId: string;
    name: string;
    description?: string;
    frequency: number;
    order: number;
  }): Promise<TrainingDivision> {
    // Validate frequency
    if (data.frequency < 1 || data.frequency > 7) {
      throw new Error('Frequency must be between 1 and 7');
    }

    return prisma.trainingDivision.create({ data });
  },

  async updateDivision(
    id: string,
    data: {
      name?: string;
      description?: string;
      frequency?: number;
      order?: number;
    }
  ): Promise<TrainingDivision> {
    // Validate frequency if provided
    if (
      data.frequency !== undefined &&
      (data.frequency < 1 || data.frequency > 7)
    ) {
      throw new Error('Frequency must be between 1 and 7');
    }

    return prisma.trainingDivision.update({
      where: { id },
      data
    });
  },

  async deleteDivision(id: string): Promise<TrainingDivision> {
    return prisma.trainingDivision.delete({
      where: { id }
    });
  },

  async findDivisionById(
    id: string
  ): Promise<TrainingDivisionWithExercises | null> {
    return prisma.trainingDivision.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                category: true
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });
  },

  // -------------------------------------------------------------------------
  // Division Exercise Operations (UPDATED)
  // -------------------------------------------------------------------------

  async addExercise(data: {
    divisionId: string;
    exerciseId: string;
    order: number;
    targetSets: number;
    targetReps: string;
    targetWeight?: number;
    restSeconds?: number;
    videoId?: string;
    notes?: string;
  }): Promise<DivisionExercise> {
    // Validate videoId if provided
    if (data.videoId && data.videoId.length !== 11) {
      throw new Error('YouTube video ID must be exactly 11 characters');
    }

    return prisma.divisionExercise.create({ data });
  },

  async updateExercise(
    id: string,
    data: {
      order?: number;
      targetSets?: number;
      targetReps?: string;
      targetWeight?: number;
      restSeconds?: number;
      videoId?: string;
      notes?: string;
    }
  ): Promise<DivisionExercise> {
    // Validate videoId if provided
    if (data.videoId && data.videoId.length !== 11) {
      throw new Error('YouTube video ID must be exactly 11 characters');
    }

    return prisma.divisionExercise.update({
      where: { id },
      data
    });
  },

  async removeExercise(id: string): Promise<DivisionExercise> {
    return prisma.divisionExercise.delete({
      where: { id }
    });
  },

  // -------------------------------------------------------------------------
  // Load History Operations (NEW)
  // -------------------------------------------------------------------------

  async getExerciseLoadHistory(
    userId: string,
    exerciseId: string,
    limit = 10
  ): Promise<ExerciseLoadHistory | null> {
    // Get exercise info
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      select: { id: true, name: true }
    });

    if (!exercise) {
      return null;
    }

    // Get workout sessions with this exercise
    const workoutExercises = await prisma.workoutExercise.findMany({
      where: {
        exerciseId,
        workoutSession: {
          userId,
          status: 'COMPLETED'
        }
      },
      include: {
        sets: {
          where: { isCompleted: true },
          orderBy: { setNumber: 'asc' }
        },
        workoutSession: {
          select: {
            completedAt: true
          }
        }
      },
      orderBy: {
        workoutSession: {
          completedAt: 'desc'
        }
      },
      take: limit
    });

    // Calculate metrics for each workout
    const workouts = workoutExercises.map(we => {
      const sets = we.sets.map(set => ({
        weight: set.weight,
        reps: set.reps,
        volume: set.weight * set.reps
      }));

      const totalVolume = sets.reduce((sum, set) => sum + set.volume, 0);
      const maxWeight = Math.max(...sets.map(s => s.weight), 0);
      const maxReps = Math.max(...sets.map(s => s.reps), 0);

      return {
        date: we.workoutSession.completedAt!,
        sets,
        totalVolume,
        maxWeight,
        maxReps
      };
    });

    // Calculate personal records
    const allWeights = workouts.flatMap(w =>
      w.sets.map(s => ({ weight: s.weight, date: w.date }))
    );
    const allReps = workouts.flatMap(w =>
      w.sets.map(s => ({ reps: s.reps, date: w.date }))
    );
    const allVolumes = workouts.map(w => ({
      volume: w.totalVolume,
      date: w.date
    }));

    const maxWeightRecord = allWeights.reduce(
      (max, curr) => (curr.weight > max.weight ? curr : max),
      { weight: 0, date: new Date() }
    );

    const maxRepsRecord = allReps.reduce(
      (max, curr) => (curr.reps > max.reps ? curr : max),
      { reps: 0, date: new Date() }
    );

    const maxVolumeRecord = allVolumes.reduce(
      (max, curr) => (curr.volume > max.volume ? curr : max),
      { volume: 0, date: new Date() }
    );

    return {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      workouts,
      personalRecords: {
        maxWeight: maxWeightRecord.weight,
        maxWeightDate: maxWeightRecord.date,
        maxReps: maxRepsRecord.reps,
        maxRepsDate: maxRepsRecord.date,
        maxVolume: maxVolumeRecord.volume,
        maxVolumeDate: maxVolumeRecord.date
      }
    };
  },

  // -------------------------------------------------------------------------
  // Utility Operations
  // -------------------------------------------------------------------------

  async hasWorkoutSessions(routineId: string): Promise<boolean> {
    const count = await prisma.workoutSession.count({
      where: { routineId }
    });
    return count > 0;
  }
};
```

---

## 3. Validation Schemas (Zod)

### 3.1 Updated Schema File

```typescript
// src/domains/routines/schema.ts

import { z } from 'zod';

// Training Division Schemas (UPDATED)

export const createDivisionSchema = z.object({
  routineId: z.string().cuid('Invalid routine ID'),
  name: z
    .string()
    .min(1, 'Division name is required')
    .max(50, 'Division name must be less than 50 characters')
    .trim(),
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters')
    .trim()
    .optional(),
  frequency: z
    .number()
    .int('Frequency must be a whole number')
    .min(1, 'Frequency must be at least 1 time per week')
    .max(7, 'Frequency cannot exceed 7 times per week'),
  order: z.number().int().min(1, 'Order must be at least 1')
});

export const updateDivisionSchema = z.object({
  id: z.string().cuid('Invalid division ID'),
  name: z
    .string()
    .min(1, 'Division name is required')
    .max(50, 'Division name must be less than 50 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters')
    .trim()
    .optional()
    .nullable(),
  frequency: z
    .number()
    .int('Frequency must be a whole number')
    .min(1, 'Frequency must be at least 1 time per week')
    .max(7, 'Frequency cannot exceed 7 times per week')
    .optional(),
  order: z.number().int().min(1, 'Order must be at least 1').optional()
});

// Division Exercise Schemas (UPDATED)

const targetRepsRegex = /^(\d+(-\d+)?|AMRAP)$/i;

// YouTube video ID validation (11 alphanumeric characters and hyphens/underscores)
const youtubeIdRegex = /^[a-zA-Z0-9_-]{11}$/;

export const addDivisionExerciseSchema = z.object({
  divisionId: z.string().cuid('Invalid division ID'),
  exerciseId: z.string().cuid('Invalid exercise ID'),
  order: z.number().int().min(1, 'Order must be at least 1'),
  targetSets: z
    .number()
    .int()
    .min(1, 'Target sets must be at least 1')
    .max(20, 'Target sets cannot exceed 20'),
  targetReps: z
    .string()
    .regex(
      targetRepsRegex,
      'Target reps must be a number, range (e.g., "8-12"), or "AMRAP"'
    )
    .trim(),
  targetWeight: z
    .number()
    .min(0, 'Target weight cannot be negative')
    .optional(),
  restSeconds: z
    .number()
    .int()
    .min(0, 'Rest time cannot be negative')
    .max(600, 'Rest time cannot exceed 10 minutes')
    .optional(),
  videoId: z
    .string()
    .regex(youtubeIdRegex, 'Invalid YouTube video ID (must be 11 characters)')
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(5000, 'Notes must be less than 5000 characters')
    .trim()
    .optional()
});

export const updateDivisionExerciseSchema = z.object({
  id: z.string().cuid('Invalid exercise ID'),
  order: z.number().int().min(1, 'Order must be at least 1').optional(),
  targetSets: z
    .number()
    .int()
    .min(1, 'Target sets must be at least 1')
    .max(20, 'Target sets cannot exceed 20')
    .optional(),
  targetReps: z
    .string()
    .regex(
      targetRepsRegex,
      'Target reps must be a number, range (e.g., "8-12"), or "AMRAP"'
    )
    .trim()
    .optional(),
  targetWeight: z
    .number()
    .min(0, 'Target weight cannot be negative')
    .optional(),
  restSeconds: z
    .number()
    .int()
    .min(0, 'Rest time cannot be negative')
    .max(600, 'Rest time cannot exceed 10 minutes')
    .optional(),
  videoId: z
    .string()
    .regex(youtubeIdRegex, 'Invalid YouTube video ID (must be 11 characters)')
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(5000, 'Notes must be less than 5000 characters')
    .trim()
    .optional()
});

// YouTube Video URL Helper

/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

// Type Inference

export type CreateDivisionInput = z.infer<typeof createDivisionSchema>;
export type UpdateDivisionInput = z.infer<typeof updateDivisionSchema>;
export type AddDivisionExerciseInput = z.infer<
  typeof addDivisionExerciseSchema
>;
export type UpdateDivisionExerciseInput = z.infer<
  typeof updateDivisionExerciseSchema
>;
```

---

## 4. Implementation Checklist

### 4.1 Database Migration

- [ ] Create Prisma migration file
- [ ] Test migration on development database
- [ ] Write rollback script
- [ ] Backup production database
- [ ] Run migration on staging
- [ ] Validate data integrity
- [ ] Run migration on production
- [ ] Monitor for errors

### 4.2 Repository Layer

- [ ] Update repository types
- [ ] Implement division CRUD operations
- [ ] Implement exercise operations with videoId
- [ ] Implement load history queries
- [ ] Add validation logic
- [ ] Write unit tests for repository
- [ ] Performance test with large datasets

### 4.3 Schema Updates

- [ ] Update Zod schemas
- [ ] Implement YouTube ID extraction helper
- [ ] Update type exports
- [ ] Write validation tests

### 4.4 Server Actions

- [ ] Update createRoutine action
- [ ] Update division management actions
- [ ] Update exercise management actions
- [ ] Create getLoadHistory action
- [ ] Add error handling
- [ ] Write integration tests

---

## 5. Risk Assessment

### High Risk

1. **Data Migration Complexity**
   - Risk: Losing data or breaking existing routines
   - Mitigation: Transaction-based migration, extensive testing, rollback plan

2. **Breaking Changes**
   - Risk: Existing UI breaks after schema changes
   - Mitigation: Deploy backend changes first, then UI (phased rollout)

### Medium Risk

3. **Performance Impact**
   - Risk: Load history queries slow with large datasets
   - Mitigation: Proper indexes, pagination, caching

4. **YouTube Video Validation**
   - Risk: Users enter invalid video IDs
   - Mitigation: Client-side preview, server-side validation, graceful error handling

---

## 6. Next Steps

After domain architecture:

1. **Create UX/UI architecture plan** - Design component structure and user flows
2. **Create Next.js implementation plan** - Plan Server Actions, form handling, routing
3. **Execute implementation** - Follow plans step-by-step
4. **Test and validate** - Integration testing, user acceptance testing

---
