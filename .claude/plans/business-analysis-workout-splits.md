# Business Analysis Plan: Workout Splits & Training System Refactoring

**Plan ID**: `business-analysis-workout-splits`
**Session ID**: `workout-splits-20251113_200040`
**Created**: 2025-11-13
**Agent**: business-analyst
**Status**: Ready for Review

---

## Executive Summary

This plan analyzes the requirements for refactoring the gym tracker's workout system from a manually configured routine approach to a guided, pre-assessment-based workout splits system with enhanced tracking features including weight history, habit calendar, and streamlined completion flows.

**Key Changes**:
- Replace manual routine creation with guided pre-assessment flow
- Auto-generate workout splits based on user frequency and focus
- Add "My Workout" unified view showing all splits and progress
- Enhance exercise tracking with per-session weight history
- Add habit tracking calendar visualization
- Implement workout completion flow with progression logic

**Business Impact**: This refactoring transforms the app from a passive tracking tool into an active training companion that guides users through setup and maintains motivation through visual progress indicators.

---

## 1. User Personas & Use Cases

### Primary Persona: Guided User (New Target)

**Profile**:
- Age: 18-40 years old
- Training experience: Beginner to Intermediate
- Motivation: Wants structure but feels overwhelmed by options
- Pain point: "I don't know how to organize my workouts"
- Tech comfort: Moderate (prefers simple, guided flows)

**Key Needs**:
- ✅ Simple onboarding that asks questions instead of requiring expertise
- ✅ Auto-generated splits based on their availability and goals
- ✅ Clear visual indication of what to do next
- ✅ Motivation through progress visualization (calendar, completion badges)
- ✅ Historical context (what weight did I use last time?)

**Primary Use Cases**:

**UC-1: First Time Setup**
1. User opens app after registration
2. Sees pre-assessment prompt: "Let's create your workout plan"
3. Answers frequency question: "How many days per week can you train?" (3-6 options)
4. Answers focus question: "What's your training priority?" (Legs, Arms, Full Body, etc.)
5. System generates N splits (N = frequency selected)
6. User lands on "My Workout" view showing all splits

**UC-2: Daily Workout Execution**
1. User opens "My Workout" view
2. Sees current split highlighted (visual indicator: border, badge)
3. Taps current split to open exercise list
4. Sees exercises with checkboxes (unchecked by default)
5. Taps exercise to see details: description, video, sets/reps, weight input
6. Enters weight for current session
7. Sees weight history from previous sessions
8. Checks off exercise when complete
9. Returns to split view, sees progress (2/5 exercises done)
10. Completes all exercises
11. Taps "Finalize Workout" button
12. System validates all exercises checked
13. Records completion date, updates calendar
14. Advances to next split (becomes new "current")

**UC-3: Progress Review**
1. User views calendar widget on "My Workout" view
2. Sees highlighted days when workouts were completed
3. Visualizes consistency streak
4. Taps specific date to see which split was completed that day

---

### Secondary Persona: Advanced User (Existing User Migration)

**Profile**:
- Current user with existing routines
- Training experience: Intermediate to Advanced
- Concern: "Will I lose my current setup?"
- Need: Migration path that preserves history

**Key Needs**:
- ✅ Option to migrate existing routines to new splits system
- ✅ Preserve historical workout data
- ✅ Option to customize auto-generated splits
- ✅ Ability to manually add/remove exercises from splits

**Migration Use Case**:
**UC-4: Existing User Migration**
1. User with existing routines opens app after update
2. Sees migration prompt: "Upgrade to Workout Splits"
3. System analyzes existing routine structure
4. Suggests mapping: "Your 'Push-Pull-Legs' routine → 3-day split"
5. User reviews and confirms
6. Historical data linked to new splits structure
7. User can continue tracking seamlessly

---

## 2. Business Rules & Validation Requirements

### BR-1: Pre-Assessment Rules

**BR-1.1: Frequency Selection**
- **Rule**: User must select training frequency between 3-6 days per week
- **Rationale**: Minimum 3 days needed for effective split training; Maximum 6 to prevent overtraining
- **Validation**:
  - Client: Radio buttons constrained to 3, 4, 5, 6 options only
  - Server: Zod schema validates `frequency: z.enum(['3', '4', '5', '6'])`
- **Error Message**: "Please select how many days per week you can train (3-6 days)"

**BR-1.2: Training Focus Selection**
- **Rule**: User must select one primary training focus
- **Options**:
  - "Legs & Lower Body"
  - "Arms & Upper Body"
  - "Full Body Balanced"
  - "Core & Functional"
- **Rationale**: Determines exercise distribution across splits
- **Validation**: Single selection required
- **Error Message**: "Please select your primary training focus"

**BR-1.3: Split Auto-Generation**
- **Rule**: Number of splits created = frequency selected
- **Examples**:
  - 3 days/week → 3 splits (Split A, Split B, Split C)
  - 4 days/week → 4 splits (Split A, B, C, D)
  - 5 days/week → 5 splits (Split A, B, C, D, E)
  - 6 days/week → 6 splits (Split A, B, C, D, E, F)
- **Enforcement**: Server Action creates exactly N TrainingDivision records where N = frequency

---

### BR-2: Workout Split Rules

**BR-2.1: Split Naming Convention**
- **Rule**: Splits auto-named as "Split A", "Split B", etc. with descriptive subtitle
- **Format**:
  - Primary name: "Split A" (letter designation)
  - Subtitle: Auto-generated based on focus (e.g., "Lower Body Focus", "Push Exercises")
- **Rationale**: Simple, universally understood naming that doesn't require user creativity

**BR-2.2: Exercise Distribution**
- **Rule**: Exercises distributed across splits based on training focus
- **Distribution Logic**:

**For "Legs & Lower Body" focus:**
- Split A: Quad-dominant (squats, leg press, extensions)
- Split B: Hip-dominant (deadlifts, Romanian DL, hamstrings)
- Split C: Upper body maintenance (push/pull basics)
- Split D+: Accessory work (calves, core, mobility)

**For "Arms & Upper Body" focus:**
- Split A: Push (chest, shoulders, triceps)
- Split B: Pull (back, biceps)
- Split C: Legs maintenance
- Split D+: Arm specialization, isolation

**For "Full Body Balanced" focus:**
- Each split: 1-2 compound exercises + accessories covering all major groups
- Progressive distribution ensuring balanced weekly volume

**For "Core & Functional" focus:**
- Split A: Core strength (planks, carries, anti-rotation)
- Split B: Dynamic movement (kettlebell, medicine ball)
- Split C: Compound lifts (fundamental patterns)
- Split D+: Mobility, stability, prehab

**BR-2.3: Exercise Count Per Split**
- **Rule**: Each split contains 5-8 exercises
- **Rationale**:
  - Minimum 5: Ensures adequate training volume
  - Maximum 8: Prevents excessive session duration (>90 min)
- **Validation**: Server validation on split creation
- **Exception**: User can manually add up to 10 exercises per split (warning shown after 8)

---

### BR-3: Workout Tracking Rules

**BR-3.1: Current Workout Indicator**
- **Rule**: System maintains pointer to "current" workout split
- **Logic**:
  - On first setup: Current = Split A
  - On completion: Current advances to next split (A→B→C→A, circular)
  - Persisted in user profile or assessment record
- **Visual Indicator**: Current split has distinct border color + "CURRENT" badge

**BR-3.2: Exercise Completion Validation**
- **Rule**: All exercises must be checked before "Finalize Workout" is enabled
- **Validation**: Client-side check counts checked exercises vs total exercises
- **Behavior**:
  - If incomplete: Button disabled, shows "3/8 exercises completed"
  - If complete: Button enabled, shows "Ready to finalize!"
- **Exception**: User can skip exercises but must explicitly mark as "Skipped" (different from unchecked)

**BR-3.3: Weight Input Requirements**
- **Rule**: Weight input is optional but recommended
- **Behavior**:
  - User can check exercise without entering weight (bodyweight exercises)
  - For weighted exercises: Warning prompt if no weight entered
  - Prompt: "No weight entered. Was this bodyweight only?"
- **Validation**:
  - If entered: Must be > 0
  - If entered: Max 999 kg (sanity check)

**BR-3.4: Weight History Display**
- **Rule**: Show last 5 sessions' weight for current exercise
- **Format**: Table or list showing:
  - Date (relative: "2 days ago", "Last week")
  - Weight used
  - Sets x Reps achieved
- **Calculation**: Query WorkoutSession + WorkoutExercise + WorkoutSet filtered by exerciseId, ordered by completedAt DESC, limit 5
- **Empty State**: "No previous sessions recorded for this exercise"

---

### BR-4: Workout Completion Rules

**BR-4.1: Completion Timestamp**
- **Rule**: Completion date recorded with precision to minute
- **Storage**: WorkoutSession.completedAt = NOW()
- **Timezone**: Server timezone (UTC), displayed in user's local time
- **Used For**: Calendar visualization, streak calculation

**BR-4.2: Calendar Update**
- **Rule**: Calendar widget updates immediately after workout finalized
- **Behavior**:
  - Completed day shows filled circle or checkmark
  - Hover shows: "Split B - Upper Body (45 min, 6 exercises)"
  - Color coding:
    - Current week: Bright color
    - Previous weeks: Muted color
    - Future: Greyed out

**BR-4.3: Next Split Advancement**
- **Rule**: After finalization, current split pointer advances
- **Logic**:
  - If current = Split A (order 1), next = Split B (order 2)
  - If current = last split (order N), next = Split A (order 1) - circular
- **Persistence**: Update user's currentSplitId in database
- **Visual Feedback**: Success message shows "Great work! Next up: Split C - Lower Body"

**BR-4.4: Session Duration Calculation**
- **Rule**: Duration calculated from workout start to finalization
- **Start Trigger**: When user clicks into first exercise detail
- **End Trigger**: When user clicks "Finalize Workout"
- **Storage**: WorkoutSession.duration (integer, seconds)
- **Display**: Shown in calendar hover and session history as "45 min"

---

### BR-5: Habit Calendar Rules

**BR-5.1: Calendar Display Period**
- **Rule**: Show current month + 2 previous months
- **Rationale**: Balance between useful history and performance
- **Navigation**: User can navigate to view older months (lazy loaded)

**BR-5.2: Streak Calculation**
- **Rule**: Streak = consecutive days with completed workouts
- **Break Condition**: Any day without workout resets streak to 0
- **Grace Period**: None for MVP (strict consecutive)
- **Display**: "5-day streak!" prominently shown on My Workout view

**BR-5.3: Completion Indicator**
- **Rule**: Day marked complete if WorkoutSession.status = COMPLETED exists for that date
- **Multiple Workouts**: If user completes 2 workouts same day, still counts as 1 calendar day
- **Timezone Handling**: Day boundaries based on user's local timezone

---

## 3. Feature Breakdown into Phases

### Phase 1: MVP - Pre-Assessment & Basic Splits (Priority: P0)

**Timeline**: 3-4 weeks

**Scope**:
- ✅ Pre-assessment flow (frequency + focus questions)
- ✅ Auto-generate workout splits based on assessment
- ✅ "My Workout" main view showing all splits
- ✅ Current split visual indicator
- ✅ Exercise list view per split
- ✅ Exercise detail view (description, sets/reps, weight input)
- ✅ Basic checkbox completion tracking
- ✅ "Finalize Workout" button with validation
- ✅ Next split advancement logic

**Excluded from Phase 1**:
- ❌ Weight history display (Phase 2)
- ❌ Calendar widget (Phase 2)
- ❌ Video/image media (Phase 3)
- ❌ Migration from existing routines (Phase 2)
- ❌ Manual split editing (Phase 3)

**Success Criteria**:
- User completes pre-assessment in < 3 minutes
- User can navigate and complete first workout in < 10 minutes
- System correctly advances to next split after completion
- 90%+ of new users complete pre-assessment (dropout metric)

---

### Phase 2: Enhanced Tracking (Priority: P1)

**Timeline**: 2-3 weeks

**Scope**:
- ✅ Weight history display (last 5 sessions)
- ✅ Calendar widget showing completed days
- ✅ Streak calculation and display
- ✅ Migration path for existing users
- ✅ Session duration tracking
- ✅ Calendar hover details
- ✅ Empty states for first-time users

**Success Criteria**:
- Users reference weight history before 80% of exercise inputs
- Calendar visualization increases session completion rate by 15%
- 85%+ of existing users successfully migrate
- Average streak increases from baseline

---

### Phase 3: Rich Media & Customization (Priority: P2)

**Timeline**: 2-3 weeks

**Scope**:
- ✅ YouTube video embedding in exercise details
- ✅ Exercise images/demonstrations
- ✅ Manual split editing (add/remove/reorder exercises)
- ✅ Custom split creation (advanced users)
- ✅ Exercise substitution suggestions
- ✅ Set-level notes (form cues, RPE)
- ✅ Per-split notes and customization

**Success Criteria**:
- Video view rate: 40%+ of exercise detail views
- Advanced users create 1+ custom splits
- User-reported satisfaction with customization options

---

### Phase 4: Intelligence & Optimization (Priority: P3)

**Timeline**: 3-4 weeks

**Scope**:
- ✅ Smart weight recommendations based on history
- ✅ Progressive overload detection and suggestions
- ✅ Volume tracking and optimization alerts
- ✅ Rest day recommendations
- ✅ Deload week detection
- ✅ Performance trend analysis
- ✅ Split effectiveness metrics

**Success Criteria**:
- 60%+ of users follow weight recommendations
- Measurable strength increase (weight progression) after 4 weeks
- Reduced injury reports (proxy: fewer extended breaks)

---

## 4. Success Criteria by Phase

### Phase 1 Success Metrics

**Adoption Metrics**:
- 90%+ new users complete pre-assessment
- 80%+ users complete first workout session
- 70%+ users complete second workout session (retention)

**Engagement Metrics**:
- Average time to complete pre-assessment: < 3 min
- Average time to complete first workout: < 10 min
- Drop-off rate during assessment: < 10%

**Quality Metrics**:
- Exercise completion rate: > 85% (not skipped)
- Weight input rate: > 70% of weighted exercises
- Zero critical bugs in split generation logic

---

### Phase 2 Success Metrics

**Feature Usage**:
- 75%+ users view weight history when logging exercises
- Calendar viewed by 90%+ users within first week
- Average streak length: > 3 days

**Migration Success**:
- 85%+ existing users migrate successfully
- < 5% data integrity issues reported
- Migration completion time: < 5 minutes

**Behavioral Change**:
- Session completion rate increases by 15%
- Weight progression consistency improves by 20%
- Session duration stabilizes (less variance)

---

### Phase 3 Success Metrics

**Media Engagement**:
- Video view rate: 40%+ of exercise detail views
- Image view rate: 60%+ of exercise detail views
- Video completion rate: > 50% watched > 30 seconds

**Customization Adoption**:
- 30%+ users edit at least one split
- 15%+ users create custom split
- Exercise substitution used by 25% of users

---

### Phase 4 Success Metrics

**Intelligence Adoption**:
- 60%+ users accept weight recommendations
- 40%+ users follow rest day suggestions
- Smart features rated 4+ stars by 70% of users

**Performance Outcomes**:
- Measurable weight increase in main lifts: 10%+ over 8 weeks
- Volume consistency improves: 15% less variance
- Deload compliance: 50%+ users take recommended deloads

---

## 5. Data Model Requirements (High-Level)

### Existing Entities to Modify

**User** (No changes needed)
- Existing fields sufficient
- Relationship: Has one WorkoutAssessment

**Exercise** (No changes needed)
- Existing Exercise catalog remains
- May need new category: "Combined" for multi-muscle exercises

---

### New Entities Required

**WorkoutAssessment** (NEW)
```typescript
{
  id: UUID
  userId: UUID (FK → User)
  frequency: Enum['3', '4', '5', '6'] // days per week
  trainingFocus: Enum['legs', 'arms', 'fullBody', 'core']
  currentSplitId: UUID (FK → WorkoutSplit) // pointer to current
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Business Rules**:
- User has exactly ONE active assessment
- Creating new assessment archives previous one
- currentSplitId updated after each workout completion

---

**WorkoutSplit** (NEW - replaces/extends TrainingDivision)
```typescript
{
  id: UUID
  assessmentId: UUID (FK → WorkoutAssessment)
  name: String // "Split A"
  subtitle: String // "Lower Body Focus"
  order: Integer // 1, 2, 3... (for circular progression)
  description: String? // Optional detailed description
  createdAt: DateTime
  updatedAt: DateTime

  // Relations
  exercises: SplitExercise[]
}
```

**Business Rules**:
- Order must be sequential within assessment (1, 2, 3, N)
- Name follows pattern "Split {letter}" where letter = A-Z[order]
- Deletion cascades to SplitExercise

---

**SplitExercise** (NEW - replaces/extends DivisionExercise)
```typescript
{
  id: UUID
  splitId: UUID (FK → WorkoutSplit)
  exerciseId: UUID (FK → Exercise)
  order: Integer // Display order within split
  targetSets: Integer // e.g., 3
  targetReps: String // e.g., "8-12" or "10"
  targetWeight: Float? // Optional reference weight
  restSeconds: Integer? // e.g., 90
  videoId: String? // YouTube video ID (Phase 3)
  imageUrl: String? // Exercise demo image (Phase 3)
  notes: String? // Form cues, tips
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Business Rules**:
- No duplicate exerciseId within same splitId
- Order must be sequential within split
- videoId format: 11 characters (YouTube standard)

---

**WorkoutSession** (MODIFY EXISTING)

**New Fields**:
```typescript
{
  // Existing fields...
  splitId: UUID? (FK → WorkoutSplit) // Link to split used
  assessmentId: UUID? (FK → WorkoutAssessment) // For analytics
  startedAt: DateTime // Already exists
  completedAt: DateTime? // Already exists
  duration: Integer? // Calculated: completedAt - startedAt (seconds)

  // Keep existing: status, rating, notes
}
```

**Business Rules**:
- If created via splits system: splitId and assessmentId required
- If legacy/free workout: splitId and assessmentId nullable
- Status flow: IN_PROGRESS → COMPLETED (on finalization)

---

**ExerciseHistory** (NEW - Optional, for performance optimization)
```typescript
{
  id: UUID
  userId: UUID (FK → User)
  exerciseId: UUID (FK → Exercise)
  sessionId: UUID (FK → WorkoutSession)
  sessionDate: Date // Denormalized for faster queries
  maxWeight: Float // Max weight used in this session
  totalVolume: Float // Total weight × reps across all sets
  setsCompleted: Integer
  avgReps: Float
  createdAt: DateTime
}
```

**Purpose**: Optimized table for weight history queries (Phase 2)

**Business Rules**:
- Populated via trigger or background job after session completion
- Read-only from application perspective
- Indexed on (userId, exerciseId, sessionDate DESC) for fast history retrieval

---

### Relationship Diagram

```
User 1─────1 WorkoutAssessment
                     │
                     │ 1
                     │
                     │ N
              WorkoutSplit ────┐
                     │         │
                     │ 1       │ current
                     │         │
                     │ N       │
              SplitExercise    │
                     │         │
                     │ N       │
                     │         │
                     └────┬────┘
                          │
                          │ 1
                          │
                    Exercise (existing)
                          │
                          │ N
                          │
                   WorkoutSession ────1─── WorkoutSplit
                          │
                          │ 1
                          │
                          │ N
                   WorkoutExercise
                          │
                          │ 1
                          │
                          │ N
                     WorkoutSet
```

---

## 6. Integration Points with Existing System

### INT-1: Migration from Routine System

**Challenge**: Existing users have Routine → TrainingDivision → DivisionExercise structure

**Migration Strategy**:

**Step 1: Detect Migration Candidates**
- Query: Users with isActive = true Routine
- Trigger: On app update, show migration banner

**Step 2: Create Assessment from Routine**
- Infer frequency from count of TrainingDivision records
- Infer focus from exercise distribution (analyze categories)
- Create WorkoutAssessment record

**Step 3: Map Divisions to Splits**
- TrainingDivision → WorkoutSplit (1:1 mapping)
- Preserve order, name (or rename to Split A/B/C)
- DivisionExercise → SplitExercise (copy all fields)

**Step 4: Link Historical Sessions**
- Update WorkoutSession: Set splitId and assessmentId
- Maintain routineId for historical reference

**Step 5: Archive Old Routine**
- Set isArchived = true
- Don't delete (preserve data integrity)

**Rollback Plan**: Keep both systems active for 2 weeks, allow manual revert

---

### INT-2: Exercise Catalog Integration

**No changes required to Exercise domain**

**Enhancement Opportunities (Phase 3)**:
- Add videoId and imageUrl to Exercise table
- Batch import YouTube video IDs for common exercises
- Allow community video contributions (moderated)

---

### INT-3: Stats & Analytics Integration

**Existing analytics queries need updates**:

**Change Required**:
- Stats that filter by routineId must also support splitId
- Volume calculations remain unchanged (use WorkoutSet data)
- PR tracking remains unchanged (use WorkoutSet.weight)

**New Analytics Opportunities**:
- Split effectiveness comparison (which split drives most progress?)
- Focus area analysis (is user's focus resulting in balanced development?)
- Assessment adherence (are they completing frequency they committed to?)

---

### INT-4: Notification Integration (Future)

**Phase 3+ Enhancement**:
- Reminder to complete current split (if 3+ days since last session)
- Streak at risk notification (if 1 day away from breaking streak)
- New split unlocked celebration (after completing full rotation)

---

## 7. Risks & Mitigation Strategies

### Risk 1: User Confusion During Migration

**Severity**: High
**Likelihood**: Medium

**Description**: Existing users may be confused by UI changes and migration prompt

**Impact**: User frustration, potential churn of power users

**Mitigation**:
- ✅ In-app migration guide with screenshots
- ✅ Email announcement 1 week before update
- ✅ "What's changing?" FAQ page
- ✅ Option to preview new system before migrating
- ✅ Ability to revert to old system for 14 days

**Contingency**: Phased rollout (5% → 25% → 50% → 100% of users)

---

### Risk 2: Auto-Generated Splits Don't Match User Needs

**Severity**: Medium
**Likelihood**: High

**Description**: Pre-defined split logic may not align with user's specific goals or preferences

**Impact**: User dissatisfaction, manual workarounds, feature abandonment

**Mitigation**:
- ✅ Phase 1: Test with 20 beta users, iterate on exercise distribution
- ✅ Phase 2: Add "Not working for you? Customize splits" escape hatch
- ✅ Phase 3: Full split editing capabilities
- ✅ Collect feedback: "How satisfied are you with your generated splits?" (1-5 scale)

**Contingency**: Hybrid approach - generate template, allow immediate customization

---

### Risk 3: Circular Progression Doesn't Match User Schedule

**Severity**: Medium
**Likelihood**: Medium

**Description**: User creates 4-day split but trains 3 days one week, gets out of sync

**Impact**: Confusion about which split is "current"

**Mitigation**:
- ✅ Allow manual "mark as current" option
- ✅ Calendar shows clear history of which splits were done when
- ✅ Smart detection: If user skips 3+ days, prompt "resume where you left off or restart cycle?"

**Contingency**: Add "flexible mode" where user picks which split to do each session (not auto-advanced)

---

### Risk 4: Weight History Performance Issues

**Severity**: Low
**Likelihood**: Medium

**Description**: Querying weight history for every exercise may cause slow loading

**Impact**: Poor UX during workout (delays when opening exercise details)

**Mitigation**:
- ✅ Limit history to last 5 sessions (not all-time)
- ✅ Index database on (userId, exerciseId, completedAt DESC)
- ✅ Use React Query with staleTime to cache results
- ✅ Lazy load history (show exercise details immediately, history loads async)
- ✅ Phase 2: Implement ExerciseHistory denormalized table

**Contingency**: Make weight history opt-in toggle ("Show history" checkbox)

---

### Risk 5: Calendar Widget Overloads UI

**Severity**: Low
**Likelihood**: Low

**Description**: Calendar widget on "My Workout" view may clutter interface, especially on mobile

**Impact**: Reduced usability, information overload

**Mitigation**:
- ✅ Minimalist calendar design (small circles, minimal text)
- ✅ Collapsible on mobile (swipe to expand/collapse)
- ✅ A/B test: Calendar prominent vs collapsed by default
- ✅ User preference toggle: "Show calendar on My Workout"

**Contingency**: Move calendar to separate "Progress" tab if engagement is low

---

## 8. Open Questions for Product Owner

### Q1: Exercise Distribution Logic - CRITICAL

**Question**: How should exercises be distributed for each training focus?

**Context**: Pre-assessment needs mapping of focus → exercise categories per split

**Options**:

**Option A - Pre-defined Templates**:
- Create 4 templates (legs, arms, fullBody, core) with fixed exercise lists
- Pros: Consistent, tested, reliable
- Cons: Less flexible, may not suit everyone

**Option B - Dynamic Generation**:
- Algorithm generates based on exercise categories and user focus
- Pros: More adaptive, can incorporate user's custom exercises
- Cons: Complex logic, unpredictable results

**Option C - Hybrid**:
- Start with template (Option A), allow customization (Phase 2)
- Pros: Best of both worlds
- Cons: Two systems to maintain

**Recommendation**: Option C (Hybrid)

**Decision Needed By**: Before Phase 1 implementation starts

---

### Q2: Migration Path - HIGH PRIORITY

**Question**: Should migration be mandatory or optional?

**Options**:

**Option A - Mandatory Migration**:
- All users must migrate to new system
- Old routine system removed
- Pros: Single codebase, cleaner architecture
- Cons: Forced change may frustrate power users

**Option B - Optional Migration**:
- Users can choose to stay on old system
- Both systems coexist indefinitely
- Pros: User choice, less risky
- Cons: Maintain two codebases, technical debt

**Option C - Phased Sunset**:
- New users get splits system only
- Existing users migrate with 60-day grace period
- After 60 days, old system read-only (no new routines)
- Pros: Balanced approach, clear timeline
- Cons: Requires maintaining both systems temporarily

**Recommendation**: Option C (Phased Sunset)

**Decision Needed By**: Before Phase 2 (migration implementation)

---

### Q3: Current Split Advancement - MEDIUM PRIORITY

**Question**: When should "current split" advance?

**Options**:

**Option A - Auto-Advance on Completion**:
- As soon as user clicks "Finalize Workout"
- Pros: Simple, automatic
- Cons: No flexibility if user wants to repeat a split

**Option B - Manual Selection**:
- User chooses which split to do next
- Pros: Maximum flexibility
- Cons: Defeats purpose of guided approach

**Option C - Auto-Advance with Override**:
- Auto-advances by default
- "Do a different split instead" button available
- Pros: Guided but flexible
- Cons: Slightly more complex UI

**Recommendation**: Option C (Auto-Advance with Override)

**Decision Needed By**: Before Phase 1 UI design

---

### Q4: Weight History Display Format - LOW PRIORITY

**Question**: How should weight history be displayed?

**Options**:

**Option A - Table View**:
```
Date       | Weight | Sets x Reps
-----------+--------+------------
2 days ago | 50 kg  | 3 x 10
1 week ago | 47.5kg | 3 x 10
```
- Pros: Data-dense, easy to scan
- Cons: Takes vertical space

**Option B - Inline Summary**:
```
Last session: 50 kg (3×10)
Previous: 47.5 kg (3×10)
Show 3 more →
```
- Pros: Compact, expandable
- Cons: Less visual

**Option C - Chart**:
- Line graph of weight over time
- Pros: Visual, trend-clear
- Cons: Overkill for 5 data points

**Recommendation**: Option B (Inline Summary) with Option A (Table) on expand

**Decision Needed By**: Before Phase 2 implementation

---

## 9. Next Steps & Agent Handoff

### Immediate Actions (Priority Order)

1. **Product Owner Review** (1-2 days)
   - Review this business analysis plan
   - Make decisions on Open Questions (Q1-Q4)
   - Approve Phase 1 scope and timeline

2. **Launch domain-architect** (2-3 days)
   - Task: Design domain entities (WorkoutAssessment, WorkoutSplit, SplitExercise)
   - Deliverable: Prisma schema updates, repository patterns
   - Dependencies: Q1 decision (exercise distribution logic)

3. **Launch ux-ui-designer** (3-4 days)
   - Task: Design user flows and wireframes
   - Deliverables:
     - Pre-assessment flow wireframes (2 screens)
     - "My Workout" main view (1 screen)
     - Exercise list view (1 screen)
     - Exercise detail view with weight input (1 screen)
     - Calendar widget design
   - Dependencies: None (can start in parallel)

4. **Launch nextjs-builder** (2-3 days)
   - Task: Create technical implementation plan
   - Deliverables:
     - Page structure and routing plan
     - Server Component vs Client Component decisions
     - Server Actions design (split generation, workout completion)
     - State management strategy
   - Dependencies: domain-architect completion

5. **Launch shadcn-builder** (1 day)
   - Task: Select UI components
   - Deliverables:
     - Component selection for pre-assessment form
     - Calendar widget component (explore options)
     - Exercise list components
     - Progress indicators
   - Dependencies: ux-ui-designer wireframes

6. **Implementation Kickoff** (After all agents complete)
   - Review all agent deliverables
   - Create implementation task breakdown
   - Begin Phase 1 development

---

### Success Criteria for This Business Analysis

This plan is considered complete and successful if:

- ✅ All 9 sections are comprehensive and actionable
- ✅ Business rules are specific enough for validation implementation
- ✅ Data model requirements enable domain-architect to create schema
- ✅ Feature phases have clear scope boundaries
- ✅ Risks identified with concrete mitigation strategies
- ✅ Open questions documented for product owner decision
- ✅ Next steps provide clear agent handoff instructions
- ✅ Product owner approves plan and answers open questions within 3 days

---

## Appendix A: Key Terminology

**Splits**: Individual workout sessions within a weekly training plan (e.g., Split A, Split B, Split C in a 3-day program)

**Pre-Assessment**: Initial questionnaire that determines user's training frequency and focus to auto-generate appropriate workout splits

**Current Split**: The next workout split the user should perform, indicated visually in the UI

**Training Focus**: User's primary training goal category (Legs, Arms, Full Body, Core) selected during pre-assessment

**Weight History**: Historical record of weights used for a specific exercise in previous workout sessions

**Habit Calendar**: Visual calendar widget showing days when workouts were completed, used for streak tracking and motivation

**Finalize Workout**: Action that marks a workout session as complete, records timestamp, and advances to next split

**Circular Progression**: System where splits advance in sequence (A→B→C→A) infinitely, ensuring balanced training rotation

---

## Appendix B: User Flow Summary

```
[New User Journey]

1. Registration/Login
   ↓
2. Pre-Assessment
   - Frequency: 3-6 days/week
   - Focus: Legs | Arms | Full Body | Core
   ↓
3. Split Generation
   - System creates N splits (N = frequency)
   - Distributes exercises based on focus
   ↓
4. My Workout View
   - See all splits
   - Current split highlighted
   - Calendar widget (empty initially)
   ↓
5. Start Workout
   - Click current split
   - See exercise list with checkboxes
   ↓
6. Exercise Detail
   - Click exercise
   - See description, sets/reps
   - Enter weight
   - View weight history (Phase 2)
   - Check off when complete
   ↓
7. Complete All Exercises
   - Return to split view
   - Progress indicator: 8/8 complete
   ↓
8. Finalize Workout
   - Validation: All checked?
   - Record completion timestamp
   - Update calendar
   - Advance to next split
   - Success message: "Great! Next: Split B"
   ↓
9. Repeat Cycle
   - Split B becomes current
   - User repeats flow
   - Calendar shows completion history
```

---

**Document Status**: Ready for Product Owner Review
**Next Action**: Product Owner answers Q1-Q4, approves Phase 1 scope
**Estimated Review Time**: 30-45 minutes
