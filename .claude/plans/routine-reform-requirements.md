# Routine System Reform - Requirements Analysis

**Session ID**: `20251106_220103`
**Created**: 2025-11-06
**Status**: Requirements Definition
**Agent**: business-analyst

---

## Executive Summary

This document defines comprehensive requirements for reforming the gym tracker app's routine system. The current system uses a rigid day-of-week structure that doesn't match users' mental model of training programs. The reformed system will introduce flexible "Training Divisions" that can occur multiple times per week, with enhanced exercise tracking including video references, load progression history, and detailed notes.

**Key Changes**:
- Replace day-of-week structure with flexible training divisions
- Add frequency-based scheduling (e.g., "3x per week" instead of "Monday/Wednesday/Friday")
- Integrate YouTube video references for exercise form
- Track load progression history over time
- Add comprehensive note-taking capabilities

**Impact**: Medium-High complexity, affects database schema, business logic, and all UI components related to routines.

---

## 1. Problem Statement

### Current Situation

The existing routine system has several limitations:

1. **Rigid Structure**: Uses `DayOfWeek` enum (MONDAY-SUNDAY) which forces users to commit to specific days
   - Problem: Real-world training is flexible - users may shift days due to schedule changes
   - Problem: Cannot represent "3x per week" without specifying exact days

2. **Limited Exercise Information**: Missing critical training data
   - No video reference for proper form
   - No historical weight progression tracking
   - Limited note-taking capabilities

3. **Suboptimal UX**: Current UI doesn't facilitate efficient routine creation and management
   - Multi-step form is complex and unclear
   - Difficult to visualize the full routine structure
   - No quick access to exercise history when planning

### Desired Outcome

A flexible, user-friendly routine system where:

1. Users create routines with named training divisions (e.g., "Upper Body", "Lower Body", "Push", "Pull")
2. Each division specifies frequency (how many times per week) rather than specific days
3. Each exercise includes:
   - Video reference URL (YouTube) for form guidance
   - Sets, reps, and weight targets
   - Rest timer configuration
   - Historical load progression data
   - Rich note-taking capabilities
4. Clear, intuitive UI that guides users through routine creation and execution

### Value Proposition

**For Users**:
- Flexibility to adapt training schedule to real-world constraints
- Better exercise form through video references
- Track progress over time with load history
- Document insights and adjustments with notes

**For the Business**:
- Improved user engagement and retention
- Better alignment with how real trainers structure programs
- Reduced confusion and support requests
- Foundation for future features (progressive overload algorithms, AI coaching, etc.)

---

## 2. Stakeholders

### Primary Users: Gym Enthusiasts

**Profile**: Regular gym-goers who follow structured training programs

**Goals**:
- Create flexible workout routines that adapt to their schedule
- Track progressive overload over time
- Learn proper exercise form through video references
- Document their training experience with notes

**Pain Points**:
- Current system forces them to commit to specific days
- Cannot easily see if they're progressing in weight/reps
- No way to reference proper form during workout
- Limited space for documenting training insights

**Needs**:
- Flexible scheduling based on frequency, not specific days
- Historical data to compare current vs past performance
- Quick access to exercise demonstration videos
- Rich note-taking for each exercise

**Technical Level**: Beginner to Intermediate (mobile-first, simple interactions)

### Secondary Users: Personal Trainers (Future)

**Profile**: Fitness professionals who create routines for clients

**Goals**:
- Create professional training programs with detailed instructions
- Share routines with clients
- Track client progress remotely

**Pain Points**:
- Need to provide video demonstrations for proper form
- Want to document specific coaching cues and progressions
- Need clients to follow frequency-based programs (not rigid schedules)

**Needs**:
- Ability to embed instructional videos
- Detailed note-taking for coaching cues
- Shareable routine templates
- Progress tracking across multiple clients

**Note**: While this persona is marked "future", the requirements should accommodate their needs without adding complexity for primary users.

### Decision Makers: Product Owner & Tech Lead

**Success Criteria**:
- System maintains data integrity during migration
- Performance doesn't degrade with new features
- Code follows architectural constraints
- User adoption of new features is measurable

---

## 3. Scope

### In Scope ✅

**Database & Data Model**:
- Rename/restructure `RoutineDay` to `TrainingDivision`
- Remove `DayOfWeek` enum, replace with `frequency` (integer)
- Add `description` field to divisions
- Add `videoUrl` field to exercise references
- Create `ExerciseLoadHistory` model for weight progression tracking
- Data migration strategy for existing routines

**Business Logic**:
- Training division creation and management
- Frequency validation (1-7 times per week)
- YouTube URL validation and metadata extraction
- Load history tracking and retrieval
- Exercise reordering within divisions
- Routine cloning/templating

**User Interface**:
- Redesigned routine creation flow
- Training division editor (name, frequency, description)
- Enhanced exercise configuration panel (video, sets, reps, weight, rest, notes)
- Load progression visualization
- Mobile-responsive design
- Embedded video player (YouTube iframe)

**User Experience**:
- Intuitive routine creation wizard
- Visual feedback for frequency selection
- Historical comparison UI (current vs previous weights)
- Quick note-taking interface
- Drag-and-drop exercise reordering

### Out of Scope ❌

**Explicitly NOT included in this reform**:
- AI-powered workout recommendations
- Social features (sharing routines publicly)
- Video recording/upload (only YouTube embedding)
- Advanced analytics and charts (beyond basic load history)
- Workout scheduling/calendar integration
- Progressive overload automation
- Exercise substitution recommendations
- Rest day management
- Nutrition tracking integration
- Multi-user routine collaboration (trainer-client features)

**Future Considerations**:
- These features may be added in later phases after validating the core reform
- The data model should be designed to accommodate future extensions

### Assumptions

1. **YouTube as Primary Video Source**: Users will primarily use YouTube for exercise videos, not upload custom videos
2. **Weekly Frequency Model**: Training frequency will be measured in "times per week" (1-7), not bi-weekly or monthly cycles
3. **Single Active Routine**: Users typically have one active routine at a time, though they can create multiple
4. **Weight as Primary Load Metric**: Load is measured in kilograms (not pounds, not RPE, not other metrics)
5. **User Responsibility for Scheduling**: The system won't automatically schedule workouts to specific days - users manually decide when to train each division
6. **Historical Data Preservation**: Existing workout data will be preserved during migration
7. **Mobile-First Usage**: Primary usage will be on mobile devices during workouts

### Dependencies

**External**:
- YouTube iframe API for video embedding
- YouTube Data API (optional) for video metadata extraction

**Internal**:
- Prisma ORM for database migrations
- React Query for data fetching and caching
- React Hook Form for complex form handling
- Zod for schema validation

**Technical Stack**:
- Next.js 15 with App Router
- React 19 Server Components
- Supabase PostgreSQL database
- shadcn/ui component library
- TailwindCSS v4 for styling

---

## 4. User Stories and Features

### Epic 1: Training Division Management

**Priority**: P0 (Critical for MVP)

#### US-1.1: Create Training Division

**As a** gym enthusiast
**I want to** create a training division within my routine with a name, frequency, and description
**So that** I can organize my workout program into logical training blocks

**Acceptance Criteria**:
- [ ] User can add a new training division to an existing or new routine
- [ ] User can specify a division name (e.g., "Upper Body Push", "Leg Day")
- [ ] User can set frequency as integer 1-7 (times per week)
- [ ] User can add optional brief description (max 200 characters)
- [ ] System validates that division name is unique within the routine
- [ ] System validates that frequency is between 1 and 7
- [ ] UI shows clear visual feedback for frequency selection (e.g., "3x per week")
- [ ] Changes are saved immediately (optimistic UI updates)

**Priority**: P0
**Estimated Effort**: Medium

**Edge Cases**:
- Division name contains special characters or emojis → Allow, sanitize for SQL injection
- User tries to set frequency to 0 or >7 → Show validation error
- Two divisions have same name → Show validation error with suggestion to differentiate

---

#### US-1.2: Reorder Training Divisions

**As a** gym enthusiast
**I want to** reorder my training divisions within a routine
**So that** they appear in my preferred training sequence

**Acceptance Criteria**:
- [ ] User can drag and drop divisions to reorder
- [ ] Order persists in database (via `order` integer field)
- [ ] Visual feedback during drag (highlight drop zones)
- [ ] Mobile-friendly touch gestures for reordering
- [ ] Changes save automatically after drop

**Priority**: P1
**Estimated Effort**: Small

---

#### US-1.3: Edit Training Division

**As a** gym enthusiast
**I want to** edit an existing training division's name, frequency, or description
**So that** I can adjust my program as my goals change

**Acceptance Criteria**:
- [ ] User can click/tap on division to enter edit mode
- [ ] User can update name, frequency, or description
- [ ] Same validation rules as creation apply
- [ ] System warns if changing frequency will affect scheduled workouts (future feature)
- [ ] Changes save with optimistic UI update

**Priority**: P0
**Estimated Effort**: Small

---

#### US-1.4: Delete Training Division

**As a** gym enthusiast
**I want to** delete a training division I no longer need
**So that** my routine stays clean and organized

**Acceptance Criteria**:
- [ ] User can delete a division via context menu or swipe action
- [ ] System shows confirmation dialog warning about cascade deletion of exercises
- [ ] If division has exercises, show count in warning (e.g., "This will delete 5 exercises")
- [ ] Deletion is permanent (no soft delete initially)
- [ ] System doesn't delete workout history associated with this division (historical data preserved)

**Priority**: P1
**Estimated Effort**: Small

**Business Rule**: Deleting a division doesn't delete historical workout data, only the routine template.

---

### Epic 2: Exercise Configuration

**Priority**: P0 (Critical for MVP)

#### US-2.1: Add Exercise to Division

**As a** gym enthusiast
**I want to** add an exercise to a training division
**So that** I can build out my workout plan

**Acceptance Criteria**:
- [ ] User can search and select from exercise library
- [ ] User can configure: target sets, target reps, target weight (optional), rest time
- [ ] User can add YouTube video URL (optional)
- [ ] User can add notes (optional)
- [ ] Exercise is added to division with next available order number
- [ ] UI validates YouTube URL format if provided

**Priority**: P0
**Estimated Effort**: Medium

**Validation Rules**:
- **Sets**: Integer 1-10
- **Reps**: String (allows "8-12", "10", "AMRAP", etc.) max 20 chars
- **Weight**: Float 0-500 kg (0 = bodyweight)
- **Rest**: Integer 0-600 seconds (0 = no rest specified)
- **Video URL**: Must be valid YouTube URL (youtube.com/watch or youtu.be format)
- **Notes**: String max 500 characters

---

#### US-2.2: Add YouTube Video Reference

**As a** gym enthusiast
**I want to** attach a YouTube video URL to an exercise
**So that** I can reference proper form during my workout

**Acceptance Criteria**:
- [ ] User can paste YouTube URL into exercise configuration
- [ ] System validates URL format (youtube.com/watch?v=X or youtu.be/X)
- [ ] System extracts video ID and stores it
- [ ] System optionally fetches video title/thumbnail for preview (nice-to-have)
- [ ] User can preview video in modal/lightbox without leaving routine editor
- [ ] User can update or remove video URL
- [ ] Invalid URL shows clear error message

**Priority**: P0
**Estimated Effort**: Medium

**Technical Notes**:
- Store video ID, not full URL (for flexibility if URL structure changes)
- Use YouTube iframe API for embedded player
- Consider rate limits if using YouTube Data API for metadata

**Edge Cases**:
- Video URL is for deleted/private video → Store anyway, show error in player
- User enters non-YouTube URL → Reject with clear error message
- URL has tracking parameters → Extract clean video ID

---

#### US-2.3: Configure Sets, Reps, Weight, and Rest

**As a** gym enthusiast
**I want to** specify sets, reps, weight, and rest time for each exercise
**So that** I have clear targets during my workout

**Acceptance Criteria**:
- [ ] User can input target sets (integer)
- [ ] User can input target reps (flexible string format: "10", "8-12", "AMRAP")
- [ ] User can input target weight in kg (optional, 0 = bodyweight)
- [ ] User can input rest time in seconds (optional)
- [ ] System provides quick selectors for common rest times (30s, 60s, 90s, 120s)
- [ ] System provides unit toggle for weight (kg/lbs) - future consideration
- [ ] All fields validate on blur
- [ ] Form shows validation errors inline

**Priority**: P0
**Estimated Effort**: Small

**UI Considerations**:
- Use number steppers for sets and rest time
- Allow text input for reps to support ranges and special notation
- Provide quick-select buttons for common values
- Show weight history from previous workouts (see US-3.1)

---

#### US-2.4: Add Exercise Notes

**As a** gym enthusiast
**I want to** add notes to each exercise in my routine
**So that** I can document coaching cues, form tips, or personal insights

**Acceptance Criteria**:
- [ ] User can add/edit notes (free text, max 500 characters)
- [ ] Notes field expands as user types (textarea)
- [ ] Character counter shows remaining space
- [ ] Notes are optional
- [ ] Notes are visible during workout execution (in active workout view)
- [ ] Notes support basic markdown formatting (bold, italic, lists) - future consideration

**Priority**: P1
**Estimated Effort**: Small

**UI Considerations**:
- Collapsible section to save space
- Auto-save on blur or after 3 seconds of inactivity
- Show truncated preview in collapsed state

---

#### US-2.5: Reorder Exercises within Division

**As a** gym enthusiast
**I want to** reorder exercises within a training division
**So that** they follow my preferred exercise sequence

**Acceptance Criteria**:
- [ ] User can drag and drop exercises within a division
- [ ] Order persists via `order` integer field
- [ ] Visual feedback during drag
- [ ] Mobile-friendly touch gestures
- [ ] Changes save automatically

**Priority**: P1
**Estimated Effort**: Small

---

#### US-2.6: Remove Exercise from Division

**As a** gym enthusiast
**I want to** remove an exercise from a training division
**So that** I can adjust my routine as needed

**Acceptance Criteria**:
- [ ] User can delete exercise via context menu or swipe action
- [ ] System shows confirmation dialog
- [ ] Deletion is permanent (no soft delete initially)
- [ ] Historical workout data is preserved (only removes from routine template)

**Priority**: P1
**Estimated Effort**: Small

---

### Epic 3: Load Progression History

**Priority**: P0 (Critical for MVP)

#### US-3.1: View Load History for Exercise

**As a** gym enthusiast
**I want to** see my previous weights and reps for an exercise
**So that** I can track my progressive overload over time

**Acceptance Criteria**:
- [ ] When configuring exercise weight, user sees historical data
- [ ] History shows last 5 workout sessions for that exercise
- [ ] Each history entry shows: date, sets × reps @ weight (e.g., "3 × 10 @ 50kg")
- [ ] History is sorted newest first
- [ ] If no history exists, show message "No previous workouts recorded"
- [ ] User can expand to see full history (modal or expanded view)

**Priority**: P0
**Estimated Effort**: Medium

**Technical Requirements**:
- Query `WorkoutExercise` and `WorkoutSet` models for historical data
- Filter by exercise ID and user ID
- Aggregate set data per workout session
- Cache aggressively (history doesn't change often)

**UI Design**:
- Show as inline table or cards below weight input
- Highlight if current target weight exceeds previous max (progressive overload indicator)
- Show trend arrow if weight is increasing/decreasing

---

#### US-3.2: Compare Current vs Historical Performance

**As a** gym enthusiast
**I want to** compare my current workout performance against previous sessions
**So that** I can validate I'm progressing

**Acceptance Criteria**:
- [ ] During active workout, user sees previous performance for current exercise
- [ ] UI highlights if user matches or exceeds previous performance (e.g., green indicator)
- [ ] UI shows warning if performance is significantly lower (possible fatigue/injury flag)
- [ ] Comparison is based on total volume (sets × reps × weight)
- [ ] User can dismiss comparison or view detailed history

**Priority**: P1
**Estimated Effort**: Medium

**Business Rules**:
- **Progressive Overload**: Current volume > previous volume by at least 5% = good progress
- **Maintenance**: Current volume within ±5% of previous = maintaining
- **Regression**: Current volume < previous volume by >5% = potential concern

---

#### US-3.3: Track Personal Records (PRs)

**As a** gym enthusiast
**I want to** see my personal records (highest weight, most reps, highest volume) for each exercise
**So that** I can celebrate milestones and set new goals

**Acceptance Criteria**:
- [ ] System tracks max weight, max reps, and max total volume per exercise
- [ ] PRs are displayed on exercise detail view
- [ ] PRs are calculated from historical workout data
- [ ] System shows date when PR was achieved
- [ ] System highlights when user is attempting to break a PR (during workout)
- [ ] PRs are updated automatically after workout completion

**Priority**: P2
**Estimated Effort**: Medium

**Technical Requirements**:
- Compute PRs via aggregation query on `WorkoutSet` model
- Consider caching PR data in separate table for performance
- Trigger recalculation after each workout completion

---

### Epic 4: Routine Creation UX

**Priority**: P0 (Critical for MVP)

#### US-4.1: Guided Routine Creation Wizard

**As a** gym enthusiast
**I want to** be guided through routine creation with clear steps
**So that** I don't feel overwhelmed and can create a complete routine easily

**Acceptance Criteria**:
- [ ] Multi-step wizard with clear progress indicator
- [ ] **Step 1**: Name your routine
- [ ] **Step 2**: Add training divisions (name, frequency, description)
- [ ] **Step 3**: Add exercises to each division
- [ ] **Step 4**: Review and save
- [ ] User can navigate back to previous steps to edit
- [ ] User can save as draft at any step
- [ ] Clear visual hierarchy and spacing (UX best practices)
- [ ] Mobile-responsive design (stacks vertically on small screens)

**Priority**: P0
**Estimated Effort**: Large

**UI Considerations**:
- Use stepper component for progress visualization
- Allow "skip and come back later" for non-critical steps
- Auto-save drafts to prevent data loss
- Provide example routines for inspiration (future)

---

#### US-4.2: Routine Templates (Quick Start)

**As a** gym enthusiast
**I want to** start from a pre-built routine template
**So that** I can quickly get started without creating from scratch

**Acceptance Criteria**:
- [ ] User can browse 3-5 popular routine templates (e.g., "Push/Pull/Legs", "Upper/Lower", "Full Body")
- [ ] User can preview template details before selecting
- [ ] User can clone template to their account
- [ ] User can customize cloned template (rename, modify divisions, add/remove exercises)
- [ ] System tracks which templates are most popular for analytics

**Priority**: P2
**Estimated Effort**: Medium

**Business Rules**:
- Templates are read-only, stored as JSON or database records
- Cloning creates new routine with user as owner
- Template modifications don't affect original template

---

#### US-4.3: Edit Existing Routine

**As a** gym enthusiast
**I want to** edit my existing routine without disrupting my workout history
**So that** I can evolve my program over time

**Acceptance Criteria**:
- [ ] User can edit routine name
- [ ] User can add/remove/edit training divisions
- [ ] User can add/remove/edit exercises
- [ ] System preserves workout history (historical data isn't modified)
- [ ] If user removes an exercise, historical workouts still reference old data
- [ ] Changes don't affect in-progress workouts (apply to next workout)

**Priority**: P0
**Estimated Effort**: Medium

**Technical Considerations**:
- Routine is a template, workout sessions are instances
- Editing template doesn't cascade to historical data
- Consider versioning if complex change tracking is needed (future)

---

#### US-4.4: Archive/Delete Routine

**As a** gym enthusiast
**I want to** archive or delete routines I no longer use
**So that** my routine list stays clean and relevant

**Acceptance Criteria**:
- [ ] User can archive a routine (soft delete, can be restored)
- [ ] User can permanently delete a routine
- [ ] Archived routines are hidden from default view but accessible via "Archived" filter
- [ ] Delete shows confirmation dialog warning about historical data impact
- [ ] Deleting routine doesn't delete workout history (workouts reference routine as nullable)
- [ ] System shows count of workouts associated with routine in confirmation

**Priority**: P1
**Estimated Effort**: Small

**Business Rules**:
- Archive is reversible, delete is permanent
- Deleting a routine sets `routineId` to null in associated workouts (preserve history)

---

### Epic 5: Mobile-First Experience

**Priority**: P0 (Critical for MVP)

#### US-5.1: Mobile-Optimized Routine Editor

**As a** gym enthusiast
**I want to** create and edit routines on my mobile device
**So that** I can plan my workouts on the go

**Acceptance Criteria**:
- [ ] All routine editor UI is fully functional on mobile (320px+ width)
- [ ] Forms use mobile-friendly inputs (large tap targets, appropriate keyboard types)
- [ ] Drag-and-drop works with touch gestures
- [ ] Modals/drawers slide up from bottom (mobile UX pattern)
- [ ] No horizontal scrolling required
- [ ] Text is readable without zooming (min 16px font size)

**Priority**: P0
**Estimated Effort**: Medium (baked into all UI work)

---

#### US-5.2: Offline Support for Routine Viewing

**As a** gym enthusiast
**I want to** view my routine even when offline or in areas with poor connectivity
**So that** I can always access my workout plan in the gym

**Acceptance Criteria**:
- [ ] Routine data is cached locally (Service Worker or IndexedDB)
- [ ] User can view cached routines when offline
- [ ] User sees "Offline Mode" indicator
- [ ] User cannot edit while offline (show message)
- [ ] Changes made online sync when connection is restored

**Priority**: P2
**Estimated Effort**: Large (requires PWA setup)

**Technical Considerations**:
- Use Next.js Service Worker for caching
- Implement optimistic UI updates
- Queue mutations for sync when back online

---

## 5. Functional Requirements

### FR-1: Training Division Management

**Priority**: P0

**Requirements**:

- **FR-1.1**: System SHALL support creating training divisions within a routine
  - **AC**: User can create division with name, frequency (1-7), and description (max 200 chars)

- **FR-1.2**: System SHALL validate division name uniqueness within a routine
  - **AC**: Two divisions in same routine cannot have identical names (case-insensitive)

- **FR-1.3**: System SHALL validate frequency range
  - **AC**: Frequency must be integer between 1 and 7 (inclusive)

- **FR-1.4**: System SHALL allow reordering divisions via `order` field
  - **AC**: Divisions display in ascending order, user can change order via drag-and-drop

- **FR-1.5**: System SHALL cascade delete divisions when routine is deleted
  - **AC**: Deleting routine removes all associated divisions and exercises

- **FR-1.6**: System SHALL preserve division history when division is deleted
  - **AC**: Deleting division from routine doesn't delete historical workout data referencing it

---

### FR-2: Exercise Configuration

**Priority**: P0

**Requirements**:

- **FR-2.1**: System SHALL support adding exercises to training divisions
  - **AC**: User can add exercise from library with configuration: sets, reps, weight, rest, notes

- **FR-2.2**: System SHALL validate exercise configuration parameters
  - **AC**: Sets (1-10), Reps (string, max 20 chars), Weight (0-500 kg), Rest (0-600 seconds), Notes (max 500 chars)

- **FR-2.3**: System SHALL allow reordering exercises within division
  - **AC**: Exercises display in ascending order by `order` field

- **FR-2.4**: System SHALL prevent duplicate exercises within same division
  - **AC**: User cannot add same exercise twice to same division (validation error)

- **FR-2.5**: System SHALL cascade delete exercises when division is deleted
  - **AC**: Deleting division removes all associated exercises from routine template

---

### FR-3: Video Integration

**Priority**: P0

**Requirements**:

- **FR-3.1**: System SHALL support YouTube video URL attachment to exercises
  - **AC**: User can paste YouTube URL, system validates and extracts video ID

- **FR-3.2**: System SHALL validate YouTube URL format
  - **AC**: Accept formats: youtube.com/watch?v=X, youtu.be/X, reject all others

- **FR-3.3**: System SHALL store video ID, not full URL
  - **AC**: Database stores 11-character YouTube video ID (e.g., "dQw4w9WgXcQ")

- **FR-3.4**: System SHALL embed video player in routine editor and workout view
  - **AC**: User can preview/watch video without leaving app (YouTube iframe API)

- **FR-3.5**: System SHALL handle invalid/deleted videos gracefully
  - **AC**: If video is unavailable, show error message in player, don't break UI

---

### FR-4: Load Progression History

**Priority**: P0

**Requirements**:

- **FR-4.1**: System SHALL track historical load data for each exercise
  - **AC**: System stores completed set data (weight, reps, date) per exercise per user

- **FR-4.2**: System SHALL retrieve load history for exercise configuration
  - **AC**: When user configures exercise, system displays last 5 workout sessions for that exercise

- **FR-4.3**: System SHALL calculate historical performance metrics
  - **AC**: System computes total volume (sets × reps × weight) for each historical workout

- **FR-4.4**: System SHALL compare current vs historical performance
  - **AC**: During workout, system shows visual indicator if user is matching/exceeding previous performance

- **FR-4.5**: System SHALL track personal records (PRs) per exercise
  - **AC**: System identifies max weight, max reps, max volume for each exercise

- **FR-4.6**: System SHALL update PRs automatically after workout completion
  - **AC**: After marking workout complete, system recalculates PRs and updates if new record achieved

---

### FR-5: Data Integrity and Migration

**Priority**: P0

**Requirements**:

- **FR-5.1**: System SHALL migrate existing routines to new structure
  - **AC**: Migration script converts `RoutineDay.dayOfWeek` to `TrainingDivision.frequency`

- **FR-5.2**: System SHALL preserve historical workout data during migration
  - **AC**: Existing workout sessions remain queryable after schema change

- **FR-5.3**: System SHALL maintain referential integrity
  - **AC**: Foreign key constraints prevent orphaned records

- **FR-5.4**: System SHALL handle concurrent edits gracefully
  - **AC**: Optimistic concurrency control prevents data loss from simultaneous edits

---

### FR-6: Routine Management

**Priority**: P0

**Requirements**:

- **FR-6.1**: System SHALL support creating new routines
  - **AC**: User can create routine with name, system sets isActive=false, isArchived=false by default

- **FR-6.2**: System SHALL support editing routine metadata
  - **AC**: User can update routine name at any time

- **FR-6.3**: System SHALL support archiving routines (soft delete)
  - **AC**: User can archive routine, setting isArchived=true, routine hidden from default list

- **FR-6.4**: System SHALL support deleting routines (hard delete)
  - **AC**: User can permanently delete routine, system sets workoutSession.routineId=null for historical data

- **FR-6.5**: System SHALL support cloning routines
  - **AC**: User can duplicate routine, creating new routine with identical structure

- **FR-6.6**: System SHALL enforce single active routine per user (optional business rule)
  - **AC**: Setting routine as active sets all other routines to isActive=false for that user

---

## 6. Non-Functional Requirements

### NFR-1: Performance

**Priority**: P0

**Requirements**:

- **NFR-1.1**: Routine editor page load time SHALL be < 2 seconds on 4G connection
  - **Measurement**: Lighthouse performance score > 80

- **NFR-1.2**: Exercise search SHALL return results in < 500ms
  - **Measurement**: P95 response time < 500ms under normal load

- **NFR-1.3**: Load history query SHALL complete in < 1 second
  - **Measurement**: P95 database query time < 1 second for 100+ historical workouts

- **NFR-1.4**: Video embeds SHALL not block page rendering
  - **Measurement**: Use lazy loading, defer iframe load until scrolled into view

- **NFR-1.5**: System SHALL support 1000 concurrent users without degradation
  - **Measurement**: Load testing confirms < 2s response time with 1000 concurrent users

---

### NFR-2: Security

**Priority**: P0

**Requirements**:

- **NFR-2.1**: All data mutations SHALL validate user session via Server Actions
  - **AC**: Every mutation checks `auth()` session before proceeding

- **NFR-2.2**: Users SHALL only access their own routines
  - **AC**: All database queries filter by `userId`, no cross-user data leakage

- **NFR-2.3**: YouTube video embeds SHALL use sandbox attributes
  - **AC**: iframes include `sandbox="allow-scripts allow-same-origin"` to prevent XSS

- **NFR-2.4**: Input validation SHALL prevent SQL injection
  - **AC**: All user input sanitized, Prisma parameterized queries used exclusively

- **NFR-2.5**: API rate limiting SHALL prevent abuse
  - **AC**: Server Actions enforce rate limit (100 requests/min per user)

---

### NFR-3: Usability

**Priority**: P1

**Requirements**:

- **NFR-3.1**: New users SHALL create their first routine in < 5 minutes
  - **Measurement**: User testing shows 80% success rate within 5 minutes

- **NFR-3.2**: Forms SHALL provide inline validation feedback
  - **AC**: Validation errors appear on blur, not on submit

- **NFR-3.3**: Error messages SHALL be clear and actionable
  - **AC**: Errors include what went wrong and how to fix it (e.g., "Frequency must be between 1 and 7. You entered 0.")

- **NFR-3.4**: All interactive elements SHALL have min 44px tap target (mobile)
  - **AC**: WCAG AA compliance for touch targets

- **NFR-3.5**: Loading states SHALL provide visual feedback
  - **AC**: Skeletons or spinners shown during async operations, no blank screens

---

### NFR-4: Accessibility

**Priority**: P1

**Requirements**:

- **NFR-4.1**: System SHALL meet WCAG 2.1 AA standards
  - **AC**: Automated testing (axe-core) shows 0 critical violations

- **NFR-4.2**: All interactive elements SHALL be keyboard accessible
  - **AC**: User can navigate entire routine editor with keyboard only (Tab, Enter, Escape)

- **NFR-4.3**: Screen reader compatibility SHALL be verified
  - **AC**: ARIA labels and roles used, tested with NVDA/JAWS

- **NFR-4.4**: Color contrast SHALL meet WCAG AA standards
  - **AC**: Contrast ratio ≥ 4.5:1 for text, ≥ 3:1 for UI components

- **NFR-4.5**: Video player controls SHALL be accessible
  - **AC**: YouTube player includes closed captions, keyboard controls work

---

### NFR-5: Reliability

**Priority**: P0

**Requirements**:

- **NFR-5.1**: System uptime SHALL be 99.9% (excluding planned maintenance)
  - **Measurement**: <43 minutes downtime per month

- **NFR-5.2**: Data backups SHALL occur every 24 hours
  - **AC**: Automated database backups via Supabase, tested restore process

- **NFR-5.3**: System SHALL gracefully handle and log all errors
  - **AC**: Try-catch blocks in all Server Actions, errors logged to monitoring service (Sentry)

- **NFR-5.4**: Failed mutations SHALL not corrupt database state
  - **AC**: Prisma transactions used for multi-step operations, rollback on error

- **NFR-5.5**: Optimistic UI updates SHALL revert on error
  - **AC**: React Query mutation errors trigger rollback to previous state

---

### NFR-6: Maintainability

**Priority**: P1

**Requirements**:

- **NFR-6.1**: Code SHALL follow project architectural constraints
  - **AC**: All code passes code review checklist (`.claude/knowledge/critical-constraints.md`)

- **NFR-6.2**: All functions SHALL have inline documentation
  - **AC**: Complex logic includes JSDoc comments explaining purpose and parameters

- **NFR-6.3**: Unit test coverage SHALL be > 70% for business logic
  - **AC**: Jest coverage report shows >70% for `/domains/*` code

- **NFR-6.4**: Database schema SHALL include comprehensive comments
  - **AC**: All tables and columns have description comments in Prisma schema

- **NFR-6.5**: Repository pattern SHALL be used for data access
  - **AC**: No direct Prisma imports in UI components, all queries via repository files

---

### NFR-7: Scalability

**Priority**: P2

**Requirements**:

- **NFR-7.1**: Database queries SHALL be optimized for 10x data growth
  - **AC**: Query plans reviewed, indexes added for common query patterns

- **NFR-7.2**: System SHALL support horizontal scaling
  - **AC**: Stateless Server Actions, no in-memory session storage

- **NFR-7.3**: Video embeds SHALL use CDN for thumbnail caching
  - **AC**: YouTube thumbnails cached via Next.js Image optimization

---

## 7. Business Rules

### BR-1: Training Division Frequency

**Rule**: Training division frequency must represent realistic weekly workout frequency (1-7 times per week)

**Rationale**:
- More than 7x per week is unrealistic (would require multiple sessions per day)
- Less than 1x per week isn't meaningful for training frequency
- System focuses on weekly microcycles (standard in fitness programming)

**Validation**:
- Frontend: Input component restricts to 1-7
- Backend: Zod schema validates `frequency >= 1 && frequency <= 7`
- Database: Check constraint `CHECK (frequency >= 1 AND frequency <= 7)`

---

### BR-2: Unique Division Names per Routine

**Rule**: Training division names must be unique within a routine (case-insensitive)

**Rationale**: Prevents user confusion when selecting which division to train

**Validation**:
- Frontend: Check existing division names on blur, show error if duplicate
- Backend: Unique constraint on `(routineId, LOWER(name))`

**Example**:
- ✅ Allowed: Routine has "Push" and "Pull" divisions
- ❌ Not allowed: Routine has "Push" and "push" divisions (duplicate)

---

### BR-3: Exercise Weight Units

**Rule**: Exercise weight is stored in kilograms (kg) in database

**Rationale**: Standardize on single unit for calculations, offer display conversion in UI

**Validation**:
- Frontend: Allow user to toggle display between kg/lbs (multiply by 2.20462 for display only)
- Backend: Always store kg
- Migration: Convert existing data to kg if needed

**Future Consideration**: User preference for default display unit (kg vs lbs)

---

### BR-4: YouTube Video ID Storage

**Rule**: Store YouTube video ID (11-char string), not full URL

**Rationale**:
- URL format may change, video ID is stable
- Smaller storage footprint
- Easier to construct embed URLs programmatically

**Validation**:
- Frontend: Accept various YouTube URL formats, extract video ID
- Backend: Validate video ID format (11 alphanumeric characters with dashes/underscores)
- Database: Store as `VARCHAR(11)`

**Example**:
- Input: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Stored: `dQw4w9WgXcQ`

---

### BR-5: Historical Data Preservation

**Rule**: Deleting routines or divisions must NOT delete historical workout data

**Rationale**: Users must be able to view past performance even if they delete routine templates

**Implementation**:
- WorkoutSession.routineId is NULLABLE
- When routine deleted, set `routineId = null` in associated workouts
- When division deleted, workout history retains old division data via snapshots (future: consider denormalization)

**Cascade Behavior**:
- Routine deleted → WorkoutSession.routineId set to null (preserve workouts)
- Division deleted → Only removes from routine template, not from historical workouts
- User deleted → CASCADE delete all data (expected behavior for GDPR)

---

### BR-6: Single Active Routine (Optional)

**Rule**: User can have only one "active" routine at a time

**Rationale**: Simplifies UI for starting workouts, reduces decision fatigue

**Validation**:
- When user sets routine as active, system sets all other routines to isActive=false
- Atomic operation to prevent race conditions

**Alternative**: Allow multiple active routines (future enhancement based on user feedback)

---

### BR-7: Exercise Uniqueness per Division

**Rule**: An exercise cannot be added multiple times to the same training division

**Rationale**: Prevents accidental duplication, simplifies UI

**Validation**:
- Database: Unique constraint on `(routineDayId, exerciseId)`
- Frontend: Disable already-added exercises in selector

**Exception**: User CAN add same exercise to different divisions within same routine

**Example**:
- ✅ Allowed: "Bench Press" in "Push Day" and "Full Body Day" of different routines
- ✅ Allowed: "Bench Press" in "Push Day" and "Pull Day" of same routine
- ❌ Not allowed: "Bench Press" twice in "Push Day"

---

### BR-8: Load Progression Tracking

**Rule**: Load history is tracked per exercise per user, independent of routine

**Rationale**: Users may perform same exercise across different routines, history should aggregate all occurrences

**Implementation**:
- Query `WorkoutExercise` filtered by `exerciseId` and `userId`
- Aggregate data from `WorkoutSet` to calculate volume, max weight, max reps
- Sort by `WorkoutSession.completedAt` descending

**Business Logic**:
- **Volume** = SUM(sets × reps × weight) for all sets in a workout session
- **Max Weight** = MAX(weight) across all sets, all workouts
- **Max Reps** = MAX(reps) across all sets, all workouts (at any weight)
- **Max Volume** = MAX(volume) for a single workout session

---

### BR-9: Rep Range Format

**Rule**: Target reps can be a number or a range (e.g., "10", "8-12", "AMRAP")

**Rationale**: Training prescriptions vary (fixed reps vs rep ranges)

**Validation**:
- Backend: Store as string, max 20 characters
- Frontend: Suggest common formats, allow free text
- No strict parsing initially (just display as-is)

**Future Enhancement**: Parse rep ranges for intelligent workout tracking (e.g., suggest reps within range)

---

### BR-10: Rest Time Default

**Rule**: If rest time is not specified (0 or null), no rest timer is shown during workout

**Rationale**: Not all exercises require timed rest (e.g., low-intensity, supersets)

**Validation**:
- Backend: Allow 0 or null for restSeconds
- Frontend: Show "No rest timer" label if 0/null

---

## 8. Data Requirements

### Entity: Routine

**Attributes**:
- `id`: String (CUID) - Primary key
- `name`: String (max 100 chars) - Routine name
- `isActive`: Boolean - Whether this is the user's current active routine
- `isArchived`: Boolean - Whether routine is archived (soft deleted)
- `userId`: String (FK to User) - Owner of the routine
- `createdAt`: DateTime - Creation timestamp
- `updatedAt`: DateTime - Last modification timestamp

**Relationships**:
- **Belongs to**: User (many routines per user)
- **Has many**: TrainingDivision (divisions within routine)
- **Has many**: WorkoutSession (workouts based on this routine, nullable FK)

**Validation Rules**:
- Name required, min 3 chars, max 100 chars
- UserId must reference valid user
- Only one isActive=true per user (enforced by business logic, not constraint)

**Indexes**:
- `(userId, isActive)` - Fast lookup of active routine per user
- `(userId, isArchived)` - Fast filtering of archived routines

---

### Entity: TrainingDivision (formerly RoutineDay)

**Attributes**:
- `id`: String (CUID) - Primary key
- `name`: String (max 100 chars) - Division name (e.g., "Upper Push", "Leg Day")
- `frequency`: Integer (1-7) - Times per week this division should be trained
- `description`: String (max 200 chars, nullable) - Brief description of division focus
- `order`: Integer - Order within routine (for display sorting)
- `routineId`: String (FK to Routine) - Parent routine

**Relationships**:
- **Belongs to**: Routine
- **Has many**: RoutineExercise (exercises within division)

**Validation Rules**:
- Name required, min 3 chars, max 100 chars
- Frequency required, 1-7 inclusive
- Description optional, max 200 chars
- Order required, positive integer
- Unique (routineId, LOWER(name))

**Indexes**:
- `(routineId, order)` - Fast ordered retrieval
- `(routineId)` - Fast lookup of divisions per routine

**Database Constraints**:
- `CHECK (frequency >= 1 AND frequency <= 7)`
- `CHECK (order > 0)`
- `UNIQUE (routineId, LOWER(name))`

---

### Entity: RoutineExercise

**Attributes**:
- `id`: String (CUID) - Primary key
- `order`: Integer - Order within division
- `targetSets`: Integer (1-10) - Target number of sets
- `targetReps`: String (max 20 chars) - Target reps (e.g., "10", "8-12", "AMRAP")
- `targetWeight`: Float (nullable, 0-500) - Target weight in kg (0 = bodyweight)
- `restSeconds`: Integer (nullable, 0-600) - Rest time between sets in seconds
- `videoId`: String (nullable, 11 chars) - YouTube video ID for exercise demonstration
- `notes`: String (nullable, max 500 chars) - Exercise-specific notes
- `routineDivisionId`: String (FK to TrainingDivision) - Parent division
- `exerciseId`: String (FK to Exercise) - Exercise reference

**Relationships**:
- **Belongs to**: TrainingDivision
- **Belongs to**: Exercise

**Validation Rules**:
- Order required, positive integer
- TargetSets required, 1-10
- TargetReps required, max 20 chars
- TargetWeight optional, 0-500 kg if specified
- RestSeconds optional, 0-600 if specified
- VideoId optional, exactly 11 alphanumeric chars if specified
- Notes optional, max 500 chars if specified
- Unique (routineDivisionId, exerciseId)

**Indexes**:
- `(routineDivisionId, order)` - Fast ordered retrieval
- `(exerciseId)` - Fast lookup for load history queries

**Database Constraints**:
- `CHECK (targetSets >= 1 AND targetSets <= 10)`
- `CHECK (targetWeight IS NULL OR (targetWeight >= 0 AND targetWeight <= 500))`
- `CHECK (restSeconds IS NULL OR (restSeconds >= 0 AND restSeconds <= 600))`
- `CHECK (videoId IS NULL OR LENGTH(videoId) = 11)`
- `UNIQUE (routineDivisionId, exerciseId)`

---

### Entity: WorkoutSession (No Changes)

**Existing structure preserved** - No changes needed for this reform

**Attributes**:
- `id`: String (CUID)
- `status`: Enum (IN_PROGRESS | COMPLETED | CANCELLED)
- `startedAt`: DateTime
- `completedAt`: DateTime (nullable)
- `duration`: Integer (nullable) - Duration in seconds
- `rating`: Integer (nullable, 1-5)
- `notes`: String (nullable)
- `userId`: String (FK to User)
- `routineId`: String (FK to Routine, nullable) - Nullable for historical data preservation

**Relationships**:
- **Belongs to**: User
- **Belongs to**: Routine (nullable)
- **Has many**: WorkoutExercise

---

### Entity: WorkoutExercise (No Changes)

**Existing structure preserved** - No changes needed for this reform

**Attributes**:
- `id`: String (CUID)
- `order`: Integer
- `notes`: String (nullable)
- `workoutSessionId`: String (FK to WorkoutSession)
- `exerciseId`: String (FK to Exercise)

**Relationships**:
- **Belongs to**: WorkoutSession
- **Belongs to**: Exercise
- **Has many**: WorkoutSet

---

### Entity: WorkoutSet (No Changes)

**Existing structure preserved** - No changes needed for this reform

**Attributes**:
- `id`: String (CUID)
- `setNumber`: Integer
- `weight`: Float - Weight in kg
- `reps`: Integer - Number of reps completed
- `isCompleted`: Boolean
- `completedAt`: DateTime (nullable)
- `workoutExerciseId`: String (FK to WorkoutExercise)

**Relationships**:
- **Belongs to**: WorkoutExercise

**Usage**: This entity is the source of truth for load progression history

---

### Entity: Exercise (No Schema Changes)

**Existing structure remains** - May add `videoUrl` field in future if per-exercise videos needed (vs per-routine-exercise)

**Current Attributes**:
- `id`: String (CUID)
- `name`: String
- `category`: Enum (CHEST | BACK | LEGS | SHOULDERS | ARMS | CORE | CARDIO)
- `description`: String (nullable)
- `isPredefined`: Boolean
- `userId`: String (nullable, FK to User)
- `createdAt`: DateTime

**Note**: For now, video URLs are stored per RoutineExercise (same exercise may have different demonstration videos in different routines/divisions)

---

## 9. Integration Requirements

### INT-1: YouTube iframe API

**Type**: Third-party JavaScript SDK

**Purpose**: Embed and control YouTube videos within routine editor and workout views

**Operations**:
- **Embed Video**: Render YouTube player iframe with video ID
- **Player Controls**: Play, pause, seek, volume (via YouTube API methods)
- **Event Handling**: Detect when video ends, errors, ready state

**Implementation**:
```tsx
// Use react-youtube or custom iframe implementation
<iframe
  src={`https://www.youtube.com/embed/${videoId}`}
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  sandbox="allow-scripts allow-same-origin"
/>
```

**Error Handling**:
- Video not found (404) → Show "Video unavailable" message in player
- Private/deleted video → Show "Video cannot be displayed" message
- Network error → Show "Failed to load video" message

**Fallback**: Always store video ID, show thumbnail with link to YouTube as fallback

**Rate Limits**: YouTube iframe API has no hard rate limits, but respect fair use

---

### INT-2: YouTube Data API v3 (Optional Enhancement)

**Type**: REST API

**Purpose**: Fetch video metadata (title, thumbnail, duration) for better UX

**Operations**:
- **GET /videos**: Fetch video details by ID
  - Response: title, description, thumbnails, duration, viewCount

**Authentication**: Requires API key (free tier: 10,000 units/day)

**Implementation**:
- Server-side fetch in Server Action (don't expose API key to client)
- Cache metadata in database to reduce API calls

**Error Handling**: If API call fails, degrade gracefully (show video ID, no metadata)

**Fallback**: Don't block user flow if metadata fetch fails, use video ID as display name

**Future Enhancement**: Batch fetch metadata for multiple videos

---

## 10. User Interface Requirements

### UI-1: Routine Editor Main View

**Purpose**: Create and edit routines with divisions and exercises

**Key Elements**:
- **Header**: Routine name (editable inline), Save/Cancel buttons
- **Division List**: Ordered list of training divisions with expand/collapse
- **Add Division Button**: Prominent CTA to add new division
- **Division Card**: Shows division name, frequency badge, description, exercise count
- **Exercise List** (within division): Ordered list with drag handles
- **Add Exercise Button** (within division): Opens exercise selector modal

**User Flow**:
1. User enters routine name
2. User clicks "Add Division"
3. User fills division form (name, frequency, description)
4. User clicks "Add Exercises" within division
5. User searches and selects exercises
6. User configures each exercise (sets, reps, weight, rest, video, notes)
7. User reorders exercises/divisions as needed
8. User clicks "Save Routine"

**Responsive Behavior**:
- **Mobile**: Single column, divisions stack vertically, full-width cards
- **Tablet**: Single column, slightly wider cards with more padding
- **Desktop**: Optional two-column layout (division list + detail panel)

**Visual Design**:
- Clear visual hierarchy (routine > division > exercise)
- Color-coded frequency badges (1-2x = blue, 3-4x = green, 5-7x = orange)
- Subtle shadows for card depth
- Smooth expand/collapse animations

---

### UI-2: Training Division Form

**Purpose**: Configure division name, frequency, and description

**Key Elements**:
- **Name Input**: Text field, max 100 chars, required
- **Frequency Selector**: Visual selector (pills 1-7 or slider), required
- **Description Textarea**: Optional, max 200 chars, shows char counter
- **Save/Cancel Buttons**: Bottom of form

**Validation Feedback**:
- Inline errors on blur
- Name uniqueness check
- Frequency range validation

**Visual Design**:
- Frequency selector uses large tap targets (44px min)
- Active frequency is highlighted (bold, colored)
- Description has subtle border, expands as user types

---

### UI-3: Exercise Configuration Panel

**Purpose**: Configure exercise parameters (sets, reps, weight, rest, video, notes)

**Key Elements**:
- **Exercise Name**: Display (not editable, from Exercise library)
- **Sets Input**: Number input, stepper controls, 1-10
- **Reps Input**: Text input, placeholder "e.g., 10 or 8-12", max 20 chars
- **Weight Input**: Number input, stepper controls, 0-500 kg, toggle kg/lbs (display only)
- **Rest Time**: Quick select buttons (30s, 60s, 90s, 120s, 180s) + custom input
- **Video URL Input**: Text field, validates YouTube URL, shows preview thumbnail
- **Notes Textarea**: Collapsible, max 500 chars, char counter
- **Load History Section**: Shows last 5 workouts for this exercise (read-only)

**User Flow**:
1. User selects exercise from library
2. Panel opens with form
3. User configures parameters
4. User optionally adds video URL (shows inline preview)
5. User optionally adds notes
6. User saves, exercise added to division

**Validation Feedback**:
- Inline errors on blur
- Video URL validation shows checkmark or error icon
- Form disabled until required fields valid

**Visual Design**:
- Form sections use card layout with clear labels
- Video preview shows thumbnail + play icon
- Load history uses mini table or card list
- Notes textarea expands to fit content (max height with scroll)

---

### UI-4: Load History Display

**Purpose**: Show historical performance for an exercise

**Key Elements**:
- **History Table/List**: Columns: Date, Sets × Reps @ Weight, Total Volume
- **Last 5 Workouts**: Default view, expandable to full history
- **Progressive Overload Indicator**: Green ↑ if volume increasing, yellow → if stable, red ↓ if decreasing
- **Personal Records Badge**: Highlight max weight, max reps, max volume with trophy icon
- **Expand Button**: Opens modal with full history and simple chart

**Visual Design**:
- Compact table on mobile (stack columns vertically)
- Color-coded trend arrows
- Trophy emoji or icon for PRs
- Subtle background highlight for latest workout

---

### UI-5: Exercise Selector Modal

**Purpose**: Search and select exercises from library to add to division

**Key Elements**:
- **Search Bar**: Fuzzy search by exercise name
- **Category Filter**: Chips for CHEST, BACK, LEGS, etc.
- **Exercise List**: Scrollable list with exercise name, category, description
- **Selection Indicator**: Checkmark or disabled state for already-added exercises
- **Add Button**: Confirms selection, closes modal, opens exercise configuration panel

**User Flow**:
1. User clicks "Add Exercise" in division
2. Modal opens with exercise list
3. User searches or filters by category
4. User clicks exercise to select
5. Modal closes, configuration panel opens

**Visual Design**:
- Large search bar at top
- Category chips below search (horizontal scroll on mobile)
- Exercise cards with clear visual separation
- "Already added" exercises are grayed out with label

---

### UI-6: Routine List View

**Purpose**: Browse all routines, filter by active/archived

**Key Elements**:
- **Header**: "My Routines" title, Add Routine button
- **Filter Tabs**: All | Active | Archived
- **Routine Cards**: Show routine name, division count, active badge, last edited date
- **Context Menu**: Edit, Activate, Archive, Delete (via long-press or swipe)
- **Empty State**: Encouraging message with CTA to create first routine

**User Flow**:
1. User views list of routines
2. User taps filter to see active or archived
3. User taps routine card to view/edit details
4. User long-presses for context menu actions

**Visual Design**:
- Cards have subtle shadow, rounded corners
- Active badge is prominent (green pill)
- Swipe-to-delete on mobile (left swipe shows delete button)
- Empty state has illustration + CTA button

---

## 11. Risk Assessment

### Risk 1: Data Migration Complexity

**Category**: Technical

**Severity**: High

**Likelihood**: Medium

**Impact**: Existing routines may not map cleanly to new structure, risk of data loss or corruption during migration

**Mitigation Strategy**:
- Write comprehensive migration script with rollback capability
- Test migration on production database backup in staging environment
- Implement database transaction for atomic migration
- Provide manual fix UI for edge cases that can't auto-migrate
- Add migration status tracking (log which routines migrated successfully)

**Contingency Plan**:
- If migration fails partially, rollback entire migration
- Implement feature flag to enable new UI only after migration confirmed successful
- Provide admin panel to manually fix broken routines

**Owner**: Domain Architect + Next.js Builder

---

### Risk 2: YouTube API Rate Limits

**Category**: Technical

**Severity**: Medium

**Likelihood**: Low

**Impact**: If using YouTube Data API for metadata, may hit rate limits (10k units/day free tier), blocking video metadata fetching

**Mitigation Strategy**:
- Cache video metadata in database after first fetch (reduce API calls)
- Implement request queuing and rate limit monitoring
- Degrade gracefully if rate limit hit (show video ID without metadata)
- Consider upgrading to paid YouTube API plan if needed
- Use iframe API only (no metadata) as fallback, which has no rate limits

**Contingency Plan**:
- If rate limit hit, disable metadata fetching for 24h
- Show cached data if available, otherwise show video ID only
- Notify users with unobtrusive message ("Video details temporarily unavailable")

**Owner**: Next.js Builder

---

### Risk 3: Complex UI Increases Development Time

**Category**: Resource

**Severity**: Medium

**Likelihood**: High

**Impact**: Designing intuitive multi-step routine editor with drag-and-drop, modals, and inline editing may take longer than estimated

**Mitigation Strategy**:
- Break UI work into smaller, testable increments
- Use existing shadcn/ui components where possible (reduce custom code)
- Prioritize P0 features first, defer P1/P2 features to later iterations
- Conduct early user testing with wireframes/prototypes before full implementation
- Allocate buffer time in estimate (multiply by 1.5x)

**Contingency Plan**:
- If timeline slips, cut P2 features (e.g., routine templates, offline support)
- Launch MVP with simplified UI, iterate based on user feedback
- Use progressive enhancement (basic form first, enhance with drag-and-drop later)

**Owner**: UX/UI Designer + Parent Agent

---

### Risk 4: Performance Degradation with Large History

**Category**: Technical

**Severity**: Medium

**Likelihood**: Medium

**Impact**: Users with 100+ workouts may experience slow load history queries, impacting UX during exercise configuration

**Mitigation Strategy**:
- Add database indexes on `(exerciseId, userId, completedAt)` for fast historical queries
- Paginate history display (show last 5, lazy-load more on demand)
- Cache aggregated PR data in separate table (denormalization)
- Use React Query aggressive caching (staleTime: 5 minutes)
- Monitor query performance with database query analyzer

**Contingency Plan**:
- If queries slow, implement background job to precompute PR data nightly
- Add "loading" skeleton for history section, don't block form submission
- Temporarily disable full history view, show only last 5 workouts

**Owner**: Domain Architect + Next.js Builder

---

### Risk 5: User Confusion with Frequency vs Days

**Category**: Usability

**Severity**: Medium

**Likelihood**: Medium

**Impact**: Users accustomed to day-of-week scheduling may find frequency concept unclear, leading to misuse

**Mitigation Strategy**:
- Add onboarding tooltip explaining frequency concept with examples
- Provide visual example ("3x per week = 3 workouts, any days you choose")
- Include help icon with explanation next to frequency selector
- Conduct user testing to validate concept clarity
- Offer optional day-of-week tags as metadata (non-functional, just for user reference)

**Contingency Plan**:
- If confusion widespread, add optional "suggested days" field (non-enforced, just guidance)
- Provide migration path to reintroduce day-of-week if frequency model fails
- Add FAQ section in app explaining frequency-based scheduling

**Owner**: UX/UI Designer + Business Analyst

---

### Risk 6: Video Embeds Increase Page Load Time

**Category**: Performance

**Severity**: Low

**Likelihood**: Medium

**Impact**: Embedding multiple YouTube iframes on routine editor page may slow rendering, especially on mobile

**Mitigation Strategy**:
- Use lazy loading for video iframes (load only when scrolled into view)
- Implement click-to-load pattern (show thumbnail, load iframe on click)
- Use `loading="lazy"` attribute on iframes
- Limit number of visible video embeds (collapse by default, expand on demand)
- Monitor Lighthouse performance score, target >80

**Contingency Plan**:
- If performance poor, switch to thumbnail-only view with external link to YouTube
- Implement "Show Videos" toggle (default off, user opts in)
- Use static thumbnail images instead of iframe embeds initially

**Owner**: Next.js Builder

---

### Risk 7: Scope Creep from User Requests

**Category**: Business

**Severity**: High

**Likelihood**: High

**Impact**: Users may request additional features (e.g., calendar scheduling, social sharing) that are out of scope, delaying MVP launch

**Mitigation Strategy**:
- Clearly define MVP scope in requirements document (this document)
- Use prioritization framework (P0/P1/P2/P3) to defer non-critical features
- Communicate roadmap to stakeholders (MVP → Enhancements → Optimizations)
- Implement feature request tracking (capture ideas for future phases)
- Conduct regular scope review meetings to realign expectations

**Contingency Plan**:
- If scope expands, cut P2 features to maintain timeline
- Negotiate extended timeline with stakeholders if P1 features added
- Launch MVP faster, iterate with user feedback for Phase 2

**Owner**: Product Owner + Business Analyst

---

## 12. Success Metrics (KPIs)

### User Adoption

**Metric**: Percentage of users who create at least one routine with new system

**Target**: 70% of active users within 30 days of launch

**Measurement**: Track routine creation events via analytics, filter by created date >= launch date

**Baseline**: Currently ~50% of users have created a routine (estimated)

---

### User Engagement

**Metric**: Average number of training divisions per routine

**Target**: 3-5 divisions per routine (indicates users are structuring programs properly)

**Measurement**: Query database for AVG(division_count) per routine

**Baseline**: N/A (new metric)

---

### Feature Usage - Video Integration

**Metric**: Percentage of routine exercises with video URL attached

**Target**: 40% of exercises have video within 60 days of launch

**Measurement**: Query database for COUNT(exercises with videoId) / COUNT(all exercises)

**Baseline**: 0% (new feature)

---

### Feature Usage - Load History

**Metric**: Number of users who view load history at least once per week

**Target**: 50% of active users view history weekly

**Measurement**: Track "view load history" events via analytics

**Baseline**: 0% (new feature)

---

### Performance

**Metric**: P95 routine editor page load time

**Target**: < 2 seconds on 4G connection

**Measurement**: Real User Monitoring (RUM) via Vercel Analytics or custom telemetry

**Baseline**: TBD (measure before launch)

---

### User Satisfaction

**Metric**: Average user rating for routine creation experience (in-app survey)

**Target**: 4.0+ out of 5 stars

**Measurement**: Optional rating prompt after first routine creation

**Baseline**: N/A (no current survey)

---

### Business Value - User Retention

**Metric**: 30-day retention rate for users who create a routine with new system

**Target**: 70% retention (vs current ~50% estimated)

**Measurement**: Cohort analysis, track users who create routine and return within 30 days

**Baseline**: ~50% (estimated)

---

### Error Rate

**Metric**: Percentage of routine save operations that fail

**Target**: < 1% failure rate

**Measurement**: Track failed mutations via error logging (Sentry)

**Baseline**: TBD (measure current failure rate)

---

## 13. Implementation Phases

### Phase 1: MVP (Minimum Viable Product)

**Timeline**: 3-4 weeks

**Includes**:
- ✅ Database schema migration (RoutineDay → TrainingDivision, add frequency, description, videoId)
- ✅ Training division CRUD (create, read, update, delete)
- ✅ Exercise configuration with video URL, sets, reps, weight, rest, notes
- ✅ Basic load history display (last 5 workouts)
- ✅ Redesigned routine editor UI (mobile-first)
- ✅ YouTube video embedding (iframe API)
- ✅ Data migration script for existing routines
- ✅ Unit tests for business logic (repositories, actions)

**Success Criteria**:
- Users can create routines with divisions and exercises
- Video embeds work reliably
- Load history displays correctly
- No data loss during migration
- Performance meets targets (< 2s page load)

**Out of MVP**:
- Routine templates
- Offline support
- Advanced analytics/charts
- PR tracking UI
- Progressive overload automation

---

### Phase 2: Enhancements

**Timeline**: 2-3 weeks (post-MVP, based on user feedback)

**Includes**:
- Personal Records (PR) tracking and display (trophy badges)
- Progressive overload indicators (visual feedback for increasing volume)
- Exercise reordering via drag-and-drop
- Routine cloning/templating
- Enhanced load history with charts (simple line chart for weight over time)
- Improved mobile gestures (swipe actions for delete)

**Success Criteria**:
- Users engage with PR tracking (50% view PRs at least once)
- Drag-and-drop works smoothly on mobile and desktop
- User feedback score improves to 4.5+ stars

---

### Phase 3: Optimization

**Timeline**: 1-2 weeks (post-Phase 2)

**Includes**:
- Performance optimization (query tuning, caching improvements)
- Offline support for routine viewing (Service Worker)
- Accessibility improvements (WCAG AA compliance verification)
- Unit/integration test coverage increase to >80%
- Routine templates library (3-5 popular programs)

**Success Criteria**:
- Performance score >90 on Lighthouse
- Offline mode works reliably
- WCAG AA compliance verified with automated tools

---

### Phase 4: Advanced Features (Future)

**Timeline**: TBD (based on user demand)

**Includes**:
- AI-powered workout recommendations
- Social features (share routines publicly)
- Trainer-client features (multi-user collaboration)
- Advanced analytics and progress tracking
- Integration with wearables (Fitbit, Apple Watch)
- Nutrition tracking

**Success Criteria**: TBD based on market validation

---

## 14. Open Questions

- [ ] **Q1**: Should frequency be enforced during workout scheduling, or is it just informational guidance?
  - **Owner**: Product Owner + UX Designer
  - **Due**: Before Phase 1 implementation starts
  - **Options**:
    - A) Informational only (user decides when to train)
    - B) System suggests days based on frequency (e.g., "You have 2 more Upper Body workouts this week")
    - C) System enforces frequency (blocks starting workout if frequency exceeded)
  - **Recommendation**: Start with A (informational), validate user behavior, add B in Phase 2 if needed

- [ ] **Q2**: Should we support imperial units (lbs) in addition to metric (kg) for weight?
  - **Owner**: Product Owner
  - **Due**: Before Phase 1 implementation starts
  - **Options**:
    - A) Metric only (kg), defer imperial to future
    - B) Support both, user preference setting
    - C) Auto-detect based on user location
  - **Recommendation**: A for MVP (store kg, show kg), add B in Phase 2 based on user requests

- [ ] **Q3**: How should we handle users who want to train a division more than 7 times per week?
  - **Owner**: Business Analyst + Domain Architect
  - **Due**: Before Phase 1 implementation starts
  - **Options**:
    - A) Hard cap at 7 (current design)
    - B) Allow up to 14 (2x per day)
    - C) Remove cap, allow any positive integer
  - **Recommendation**: A for MVP (realistic limit), revisit if user requests emerge

- [ ] **Q4**: Should video URLs support platforms other than YouTube (e.g., Vimeo, Instagram)?
  - **Owner**: Product Owner + Next.js Builder
  - **Due**: Before Phase 1 implementation starts
  - **Options**:
    - A) YouTube only (simplifies implementation)
    - B) Support YouTube + Vimeo
    - C) Support any embeddable video URL
  - **Recommendation**: A for MVP (YouTube is dominant platform for fitness content), add others if requested

- [ ] **Q5**: Should we allow users to create custom exercises directly from routine editor?
  - **Owner**: UX Designer + Domain Architect
  - **Due**: Before Phase 1 UI design
  - **Options**:
    - A) Yes, inline exercise creation
    - B) No, must go to separate exercise management page
    - C) Allow adding from library, offer "create new" button that opens modal
  - **Recommendation**: C (best UX compromise), implement in MVP

- [ ] **Q6**: How should we handle routine versioning if user makes significant changes?
  - **Owner**: Domain Architect
  - **Due**: Before Phase 1 implementation starts
  - **Options**:
    - A) No versioning, edits overwrite (simple)
    - B) Automatic versioning on major changes (complex)
    - C) Manual "save as new version" option
  - **Recommendation**: A for MVP (no versioning), consider B or C if users request audit trail

- [ ] **Q7**: Should we migrate all existing routines automatically, or give users option to manually convert?
  - **Owner**: Domain Architect + Product Owner
  - **Due**: Before Phase 1 implementation starts
  - **Options**:
    - A) Auto-migrate all routines (use heuristic: dayOfWeek → frequency mapping)
    - B) Auto-migrate, allow manual adjustment afterward
    - C) Leave old routines unchanged, users manually recreate using new system
  - **Recommendation**: B (auto-migrate with review step), least user friction

---

## 15. Assumptions Validation

| Assumption | Status | Validation Method | Result |
|------------|--------|-------------------|--------|
| Users prefer frequency-based scheduling over day-of-week | ⏳ Pending | User interview / survey | TBD |
| YouTube is primary video source for exercise demos | ⏳ Pending | Analyze current user video links (if any) | TBD |
| Load history is valuable for tracking progress | ⏳ Pending | User interview, competitive analysis | TBD |
| Users will manually decide when to train each division | ⏳ Pending | User testing with frequency concept | TBD |
| Mobile-first usage is dominant | ✅ Validated | Analytics show 75% mobile traffic | 75% mobile |
| Single active routine per user is sufficient | ⏳ Pending | User interview | TBD |
| Weekly frequency model (1-7x) covers most use cases | ⏳ Pending | User interview, survey fitness trainers | TBD |
| Users can manually convert day-based routines to frequency-based | ⏳ Pending | Usability testing with migration flow | TBD |

**Next Steps**: Conduct user interviews and surveys before Phase 1 to validate pending assumptions

---

## 16. Glossary

**Training Division**: A logical grouping of exercises within a routine, characterized by a name, frequency, and description. Replaces the concept of "day" in the old system.

**Frequency**: The number of times per week a training division should be performed (integer 1-7).

**Routine**: A complete workout program consisting of multiple training divisions.

**Exercise**: A specific movement or activity (e.g., "Bench Press", "Squat"). Can be predefined (global) or custom (user-created).

**Routine Exercise**: An exercise instance within a routine division, including configuration (sets, reps, weight, rest, video, notes).

**Load**: The weight used for an exercise, measured in kilograms.

**Progressive Overload**: The gradual increase of stress placed on the body during training (increasing weight, reps, or volume over time).

**Volume**: Total work performed, calculated as sets × reps × weight.

**Personal Record (PR)**: The maximum weight, reps, or volume achieved for an exercise.

**Set**: A group of repetitions performed without rest.

**Rep (Repetition)**: A single complete motion of an exercise.

**Rest Time**: The time between sets, measured in seconds.

**Video ID**: The unique 11-character identifier for a YouTube video (e.g., "dQw4w9WgXcQ").

**AMRAP**: As Many Reps As Possible (common rep scheme in training).

**Server Action**: Next.js 15 feature for server-side mutation functions, marked with `"use server"`.

**Repository Pattern**: Architectural pattern that abstracts data access logic into dedicated repository files.

**Optimistic UI**: UI pattern that updates interface immediately before server confirms success, rolling back on error.

---

## 17. References

**Related Documents**:
- `.claude/tasks/context_session_20251106_220103.md` - Session context for this reform
- `.claude/knowledge/critical-constraints.md` - Non-negotiable architectural rules
- `.claude/knowledge/architecture-patterns.md` - Repository pattern, data access guidelines
- `prisma/schema.prisma` - Current database schema

**Market Research**:
- Competitive analysis: Strong App (uses day-based scheduling), Hevy (uses frequency-based scheduling)
- User feedback: Reddit r/Fitness, r/weightroom discussions on workout tracking apps

**Technical Specs**:
- Next.js 15 Documentation: https://nextjs.org/docs
- React 19 Documentation: https://react.dev
- Prisma Documentation: https://www.prisma.io/docs
- YouTube iframe API: https://developers.google.com/youtube/iframe_api_reference
- YouTube Data API v3: https://developers.google.com/youtube/v3

**Regulatory**: N/A (no health claims, HIPAA compliance, or medical device regulations apply)

---

## 18. Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | TBD | | |
| Technical Lead | TBD | | |
| Stakeholder (User Representative) | TBD | | |

---

## 19. Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-06 | business-analyst | Initial requirements document for routine system reform |

---

## Next Steps for Parent Agent

This requirements document is now complete and ready for technical planning. The parent agent should:

1. **Review with stakeholders** (if available) to validate requirements and answer open questions
2. **Invoke specialized agents** to create implementation plans:
   - **domain-architect**: Design data model, business logic, repository pattern implementation
   - **ux-ui-designer**: Design UI/UX flows, wireframes, component structure
   - **nextjs-builder**: Plan Next.js architecture, routing, Server Actions, form handling
3. **Execute implementation** following plans created by agents
4. **Invoke code-reviewer** after each major phase to ensure architectural compliance

**Recommendation**: Start with domain-architect to finalize data model and migration strategy, as this is the foundation for all other work.
