# Session Context: Workout Set Tracking Enhancements

**Session ID**: `workout_enhancements_001`
**Created**: 2025-11-10
**Status**: Active
**Feature**: Enhanced Set Logging with Notes, Weight Tracking, and Rest Timers

## Session Goal

Enhance the active workout experience by adding:
1. **Set-level notes** - Allow users to add comments about each set (form, difficulty, etc.)
2. **Weight tracking** - When checking a set as complete, save the actual weight used
3. **Rest timer** - Display countdown timer between sets based on configured rest seconds
4. **Expandable set UI** - Click on set to expand and enter details before marking complete

## User Requirements (2025-11-10)

User wants:
- When marking an exercise set as complete (checkbox), should be able to:
  - Add comments/notes about that specific set
  - Enter the weight used for that set
  - Enter reps completed for that set
- Between sets (when multiple sets exist):
  - Show rest timer countdown based on configured `restSeconds` from routine
  - Visual/audio cue when rest period is complete
- UI should support:
  - Expanding individual sets to show detail form
  - Saving set data when checkbox is marked
  - Displaying rest timer automatically after completing a set

## Current State Analysis

### Database Schema (WorkoutSet model)
```prisma
model WorkoutSet {
  id                  String    @id @default(cuid())
  setNumber           Int       // 1, 2, 3...
  weight              Float     // Weight in kg ✓ EXISTS
  reps                Int       // Number of reps ✓ EXISTS
  isCompleted         Boolean   @default(false) ✓ EXISTS
  completedAt         DateTime? ✓ EXISTS

  // Relations
  workoutExerciseId   String
  workoutExercise     WorkoutExercise @relation(...)

  @@unique([workoutExerciseId, setNumber])
}
```

**What's Missing:**
- ❌ `notes` field on WorkoutSet (currently only exists at WorkoutExercise level)

### Current UI Flow (Active Workout Page)
**File:** `/src/app/(app)/workout/active/page.tsx`

**Existing Features:**
- ✓ Session timer (elapsed time)
- ✓ Progress bar (completed sets / total sets)
- ✓ Exercise cards with set table
- ✓ Weight and reps input fields per set
- ✓ "Complete" button to mark set as done
- ✓ Auto-save via React Query mutations

**What's Missing:**
- ❌ Rest timer between sets
- ❌ Set-specific notes input
- ❌ Expandable set details UI
- ❌ Visual rest timer countdown

### Rest Timer Data Availability
**Source:** `DivisionExercise.restSeconds` (Integer, 0-600 seconds)
- ✓ Already configured when building routines
- ❌ Not currently used in active workout UI
- Available in workout data structure (need to verify)

## Technical Analysis

### Required Changes

#### 1. **Database Migration**
Add `notes` column to `workout_sets` table:
```prisma
model WorkoutSet {
  // ... existing fields
  notes String? @db.Text // NEW: Per-set notes
}
```

**Migration Steps:**
1. Add `notes String?` to WorkoutSet model
2. Run `prisma migrate dev --name add_workout_set_notes`
3. Update TypeScript types

#### 2. **Schema Validation Updates**
**File:** `src/domains/workouts/schema.ts`

Update `logSetSchema` to include notes:
```typescript
export const logSetSchema = z.object({
  workoutExerciseId: z.string(),
  setNumber: z.number().int().positive(),
  weight: z.number().nonnegative(),
  reps: z.number().int().positive(),
  notes: z.string().optional(), // NEW
});
```

#### 3. **Repository Layer Updates**
**File:** `src/domains/workouts/repository.ts`

Update `logSet()` method to save notes:
```typescript
async logSet(data: LogSetInput) {
  return prisma.workoutSet.upsert({
    where: { workoutExerciseId_setNumber: {...} },
    create: {
      weight: data.weight,
      reps: data.reps,
      notes: data.notes, // NEW
      isCompleted: true,
      completedAt: new Date(),
    },
    update: {
      weight: data.weight,
      reps: data.reps,
      notes: data.notes, // NEW
      isCompleted: true,
      completedAt: new Date(),
    },
  });
}
```

#### 4. **UI Component Changes**
**File:** `src/app/(app)/workout/active/page.tsx`

**New Components Needed:**
- `SetDetailsExpander` - Collapsible panel for set details
- `RestTimer` - Countdown timer component
- `SetNotesInput` - Textarea for set-specific notes

**Enhanced Flow:**
1. User clicks on set row → Expands to show form
2. User enters weight, reps, and notes
3. User clicks checkbox → Saves data + marks complete
4. If more sets remain → Start rest timer countdown
5. Timer completes → Visual/audio cue + auto-focus next set

#### 5. **Text Map Updates**
**File:** `src/domains/workouts/workouts.text-map.ts`

Add new strings:
```typescript
{
  activeWorkout: {
    setNotes: {
      label: 'Notes (optional)',
      placeholder: 'How did this set feel? Form cues, etc.'
    },
    restTimer: {
      label: 'Rest Timer',
      ready: 'Ready for next set!',
      skip: 'Skip Rest'
    }
  }
}
```

---

## Implementation Plan Needed

Specialized agents needed:
1. **Domain Architect** - Database schema changes and business logic
2. **UX/UI Designer** - Expandable set UI and rest timer design
3. **Next.js Builder** - Component implementation strategy
4. **Code Reviewer** - Review changes against critical constraints

---

## Constraints to Follow

From `.claude/knowledge/critical-constraints.md`:
- ✓ Use repository pattern for all data access
- ✓ Externalize all text to text maps
- ✓ Server Components by default, Client only when needed
- ✓ Zod validation for all inputs
- ✓ Named exports, kebab-case files

---

## Success Criteria

- [ ] Database migration adds `notes` field to WorkoutSet
- [ ] Users can expand each set to enter weight, reps, and notes
- [ ] Checkbox marking set complete saves all data
- [ ] Rest timer appears after completing a set (if restSeconds configured)
- [ ] Timer counts down visually
- [ ] Audio/visual cue when timer completes
- [ ] "Skip Rest" button available during countdown
- [ ] All text externalized to text maps
- [ ] No regressions in existing workout flow
- [ ] Build succeeds with no errors

---

*Entries below will be appended by executing agents*

---

## UX/UI Designer Entry (2025-11-10)

**Agent**: ux-ui-designer
**Task**: Design UX/UI for enhanced set logging with expandable details and rest timer
**Status**: Complete

### Work Summary

Created comprehensive UX/UI design plan for enhanced workout set logging interface.

**Plan Location**: `.claude/plans/ux-workout-set-ui-plan.md`

### Key Design Decisions

1. **Expandable Set Rows**:
   - Collapsed state: 4-column table layout (Set # | Weight | Reps | Action)
   - Expanded state: Full form with weight, reps, notes textarea
   - Tap entire row to expand (mobile-friendly, large touch target)
   - Smooth 300ms expand/collapse animation
   - Auto-scroll expanded panel into view

2. **Rest Timer**:
   - Modal overlay (centers attention, prevents accidental taps)
   - Circular progress indicator (200px diameter, more engaging than linear)
   - Large countdown display (48px font, easy to read from distance)
   - "Skip Rest" button for flexibility
   - Auto-dismiss with visual/audio cue when complete
   - Auto-focus next set after timer

3. **Mobile-First Approach**:
   - Minimum 44x44px touch targets (sweaty fingers consideration)
   - Full-width Complete button on mobile (48px height)
   - Single-column stacked layout when expanded
   - Haptic feedback for tactile confirmation
   - 16px minimum text size (prevents iOS zoom)

4. **Interaction Flow**:
   - Tap set row → Expands inline
   - Enter weight/reps (smart defaults from previous set)
   - Optionally add notes
   - Tap Complete → Optimistic save
   - Rest timer appears immediately (if more sets)
   - Timer completes → Auto-focus next set with pulse animation

5. **Accessibility Highlights**:
   - Full keyboard navigation (Tab order: Weight → Reps → Notes → Complete)
   - Screen reader announcements for all state changes
   - ARIA live regions for set completion and rest timer
   - Color-independent status (opacity + icons, not just color)
   - Respects prefers-reduced-motion
   - WCAG AA color contrast minimum

### Component Architecture

**New Components**:
1. `SetRowExpandable` - Expandable set form with Collapsible
2. `RestTimerModal` - Timer modal with circular progress and countdown

**shadcn/ui Components Needed**:
- Collapsible (expandable set rows)
- Dialog (rest timer modal)
- Progress (circular variant for timer)
- Input, Textarea, Button, Label, Badge (already available)

**Custom Logic**:
- `use-rest-timer` hook for countdown logic
- Optimistic updates for instant feedback
- Auto-focus management for flow

### Text Map Additions

Added 30+ new text keys to `workouts.text-map.ts`:
- `setLogging.*` - All set logging UI text
- `restTimer.*` - Rest timer text and notifications
- `errors.*` - Validation and system errors

All text is externalized, no hardcoded strings.

### User Persona: Alex's Journey

1. **Completes lift** → Glances at phone
2. **Taps set row** → Form expands smoothly
3. **Enters weight/reps** → Large touch targets, easy with sweaty hands
4. **Adds optional note** → "Form felt good, full ROM"
5. **Taps Complete** → Haptic feedback, row collapses
6. **Rest timer appears** → 90 seconds, circular countdown
7. **Waits or skips** → Flexible, respects user preference
8. **Timer completes** → Soft chime, next set highlighted
9. **Repeat** → Smooth flow, maintains momentum

### Design Philosophy Applied

- **Clarity**: Each action is obvious, no hidden features
- **Efficiency**: 3-4 taps per set, optimized for speed
- **Feedback**: Immediate response to every interaction
- **Consistency**: Matches existing exercise card patterns
- **Error Prevention**: Disabled states, validation on blur
- **Recognition over Recall**: Smart defaults, previous set data visible
- **Flexibility**: Optional notes, skip rest, manual weight entry
- **Aesthetics**: Clean, focused, motivating

### Success Metrics Defined

- Task completion rate: 95%+
- Time to complete set: < 10 seconds
- Error rate: < 5%
- Notes adoption: 20%+ (optional but useful)
- Keyboard navigation: 100% accessible
- Performance: < 300ms perceived latency

### Recommendations

1. **User Testing**: High-impact feature, test with 5+ users before full rollout
2. **Progressive Enhancement**: Ship expandable rows first, add rest timer in phase 2 if needed
3. **Audio Preferences**: Consider user setting to disable audio cues (gym environment)
4. **Vibration Patterns**: Test haptic feedback intensity (not too strong)
5. **Default Rest Times**: Monitor skip rate to validate default rest periods
6. **Quick Log Option**: Consider keeping simple "Log" button for users who prefer speed over detail

### Technical Constraints Followed

- Server Components by default (page-level)
- Client Components only for interactive set rows and timer
- Text externalized to text maps (30+ new keys)
- Accessibility mandatory (WCAG AA minimum)
- Mobile-first responsive design
- Optimistic updates for perceived performance
- Repository pattern for data access (no direct DB)

### Risks & Mitigations

**Risk**: Expandable UI adds complexity, users may prefer simple quick-log
**Mitigation**: Keep "Log" button visible in collapsed state for one-tap completion

**Risk**: Modal rest timer may feel intrusive
**Mitigation**: "Skip Rest" button prominent, modal can be dismissed easily

**Risk**: Auto-focus may be disorienting
**Mitigation**: Clear pulse animation shows where focus moved, respects user preferences

**Risk**: Optimistic updates may cause confusion if save fails
**Mitigation**: Clear error state, automatic retry, revert to editable on failure

### Files Created

- `.claude/plans/ux-workout-set-ui-plan.md` (7,500+ words, comprehensive design spec)

### Next Steps for Parent

1. **Review plan**: Validate design decisions align with product vision
2. **Coordinate with domain-architect**: Add `notes` field to WorkoutSet schema
3. **Coordinate with shadcn-builder**: Verify Collapsible, Dialog, Progress components available
4. **Implementation priority**:
   - Phase 1: Expandable set rows with notes
   - Phase 2: Rest timer modal
   - Phase 3: Advanced features (audio, vibration, quick-log toggle)

### Questions for Parent

1. Should audio notifications be on by default or opt-in?
2. Is there a preferred rest timer duration if not specified (default to 90s)?
3. Should we show previous workout data as hints in inputs?
4. Do we want to track set duration (time from expand to complete)?

---
