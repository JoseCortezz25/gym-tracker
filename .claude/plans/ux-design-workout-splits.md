# Workout Splits System - UX/UI Design Plan

**Created**: 2025-11-13
**Session**: workout-splits-20251113_200040
**Complexity**: High
**User Impact**: Critical

## 1. User Context

### User Goals
- **Primary Goal**: Complete structured workout programs efficiently with clear guidance on what to do next
- **Secondary Goals**:
  - Track progress over time (weight history per exercise)
  - Build consistent training habits (calendar tracker)
  - Understand workout structure upfront (pre-assessment clarity)
- **Success Criteria**:
  - User can complete pre-assessment in under 2 minutes
  - User always knows which workout is next
  - User can log a full workout session in under 15 minutes
  - User can view weight progression at a glance

### User Personas
- **Primary**: Gym-goers following structured split routines (PPL, Upper/Lower, Bro Split)
- **Context**: At the gym with phone, needs quick data entry between sets, wants to minimize time looking at screen
- **Pain Points**:
  - Confusion about which workout to do today
  - Forgetting what weight was used last session
  - Tedious manual entry for each set
  - Losing motivation when progress isn't visible

### User Journey

**First-Time User Journey**:
1. Landing on "My Workout" (empty state) → Complete Pre-Assessment → See generated splits preview → Confirm and start first workout
2. View first split detail → Select first exercise → Log sets with weight → Mark exercise complete → Repeat for all exercises
3. Complete all exercises → Finalize workout → See success feedback + calendar updated → Return to dashboard showing next workout

**Returning User Journey**:
1. Open app → See "My Workout" dashboard with current split highlighted → Tap "Start Workout"
2. Exercise list appears → Work through exercises sequentially → Log sets as completed
3. All exercises done → "Finalize Workout" → Calendar updates → Next split becomes active

**Weight History Check Journey**:
1. In active workout → Tap exercise → See exercise detail → View "Weight History" section showing last 3-5 sessions
2. Reference previous weight → Log current weight → Continue workout

## 2. Interface Architecture

### Information Hierarchy

**Dashboard (My Workout) - Primary Screen**:
1. **Primary**: Current/Next Workout Split Card (large, centered, actionable)
2. **Secondary**: All Workout Splits (A, B, C, etc.) in horizontal scrollable list or grid
3. **Tertiary**: Calendar widget showing workout completion streak/pattern

**Workout Split Detail**:
1. **Primary**: Exercise checklist (main focus - what needs to be done)
2. **Secondary**: Progress indicator (X of Y exercises completed)
3. **Tertiary**: "Finalize Workout" button (appears when all exercises checked)

**Exercise Detail**:
1. **Primary**: Sets logging interface (weight + reps input)
2. **Secondary**: Exercise information (description, media)
3. **Tertiary**: Weight history chart/list

### Layout Strategy

**Structure**: Full-page views with bottom sheet/modal for exercise details

**Grid**:
- Dashboard: Card-based grid (1 column mobile, 2-3 columns tablet/desktop)
- Exercise List: Stacked list with checkboxes
- Set Logging: 2-column grid for weight/reps side-by-side

**Spacing**: Comfortable (optimize for readability and touch targets)

**Breakpoints**:
- **Mobile (< 640px)**:
  - Single column layouts
  - Full-width action buttons
  - Bottom sheet for exercise details
  - Calendar widget below splits
- **Tablet (640px - 1024px)**:
  - 2-column grid for splits
  - Side drawer for exercise details (optional)
  - Calendar widget in sidebar
- **Desktop (> 1024px)**:
  - 3-column grid for splits
  - Right sidebar with calendar always visible
  - Modal overlay for exercise details with larger media

### Visual Hierarchy

**Focal Point**: "Next Workout" or "Current Workout" card on dashboard

**Visual Flow**:
1. Top: Page title + context
2. Center: Primary action area (workout cards or exercise list)
3. Bottom: Secondary info (calendar, stats)

**Grouping**:
- Workout splits grouped together
- Exercise sets grouped per exercise
- Calendar shows weekly groupings

**Contrast**:
- Active/current workout: Highlighted border (primary color, thicker stroke)
- Completed workouts: Muted colors, checkmark badge
- Incomplete exercises: High contrast, prominent
- Completed exercises: Lower opacity, checkmark icon

## 3. Interaction Design

### Primary Actions

#### Dashboard Primary Actions

**Action**: "Start Workout"
- **Type**: Primary
- **Location**: Center of current workout card
- **States**:
  - Default: Solid primary color, high contrast text
  - Hover: Slight scale (1.02), darker shade
  - Active: Pressed animation (scale 0.98)
  - Disabled: Grayed out (when no splits exist)
- **Feedback**: Immediate navigation to workout split detail view with slide transition

**Action**: "Begin Pre-Assessment" (first-time users)
- **Type**: Primary
- **Location**: Center of empty state card
- **States**: Same as "Start Workout"
- **Feedback**: Modal/sheet opens with step 1 of pre-assessment

#### Workout Split Detail Primary Actions

**Action**: "Finalize Workout"
- **Type**: Primary
- **Location**: Bottom sticky bar (mobile), bottom-right (desktop)
- **States**:
  - Default: Disabled until all exercises checked
  - Enabled: Solid primary color when ready
  - Loading: Spinner animation + "Finalizing..." text
  - Success: Brief checkmark animation before transition
- **Feedback**:
  1. Optimistic UI update (workout marked complete)
  2. Success toast: "Workout complete! Great job!"
  3. Calendar widget updates with today's date
  4. Transition back to dashboard with next workout highlighted

#### Exercise Detail Primary Actions

**Action**: "Complete Set" (within expandable set row)
- **Type**: Primary
- **Location**: Bottom of expanded set row form
- **States**:
  - Default: Disabled until valid weight + reps entered
  - Enabled: Primary color when data valid
  - Loading: "Saving..." with spinner
  - Success: Row collapses, shows completed state with checkmark
- **Feedback**:
  1. Row animates to collapsed state
  2. Checkmark appears
  3. Opacity reduces slightly
  4. Next set auto-focuses if exists

### Secondary Actions

**Action**: "View Exercise Details" (from exercise list)
- **Type**: Secondary (text/link style)
- **Location**: Exercise name in list (clickable area)
- **Feedback**: Bottom sheet slides up (mobile) or modal opens (desktop) with exercise info

**Action**: "Edit Pre-Assessment"
- **Type**: Tertiary/Link
- **Location**: Top-right menu or settings area
- **Feedback**: Opens pre-assessment modal in edit mode

**Action**: "View Calendar" (expand)
- **Type**: Tertiary
- **Location**: Calendar widget header (if collapsed on mobile)
- **Feedback**: Calendar expands to show full month view

### Micro-interactions

**Hover Effects**:
- Cards: Subtle elevation increase (shadow) + slight border color change
- Buttons: Background color darkens 10%, scale 1.02
- Checkboxes: Border color changes to primary color
- Exercise rows: Background tint (light gray/muted)

**Focus States**:
- All interactive elements: 2px primary color ring with offset
- Keyboard navigation: Clear visual indicator following tab order
- Skip links: "Skip to workout list" for screen readers

**Loading States**:
- Pre-assessment: Skeleton cards for split preview
- Dashboard: Skeleton cards (3 placeholders) while loading splits
- Exercise detail: Skeleton for weight history chart
- Set completion: Inline spinner on button, disabled inputs

**Transitions**:
- Page navigation: Slide left/right (150ms ease-out)
- Modal/sheet: Slide up from bottom (200ms ease-out)
- Expand/collapse: Height animation (150ms ease-in-out)
- Checkbox toggle: Scale + rotation animation (100ms)
- Calendar date marking: Fade in + scale (200ms)

**Success/Error**:
- Success: Toast notification (top-right) with checkmark icon, auto-dismiss 3s
- Error: Toast notification (top-right) with alert icon, manual dismiss
- Validation errors: Inline red text below input, shake animation on submit

### User Input

**Pre-Assessment Inputs**:

1. **Frequency Selection**:
   - **Input Type**: Radio button group (visual cards)
   - **Options**: 2, 3, 4, 5, 6 days per week
   - **Validation**: On blur - must select one
   - **Error Message**: "Please select how many days per week you plan to train"
   - **Placeholder/Helper**: "Choose your training frequency"

2. **Training Focus Selection**:
   - **Input Type**: Checkbox group (multi-select) or radio (single-select - TBD by business-analyst)
   - **Options**: Legs, Arms, Chest, Back, Shoulders, Full Body, etc.
   - **Validation**: On blur - at least one required
   - **Error Message**: "Please select at least one training focus"
   - **Placeholder/Helper**: "What areas do you want to focus on?"

**Exercise Logging Inputs**:

1. **Weight Input**:
   - **Input Type**: Number input (decimal allowed)
   - **Validation**: Real-time - must be >= 0, max 999.9
   - **Error Message**: "Weight must be between 0 and 999 kg"
   - **Placeholder/Helper**: Previous weight shown as placeholder if available, otherwise "0"
   - **Keyboard Type**: Numeric keypad on mobile

2. **Reps Input**:
   - **Input Type**: Number input (integer only)
   - **Validation**: Real-time - must be >= 1, max 999
   - **Error Message**: "Reps must be between 1 and 999"
   - **Placeholder/Helper**: Previous reps shown as placeholder if available, otherwise "0"
   - **Keyboard Type**: Numeric keypad on mobile

3. **Set Notes** (optional):
   - **Input Type**: Textarea
   - **Validation**: Max length 500 characters
   - **Error Message**: "Notes cannot exceed 500 characters"
   - **Placeholder/Helper**: "Form cues, difficulty, etc."
   - **Character Counter**: "0/500" bottom-right

## 4. Component Selection

### shadcn/ui Components Needed

- **Card**: Workout split cards on dashboard, exercise cards
- **Button**: All primary/secondary actions
- **Badge**: "Active" indicator, "Completed" status, day labels (A, B, C)
- **Checkbox**: Exercise completion checkboxes
- **Sheet** (Bottom Sheet): Exercise detail view on mobile
- **Dialog** (Modal): Pre-assessment flow, confirmation dialogs, exercise detail on desktop
- **Progress**: Workout completion progress bar (X of Y exercises)
- **Input**: Weight and reps number inputs
- **Textarea**: Set notes, workout notes
- **Label**: Form field labels
- **Skeleton**: Loading states for cards and lists
- **Collapsible**: Expandable set rows (already implemented in codebase)
- **Tabs**: Potentially for switching between workout splits or history views
- **Calendar** (or custom): Habit tracking calendar widget
- **Toast** (Sonner): Success/error notifications
- **Separator**: Visual dividers between sections
- **Select**: Pre-assessment dropdowns (if needed)
- **RadioGroup**: Pre-assessment frequency selection

**Note**: Coordinate with shadcn-builder agent for:
- Calendar component implementation (may need custom or shadcn calendar adaptation for habit tracking)
- Confirmation dialog patterns
- Loading state skeletons

### Custom Components Needed

- **HabitCalendar**: Custom calendar widget showing workout completion dots/checkmarks
  - **Why custom**: Needs specific visual treatment for habit tracking (dots on completed days, current day highlight, week view vs month view)
  - **Base**: Could extend shadcn Calendar component with custom day rendering

- **WorkoutSplitCard**: Specialized card for workout splits
  - **Why custom**: Specific layout for split letter badge, exercise count, progress ring, current/next indicator
  - **Base**: Extends shadcn Card with custom internal layout

- **ExerciseChecklistItem**: Checkbox list item with exercise name + details link
  - **Why custom**: Combines checkbox, text, and tap-to-expand interaction in specific layout
  - **Base**: Combines shadcn Checkbox with custom layout

- **WeightHistoryChart**: Simple line/bar chart showing weight progression
  - **Why custom**: Lightweight visualization of weight over time (last 5-10 sessions)
  - **Base**: May use recharts library or simple custom SVG visualization

## 5. Content Strategy

### Text Requirements

**Text Map**: `src/domains/workout-splits/workout-splits.text-map.ts`

**Keys to Define**:

**Headings**:
- `myWorkout.heading`: "My Workout"
- `preAssessment.heading`: "Let's Set Up Your Workout Plan"
- `splitDetail.heading`: "Workout {splitLetter}"
- `exerciseDetail.heading`: "{exerciseName}"
- `weightHistory.heading`: "Weight History"

**Body**:
- `myWorkout.emptyState.description`: "Complete a quick assessment to generate your personalized workout splits"
- `preAssessment.frequency.description`: "How many days per week can you train?"
- `preAssessment.focus.description`: "What areas do you want to prioritize?"
- `preAssessment.preview.description`: "Based on your answers, here's your personalized {frequency}-day split"
- `splitDetail.progress`: "{completed} of {total} exercises completed"
- `exerciseDetail.sets.description`: "Complete {sets} sets of {reps} reps"
- `weightHistory.empty`: "No history yet. Complete this exercise to start tracking."

**Actions**:
- `myWorkout.startWorkout`: "Start Workout"
- `myWorkout.beginAssessment`: "Begin Assessment"
- `preAssessment.continue`: "Continue"
- `preAssessment.confirm`: "Confirm & Start"
- `preAssessment.back`: "Back"
- `splitDetail.finalizeWorkout`: "Finalize Workout"
- `exerciseDetail.completeSet`: "Complete Set"
- `exerciseDetail.viewDetails`: "View Details"
- `exerciseDetail.addSet`: "Add Set"

**Feedback** (Success/Error/Warning):
- `success.workoutFinalized`: "Workout complete! Great job!"
- `success.setCompleted`: "Set {number} logged"
- `success.assessmentComplete`: "Your workout plan is ready!"
- `error.finalizeWorkout`: "Please complete all exercises before finalizing"
- `error.invalidWeight`: "Weight must be between 0 and 999 kg"
- `error.invalidReps`: "Reps must be between 1 and 999"
- `warning.exitWorkout`: "Your progress will be saved. Exit anyway?"

**Placeholders**:
- `preAssessment.frequency.placeholder`: "Select training days"
- `preAssessment.focus.placeholder`: "Select focus areas"
- `exerciseDetail.weight.placeholder`: "{lastWeight} kg last time" or "0"
- `exerciseDetail.reps.placeholder`: "{lastReps} reps last time" or "0"
- `exerciseDetail.notes.placeholder`: "Form cues, difficulty, how it felt..."

**Help Text**:
- `preAssessment.frequency.help`: "Be realistic - consistency matters more than volume"
- `preAssessment.focus.help`: "Don't worry, you can change this later"
- `splitDetail.finalizeWorkout.help`: "Mark all exercises complete to finalize"
- `exerciseDetail.notes.help`: "Optional - helps track progress and form"

**Calendar**:
- `calendar.today`: "Today"
- `calendar.streak`: "{days} day streak"
- `calendar.thisWeek`: "This Week: {count} workouts"
- `calendar.noWorkouts`: "No workouts this week yet"

**Tone**: Encouraging, supportive, motivational (not clinical or overly technical)
**Voice**: 2nd person ("You"), active voice, direct and concise

### Microcopy

**Empty States**:
- **No Splits**: "Ready to start your fitness journey? Complete a quick 2-minute assessment to get your personalized workout plan."
- **No Exercises in Split**: "This split doesn't have exercises yet. Add exercises to get started."
- **No Weight History**: "Complete this exercise to start tracking your progress. You've got this!"

**Error States**:
- **Load Failed**: "Couldn't load your workouts. Pull to refresh or try again."
- **Save Failed**: "Couldn't save your progress. Don't worry, we'll try again automatically."
- **Network Error**: "No internet connection. Your data will sync when you're back online."

**Success States**:
- **First Workout Complete**: "Amazing! You completed your first workout. The hardest part is starting - you did it!"
- **Streak Milestone**: "5-day streak! You're on fire! Keep it going!"
- **Weight PR**: "New personal record! You lifted {weight} kg - that's {difference} kg more than last time!"

**Loading States**:
- **Loading Splits**: "Loading your workouts..."
- **Generating Plan**: "Creating your personalized plan..."
- **Saving Progress**: "Saving..."

## 6. Accessibility Design

### Semantic Structure

**Landmarks**:
- `<header>`: Page title and navigation
- `<main>`: Primary content area (dashboard, split detail, exercise detail)
- `<nav>`: Bottom navigation or breadcrumb if present
- `<aside>`: Calendar widget (desktop sidebar)

**Headings**:
- H1: Page title ("My Workout", "Workout A", "Bench Press")
- H2: Major sections ("All Splits", "Exercises", "Weight History")
- H3: Subsections ("Set 1", "Form Tips")

**Lists**:
- Workout splits: `<ul>` with role="list"
- Exercise checklist: `<ul>` with role="list"
- Set rows: `<ol>` (ordered by set number)

### Keyboard Navigation

**Tab Order**:
1. Skip link ("Skip to workout")
2. Page header navigation
3. Primary action button ("Start Workout")
4. Workout split cards (left to right, top to bottom)
5. Calendar widget (if interactive)
6. Footer links

**In Workout Split Detail**:
1. Back button
2. Progress indicator (focusable for SR, not interactive)
3. Exercise checklist items (top to bottom)
4. "Finalize Workout" button

**In Exercise Detail**:
1. Close button
2. Exercise description expand/collapse
3. Set 1 expand trigger
4. Set 1 weight input
5. Set 1 reps input
6. Set 1 notes input
7. Set 1 complete button
8. Set 2 expand trigger... (repeat)

**Shortcuts**:
- `Escape`: Close modal/sheet, exit workout (with confirmation)
- `Enter`: Submit form, complete set (when in form)
- `Space`: Toggle checkbox, activate button

**Focus Management**:
- On modal open: Focus first input or close button
- On modal close: Return focus to trigger element
- On set completion: Focus next set expand trigger
- On exercise completion: Focus next exercise in list

**Escape Hatch**:
- `Escape` key closes any modal/sheet
- "Cancel" button always visible in multi-step flows
- "Exit Workout" button in workout detail (top-left)

### Screen Reader Experience

**ARIA Labels**:
- Workout split cards: `aria-label="Workout A, 5 exercises, current workout"`
- Exercise checkboxes: `aria-label="Mark Bench Press as complete"`
- Calendar dates: `aria-label="November 13th, workout completed"`
- Progress bar: `aria-label="3 of 5 exercises completed, 60 percent"`

**ARIA Descriptions**:
- Pre-assessment frequency: `aria-describedby="frequency-help"` → "Be realistic - consistency matters more than volume"
- Finalize button: `aria-describedby="finalize-help"` → "Mark all exercises complete to finalize"

**Live Regions**:
- Workout completion: `<div role="status" aria-live="polite">Workout complete! Great job!</div>`
- Set completion: `<div role="status" aria-live="polite">Set 1 logged</div>`
- Error messages: `<div role="alert" aria-live="assertive">Please complete all exercises</div>`

**Hidden Content**:
- Skip links: Visually hidden but accessible
- Icon-only buttons: `<span class="sr-only">Close</span>`
- Decorative images: `aria-hidden="true"` or `alt=""`

### Visual Accessibility

**Color Contrast**:
- Text on background: Minimum 4.5:1 (WCAG AA)
- Large text (18px+): Minimum 3:1
- Primary buttons: 4.5:1 for text, 3:1 for border
- Error text: Red with 4.5:1 contrast ratio

**Color Independence**:
- Completed exercises: Checkmark icon + opacity change (not just green)
- Current workout: Border + "Current" label (not just color highlight)
- Errors: Icon + red text + border (not just red text)
- Calendar completed days: Dot/checkmark + tooltip (not just colored background)

**Text Size**:
- Body text: 16px minimum (comfortable reading)
- Labels: 14px minimum
- Headings: 24px (H1), 20px (H2), 18px (H3)
- Small text (e.g., character counter): 12px minimum

**Touch Targets**:
- Buttons: 44x44px minimum (48x48px preferred)
- Checkboxes: 44x44px tap area (even if visual size smaller)
- Exercise list items: 56px minimum height for comfortable tapping
- Set expand triggers: Full row width, 48px minimum height

**Motion**:
- Respect `prefers-reduced-motion`:
  - Disable page transitions (use instant)
  - Disable card hover animations
  - Reduce collapse/expand animation duration to 50ms
  - Disable calendar date fade-ins
- Keep essential feedback (checkmark, success indicator) but simplify

## 7. Responsive Design

### Mobile (< 640px)

**Layout**:
- Single column stack
- Full-width cards
- Bottom sheet for exercise details (not modal)
- Calendar widget below splits (collapsible)

**Navigation**:
- Bottom navigation bar (if app has global nav)
- Back button top-left
- Breadcrumb hidden (use back button only)

**Actions**:
- Full-width primary buttons (48px height)
- "Finalize Workout": Sticky bottom bar (fixed position)
- Checkboxes: Large touch targets (48x48px)

**Content**:
- Split cards: Stack vertically, full width
- Exercise list: Full width, generous padding
- Set rows: Stack weight/reps vertically in expanded state
- Calendar: Compact week view by default, expand to month

**Typography**:
- H1: 24px
- H2: 20px
- Body: 16px
- Small: 14px

### Tablet (640px - 1024px)

**Layout**:
- 2-column grid for splits
- Still use bottom sheet for exercise details (feels natural on tablet)
- Calendar widget in right sidebar (collapsible) or below splits

**Navigation**:
- Top breadcrumb navigation appears
- Back button still present

**Actions**:
- Buttons: Max-width 400px (not full width)
- "Finalize Workout": Bottom-right corner (fixed)

**Content**:
- Split cards: 2-up grid with equal heights
- Exercise list: Max-width 600px, centered
- Set rows: Weight/reps side-by-side (2 columns)
- Calendar: Full month view visible by default

**Typography**: Same as mobile

### Desktop (> 1024px)

**Layout**:
- 3-column grid for splits (or 2 columns with larger cards)
- Modal overlay for exercise details (centered, max-width 800px)
- Calendar widget: Always visible in right sidebar (sticky)

**Navigation**:
- Full breadcrumb trail
- Back button optional (breadcrumb serves this purpose)

**Actions**:
- Buttons: Max-width 300px
- "Finalize Workout": Bottom-right of content area (not screen edge)
- Hover states more prominent

**Content**:
- Split cards: 3-up grid, equal heights, max-width 1200px total
- Exercise detail modal: Shows exercise video/image larger (50% width)
- Set rows: Weight/reps side-by-side, notes below
- Calendar: Full month view, shows streak stats

**Additional Features**:
- Hover tooltips for icons
- Keyboard shortcuts helper (show on `?` key)
- Richer animations (if prefers-reduced-motion off)

## 8. States & Feedback

### Loading States

**Initial Load** (Dashboard):
- **Approach**: Skeleton cards
- **Implementation**: 3 skeleton card placeholders matching split card dimensions
- **Duration**: Until data loads
- **Fallback**: If load fails after 5s, show error state with retry button

**Action Feedback** (Finalize Workout):
- **Approach**: Button loading state
- **Implementation**:
  1. Button text changes to "Finalizing..."
  2. Spinner icon replaces checkmark
  3. Button disabled
  4. Optimistic update: UI shows workout as complete
- **Duration**: Until server confirms (2-3s typical)
- **Fallback**: If fails, revert optimistic update, show error toast

**Optimistic Updates**:
- Set completion: Immediately show checkmark, collapse row
- Exercise checkbox: Immediately check, update progress bar
- Workout finalization: Immediately show success, update calendar
- If server rejects: Revert with animation + error message

### Error States

**Validation Errors** (Exercise Logging):
- **Display**: Inline below input field
- **Style**: Red text (12px), alert icon, subtle shake animation on input
- **Specific Messages**:
  - Weight < 0: "Weight must be 0 or greater"
  - Weight > 999: "Weight must be less than 1000 kg"
  - Reps < 1: "Reps must be at least 1"
  - Reps > 999: "Reps must be less than 1000"
- **Recovery**: Error clears on valid input (real-time validation)

**System Errors** (Network, Server):
- **Display**: Toast notification (top-right)
- **Style**: Alert icon, red accent, manual dismiss (X button)
- **Specific Messages**:
  - Network error: "No internet connection. Your data will sync when you're back online."
  - Server error: "Something went wrong. Please try again."
  - Not found: "Workout not found. It may have been deleted."
- **Recovery**:
  - Retry button in toast
  - Auto-retry in background (3 attempts)
  - If persistent, show "Contact support" option

**Recovery Paths**:
- Pull-to-refresh on list views
- "Retry" button on error states
- "Go Back" to previous screen if critical data missing
- Offline mode: Save to local storage, sync when online

### Empty States

**No Data** (First-time user, no splits):
- **Message**: "Ready to start your fitness journey?"
- **Subtext**: "Complete a quick 2-minute assessment to get your personalized workout plan."
- **CTA**: "Begin Assessment" (primary button)
- **Visual**: Illustration or icon (dumbbell, person lifting)

**No Results** (Search/filter scenarios - future):
- **Message**: "No workouts found"
- **Subtext**: "Try adjusting your filters or create a new workout split."
- **CTA**: "Clear Filters" or "Create Split"

**First Use** (Pre-assessment):
- **Onboarding**:
  - Step 1: Welcome message + explanation of pre-assessment
  - Step 2: Frequency selection with helper text
  - Step 3: Focus selection with helper text
  - Step 4: Preview of generated splits
  - Step 5: Confirmation + "Let's Go!" button
- **Tutorial**: First workout shows tooltips on key UI elements (optional)

### Success States

**Confirmation** (Workout Finalized):
- **Display**: Toast notification (top-right)
- **Style**: Checkmark icon, green accent, auto-dismiss 4s
- **Message**: "Workout complete! Great job!"
- **Animation**: Brief confetti or celebration animation (respect prefers-reduced-motion)
- **Sound**: Optional success sound (if user enabled in settings)

**Next Steps** (After workout complete):
- **Guide**: Automatically transition to dashboard
- **Highlight**: Next workout split card highlighted with subtle pulse animation
- **Message**: "Your next workout is Workout B. See you soon!"

## 9. User Flow Diagram

### First-Time User Flow (Pre-Assessment → First Workout)

```
[Open App / Landing]
    ↓
[Dashboard - Empty State]
    - Sees: "Begin Assessment" CTA
    - Action: Tap "Begin Assessment"
    ↓
[Pre-Assessment Modal - Step 1: Frequency]
    - Sees: "How many days per week?" + Radio options (2-6)
    - Action: Select frequency (e.g., 4 days)
    - Action: Tap "Continue"
    ↓
[Pre-Assessment Modal - Step 2: Focus]
    - Sees: "What areas to prioritize?" + Checkboxes
    - Action: Select focus areas (e.g., Chest, Back, Legs)
    - Action: Tap "Continue"
    ↓
[Pre-Assessment Modal - Step 3: Preview]
    - Sees: "Your 4-day split" + List (Workout A, B, C, D with exercises)
    - Action: Review
    - Action: Tap "Confirm & Start"
    ↓
[Dashboard - Splits Generated]
    - Sees: 4 workout split cards (A, B, C, D)
    - Sees: Workout A highlighted as "Current"
    - Sees: Calendar widget (empty)
    - Action: Tap "Start Workout" on Workout A card
    ↓
[Workout A Detail - Exercise List]
    - Sees: Progress bar (0 of 5 exercises)
    - Sees: Exercise checklist (unchecked)
    - Action: Tap first exercise name
    ↓
[Exercise Detail Bottom Sheet]
    - Sees: Exercise description, video, image
    - Sees: Set 1 expandable row (collapsed)
    - Action: Tap Set 1 to expand
    ↓
[Set 1 Expanded Form]
    - Sees: Weight input (placeholder: 0)
    - Sees: Reps input (placeholder: 0)
    - Sees: Notes textarea (optional)
    - Action: Enter weight (e.g., 50) and reps (e.g., 10)
    - Action: Tap "Complete Set"
    ↓
[Set 1 Completed]
    - Sees: Row collapses, checkmark appears
    - Sees: Set 2 row still collapsed
    - Action: Expand Set 2, repeat logging
    ↓
[All Sets Completed for Exercise]
    - Sees: All set rows show checkmarks
    - Action: Tap back/close to return to exercise list
    ↓
[Exercise List - First Exercise Checked]
    - Sees: First exercise checkbox now checked
    - Sees: Progress bar updated (1 of 5)
    - Action: Tap next exercise, repeat process
    ↓
[All Exercises Completed]
    - Sees: All checkboxes checked
    - Sees: Progress bar (5 of 5)
    - Sees: "Finalize Workout" button now enabled
    - Action: Tap "Finalize Workout"
    ↓
[Workout Finalized]
    - Sees: Success toast "Workout complete! Great job!"
    - Sees: Transition back to dashboard
    - Sees: Calendar updated with today's date marked
    - Sees: Workout B now highlighted as "Next Workout"
```

### Returning User Flow (Quick Workout Session)

```
[Open App]
    ↓
[Dashboard - Splits Visible]
    - Sees: Workout B card highlighted as "Current"
    - Sees: Calendar showing previous workout dates
    - Action: Tap "Start Workout"
    ↓
[Workout B Detail]
    - Sees: Exercise list
    - Action: Tap first exercise
    ↓
[Exercise Detail]
    - Sees: Set 1 expanded automatically (optimization)
    - Sees: Weight placeholder shows last session value (e.g., "52.5 kg last time")
    - Sees: Weight History section below sets
    - Action: Reference previous weight
    - Action: Enter current weight + reps
    - Action: Complete set
    ↓
[Repeat for All Sets & Exercises]
    ↓
[Finalize Workout]
    - Sees: Success message
    - Sees: Calendar updated
    - Sees: Workout C now current
```

### Weight History Check Flow

```
[In Active Workout]
    ↓
[Exercise Detail Open]
    - Sees: Set logging area (top)
    - Action: Scroll down
    ↓
[Weight History Section]
    - Sees: "Weight History" heading
    - Sees: List or chart of last 5 sessions:
      - Nov 6: 50 kg x 10 reps
      - Nov 3: 47.5 kg x 10 reps
      - Oct 30: 45 kg x 12 reps
      - (etc.)
    - Action: Note progression
    - Action: Scroll back up to log current set
```

## 10. Design Specifications

### Spacing Scale

**Tight** (when to use):
- Between label and input: 4px (0.25rem)
- Icon to text in button: 8px (0.5rem)
- Checkbox to label: 8px

**Normal** (default):
- Between form fields: 16px (1rem)
- Card padding: 16px (mobile), 24px (desktop)
- Section margins: 24px (1.5rem)
- Between cards in grid: 16px

**Relaxed** (when to use):
- Between major page sections: 32px (2rem)
- Top/bottom page padding: 32px (mobile), 48px (desktop)
- Modal/sheet padding: 24px (mobile), 32px (desktop)

### Typography

**Headings**:
- H1: 24px (1.5rem), font-weight 700 (bold), line-height 1.2
- H2: 20px (1.25rem), font-weight 600 (semibold), line-height 1.3
- H3: 18px (1.125rem), font-weight 600, line-height 1.4

**Body**:
- Body text: 16px (1rem), font-weight 400 (normal), line-height 1.5
- Small text: 14px (0.875rem), font-weight 400, line-height 1.5
- Tiny text (captions): 12px (0.75rem), font-weight 400, line-height 1.4

**Labels**:
- Form labels: 14px, font-weight 500 (medium)
- Button text: 14px (small), 16px (default), font-weight 500

**Font Family**:
- Primary: Inter, system-ui, sans-serif (or project default)

### Color Usage

**Primary** (when to use):
- Primary action buttons
- Current workout highlight border
- Focus rings
- Active states
- Progress bar fill

**Secondary** (when to use):
- Secondary action buttons
- Supporting text
- Icons
- Muted backgrounds

**Accent** (call-to-action):
- "Start Workout" button (if different from primary)
- Achievement badges
- Streak milestones
- Weight PRs

**Semantic**:
- Success (green): Completed exercises, workout finalized, checkmarks
- Warning (yellow): Missing inputs, incomplete workouts, sync pending
- Error (red): Validation errors, failed actions, critical alerts
- Info (blue): Helper text, tooltips, informational messages

**Neutral**:
- Text: gray-900 (dark mode: gray-50)
- Muted text: gray-600 (dark mode: gray-400)
- Borders: gray-300 (dark mode: gray-700)
- Backgrounds: white (dark mode: gray-950)
- Muted backgrounds: gray-50 (dark mode: gray-900)

## 11. Performance Considerations

**Critical Path** (what loads first):
1. App shell (layout, navigation)
2. Dashboard skeleton (3 card placeholders)
3. Current workout data (prioritize over other splits)
4. Calendar widget (last, below fold on mobile)

**Lazy Loading** (below fold content):
- Exercise videos: Load on exercise detail open, not upfront
- Exercise images: Low-quality placeholder → high-quality on view
- Weight history chart: Load when exercise detail opens
- Calendar past months: Load on demand when user navigates

**Image Optimization**:
- Exercise images: Responsive sizes (320px, 640px, 1024px)
- Format: WebP with JPG fallback
- Lazy load: Use `loading="lazy"` attribute
- Placeholder: Blurred low-res version while loading

**Animation Budget**:
- Limit to essential feedback animations (checkbox, set completion)
- Use CSS transforms (not layout properties) for animations
- Keep animations under 300ms
- Disable non-essential animations on low-end devices (via media query)
- Respect `prefers-reduced-motion`

**Data Fetching**:
- Prefetch next workout data on dashboard mount
- Cache exercise details (avoid re-fetch on every open)
- Optimistic updates for better perceived performance
- Background sync for offline data

## 12. Implementation Coordination

### Agent Collaboration

**shadcn-builder**:
- Provide component requirements:
  - Calendar component for habit tracking (date marking, week/month view)
  - Confirmation dialog pattern (exit workout, finalize workout)
  - Bottom sheet vs modal decision based on viewport
  - Progress component for workout completion (X of Y exercises)
  - Toast/Sonner configuration for success/error messages
  - Skeleton loading patterns for cards and lists

**domain-architect**:
- Provide data structure needs:
  - Pre-assessment entity (frequency, focus selections)
  - WorkoutSplit entity with completion status and current/next logic
  - ExerciseHistory entity for weight tracking by date
  - Set logging data structure (weight, reps, notes, timestamp)
  - Calendar event data (workout completion dates)

**nextjs-builder**:
- Provide routing requirements:
  - `/my-workout` - Dashboard (main view)
  - `/my-workout/[splitId]` - Workout split detail
  - `/my-workout/assessment` - Pre-assessment flow (or modal-based)
  - Query params for exercise detail: `/my-workout/[splitId]?exercise=[id]`
- Server vs Client component strategy:
  - Dashboard: Server component with client islands for interactive cards
  - Exercise detail: Client component (interactive form)
  - Calendar widget: Client component (interactive date selection)

**Parent**:
- Implementation sequence:
  1. Pre-assessment flow (blocks all other features)
  2. Dashboard with workout split cards
  3. Workout split detail with exercise checklist
  4. Exercise detail with set logging
  5. Finalize workout flow
  6. Calendar widget integration
  7. Weight history visualization

### Files Impacted

**Components** (expected structure):
- `src/domains/workout-splits/components/atoms/`
  - `split-badge.tsx` - Badge showing split letter (A, B, C)
  - `exercise-checkbox.tsx` - Checkbox for exercise completion
  - `weight-input.tsx` - Specialized number input for weight
  - `reps-input.tsx` - Specialized number input for reps

- `src/domains/workout-splits/components/molecules/`
  - `split-card.tsx` - Workout split card for dashboard
  - `exercise-list-item.tsx` - Exercise in checklist with checkbox
  - `set-row.tsx` - Single set logging row (may reuse existing `set-row-expandable.tsx`)
  - `progress-indicator.tsx` - "X of Y exercises" progress bar
  - `calendar-day.tsx` - Single day in habit calendar

- `src/domains/workout-splits/components/organisms/`
  - `pre-assessment-modal.tsx` - Multi-step pre-assessment flow
  - `split-grid.tsx` - Grid of workout split cards
  - `exercise-checklist.tsx` - Full exercise list with checkboxes
  - `exercise-detail-sheet.tsx` - Bottom sheet/modal for exercise details
  - `habit-calendar.tsx` - Calendar widget showing workout completion
  - `weight-history-chart.tsx` - Weight progression visualization

**Text Maps**:
- `src/domains/workout-splits/workout-splits.text-map.ts` - All UI text as defined in Section 5

**Styles** (if custom styles needed):
- `src/styles/components/organisms/habit-calendar.css` - Custom calendar styling
- `src/styles/components/molecules/split-card.css` - Split card specific styles

**Pages**:
- `src/app/(app)/my-workout/page.tsx` - Dashboard
- `src/app/(app)/my-workout/[splitId]/page.tsx` - Split detail
- `src/app/(app)/my-workout/assessment/page.tsx` - Pre-assessment (or modal)

## 13. Important Notes

**User testing recommended**: YES - Pre-assessment flow is critical for first-time user experience. Test with 5-10 users to ensure clarity.

**Accessibility is mandatory**:
- All interactive elements must be keyboard accessible
- Screen reader testing required for exercise logging flow
- Color contrast verification on all text/background combinations
- Touch target size validation on mobile devices

**Mobile-first**:
- Design screens at 375px width first (iPhone SE)
- Expand to tablet (768px) and desktop (1024px+) progressively
- Bottom sheet preferred over modal on mobile for exercise details

**Content before chrome**:
- Exercise list is the hero - minimize visual clutter
- Calendar is secondary - collapsible on mobile
- Progress indicator visible but not intrusive

**Iterate**:
- Phase 1: Core flow (pre-assessment → exercise logging → finalization)
- Phase 2: Weight history visualization
- Phase 3: Calendar enhancements (streaks, stats)
- Phase 4: Social features, achievements (future)

**Consistency**:
- Reuse existing `set-row-expandable.tsx` pattern for set logging
- Follow existing text map structure from workouts/routines domains
- Match button styles and interaction patterns from existing components

## 14. Success Metrics

**Usability**:
- Pre-assessment completion rate > 85%
- Average time to complete pre-assessment < 2 minutes
- Exercise logging time per set < 30 seconds
- Percentage of users who finalize workouts > 70%

**Efficiency**:
- Dashboard to active workout start: < 3 taps
- Set logging: < 10 seconds per set (weight + reps entry)
- Full workout completion time: < 15 minutes for 5 exercises

**Satisfaction**:
- User feedback: "Easy to use" rating > 4/5
- Feature usage: Calendar widget views > 50% of users
- Retention: Users return within 48 hours > 60%

**Accessibility**:
- Screen reader testing: All flows completable without sight
- Keyboard-only testing: All actions achievable without mouse
- Color contrast: 100% WCAG AA compliance
- Touch target: 100% of interactive elements meet 44x44px minimum

**Performance**:
- Dashboard initial load: < 2 seconds on 4G
- Set completion save: < 1 second
- Exercise detail sheet open: < 300ms
- Calendar render: < 500ms

---

## Additional Considerations

### Edge Cases

**Interrupted Workout**:
- User starts workout but doesn't finish
- Solution: Auto-save progress, show "Resume Workout" on dashboard
- Allow manual "Abandon Workout" action

**Pre-assessment Changes**:
- User wants to change frequency/focus after setup
- Solution: "Edit Plan" button in settings or dashboard menu
- Re-running assessment generates new splits (confirm before replacing)

**No Internet During Workout**:
- User logs sets offline
- Solution: Save to local storage, sync when online
- Show "Offline" indicator, reassure data is safe

**Weight History Missing**:
- First time doing an exercise, no history
- Solution: Show encouraging empty state, suggest starting weight

**Multiple Workouts Same Day**:
- User wants to do two workouts in one day
- Solution: Allow, but show warning about overtraining
- Calendar marks day as completed (doesn't double-count)

### Future Enhancements (Out of Scope)

- Exercise substitutions (swap exercises in split)
- Custom split creation (advanced users)
- Rest timer between sets (already exists in codebase - integrate)
- Workout notes (overall session notes)
- Share workout results (social features)
- Exercise video playback controls (pause, slow-mo)
- Weight progression suggestions (auto-recommend weight increases)
- Deload week scheduling (periodization)

---

**End of UX/UI Design Plan**
