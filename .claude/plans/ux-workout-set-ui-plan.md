# Enhanced Set Logging UX/UI Design Plan

**Created**: 2025-11-10
**Session**: workout_enhancements_001
**Complexity**: High
**User Impact**: Critical

## 1. User Context

### User Goals
- **Primary Goal**: Quickly log set data (weight, reps) during workout with minimal friction
- **Secondary Goals**:
  - Add optional notes about form, difficulty, or feelings
  - Take appropriate rest between sets
  - Maintain workout momentum and focus
- **Success Criteria**:
  - Can complete a set with 1-2 taps
  - Rest timer helps maintain proper rest intervals
  - Notes entry is optional and non-intrusive

### User Personas
- **Primary**: Alex, 28, gym-goer lifting weights with phone nearby
- **Context**: Between sets at gym, sweaty hands, needs quick input, glances at phone
- **Pain Points**:
  - Too many taps to log a set breaks flow
  - Forgetting to rest or resting too long
  - Wants to note form cues but doesn't want to type every set
  - Small touch targets are hard to hit with sweaty fingers

### User Journey
1. **During Set** → User lifts weight → Completes reps
2. **After Set** → Taps on set row → Expands to show inputs
3. **Logging** → Enters weight/reps (already filled from previous) → Optionally adds notes → Taps Complete
4. **Rest Period** → Rest timer appears with countdown → Visual/audio cue when complete
5. **Next Set** → Auto-focus next set row → Repeat journey
6. **Skip Rest** → (Optional) Tap "Skip Rest" if ready early

## 2. Interface Architecture

### Information Hierarchy
1. **Primary**: Set number, weight input, reps input, complete button
2. **Secondary**: Notes textarea (expandable), rest timer
3. **Tertiary**: Set history from previous workout (if available)

### Layout Strategy
- **Structure**: In-place expandable panels within exercise card
- **Grid**: Current 4-column grid for collapsed state (Set # | Weight | Reps | Action)
- **Spacing**: Comfortable spacing for touch targets (min 44x44px)
- **Breakpoints**:
  - Mobile (< 640px): Single column when expanded, stacked inputs
  - Tablet (640px - 1024px): Two-column layout when expanded
  - Desktop (> 1024px): Horizontal layout, all inputs visible

### Visual Hierarchy
- **Focal Point**: Complete button (green, prominent)
- **Visual Flow**: Top to bottom → Set # → Weight → Reps → Notes → Complete
- **Grouping**:
  - Collapsed sets in table format
  - Expanded set in card format with clear boundaries
  - Rest timer as modal overlay (center of screen)
- **Contrast**:
  - Completed sets: 50% opacity, checkmark icon
  - Active set: Full color, highlighted border
  - Next set: Subtle pulse animation when rest complete

## 3. Interaction Design

### Primary Actions

#### **Complete Set Button**
- **Type**: Primary
- **Location**: Bottom right of expanded set panel (mobile), inline right (desktop)
- **State**:
  - **Default**: Green background, "Complete" text
  - **Hover**: Darker green, subtle scale
  - **Active**: Pressed state, immediate feedback
  - **Disabled**: Gray, "Enter weight & reps" tooltip
  - **Success**: Checkmark icon, collapses panel
- **Feedback**:
  - Haptic feedback on mobile (if available)
  - Smooth collapse animation
  - Set row grays out (50% opacity)
  - If more sets: Rest timer appears immediately
  - If last set: Focus moves to next exercise

#### **Expand/Collapse Set Row**
- **Type**: Tertiary (tap entire row)
- **Location**: Entire set row is tappable
- **State**:
  - **Collapsed**: Shows Set #, Weight, Reps, "Log" button
  - **Expanded**: Shows full form with notes textarea
- **Feedback**:
  - Smooth expand/collapse animation (300ms ease-out)
  - Row height animates from 48px to ~200px
  - Chevron icon rotates 180deg
  - Auto-scroll expanded panel into view

### Secondary Actions

#### **Skip Rest Button**
- **Type**: Secondary
- **Location**: Bottom of rest timer modal
- **State**:
  - **Default**: Ghost button, "Skip Rest" text
  - **Hover**: Light gray background
  - **Active**: Darker press state
- **Feedback**: Timer dismisses, next set auto-focused

#### **Add Notes Toggle**
- **Type**: Tertiary (only in expanded state)
- **Location**: Below reps input
- **State**:
  - **Default**: "Add notes (optional)" placeholder
  - **Focus**: Textarea expands to 3 rows
  - **Filled**: Shows character count (max 500 chars)

### Micro-interactions

#### **Hover Effects**
- Set row: Subtle background color change (gray-50 → gray-100)
- Complete button: Scale 1.02, shadow increase
- Skip Rest: Background opacity increase

#### **Focus States**
- Blue ring (2px) around focused input
- Keyboard trap within expanded panel
- Tab order: Weight → Reps → Notes → Complete

#### **Loading States**
- Complete button: Spinner replaces text
- Set row: Subtle pulse during save
- Optimistic update: Set marks complete immediately, reverts if error

#### **Transitions**
- Expand/Collapse: 300ms cubic-bezier(0.4, 0, 0.2, 1)
- Rest timer fade-in: 200ms ease-out
- Rest timer progress: Linear countdown
- Next set highlight: 500ms pulse animation

#### **Success/Error**
- **Success**:
  - Green checkmark icon appears
  - Row collapses smoothly
  - Haptic feedback (mobile)
  - Rest timer appears (if applicable)
- **Error**:
  - Red border flash on inputs
  - Error message below form
  - Inputs remain editable

### User Input

#### **Weight Input**
- **Type**: Number input with stepper
- **Validation**: On blur (must be >= 0)
- **Error Messages**: "Weight must be 0 or greater"
- **Placeholder**: Previous set weight or "0"
- **Helper**: "kg" suffix, step by 2.5 increments

#### **Reps Input**
- **Type**: Number input with stepper
- **Validation**: On blur (must be >= 1)
- **Error Messages**: "Reps must be at least 1"
- **Placeholder**: Previous set reps or "0"

#### **Notes Textarea**
- **Type**: Textarea (3 rows when focused)
- **Validation**: None (optional field)
- **Error Messages**: N/A
- **Placeholder**: "Form notes, difficulty, how it felt..."
- **Helper**: Character count (max 500)

## 4. Component Selection

### shadcn/ui Components Needed
- **Collapsible**: For expandable set rows
- **Input**: Weight and reps number inputs
- **Textarea**: Notes input
- **Button**: Complete, Skip Rest, Add Set
- **Dialog**: Rest timer modal overlay
- **Progress**: Circular progress for rest timer
- **Label**: Input labels
- **Badge**: Set number indicator

**Note**: Coordinate with shadcn-builder agent for Collapsible and Dialog implementation

### Custom Components Needed
- **RestTimerModal**:
  - Why custom: Need circular progress with countdown, audio cue, specific positioning
  - Composition: Uses shadcn Dialog + custom SVG circular progress
  - Features: Audio notification, haptic feedback, auto-dismiss
- **SetRowExpandable**:
  - Why custom: Complex expand/collapse behavior with form state
  - Composition: Uses shadcn Collapsible + Form components
  - Features: Auto-save, optimistic updates, smart defaults

## 5. Content Strategy

### Text Requirements
**Text Map**: `src/domains/workouts/workouts.text-map.ts`

**Keys to Define** (add to `workout.active` section):

```typescript
workout: {
  active: {
    // ... existing keys
    setLogging: {
      weightLabel: 'Weight (kg)',
      weightPlaceholder: '0',
      repsLabel: 'Reps',
      repsPlaceholder: '0',
      notesLabel: 'Notes (optional)',
      notesPlaceholder: 'Form notes, difficulty, how it felt...',
      notesMaxChars: '500 characters max',
      completeButton: 'Complete',
      completingButton: 'Saving...',
      logButton: 'Log',
      expandAriaLabel: 'Expand set {number} details',
      collapseAriaLabel: 'Collapse set {number} details',
      setComplete: 'Set {number} complete',
      enterDetails: 'Enter weight and reps to complete'
    },
    restTimer: {
      title: 'Rest Timer',
      countdown: '{minutes}:{seconds}',
      ready: 'Ready for next set!',
      skip: 'Skip Rest',
      nextSet: 'Next: Set {number}',
      audioNotification: 'Rest period complete',
      pauseTimer: 'Pause',
      resumeTimer: 'Resume'
    },
    errors: {
      saveSetFailed: 'Failed to save set. Please try again.',
      invalidWeight: 'Weight must be 0 or greater',
      invalidReps: 'Reps must be at least 1',
      networkError: 'Network error. Changes saved locally.'
    }
  }
}
```

**Tone**: Motivating, encouraging, action-oriented
**Voice**: Active voice, second person ("You completed set 1!")

### Microcopy

#### **Empty States**
- No notes: "Add notes to remember form cues" (shown as helper text)

#### **Error States**
- Save failed: "Couldn't save. Tap to retry."
- Network error: "Saved locally. Will sync when online."

#### **Success States**
- Set complete: "Set {number} done! 💪" (with haptic)
- Rest complete: "Let's go! Time for set {number}"

#### **Loading States**
- Saving set: "Saving..." (in button)
- Starting timer: "Rest timer starting..." (brief)

## 6. Accessibility Design

### Semantic Structure
- **Landmarks**:
  - Each exercise card is `<section>` with `aria-label="Exercise name"`
  - Set list is `<ul>` with `<li>` for each set row
  - Rest timer modal is `<dialog>` with `role="alertdialog"`
- **Headings**:
  - Exercise name: `<h3>`
  - Rest timer: `<h2>` (modal heading)
- **Lists**:
  - Set rows: `<ul>` with `<li>` for semantic grouping

### Keyboard Navigation
- **Tab Order**:
  1. Expand set row (Enter/Space to expand)
  2. Weight input
  3. Reps input
  4. Notes textarea (if visible)
  5. Complete button
  6. Next set row
- **Shortcuts**:
  - `Esc` to collapse expanded panel
  - `Esc` to skip rest timer
  - `Enter` on Complete button to save
- **Focus Management**:
  - After completing set: Focus moves to rest timer modal
  - After rest complete: Focus moves to next set row
  - After last set: Focus moves to "Complete Workout" button
- **Escape Hatch**:
  - `Esc` key always collapses expanded panels
  - `Esc` during rest timer shows "Skip Rest" confirmation

### Screen Reader Experience
- **ARIA Labels**:
  - Set row: `aria-label="Set {number}, {weight}kg, {reps} reps"`
  - Complete button: `aria-label="Complete set {number}"`
  - Rest timer: `aria-label="Rest timer: {minutes} minutes {seconds} seconds remaining"`
- **ARIA Descriptions**:
  - Weight input: `aria-describedby="weight-help"` → "Enter weight in kilograms"
  - Rest timer: `aria-describedby="rest-help"` → "Rest between sets for optimal recovery"
- **Live Regions**:
  - Set completion: `<div role="status" aria-live="polite">Set {number} completed</div>`
  - Rest timer: `<div role="timer" aria-live="off">` (updates too frequent)
  - Rest complete: `<div role="alert" aria-live="assertive">Ready for next set!</div>`
- **Hidden Content**:
  - Collapse/expand icon: `aria-hidden="true"` (state conveyed by aria-expanded)
  - Decorative progress circle: `aria-hidden="true"` (time announced in label)

### Visual Accessibility
- **Color Contrast**:
  - Text on background: 4.5:1 minimum (WCAG AA)
  - Complete button: 3:1 against surrounding (AAA)
  - Disabled state: 3:1 minimum
- **Color Independence**:
  - Completed sets: Opacity + checkmark icon (not just green)
  - Error state: Red border + icon + text message
  - Rest timer: Numerical countdown + visual progress
- **Text Size**:
  - Body text: 16px (1rem) minimum
  - Button text: 16px minimum
  - Input text: 16px to prevent iOS zoom
- **Touch Targets**:
  - Minimum 44x44px (iOS) / 48x48px (Android)
  - Set row: Full width, 48px height (collapsed)
  - Complete button: 48px height
  - Number input steppers: 44x44px each
- **Motion**:
  - Respect `prefers-reduced-motion`
  - Disable expand/collapse animations if set
  - Disable rest timer pulse animation if set
  - Keep essential transitions only (fade-in/out)

## 7. Responsive Design

### Mobile (< 640px)
- **Layout**:
  - Set table: 4-column grid (Set # | Weight | Reps | Action)
  - Expanded panel: Stacked single-column form
  - Rest timer: Full-screen modal overlay
- **Navigation**:
  - Tap entire row to expand
  - Swipe down to collapse (optional enhancement)
- **Actions**:
  - Complete button: Full-width, 48px height
  - Skip Rest: Full-width, bottom of modal
- **Content**:
  - Hide "kg" suffix in collapsed state
  - Show "kg" in expanded state
  - Notes textarea: 3 rows minimum

### Tablet (640px - 1024px)
- **Layout**:
  - Set table: Same 4-column grid
  - Expanded panel: 2-column form (Weight/Reps | Notes)
  - Rest timer: Centered modal (max-width 400px)
- **Navigation**:
  - Tap or click to expand
  - Hover states visible
- **Actions**:
  - Complete button: Inline right, auto-width
  - Skip Rest: Centered, auto-width

### Desktop (> 1024px)
- **Layout**:
  - Set table: Same 4-column grid
  - Expanded panel: Horizontal form (all inputs inline)
  - Rest timer: Centered modal (max-width 400px)
- **Navigation**:
  - Click to expand
  - Hover preview (tooltip with note snippet if exists)
- **Actions**:
  - Complete button: Inline right, auto-width
  - Skip Rest: Centered, auto-width
- **Additional**:
  - Keyboard shortcuts visible in tooltips
  - Previous set data shown as hint text

## 8. States & Feedback

### Loading States

#### **Initial Load**
- Skeleton: Set rows with pulsing rectangles
- Duration: Until workout data fetched

#### **Action Feedback**
- Complete button:
  - Text changes to "Saving..."
  - Spinner icon replaces text
  - Button disabled during save
- Set row:
  - Subtle opacity pulse (0.8 → 1.0)
  - Border color animates

#### **Optimistic Updates**
- Set marks complete immediately on click
- Row collapses and grays out
- If save fails: Revert to expanded state with error
- Rest timer starts immediately (optimistic)

### Error States

#### **Validation Errors**
- **Weight < 0**: Red border + "Weight must be 0 or greater"
- **Reps < 1**: Red border + "Reps must be at least 1"
- **Location**: Inline below input
- **Timing**: On blur (not on every keystroke)

#### **System Errors**
- **Network failure**: Toast at top "Network error. Saved locally."
- **Save failure**: Inline error + "Retry" button
- **Location**: Below form in expanded panel
- **Persistence**: Until user dismisses or retries

#### **Recovery**
- "Retry" button re-attempts save
- "Cancel" button reverts optimistic update
- Auto-retry in background if offline → online

### Empty States

#### **No Previous Data**
- Weight/Reps inputs: Placeholder "0"
- Helper text: "Enter weight and reps for this set"

#### **No Notes**
- Textarea placeholder: "Form notes, difficulty, how it felt..."
- No empty state message (field is optional)

#### **First Set of Exercise**
- Badge: "First set - set your baseline!"
- Helper: "This will be your reference for next sets"

### Success States

#### **Set Completion**
- Toast: "Set {number} complete! 💪"
- Haptic: Medium impact (iOS) or short vibration (Android)
- Visual: Green checkmark icon appears
- Row: Collapses smoothly, grays out
- Next: Rest timer appears (if applicable)

#### **Rest Timer Complete**
- Toast: "Ready for next set!"
- Haptic: Heavy impact (iOS) or long vibration (Android)
- Visual: Green pulse animation on next set row
- Audio: Soft chime (user can disable in settings - future)
- Focus: Moves to next set row automatically

#### **All Sets Complete**
- Toast: "Exercise complete! Move to next exercise"
- Visual: Exercise card border turns green
- Focus: Moves to next exercise card

## 9. User Flow Diagram

```
[Start Workout]
    ↓
[View Exercise Card with Sets]
    ↓
[Tap Set Row] → [Row Expands]
    ↓
[Enter Weight & Reps]
    ↓
[Optional: Add Notes]
    ↓
[Tap Complete Button]
    ↓
[Saving...] → [Success ✓] or [Error ⚠️]
    ↓                            ↓
[Set Collapses]           [Show Error + Retry]
    ↓
[Check: More Sets?]
    ↓               ↓
  [YES]           [NO]
    ↓               ↓
[Start Rest Timer] [Move to Next Exercise]
    ↓
[Countdown: MM:SS]
    ↓
[User Options]
    ↓               ↓
[Wait for Timer] [Skip Rest]
    ↓               ↓
[Timer Complete] ←─┘
    ↓
[Visual/Audio Cue]
    ↓
[Auto-Focus Next Set]
    ↓
[Highlight Next Set Row] → [User Taps to Expand]
    ↓
[Repeat Cycle]
```

## 10. Design Specifications

### Spacing Scale
- **Tight**: 0.5rem (8px) - Between label and input
- **Normal**: 1rem (16px) - Between form fields, default spacing
- **Relaxed**: 1.5rem (24px) - Between sections, exercise cards

### Typography
- **Headings**:
  - Exercise name (h3): 1.125rem (18px), font-weight 600
  - Rest timer (h2): 1.5rem (24px), font-weight 700
- **Body**:
  - Input labels: 0.875rem (14px), line-height 1.5
  - Helper text: 0.75rem (12px), line-height 1.5
  - Set number: 1rem (16px), font-weight 600
- **Labels**:
  - Button text: 1rem (16px), font-weight 500
  - Badge text: 0.75rem (12px), font-weight 600

### Color Usage
- **Primary**:
  - Complete button: green-600 background, white text
  - Success states: green-500 accents
- **Secondary**:
  - Skip Rest button: gray-200 background, gray-900 text
  - Cancel actions: gray-300
- **Accent**:
  - Active set: blue-500 border
  - Focus ring: blue-500, 2px width
- **Semantic**:
  - Success: green-500 (checkmark, success toast)
  - Warning: yellow-500 (validation hints)
  - Error: red-500 (error borders, error toast)
  - Info: blue-500 (helper text, info toast)

### Rest Timer Visual Specs
- **Modal**:
  - Background: white (light) / gray-900 (dark)
  - Overlay: black with 40% opacity
  - Border radius: 1rem (16px)
  - Padding: 2rem (32px)
  - Max-width: 400px
  - Shadow: lg (0 10px 15px rgba(0,0,0,0.1))
- **Circular Progress**:
  - Diameter: 200px
  - Stroke width: 12px
  - Background circle: gray-200
  - Progress circle: green-500
  - Animation: Linear countdown from 100% to 0%
- **Countdown Text**:
  - Font size: 3rem (48px)
  - Font weight: 700
  - Color: gray-900 (light) / white (dark)
  - Position: Center of circle
- **Title**:
  - "Rest Timer"
  - Font size: 1.25rem (20px)
  - Font weight: 600
  - Position: Above circle
- **Skip Button**:
  - Position: Below circle
  - Width: Full-width within modal
  - Height: 48px

## 11. Performance Considerations

- **Critical Path**:
  1. Workout data fetch (priority)
  2. Exercise list render (priority)
  3. Set row render (priority)
  4. Rest timer component (lazy-loaded on demand)
- **Lazy Loading**:
  - Rest timer modal: Load when first set completed
  - Notes textarea: Render when set expanded (already in DOM but hidden)
- **Image Optimization**:
  - No images in set logging UI
  - Exercise thumbnails (if added) should be lazy-loaded
- **Animation Budget**:
  - Expand/collapse: 300ms (acceptable)
  - Rest timer: 1s updates (low impact)
  - Pulse animation: CSS-only (hardware accelerated)
  - Total: < 500ms perceived delay

## 12. Implementation Coordination

### Agent Collaboration

#### **shadcn-builder**
**Provide Component Requirements:**
1. **Collapsible Component**:
   - Purpose: Expandable set rows
   - Props: `open`, `onOpenChange`, `children`
   - Animation: Height transition (300ms ease-out)
   - Trigger: Entire row should be clickable

2. **Dialog Component** (for Rest Timer):
   - Purpose: Modal overlay for rest timer
   - Props: `open`, `onOpenChange`, `modal=true`
   - Overlay: Darken background (40% opacity)
   - Close behavior: Only via "Skip Rest" button or timer complete

3. **Progress Component**:
   - Purpose: Circular progress for rest timer
   - Type: Circular variant (not linear)
   - Props: `value` (0-100), `size`, `strokeWidth`
   - If circular not available: Custom SVG implementation

#### **domain-architect**
**Provide Data Structure Needs:**
1. **WorkoutSet Model**:
   - Add `notes` field (String?, nullable, Text type)
   - Add `previousWeight` virtual field (from last workout)
   - Add `previousReps` virtual field (from last workout)

2. **Repository Method**:
   - `logSet()` should accept `notes` parameter
   - Return updated set with optimistic UI support

3. **Rest Timer Data**:
   - Need `restSeconds` from `DivisionExercise` in workout data
   - Expose in `useActiveWorkout` hook result

#### **Parent**
**Implementation Sequence:**
1. Domain architect: Add `notes` field to schema
2. Domain architect: Update repository and validation
3. Shadcn-builder: Ensure Collapsible, Dialog, Progress available
4. Parent: Implement `SetRowExpandable` component
5. Parent: Implement `RestTimerModal` component
6. Parent: Update text map with new keys
7. Parent: Integration testing with real workout flow
8. Parent: Accessibility testing (keyboard + screen reader)

### Files Impacted

#### **Components**
- `/src/domains/workouts/components/set-row-expandable.tsx` (NEW)
- `/src/domains/workouts/components/rest-timer-modal.tsx` (NEW)
- `/src/domains/workouts/components/exercise-card.tsx` (MODIFY - extract set logic)
- `/src/app/(app)/workout/active/page.tsx` (MODIFY - integrate new components)

#### **Text Maps**
- `/src/domains/workouts/workouts.text-map.ts` (MODIFY - add new keys)

#### **Styles**
- `/src/styles/components/molecules/set-row-expandable.css` (NEW - if custom styles needed)
- `/src/styles/components/molecules/rest-timer.css` (NEW - circular progress styles)

#### **Hooks**
- `/src/domains/workouts/hooks/use-rest-timer.ts` (NEW - countdown logic)
- `/src/domains/workouts/hooks/use-workouts.ts` (MODIFY - update logSet mutation)

## 13. Important Notes

⚠️ **User testing recommended**: High-impact feature affecting core workout flow
⚠️ **Accessibility is mandatory**: Keyboard navigation and screen reader support critical
⚠️ **Performance critical**: Workout logging must feel instant (optimistic updates)
💡 **Mobile-first**: 90% of users will log workouts on mobile devices
💡 **Sweaty fingers**: Touch targets must be large and forgiving
💡 **Battery consideration**: Rest timer should not drain battery (efficient rendering)
📝 **Iterate based on feedback**: Monitor completion rates and user feedback
🎨 **Consistency**: Match existing exercise card design patterns
🔊 **Audio cues**: Consider user preferences (gym environment may be noisy)
⏱️ **Timer accuracy**: Ensure countdown is accurate within 1 second
🎯 **Auto-focus**: Helps maintain flow, but respect focus management best practices

## 14. Success Metrics

### Usability
- **Task completion rate**: 95%+ of sets logged successfully
- **Time to complete set**: < 10 seconds from tap to save
- **Error rate**: < 5% of sets require retry
- **Feature adoption**: 60%+ of users expand sets (vs quick log)
- **Notes usage**: 20%+ of sets have notes added

### Efficiency
- **Average taps per set**: 3-4 taps (expand → input → complete)
- **Rest timer skip rate**: Track how often users skip (indicates if default rest time is appropriate)
- **Set completion time**: Track time from set start to complete

### Satisfaction
- **User feedback**: Collect in-app feedback on new UI
- **Session completion rate**: Should not decrease with new UI
- **Return rate**: Users continue logging workouts consistently

### Accessibility
- **Keyboard-only completion**: 100% of features accessible via keyboard
- **Screen reader testing**: All actions announced clearly
- **Color contrast**: All text meets WCAG AA minimum
- **Touch target testing**: All targets meet 44x44px minimum

### Performance
- **Load time**: Set row expand < 300ms
- **Save time**: Set save < 1 second (perceived, optimistic)
- **Rest timer accuracy**: Within 1 second of actual time
- **Animation frame rate**: 60fps for all transitions

---

## 15. Design Decisions & Rationale

### Why Expandable Rows vs. Always Visible?
- **Rationale**: Keeps UI clean, reduces cognitive load, allows quick scanning of sets
- **Trade-off**: Extra tap to expand, but provides flexibility for power users
- **Alternative considered**: Always show all inputs (rejected - too cluttered on mobile)

### Why Modal for Rest Timer vs. Inline?
- **Rationale**: Forces focus on rest, prevents accidental taps during rest period
- **Trade-off**: More intrusive, but ensures proper rest is taken
- **Alternative considered**: Inline timer at top (rejected - easy to ignore)

### Why Circular Progress vs. Linear?
- **Rationale**: More visually engaging, easier to understand at a glance, matches timer metaphor
- **Trade-off**: Slightly more complex to implement
- **Alternative considered**: Linear progress bar (simpler but less intuitive)

### Why Auto-Focus Next Set?
- **Rationale**: Maintains flow, reduces taps, guides user through workout
- **Trade-off**: Could be disorienting if unexpected
- **Mitigation**: Visual pulse animation clearly indicates focus change

### Why Optional Notes vs. Required?
- **Rationale**: Most sets don't need notes, adding friction would slow down logging
- **Trade-off**: Notes may be underutilized
- **Alternative considered**: Quick tags (e.g., "Hard", "Easy") - future enhancement

---

**Next Steps:**
1. Parent reviews this UX plan
2. Coordinate with shadcn-builder for Collapsible and Dialog specs
3. Coordinate with domain-architect for data structure changes
4. Parent implements design step-by-step following this plan

**Collaboration Needed:**
- **shadcn-builder**: Collapsible, Dialog, Circular Progress components
- **domain-architect**: Add `notes` field to WorkoutSet schema, update repository
