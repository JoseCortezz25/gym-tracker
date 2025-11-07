# Routine System Reform - UI/UX Architecture Plan

**Created**: 2025-11-06
**Session**: `20251106_220103`
**Complexity**: High
**User Impact**: Critical
**Agent**: ux-ui-designer

---

## 1. User Context

### User Goals

- **Primary Goal**: Create flexible workout routines organized by training divisions (not rigid day-of-week) that can be adapted to real-world schedules
- **Secondary Goals**:
  - Track progressive overload through historical weight/rep data
  - Learn proper exercise form through video references
  - Document training insights and coaching cues with notes
  - Visualize training volume and progress over time
- **Success Criteria**:
  - Users can create a complete routine with divisions in under 5 minutes
  - 70% of users adopt new system within 30 days
  - Load history is viewed by 50% of users weekly
  - User satisfaction rating of 4.0+ stars

### User Personas

**Primary: Gym Enthusiast (Alex)**
- **Who**: 28 years old, trains 4-5x per week, follows structured programs
- **Context**: Creates routines on mobile during commute, executes workouts in gym
- **Pain Points**:
  - Current system forces specific days (can't adapt to work schedule)
  - Can't remember previous weights when planning next workout
  - No video reference for new exercises
  - Limited space for form notes
- **Tech Level**: Intermediate (comfortable with mobile apps)
- **Needs**: Mobile-first, intuitive, fast loading

**Secondary: Personal Trainer (Coach Sarah) - Future**
- **Who**: 35 years old, trains 20+ clients remotely
- **Context**: Creates routines for clients, needs detailed instructions
- **Pain Points**:
  - Needs to provide video demonstrations
  - Wants detailed coaching cues per exercise
  - Clients need flexible scheduling
- **Tech Level**: Advanced (power user)
- **Needs**: Rich text editing, batch operations, templates

### User Journey

**Journey 1: Create New Routine**
1. Entry Point: Dashboard → "Create Routine" button → Routine creation wizard
2. Step 1: Enter routine name → Auto-save → Next
3. Step 2: Add training divisions (name, frequency, description) → Visual frequency selector
4. Step 3: Add exercises to each division → Exercise selector modal → Configure (sets/reps/weight/video/notes)
5. Step 4: Review complete routine → Adjust order if needed → Save
6. Success State: Routine saved → Redirect to routines list → Show success toast

**Journey 2: View Exercise History During Workout**
1. Entry Point: Active workout → Current exercise screen
2. Action: Tap "View History" icon → Load history drawer slides up
3. View: Last 5 workouts with sets/reps/weight → See progressive overload indicator (green arrow if improving)
4. Action: Tap "Full History" → Modal with complete data + simple chart
5. Success State: User informed of previous performance → Can adjust current weight accordingly

**Journey 3: Add Video Reference to Exercise**
1. Entry Point: Routine editor → Exercise configuration panel
2. Action: Paste YouTube URL into "Video URL" field → System validates and extracts video ID
3. Feedback: Thumbnail preview appears with play icon → Auto-save
4. Action: Tap thumbnail → Video player modal opens → Watch demonstration
5. Success State: Video saved → Available during workout for form reference

---

## 2. Interface Architecture

### Information Hierarchy

**Routine List Page** (Priority Order):
1. **Primary**: Active routine card (prominent, highlighted)
2. **Secondary**: Inactive routines (standard cards)
3. **Tertiary**: Page actions (create, filter, archive view)

**Routine Editor** (Priority Order):
1. **Primary**: Routine name (sticky header)
2. **Secondary**: Training divisions (expandable cards, frequency badges prominent)
3. **Tertiary**: Exercises within divisions (nested, reorderable)
4. **Quaternary**: Exercise details (sets/reps/weight/rest/video/notes)

**Active Workout View** (Priority Order):
1. **Primary**: Current exercise name + target (sets/reps/weight)
2. **Secondary**: Video player (if video exists) + rest timer
3. **Tertiary**: Historical data comparison (collapsible)
4. **Quaternary**: Notes (collapsible)

### Layout Strategy

**Structure**: Multi-page flow with modal overlays
- **Routines List**: Page with grid of cards
- **Routine Editor**: Page with expandable accordion structure
- **Exercise Selector**: Modal with search and filters
- **Exercise Configuration**: Sheet/drawer (mobile) or modal (desktop)
- **Video Player**: Modal with embedded iframe
- **Load History**: Sheet/drawer (mobile) or popover (desktop)

**Grid System**:
- Mobile: Single column, full width
- Tablet: 2 columns for cards, single column for forms
- Desktop: 3 columns for cards, 2-column forms (sidebar + content)

**Spacing**: Comfortable (16px base unit)
- Card padding: 24px (1.5rem)
- Section gaps: 24px (1.5rem)
- Form field gaps: 16px (1rem)
- Inline element gaps: 8px (0.5rem)

**Breakpoints**:
- **Mobile**: < 640px
  - Single column layouts
  - Full-width cards
  - Bottom sheets for modals
  - Stacked form fields
  - Hamburger menu
  - 44px min touch targets
- **Tablet**: 640px - 1024px
  - 2-column card grid
  - Larger modals (80% viewport width)
  - Side-by-side form fields where appropriate
  - Drawer navigation
- **Desktop**: > 1024px
  - 3-column card grid
  - Sidebar navigation always visible
  - Modals centered (max 600px width for forms)
  - Horizontal form layouts where appropriate
  - Hover states prominent

### Visual Hierarchy

**Focal Point**:
- Routine List: "Create Routine" button (primary color, top right)
- Routine Editor: Routine name (sticky header, large text)
- Active Workout: Current exercise name (bold, 24px)

**Visual Flow**:
- Top to bottom: Header → Primary content → Actions
- Left to right: Content → Supplementary info → Actions
- Z-axis: Cards elevated with shadows, modals above with backdrop

**Grouping**:
- Training divisions grouped by routine (cards with borders)
- Exercises grouped by division (nested list)
- Exercise configuration grouped by type (input groups: target, video, notes)
- Historical data grouped by date (timeline or table)

**Contrast**:
- Active state: Primary color background (blue/green)
- Frequency badges: Color-coded by intensity (1-2x = blue, 3-4x = green, 5-7x = orange)
- Progressive overload: Green up arrow = good, yellow = maintenance, red down arrow = concern
- PR badges: Gold/trophy color for personal records

---

## 3. Interaction Design

### Primary Actions

**Action: Create Routine**
- **Type**: Primary button
- **Location**: Top right of routines list page (sticky on mobile)
- **States**:
  - Default: Blue background, white text, shadow
  - Hover: Darker blue, slightly larger shadow
  - Active: Pressed effect (scale 0.98)
  - Disabled: Gray background, cursor not-allowed
- **Feedback**: Tap → Navigate to routine editor with slide transition

**Action: Add Training Division**
- **Type**: Primary button
- **Location**: Below existing divisions in routine editor
- **States**: Same as Create Routine
- **Feedback**: Click → New empty division card appears with expand animation

**Action: Add Exercise to Division**
- **Type**: Secondary button
- **Location**: Within division card, below exercise list
- **States**:
  - Default: Outline style, no background
  - Hover: Light background fill
  - Active: Border becomes solid
- **Feedback**: Click → Exercise selector modal slides up from bottom (mobile) or fades in (desktop)

**Action: Save Routine**
- **Type**: Primary button
- **Location**: Bottom sticky footer in routine editor
- **States**:
  - Default: Enabled when form valid
  - Loading: Spinner icon, disabled
  - Success: Checkmark icon briefly, then redirect
  - Error: Shake animation, error message toast
- **Feedback**:
  - Click → Button shows loading spinner
  - Success → Toast "Routine saved" + redirect to list
  - Error → Toast with error message, button returns to default

### Secondary Actions

**Action: View Exercise History**
- **Type**: Icon button (history/clock icon)
- **Location**: Exercise card in active workout view
- **States**: Ghost button with icon only
- **Feedback**: Tap → Drawer slides up from bottom with history data

**Action: Play Video**
- **Type**: Thumbnail with play icon overlay
- **Location**: Exercise configuration panel or active workout view
- **States**:
  - Default: Thumbnail with semi-transparent play icon
  - Hover: Play icon becomes opaque, slight scale
- **Feedback**: Tap → Modal opens with embedded YouTube player

**Action: Reorder Division/Exercise**
- **Type**: Drag handle icon (grip vertical)
- **Location**: Left edge of division cards and exercise rows
- **States**:
  - Default: Gray icon, subtle
  - Hover/Touch: Darker, cursor changes to grab
  - Dragging: Card elevates, follows cursor/touch
- **Feedback**:
  - Grab → Card elevates with shadow
  - Drag → Visual indicator of drop zones (border highlight)
  - Drop → Card snaps into position, order saved

**Action: Delete Division/Exercise**
- **Type**: Icon button (trash icon)
- **Location**: Top right of division cards, right side of exercise rows
- **States**:
  - Default: Ghost button, red icon
  - Hover: Red background
- **Feedback**:
  - Click → Confirmation dialog appears
  - Confirm → Item fades out with slide animation
  - Cancel → Dialog closes

### Micro-interactions

**Hover Effects**:
- Cards: Subtle shadow increase on hover (4px → 8px)
- Buttons: Background color darkens by 10%, slight scale (1.02x)
- Links: Underline appears, color darkens
- Icons: Scale to 1.1x, color change

**Focus States** (Keyboard Navigation):
- All interactive elements: 2px solid blue outline with 2px offset
- Skip to main content link (hidden until focused)
- Focus order: Logical top-to-bottom, left-to-right
- Trap focus within modals (Esc to close)

**Loading States**:
- **Skeleton**: Use for initial page load (routine list, exercise list)
  - Gray animated shimmer effect
  - Match actual content layout
- **Spinner**: Use for button actions (save, delete)
  - Inline spinner in button
  - Button disabled during loading
- **Progress Bar**: Use for multi-step processes (routine creation wizard)
  - Linear progress at top of page
  - Shows current step (1 of 3)

**Transitions**:
- **Page Navigation**: Slide left/right (150ms ease-out)
- **Modal Open**: Fade in backdrop (150ms) + slide up content (200ms ease-out)
- **Accordion Expand**: Height expansion (200ms ease-in-out) + content fade in (150ms)
- **Card Hover**: Shadow change (150ms ease-out)
- **Button Click**: Scale down (100ms) + scale up (100ms)
- **Drag and Drop**: Elevation change (200ms cubic-bezier)

**Success/Error Feedback**:
- **Success**:
  - Toast notification (green background, checkmark icon)
  - Slides in from top, auto-dismiss after 3 seconds
  - Can be dismissed by swipe or close button
- **Error**:
  - Toast notification (red background, X icon)
  - Slides in from top, persists until dismissed
  - Shake animation on form field with error
  - Red border on invalid inputs

### User Input

**Routine Name Input**:
- **Type**: Text input
- **Validation**: Real-time on blur
- **Rules**: Required, min 3 chars, max 100 chars
- **Error Messages**:
  - Empty: "Routine name is required"
  - Too short: "Routine name must be at least 3 characters"
  - Too long: "Routine name must be less than 100 characters"
- **Helper Text**: "Give your routine a memorable name"

**Division Name Input**:
- **Type**: Text input
- **Validation**: Real-time on blur
- **Rules**: Required, min 3 chars, max 100 chars, unique within routine
- **Error Messages**:
  - Empty: "Division name is required"
  - Duplicate: "Division name already exists. Try 'Upper Push' or 'Lower A'"
- **Placeholder**: "e.g., Push Day, Upper Body"

**Frequency Selector**:
- **Type**: Button group (1-7) or slider
- **Validation**: Real-time
- **Rules**: Required, integer 1-7
- **Visual Design**:
  - 7 pill-shaped buttons side by side
  - Selected state: Filled with color (1-2x = blue, 3-4x = green, 5-7x = orange)
  - Unselected: Outline only
  - Mobile: Scrollable horizontal row
  - Desktop: All visible inline
- **Helper Text**: "How many times per week will you train this division?"

**Sets/Reps Inputs**:
- **Type**: Number input with steppers
- **Validation**: On blur
- **Rules**:
  - Sets: Integer 1-10
  - Reps: String, max 20 chars (allows "8-12", "AMRAP")
- **Error Messages**:
  - Sets out of range: "Sets must be between 1 and 10"
  - Reps too long: "Reps must be less than 20 characters"
- **Placeholder**:
  - Sets: "3"
  - Reps: "8-12"

**Weight Input**:
- **Type**: Number input with stepper
- **Validation**: On blur
- **Rules**: Float 0-500 kg (0 = bodyweight)
- **Error Messages**:
  - Negative: "Weight must be 0 or greater"
  - Too high: "Weight must be less than 500 kg"
- **Helper Text**: "Leave blank or enter 0 for bodyweight exercises"
- **Enhancement**: Show last 3 workout weights below input as quick reference

**Rest Time Input**:
- **Type**: Quick select buttons + custom input
- **Validation**: On blur
- **Rules**: Integer 0-600 seconds (0 = no timer)
- **Quick Select Options**: 30s, 60s, 90s, 120s, 180s, Custom
- **Custom**: Number input appears when "Custom" selected
- **Helper Text**: "Rest time between sets"

**Video URL Input**:
- **Type**: Text input with validation indicator
- **Validation**: Real-time as user types (debounced 500ms)
- **Rules**:
  - Optional
  - Must match YouTube URL pattern: youtube.com/watch?v=X or youtu.be/X
  - Extract 11-char video ID
- **Visual Feedback**:
  - Valid: Green checkmark icon appears
  - Invalid: Red X icon appears
  - Loading: Spinner while validating
- **Error Messages**:
  - Invalid format: "Please enter a valid YouTube URL"
  - Video not found: "Video unavailable. URL saved but may not play"
- **Preview**: Thumbnail appears below input when valid URL detected
- **Placeholder**: "https://youtube.com/watch?v=..."

**Notes Textarea**:
- **Type**: Expandable textarea
- **Validation**: On blur
- **Rules**: Max 500 chars
- **Visual Design**:
  - Initially collapsed with "Add Notes" button
  - Expands to show textarea when clicked
  - Auto-expands as user types (max 10 lines, then scroll)
  - Character counter below (450/500)
- **Placeholder**: "Add coaching cues, form tips, or personal insights..."
- **Helper Text**: "Notes will be visible during your workout"

---

## 4. Component Architecture

### Page Components (App Router)

**`/app/(app)/routines/page.tsx`** - Routines List Page (EXISTS - ENHANCE)
- **Purpose**: Browse all routines, create new, manage existing
- **Components Used**:
  - `RoutineCard` (domain component)
  - `EmptyState` (molecule)
  - `Button` (shadcn)
  - `Alert` (shadcn)
- **Enhancements Needed**:
  - Add filter tabs (All | Active | Archived)
  - Add search bar for routine names
  - Add sort options (name, last used, date created)

**`/app/(app)/routines/new/page.tsx`** - Create Routine Page (EXISTS - REDESIGN)
- **Purpose**: Guided routine creation wizard
- **Components Used**:
  - `RoutineEditorWizard` (new domain component)
  - `ProgressStepper` (new molecule)
- **Steps**:
  1. Basic Info (name)
  2. Training Divisions (add/configure divisions)
  3. Exercises (add exercises to each division)
  4. Review & Save

**`/app/(app)/routines/[id]/page.tsx`** - Routine Detail Page (NEW)
- **Purpose**: View complete routine structure (read-only overview)
- **Components Used**:
  - `RoutineHeader` (new domain component)
  - `DivisionCard` (new domain component)
  - `ExerciseCard` (new domain component)
  - `Button` (shadcn)
  - `Badge` (shadcn)
- **Actions**: Edit, Delete, Archive, Start Workout

**`/app/(app)/routines/[id]/edit/page.tsx`** - Edit Routine Page (NEW)
- **Purpose**: Modify existing routine
- **Components Used**:
  - `RoutineEditorForm` (enhanced domain component)
  - Same as create page, but pre-filled with existing data

### Domain Components (Routines Domain)

**`src/domains/routines/components/routine-editor-wizard.tsx`** (NEW)
- **Purpose**: Multi-step routine creation flow
- **Props**: `onComplete: (routine: Routine) => void`
- **State**:
  - `currentStep: number`
  - `routineData: PartialRoutine`
- **Subcomponents**:
  - `StepBasicInfo`
  - `StepDivisions`
  - `StepExercises`
  - `StepReview`
- **Navigation**: Next/Back buttons, progress indicator
- **Validation**: Each step validates before allowing next

**`src/domains/routines/components/routine-editor-form.tsx`** (EXISTS - REDESIGN)
- **Purpose**: Single-page form for editing existing routines
- **Current Issues**:
  - Multi-step is confusing
  - Exercise configuration too simplified
  - No video or history integration
- **Redesign Approach**:
  - Accordion layout with expandable divisions
  - Inline exercise configuration
  - Drag-and-drop reordering
  - Integrated video preview and history display

**`src/domains/routines/components/division-editor.tsx`** (NEW)
- **Purpose**: Edit single training division
- **Props**:
  - `division: TrainingDivision`
  - `onChange: (division: TrainingDivision) => void`
  - `onDelete: () => void`
- **UI Elements**:
  - Name input
  - Frequency selector (visual button group)
  - Description textarea
  - Exercise list (reorderable)
  - Add exercise button
- **Validation**: Inline validation, error display

**`src/domains/routines/components/frequency-selector.tsx`** (NEW)
- **Purpose**: Visual selector for training frequency
- **Props**:
  - `value: number` (1-7)
  - `onChange: (value: number) => void`
- **UI Design**:
  - 7 pill buttons side by side
  - Color-coded by intensity
  - Mobile: Horizontal scroll
  - Desktop: All visible
- **Accessibility**:
  - Radio button group semantics
  - Keyboard navigation (arrow keys)
  - ARIA labels

**`src/domains/routines/components/exercise-configuration-panel.tsx`** (NEW)
- **Purpose**: Detailed exercise configuration with all fields
- **Props**:
  - `exercise: Exercise`
  - `config: RoutineExerciseConfig`
  - `onChange: (config: RoutineExerciseConfig) => void`
  - `onCancel: () => void`
  - `onSave: () => void`
- **Sections**:
  1. Exercise info (name, category - read-only)
  2. Target configuration (sets, reps, weight, rest)
  3. Video URL (with preview)
  4. Load history (last 5 workouts)
  5. Notes (expandable textarea)
- **Layout**: Vertical form, grouped by section
- **Actions**: Save, Cancel buttons at bottom

**`src/domains/routines/components/exercise-selector.tsx`** (EXISTS - ENHANCE)
- **Purpose**: Search and select exercises from library
- **Current Features**: Basic search, category filter
- **Enhancements Needed**:
  - Fuzzy search (not just startsWith)
  - Recently used exercises section
  - Create custom exercise inline (modal within modal)
  - Exclude already-added exercises (disabled state)
- **UI Design**:
  - Search bar at top (autofocus)
  - Category chips below search
  - Scrollable exercise list
  - Empty state for no results

**`src/domains/routines/components/video-player-modal.tsx`** (NEW)
- **Purpose**: Display YouTube video in modal
- **Props**:
  - `videoId: string`
  - `exerciseName: string`
  - `onClose: () => void`
- **UI Design**:
  - Modal with black backdrop
  - YouTube iframe (16:9 aspect ratio)
  - Close button (top right)
  - Exercise name as title
- **Implementation**:
  - Use YouTube iframe API
  - Lazy load iframe (only when modal opens)
  - Sandbox attributes for security
- **Error Handling**:
  - Show error message if video unavailable
  - Fallback to link to YouTube

**`src/domains/routines/components/load-history-display.tsx`** (NEW)
- **Purpose**: Show historical workout data for exercise
- **Props**:
  - `exerciseId: string`
  - `userId: string`
  - `limit?: number` (default 5)
- **Data Source**: Query `WorkoutSet` via React Query hook
- **UI Design**:
  - Compact table or card list
  - Columns: Date, Sets × Reps @ Weight, Volume
  - Progressive overload indicator (arrow icon, color-coded)
  - PR badge on record workouts (trophy icon)
  - "Show More" button to expand full history
- **Full History View**: Modal with complete data + simple line chart (weight over time)
- **Empty State**: "No previous workouts for this exercise"

**`src/domains/routines/components/routine-card.tsx`** (EXISTS - ENHANCE)
- **Purpose**: Display routine summary in list
- **Current Features**: Name, days, exercises, actions
- **Enhancements Needed**:
  - Change "days" to "divisions" terminology
  - Add frequency badges to card (show division frequencies)
  - Add last used date
  - Add preview of first 3 divisions (collapsed)
- **Actions**: View, Edit, Activate, Archive, Delete (dropdown menu)

**`src/domains/routines/components/division-card.tsx`** (NEW)
- **Purpose**: Display training division in routine detail view
- **Props**:
  - `division: TrainingDivision`
  - `exercises: RoutineExercise[]`
  - `editable?: boolean`
- **UI Design**:
  - Card with header (name, frequency badge, description)
  - Collapsible exercise list
  - Exercise count badge
  - Edit/delete actions (if editable)
- **Frequency Badge**:
  - Color-coded (1-2x blue, 3-4x green, 5-7x orange)
  - Shows "3x per week" format

**`src/domains/routines/components/exercise-card.tsx`** (NEW)
- **Purpose**: Display exercise in division
- **Props**:
  - `exercise: Exercise`
  - `config: RoutineExerciseConfig`
  - `editable?: boolean`
  - `onEdit?: () => void`
  - `onDelete?: () => void`
- **UI Design**:
  - Horizontal card with drag handle (if editable)
  - Exercise name (bold)
  - Configuration summary (3 sets × 8-12 @ 50kg • 90s rest)
  - Video thumbnail (if video exists)
  - Notes preview (truncated if long)
  - Edit/delete actions (if editable)

### Display Components (Molecules/Organisms)

**`src/components/molecules/progress-stepper.tsx`** (NEW)
- **Purpose**: Show progress in multi-step wizard
- **Props**:
  - `steps: string[]`
  - `currentStep: number`
- **UI Design**:
  - Horizontal line with circles for each step
  - Completed steps: Checkmark icon, filled
  - Current step: Number, pulsing
  - Future steps: Number, outline only
- **Mobile**: Stack vertically or show only current step

**`src/components/molecules/empty-state.tsx`** (EXISTS - USE)
- **Purpose**: Display when no data exists
- **Props**:
  - `icon: LucideIcon`
  - `heading: string`
  - `message: string`
  - `action?: { label: string, onClick: () => void }`
- **Usage**:
  - No routines: Show dumbbell icon
  - No divisions: Show calendar icon
  - No exercises: Show barbell icon

**`src/components/molecules/confirmation-dialog.tsx`** (NEW - USE SHADCN ALERT DIALOG)
- **Purpose**: Confirm destructive actions
- **Props**:
  - `title: string`
  - `message: string`
  - `confirmLabel: string`
  - `cancelLabel: string`
  - `onConfirm: () => void`
  - `onCancel: () => void`
  - `variant?: 'default' | 'destructive'`
- **UI Design**: Use shadcn AlertDialog component
- **Usage**: Delete routine, delete division, delete exercise

**`src/components/molecules/frequency-badge.tsx`** (NEW)
- **Purpose**: Display frequency with color coding
- **Props**:
  - `frequency: number` (1-7)
  - `size?: 'sm' | 'md' | 'lg'`
- **UI Design**:
  - Pill-shaped badge
  - Color: 1-2x = blue, 3-4x = green, 5-7x = orange
  - Text: "3x/week" or "3x per week"
- **Accessibility**: Include full text in aria-label

### Modal/Dialog Components

**Modal Stack Hierarchy**:
1. Exercise Selector Modal (base layer)
2. Exercise Configuration Sheet/Drawer (on top of selector)
3. Video Player Modal (on top of configuration)
4. Load History Drawer (on top of configuration)
5. Confirmation Dialog (topmost)

**Implementation Notes**:
- Use shadcn Dialog for desktop modals
- Use shadcn Sheet for mobile drawers (slide from bottom)
- Manage z-index carefully (layer 1: 50, layer 2: 51, etc.)
- Prevent body scroll when modal open
- Close on Esc key or backdrop click (configurable)

---

## 5. Video Integration UX

### Video Input Experience

**Location**: Exercise configuration panel

**UI Flow**:
1. User sees "Video URL (optional)" input field
2. User pastes YouTube URL (any format)
3. System validates URL in real-time (debounced 500ms)
4. If valid:
   - Green checkmark appears next to input
   - Thumbnail preview loads below input (100px height)
   - "Play" icon overlays thumbnail
   - Video title displays below thumbnail (if metadata available)
5. If invalid:
   - Red X icon appears
   - Error message below input: "Please enter a valid YouTube URL"
6. User can clear URL (X button in input) or paste new URL

**URL Extraction Logic**:
- Accept formats:
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`
  - `https://www.youtube.com/embed/VIDEO_ID`
- Extract 11-character video ID
- Store only video ID in database (not full URL)
- Reconstruct URL when displaying: `https://www.youtube.com/embed/${videoId}`

### Video Display Contexts

**Context 1: Exercise Configuration Panel** (Routine Editor)
- **Display**: Thumbnail preview (150px × 85px, 16:9 aspect)
- **Interaction**: Click thumbnail → Video player modal opens
- **Purpose**: Preview video while configuring exercise
- **Lazy Loading**: Thumbnail only (not iframe)

**Context 2: Routine Detail View** (Read-Only)
- **Display**: Thumbnail preview on exercise card (small, 100px × 56px)
- **Interaction**: Click thumbnail → Video player modal opens
- **Purpose**: Quick reference before starting workout

**Context 3: Active Workout View** (During Execution)
- **Display**:
  - Option A: Inline embedded player (300px × 169px) above exercise details
  - Option B: Thumbnail with prominent "Watch Form Video" button
- **Interaction**: Click play → Video plays inline or in modal
- **Purpose**: Watch form reference during rest periods
- **Recommendation**: Option B (thumbnail) to avoid slow page loads

### Video Player Modal

**UI Design**:
- Full-screen on mobile (takes entire viewport)
- Centered modal on desktop (max 800px width)
- Black backdrop (80% opacity)
- Close button (X) in top right corner
- Exercise name as title above player
- YouTube iframe (16:9 aspect ratio)
- Player controls: YouTube default (play, pause, seek, volume, fullscreen)

**Implementation**:
```tsx
<iframe
  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  sandbox="allow-scripts allow-same-origin allow-presentation"
  className="aspect-video w-full"
/>
```

**Loading Strategy**:
- Don't load iframe until modal opens (performance)
- Show loading spinner while iframe loads
- Autoplay video when modal opens (add `?autoplay=1` to URL)

### Video Error Handling

**Scenario 1: Video Deleted/Private**
- **Detection**: YouTube iframe fires "error" event
- **UI Response**:
  - Show error message in player area
  - Message: "This video is unavailable. It may have been deleted or set to private."
  - Provide link: "View on YouTube" (opens video URL in new tab, may show YouTube error)
  - Keep video ID stored (user may fix URL later)

**Scenario 2: Invalid Video ID**
- **Detection**: Validation fails (not 11 chars or invalid format)
- **UI Response**:
  - Red X icon in input field
  - Error message: "Please enter a valid YouTube URL"
  - Don't show thumbnail

**Scenario 3: Network Error Loading Thumbnail**
- **Detection**: Thumbnail image fails to load
- **UI Response**:
  - Show placeholder image (gray box with play icon)
  - Video player modal still opens on click

**Scenario 4: YouTube API Rate Limit** (if using Data API for metadata)
- **Detection**: API returns 429 error
- **UI Response**:
  - Degrade gracefully: Show video ID instead of title
  - Show thumbnail from default URL (no API needed)
  - Display tooltip: "Video details temporarily unavailable"

### Video Accessibility

- **ARIA Labels**:
  - Thumbnail button: `aria-label="Play exercise demonstration video"`
  - Modal: `role="dialog" aria-labelledby="video-title"`
- **Keyboard Navigation**:
  - Tab to focus thumbnail/button
  - Enter/Space to open modal
  - Esc to close modal
  - Arrow keys to seek (YouTube default)
- **Screen Reader**:
  - Announce modal open: "Video player opened"
  - Announce modal close: "Video player closed"
  - Announce video title and duration
- **Closed Captions**: YouTube player includes CC button (user-controlled)

---

## 6. Load History UX

### History Display Format

**Primary View: Compact Table** (last 5 workouts)

**Location**: Exercise configuration panel, below target weight input

**Layout**:
```
┌─ Load History ──────────────────────────┐
│ Date         Sets × Reps    Weight  Vol │
│ Nov 3, 2025  3 × 10        50kg    1500│ ↑ (green)
│ Oct 30       3 × 10        47.5kg  1425│ ↑ (green)
│ Oct 27       3 × 12        45kg    1620│ → (yellow)
│ Oct 23       3 × 10        45kg    1350│ ↑ (green)
│ Oct 20       3 × 8         45kg    1080│
│                                          │
│ [View Full History →]                    │
└──────────────────────────────────────────┘
```

**Column Details**:
- **Date**: Relative format for recent (Today, Yesterday, 3 days ago), absolute for older (Oct 20)
- **Sets × Reps**: Aggregated (e.g., "3 × 10" if all sets same, "3 × 8-10" if varied)
- **Weight**: Average weight if varied, single value if consistent
- **Volume**: Total volume for workout (sets × reps × weight)
- **Indicator**: Arrow icon (↑ up = improving, → right = maintaining, ↓ down = regressing)

**Progressive Overload Indicator Logic**:
- Compare current workout volume to previous workout volume
- **↑ Green Up Arrow**: Current volume > previous by ≥5%
- **→ Yellow Right Arrow**: Current volume within ±5% of previous
- **↓ Red Down Arrow**: Current volume < previous by ≥5%
- **No Indicator**: First workout or no comparison available

**Mobile Optimization**:
- Stack columns vertically for narrow screens
- Show only Date, Weight, Indicator on mobile (tap to expand)

### Full History View

**Trigger**: User taps "View Full History" button in compact table

**UI**: Sheet (mobile) or Modal (desktop)

**Layout**:
```
┌─ Exercise Name - Full History ─────────────────┐
│ [Close X]                                      │
│                                                │
│ ┌─ Summary Stats ─────────────────────┐      │
│ │ Max Weight: 50kg (Nov 3, 2025) 🏆   │      │
│ │ Max Reps: 12 @ 45kg (Oct 27)        │      │
│ │ Max Volume: 1620kg (Oct 27) 🏆      │      │
│ │ Total Workouts: 24                   │      │
│ └─────────────────────────────────────┘      │
│                                                │
│ ┌─ Chart: Weight Over Time ──────────────┐   │
│ │      Weight (kg)                        │   │
│ │  50 ┤        ●                           │   │
│ │  48 ┤      ●   ●                         │   │
│ │  46 ┤    ●                               │   │
│ │  44 ┤  ●                                 │   │
│ │  42 ┤●                                   │   │
│ │     └──────────────────────────────────│   │
│ │     Oct    Oct    Oct    Nov           │   │
│ └────────────────────────────────────────┘   │
│                                                │
│ ┌─ Workout History (All) ──────────────────┐ │
│ │ [Filter: Last 30 days ▼] [Sort: Date ▼] │ │
│ │                                          │ │
│ │ Nov 3, 2025  3×10 @ 50kg   Vol: 1500 ↑ │ │
│ │ Oct 30       3×10 @ 47.5kg Vol: 1425 ↑ │ │
│ │ Oct 27       3×12 @ 45kg   Vol: 1620 → │ │
│ │ ... (scrollable)                        │ │
│ └─────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

**Summary Stats**:
- Max Weight: Highest weight lifted (any rep count) + date + PR trophy if current
- Max Reps: Most reps completed (at any weight) + weight + date
- Max Volume: Highest total volume in single workout + date + PR trophy if current
- Total Workouts: Count of workouts where this exercise was performed

**Chart**:
- Simple line chart: X-axis = date, Y-axis = average weight per workout
- Points: Each workout (clickable to see details)
- Trend line: Visual indicator of progress direction
- Mobile: Scrollable/pannable chart
- Desktop: Full chart visible
- Library: Use lightweight charting library (Recharts or Chart.js)

**Workout History Table**:
- Full list of all workouts (paginated or infinite scroll)
- Filters: Date range (Last 7 days, 30 days, 3 months, All)
- Sort: Date (newest/oldest), Weight (highest/lowest), Volume (highest/lowest)
- Expandable rows: Tap workout to see set-by-set breakdown
  - Set 1: 10 reps @ 50kg
  - Set 2: 10 reps @ 50kg
  - Set 3: 10 reps @ 50kg

### Comparison with Previous Workouts

**Location**: Active workout view, current exercise

**UI**: Inline comparison card below exercise name

**Layout**:
```
┌─ Current Exercise ──────────────────────────┐
│ Bench Press                                 │
│ Target: 3 sets × 10 @ 50kg • 90s rest     │
│                                             │
│ ┌─ Last Workout (Nov 3) ─────────────────┐ │
│ │ 3 sets × 10 @ 47.5kg                    │ │
│ │ Volume: 1425kg                          │ │
│ │                                         │ │
│ │ ✓ You're attempting to increase weight │ │
│ │   from 47.5kg to 50kg. Go for it! 💪  │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [View Full History]                         │
└─────────────────────────────────────────────┘
```

**Comparison Logic**:
- Show last workout data for same exercise
- Compare target weight to last weight
- If target > last: Show encouragement message (green)
- If target = last: Show "Maintain performance" message (yellow)
- If target < last: Show caution message "Lower weight than last time. Deload day?" (orange)

**Contextual Feedback**:
- **Attempting PR**: "You're going for a new personal record! 🏆"
- **Matching PR**: "Match your PR of 50kg. You've got this! 💪"
- **Increasing Weight**: "You're attempting +2.5kg from last time. Progressive overload! ↑"
- **Maintaining**: "Same weight as last time. Try for more reps! →"
- **Decreasing**: "Lower weight than last time. Deload or recovery day? ↓"

### PR (Personal Record) Highlighting

**PR Badge Locations**:
1. Load history table (trophy emoji or icon next to PR workout)
2. Exercise card in routine detail (if current target matches PR)
3. Active workout view (if attempting PR)
4. Full history modal (summary stats section)

**Visual Design**:
- **Icon**: Trophy emoji 🏆 or gold trophy icon
- **Color**: Gold/yellow accent
- **Badge**: "PR" text in gold badge
- **Animation**: Subtle sparkle animation when PR achieved (confetti or glow)

**PR Types**:
- **Weight PR**: Highest weight lifted for any rep count
- **Rep PR**: Most reps at any weight
- **Volume PR**: Highest total volume in single workout

**PR Achievement Flow**:
1. User completes workout with new PR
2. System calculates volume, compares to historical max
3. If new PR detected:
   - Show celebration modal "New Personal Record! 🏆"
   - Display: "Bench Press - 52.5kg (previous: 50kg)"
   - Confetti animation or trophy icon
   - Option to share (future: social features)
   - Save button → Modal closes, PR stored

**PR Context in Routine Planning**:
- When user sets target weight in routine editor
- Show current PR below weight input: "Current PR: 50kg (Nov 3, 2025)"
- If target > PR: Show "Attempting new PR!" badge (gold)

---

## 7. Mobile-First Design

### Touch-Friendly Controls

**Minimum Touch Targets**: 44px × 44px (WCAG AA standard)
- Buttons: Min 44px height, full width on mobile
- Icon buttons: Min 44px × 44px
- Links: Min 44px height with padding
- Form inputs: Min 44px height
- Drag handles: Min 44px × 44px

**Spacing for Fat Fingers**:
- Button groups: 8px gap minimum
- Form fields: 16px gap minimum
- List items: 8px gap minimum
- Card grid: 16px gap minimum

**Gesture Support**:
- **Tap**: Primary action (button click, card select)
- **Long Press**: Context menu (card actions)
- **Swipe Left**: Delete action (exercise, division)
- **Swipe Right**: Archive action (routine)
- **Drag**: Reorder (divisions, exercises)
- **Pinch**: Zoom (charts in full history)
- **Pull to Refresh**: Reload data (routine list)

### Optimized Spacing for Mobile

**Layout Adjustments**:
- **Desktop**: 24px padding, 24px gaps
- **Mobile**: 16px padding, 16px gaps
- **Card padding**:
  - Desktop: 24px (1.5rem)
  - Mobile: 16px (1rem)
- **Section gaps**:
  - Desktop: 32px (2rem)
  - Mobile: 24px (1.5rem)
- **Form field gaps**:
  - Desktop: 16px (1rem)
  - Mobile: 12px (0.75rem)

**Typography Adjustments**:
- **Headings**:
  - Desktop: h1=36px, h2=24px, h3=18px
  - Mobile: h1=28px, h2=20px, h3=16px
- **Body**:
  - Desktop: 16px (1rem)
  - Mobile: 16px (no change, for readability)
- **Labels**:
  - Desktop: 14px (0.875rem)
  - Mobile: 14px (no change)

### Collapsible Sections

**Accordion Pattern**: Use for training divisions in routine editor

**UI Design**:
- **Collapsed State**:
  - Division name + frequency badge + exercise count
  - Down chevron icon (right side)
  - Height: ~60px
- **Expanded State**:
  - Division name + frequency badge
  - Up chevron icon
  - Full exercise list visible
  - Add exercise button visible
- **Transition**: Smooth height animation (200ms ease-in-out)

**Behavior**:
- Only one division expanded at a time (accordion mode)
- Or: Multiple divisions can be expanded (independent)
- Recommendation: Independent (better for mobile, less scrolling)

**Sections to Collapse**:
1. Training divisions (routine editor)
2. Exercise notes (exercise configuration panel)
3. Load history (compact view, expand to full)
4. Video preview (show thumbnail, expand to player)

### Bottom Sheets vs Modals

**Bottom Sheet** (Mobile Only):
- **Use For**:
  - Exercise selector
  - Exercise configuration panel
  - Load history drawer
  - Confirmation dialogs
- **UI Design**:
  - Slides up from bottom of screen
  - Rounded top corners (16px radius)
  - Drag handle at top (gray bar, 32px × 4px)
  - Backdrop (semi-transparent black)
  - Max height: 90vh (leave space for status bar)
- **Interaction**:
  - Tap backdrop to close
  - Swipe down on handle to close
  - Swipe down on content to close (if scrolled to top)
  - Esc key to close (keyboard support)

**Modal** (Desktop Only):
- **Use For**:
  - Video player
  - Full history view
  - Confirmation dialogs
  - Exercise selector (as alternative to bottom sheet)
- **UI Design**:
  - Centered on screen
  - Max width: 600px (forms), 800px (video player)
  - Rounded corners (8px radius)
  - Backdrop (semi-transparent black)
  - Close button (top right)
- **Interaction**:
  - Tap backdrop to close
  - Click X button to close
  - Esc key to close

**Hybrid Components**:
- **shadcn Dialog**: Desktop modal
- **shadcn Sheet**: Mobile bottom sheet
- Use same component, render conditionally:
  ```tsx
  const isMobile = useMediaQuery('(max-width: 640px)');
  return isMobile ? <Sheet>...</Sheet> : <Dialog>...</Dialog>;
  ```

### Mobile Navigation Patterns

**Sticky Header**:
- Routine name (routine editor)
- Back button (left)
- Save button (right)
- Progress indicator (wizard)
- Height: 56px
- Background: White/dark with shadow
- Scrolls up on scroll down, reappears on scroll up (hide on scroll pattern)

**Sticky Footer**:
- Primary action button (Save Routine, Add Exercise)
- Full width on mobile
- Fixed to bottom of viewport
- Height: 56px + safe area inset
- Background: White/dark with top border
- Always visible (does not hide on scroll)

**Floating Action Button** (FAB):
- **Use For**: Create Routine (routines list page)
- **Position**: Bottom right, above navigation
- **Size**: 56px × 56px
- **Icon**: Plus icon
- **Color**: Primary (blue/green)
- **Shadow**: Large shadow (8px blur, 4px offset)
- **Label**: "Create" (appears on hover/long press)

**Bottom Navigation** (App-Level):
- 4-5 tabs (Dashboard, Routines, Workout, History, Profile)
- Icon + label
- Active state: Bold label, primary color
- Height: 56px + safe area inset
- Fixed to bottom

**Back Navigation**:
- Always provide back button in header (left side)
- Gesture: Swipe right from left edge to go back (native behavior)
- Keyboard: Esc key or browser back button

---

## 8. Component Specifications

### shadcn/ui Components to Use

**Layout & Structure**:
- **Card**: Routine cards, division cards, exercise cards
  - Props: `className`, `children`
  - Variants: Default (with shadow), flat (no shadow)
- **Separator**: Dividers between sections
  - Props: `orientation` (horizontal/vertical), `className`

**Forms & Inputs**:
- **Input**: Text inputs (name, weight, reps)
  - Props: `type`, `placeholder`, `value`, `onChange`, `error`
  - Variants: Default, error state, disabled
- **Label**: Form field labels
  - Props: `htmlFor`, `children`
- **Textarea**: Notes, description
  - Props: `rows`, `maxLength`, `placeholder`, `value`, `onChange`
- **Select**: Day of week (legacy), category filter (exercise selector)
  - Props: `options`, `value`, `onChange`, `placeholder`
- **Checkbox**: Boolean options (future: "Show video during workout")
  - Props: `checked`, `onChange`, `label`

**Buttons**:
- **Button**: All button actions
  - Props: `variant`, `size`, `disabled`, `onClick`
  - Variants: `default` (primary), `outline`, `ghost`, `destructive`
  - Sizes: `sm`, `md` (default), `lg`
- **Badge**: Frequency badges, active badge, PR badge
  - Props: `variant`, `children`
  - Variants: `default`, `secondary`, `outline`, `destructive`

**Overlays**:
- **Dialog**: Desktop modals (video player, full history, confirmations)
  - Props: `open`, `onOpenChange`, `children`
  - Subcomponents: `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`
- **Sheet**: Mobile bottom sheets (exercise selector, configuration panel)
  - Props: `open`, `onOpenChange`, `side` (bottom/left/right/top)
  - Subcomponents: Similar to Dialog
- **Alert Dialog**: Confirmation dialogs (delete, archive)
  - Props: Similar to Dialog, but with destructive styling
- **Dropdown Menu**: Context menus (routine card actions)
  - Props: `trigger`, `items`
  - Subcomponents: `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`

**Feedback**:
- **Alert**: Error/success messages
  - Props: `variant`, `children`
  - Variants: `default`, `destructive`
- **Sonner (Toast)**: Toast notifications (save success, errors)
  - Use via `toast()` function
  - Props: `title`, `description`, `variant`, `duration`
- **Skeleton**: Loading placeholders
  - Props: `className`
  - Use for card loading, list loading
- **Progress**: Progress bar (wizard steps)
  - Props: `value`, `max`

**Navigation**:
- **Tabs**: Filter tabs (All/Active/Archived)
  - Props: `tabs`, `activeTab`, `onChange`
  - Subcomponents: `TabsList`, `TabsTrigger`, `TabsContent`

### Custom Components Needed

**Why Custom Components?**
- shadcn doesn't provide: Frequency selector, drag-and-drop, video player integration, load history display
- Domain-specific logic: Routine editor wizard, exercise configuration
- Complex interactions: Multi-step forms, reordering

**`<FrequencySelector />`**
- **Why Not shadcn**: No visual button group component with specific color logic
- **Implementation**: Custom component using shadcn Button primitives
- **Complexity**: Medium (7 buttons, state management, accessibility)

**`<ProgressStepper />`**
- **Why Not shadcn**: No stepper component, Progress is just a bar
- **Implementation**: Custom component with SVG or div elements
- **Complexity**: Medium (step rendering, active state, transitions)

**`<LoadHistoryDisplay />`**
- **Why Not shadcn**: Requires data fetching, calculations, chart rendering
- **Implementation**: Custom component using React Query + charting library
- **Complexity**: High (query logic, chart integration, responsive design)

**`<VideoPlayerModal />`**
- **Why Not shadcn**: YouTube iframe integration is specific
- **Implementation**: shadcn Dialog wrapper + custom iframe component
- **Complexity**: Medium (YouTube API, error handling, accessibility)

**`<RoutineEditorWizard />`**
- **Why Not shadcn**: Multi-step form logic with validation
- **Implementation**: Custom component using shadcn Dialog + Form + Button
- **Complexity**: High (step management, form state, validation)

**`<ExerciseConfigurationPanel />`**
- **Why Not shadcn**: Complex domain logic, multiple sections
- **Implementation**: Custom component using shadcn Sheet/Dialog + Form components
- **Complexity**: High (multiple inputs, validation, video integration, history display)

**`<DragAndDropList />`**
- **Why Not shadcn**: No drag-and-drop component
- **Implementation**: Custom component using @dnd-kit/core or react-beautiful-dnd
- **Complexity**: High (drag state, drop zones, animations, accessibility)

### Props and State Management

**Props Pattern**: Follow React best practices
- **Controlled Components**: Pass `value` and `onChange` props
- **Uncontrolled Components**: Use internal state + `defaultValue` prop
- **Callbacks**: `onX` naming (onClick, onChange, onSubmit, onDelete)
- **Composition**: Pass `children` for flexible layouts

**State Management Strategy**:

**Form State**: React Hook Form
- **Use For**: Routine editor form, exercise configuration form
- **Why**: Complex validation, multiple fields, optimistic UI
- **Example**:
  ```tsx
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(routineSchema),
    defaultValues: routine
  });
  ```

**Server State**: React Query
- **Use For**: Fetching routines, exercises, load history
- **Why**: Caching, auto-refetching, optimistic updates
- **Example**:
  ```tsx
  const { data: routines, isLoading } = useRoutines();
  const createRoutine = useCreateRoutine();
  ```

**UI State**: Zustand (if needed) or useState
- **Use For**: Modal open/close, accordion expand/collapse, current wizard step
- **Why**: Simple UI state doesn't need complex state management
- **Example**:
  ```tsx
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  ```

**Component State**: useState
- **Use For**: Temporary state within single component (search query, selected items)
- **Example**:
  ```tsx
  const [searchQuery, setSearchQuery] = useState('');
  ```

### Validation and Error Display

**Validation Strategy**: Zod schemas + React Hook Form

**Schema Location**: `src/domains/routines/schema.ts`

**Validation Rules**:
```typescript
// Training Division
const divisionSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  frequency: z.number().int().min(1).max(7),
  description: z.string().max(200).optional(),
  order: z.number().int().positive()
});

// Exercise Configuration
const exerciseConfigSchema = z.object({
  targetSets: z.number().int().min(1).max(10),
  targetReps: z.string().max(20).regex(/^(\d+(-\d+)?|AMRAP)$/i, "Invalid reps format"),
  targetWeight: z.number().min(0).max(500).optional(),
  restSeconds: z.number().int().min(0).max(600).optional(),
  videoId: z.string().length(11).optional(),
  notes: z.string().max(500).optional()
});

// Video URL (custom validation)
const youtubeUrlSchema = z.string().refine(
  (url) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return regex.test(url);
  },
  { message: "Please enter a valid YouTube URL" }
);
```

**Error Display Pattern**:
- **Inline**: Error message below input field (red text, 14px)
- **Icon**: Red X icon in input field (right side)
- **Border**: Red border on input field (error state)
- **Toast**: For server errors (mutation failures)

**Error Message Format**:
- **Clear**: "Routine name is required" (not "Invalid input")
- **Actionable**: "Frequency must be between 1 and 7. You entered 0." (not just "Invalid")
- **Specific**: "Division name 'Push' already exists. Try 'Push A' or 'Upper Push'" (not "Duplicate")

**Validation Timing**:
- **On Blur**: Validate individual fields when user leaves field
- **On Submit**: Validate entire form before submitting
- **Real-Time**: For async validations (YouTube URL check)
- **Debounced**: For expensive validations (database uniqueness checks)

---

## 9. Responsive Design Details

### Mobile (< 640px)

**Layout**:
- Single column everywhere
- Full-width cards
- Stacked form fields
- Bottom sheets for overlays
- Sticky header and footer

**Navigation**:
- Bottom navigation bar (fixed)
- Hamburger menu for secondary actions
- Back button in header (always visible)

**Actions**:
- Full-width buttons
- Floating action button for primary action
- Swipe gestures for quick actions

**Content Prioritization**:
- Show only essential info on cards (name, key stat)
- Collapse secondary info (tap to expand)
- Hide tertiary actions in dropdown menu

**Example: Routine Card (Mobile)**
```
┌─────────────────────────────┐
│ Push Pull Legs     [⋮]      │
│ ┌─────┐                     │
│ │Active│                    │
│ └─────┘                     │
│                              │
│ 3 divisions • 15 exercises  │
│                              │
│ [View]          [Edit]      │
└─────────────────────────────┘
```

### Tablet (640px - 1024px)

**Layout**:
- 2-column card grid
- Side-by-side form fields (where appropriate)
- Drawers for secondary panels
- More breathing room (increased padding)

**Navigation**:
- Drawer navigation (slide from left)
- Breadcrumbs for deep pages
- Tabs for filters (horizontal)

**Actions**:
- Buttons have fixed width (not full-width)
- Hover states start to appear
- Context menus on long-press or right-click

**Content**:
- More details visible on cards
- Inline editing (less modal usage)
- Side panels for supplementary info

**Example: Routine Card (Tablet)**
```
┌─────────────────────────────────────┐
│ Push Pull Legs             [Active] │
│ Last used: Nov 3, 2025               │
│                                      │
│ 3 divisions • 15 total exercises    │
│ Push (3x), Pull (3x), Legs (2x)    │
│                                      │
│ [View Details] [Edit] [⋮ More]      │
└─────────────────────────────────────┘
```

### Desktop (> 1024px)

**Layout**:
- 3-column card grid
- Sidebar + content (split screen)
- Modals for overlays (centered, max-width)
- Generous spacing and padding

**Navigation**:
- Persistent sidebar navigation (always visible)
- Breadcrumbs + page title
- Tabbed interfaces for complex views

**Actions**:
- Buttons have fixed width + padding
- Prominent hover states
- Tooltips on icon buttons
- Right-click context menus

**Content**:
- Maximum detail visible
- Inline editing with autosave
- Side-by-side panels (master-detail)
- Charts and data visualization

**Additional Desktop Features**:
- Keyboard shortcuts (Cmd+K for search, etc.)
- Drag-and-drop with visual feedback
- Hover previews (video thumbnail → inline preview)
- Bulk actions (select multiple items)

**Example: Routine Card (Desktop)**
```
┌─────────────────────────────────────────────┐
│ Push Pull Legs                     [Active] │
│ Created: Oct 15, 2025                       │
│ Last used: Nov 3, 2025                      │
│                                              │
│ Training Divisions:                         │
│ • Push (3x/week): Chest, Shoulders, Triceps│
│ • Pull (3x/week): Back, Biceps              │
│ • Legs (2x/week): Quads, Hamstrings, Calves│
│                                              │
│ 3 divisions • 15 total exercises            │
│                                              │
│ [View Details] [Edit Routine] [⋮ More]      │
└─────────────────────────────────────────────┘
```

### Responsive Breakpoint Strategy

**CSS Approach**: Mobile-first (default styles for mobile, override for larger)

**Example**:
```css
/* Mobile default */
.routine-card {
  padding: 1rem;
  width: 100%;
}

/* Tablet and up */
@media (min-width: 640px) {
  .routine-card {
    padding: 1.5rem;
    width: calc(50% - 0.5rem);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .routine-card {
    width: calc(33.333% - 0.666rem);
  }
}
```

**Tailwind Approach**: Mobile-first with responsive prefixes
```tsx
<div className="p-4 w-full md:p-6 md:w-1/2 lg:w-1/3">
  {/* Card content */}
</div>
```

---

## 10. States & Feedback

### Loading States

**Initial Page Load** (Routine List):
- **Skeleton Loading**:
  - Show 6 skeleton cards in grid
  - Each skeleton: Gray animated shimmer
  - Height: 200px (matches actual card)
  - Duration: Until data loads

**Button Actions** (Save, Delete, Create):
- **Inline Spinner**:
  - Button text replaced with spinner icon
  - Button disabled (cursor: not-allowed)
  - Button color slightly faded
  - Duration: Until action completes (typically < 1s)

**Data Fetching** (Load History, Exercise Search):
- **Inline Spinner**:
  - Small spinner icon in relevant section
  - Content area slightly faded (opacity: 0.5)
  - "Loading..." text below spinner
  - Duration: Until data loads

**Optimistic Updates** (Create Routine, Add Exercise):
- **Immediate UI Update**:
  - Item appears instantly with "saving..." indicator
  - Gray shimmer or spinner on item
  - If save fails, item fades out + error toast
  - If save succeeds, shimmer stops + success state

**Lazy Loading** (Infinite Scroll for Full History):
- **Spinner at Bottom**:
  - "Load More" button or auto-load spinner
  - Appears when scrolled to bottom
  - Loads next page of results

### Error States

**Validation Errors** (Form Fields):
- **Visual Indicators**:
  - Red border on input field (2px solid)
  - Red X icon inside input (right side)
  - Red error text below input (14px, 0.875rem)
- **Message Format**: Clear and actionable
  - "Routine name is required"
  - "Frequency must be between 1 and 7. You entered 0."
- **Timing**: Show on blur or on submit attempt

**System Errors** (Mutation Failures):
- **Toast Notification**:
  - Red background (destructive variant)
  - X icon (left side)
  - Error title: "Failed to save routine"
  - Error message: "Network error. Please try again."
  - Action button: "Retry" (optional)
  - Dismiss button: X (right side)
  - Duration: Persists until dismissed (don't auto-dismiss)

**Network Errors** (Fetch Failures):
- **Alert Component** (Inline):
  - Red border and background
  - X icon
  - Message: "Failed to load routines. Please try again."
  - Action button: "Retry" or "Refresh"
  - Position: Top of page (replaces content)

**Video Load Errors** (YouTube):
- **Placeholder Message in Player**:
  - Gray box with error icon
  - Message: "This video is unavailable."
  - Explanation: "It may have been deleted or set to private."
  - Action link: "View on YouTube" (opens in new tab)

**Empty State vs Error State**:
- **Empty State**: No data exists (not an error)
  - Example: "No routines yet. Create your first routine!"
  - Friendly, encouraging tone
  - Clear call-to-action
- **Error State**: Something went wrong
  - Example: "Failed to load routines. Please try again."
  - Problem-focused, solution-oriented
  - Retry action available

### Empty States

**No Routines** (Routines List Page):
- **UI**:
  - Large icon (Dumbbell, 64px)
  - Heading: "No routines yet"
  - Message: "Create your first routine to start tracking workouts"
  - Button: "Create Routine" (primary, prominent)
- **Tone**: Encouraging, actionable

**No Divisions** (Routine Editor):
- **UI**:
  - Dashed border box (gray, 2px)
  - Icon (Calendar, 48px)
  - Message: "No training divisions yet. Add your first division to get started."
  - Button: "Add Division" (inside dashed box)
- **Tone**: Instructional, helpful

**No Exercises** (Division):
- **UI**:
  - Text only (smaller empty state)
  - Message: "No exercises yet. Add your first exercise."
  - Button: "Add Exercise" (secondary, inline)
- **Tone**: Minimal, direct

**No History** (Load History Display):
- **UI**:
  - Text only (inline)
  - Message: "No previous workouts recorded for this exercise."
  - Icon: Clock with X overlay (16px, inline)
- **Tone**: Informational, neutral

**No Search Results** (Exercise Selector):
- **UI**:
  - Icon (Search with X, 48px)
  - Message: "No exercises found for 'bench'"
  - Suggestion: "Try a different search term or create a custom exercise."
  - Button: "Create Custom Exercise" (optional)
- **Tone**: Helpful, offers alternative

### Success States

**Routine Saved** (Create/Edit Routine):
- **Toast Notification**:
  - Green background (success variant)
  - Checkmark icon (left side)
  - Title: "Routine saved"
  - Message: "Your routine has been saved successfully."
  - Duration: 3 seconds (auto-dismiss)
  - Action: None (toast only)
- **Redirect**: Navigate to routines list after toast

**Exercise Added** (Exercise Configuration):
- **Feedback**:
  - Modal/sheet closes with fade-out transition
  - Exercise appears in division list with slide-in animation
  - Brief green highlight on new exercise card (1s)
  - No toast (inline feedback sufficient)

**Division Created** (Add Division):
- **Feedback**:
  - Division card appears with expand animation
  - Auto-scrolls to new division
  - Division expanded by default (ready to add exercises)
  - No toast (inline feedback sufficient)

**Weight Increased (PR Attempt)** (Active Workout):
- **Celebration Modal** (if PR achieved):
  - Confetti animation or trophy icon
  - Title: "New Personal Record! 🏆"
  - Message: "Bench Press - 52.5kg (previous: 50kg)"
  - Button: "Awesome!" or "Continue Workout"
  - Duration: Modal until dismissed (don't auto-close)

**All Exercises Completed** (Active Workout):
- **Celebration Screen**:
  - Large checkmark icon (green, 96px)
  - Title: "Workout Complete! 💪"
  - Stats: Duration, exercises completed, total volume
  - Button: "Finish Workout" (navigates to workout summary)

### State Transition Animations

**Card Appear** (New Item Added):
- Fade in (0 → 1 opacity, 150ms)
- Slide up (20px → 0, 200ms ease-out)
- Scale up (0.95 → 1, 200ms ease-out)

**Card Remove** (Delete Item):
- Fade out (1 → 0 opacity, 150ms)
- Scale down (1 → 0.9, 150ms ease-in)
- Height collapse (auto → 0, 200ms ease-in-out)

**Modal Open**:
- Backdrop fade in (0 → 0.5 opacity, 150ms)
- Content slide up (mobile: 100% → 0, 200ms ease-out)
- Content fade in (desktop: 0 → 1 opacity, 200ms ease-out)

**Modal Close**:
- Reverse of open (150-200ms)

**Button Click Feedback**:
- Scale down (1 → 0.95, 100ms)
- Scale up (0.95 → 1, 100ms)
- Ripple effect (Material Design pattern)

---

## 11. Accessibility Design (WCAG 2.1 AA Minimum)

### Semantic Structure

**Landmarks** (ARIA Roles):
- `<header role="banner">`: App header with logo, navigation
- `<nav role="navigation">`: Sidebar navigation, bottom navigation
- `<main role="main">`: Page content
- `<aside role="complementary">`: Supplementary info (load history panel)
- `<footer role="contentinfo">`: App footer (if exists)

**Headings** (Logical Hierarchy):
- **Page**: One `<h1>` per page (page title)
- **Sections**: `<h2>` for major sections (Training Divisions, Exercises)
- **Subsections**: `<h3>` for subsections (Division name, Exercise name)
- **Never Skip Levels**: h1 → h2 → h3 (never h1 → h3)

**Lists**:
- **Unordered Lists** (`<ul>`): Routine list, division list, exercise list
- **Ordered Lists** (`<ol>`): Steps in wizard, history entries (if order matters)
- **Definition Lists** (`<dl>`): Exercise configuration (term: Sets, definition: 3)

### Keyboard Navigation

**Tab Order** (Logical Flow):
- Top to bottom: Header → Main content → Footer
- Left to right: Sidebar → Content → Actions
- Interactive elements only: Buttons, links, inputs, custom controls

**Keyboard Shortcuts** (Future Enhancement):
- `Cmd/Ctrl + K`: Focus search bar
- `N`: Create new routine (from routines list)
- `Esc`: Close modal/sheet, cancel action
- `Enter`: Submit form, confirm action
- `Space`: Select item, play video
- `/`: Focus search (common pattern)

**Focus Management**:
- **Modal Open**: Focus first interactive element (close button or first input)
- **Modal Close**: Return focus to trigger element (button that opened modal)
- **Delete Action**: Focus next item in list (or previous if last)
- **Form Submission**: Focus first error field (if errors) or success message

**Focus Indicators**:
- **Visible Outline**: 2px solid blue, 2px offset
- **High Contrast**: Ensure outline visible on all backgrounds
- **Never Remove**: Don't use `outline: none` without replacement
- **Custom Focus Styles**: Use `:focus-visible` for better UX (show only on keyboard focus)

**Escape Hatch** (Exit Mechanism):
- **Modal**: Esc key, backdrop click, close button
- **Multi-Step Wizard**: Cancel button on each step, back button
- **Inline Editing**: Esc key to cancel, blur to save
- **Search/Filter**: Clear button, Esc to reset

### Screen Reader Experience

**ARIA Labels** (Descriptive Labels for Non-Text Elements):
- Icon buttons: `aria-label="Delete exercise"`
- Close buttons: `aria-label="Close modal"`
- Navigation: `aria-label="Main navigation"`
- Search input: `aria-label="Search exercises"`
- Video thumbnail: `aria-label="Play exercise demonstration video"`

**ARIA Descriptions** (Additional Context):
- Complex controls: `aria-describedby="help-text-id"`
- Form fields: `aria-describedby="error-message-id"`
- Frequency selector: `aria-describedby="frequency-help"`

**ARIA Live Regions** (Dynamic Content Announcements):
- Toast notifications: `<div role="status" aria-live="polite">`
- Error messages: `<div role="alert" aria-live="assertive">`
- Loading states: `<div aria-live="polite">Loading...</div>`
- Success messages: `<div role="status">Routine saved</div>`

**ARIA States**:
- Expanded/collapsed: `aria-expanded="true|false"` on accordion triggers
- Selected state: `aria-selected="true|false"` on tabs
- Disabled state: `aria-disabled="true"` on disabled buttons
- Hidden content: `aria-hidden="true"` on decorative elements

**Hidden Content** (Visually Hidden but Accessible):
- **Skip to Main Content Link**:
  - Visually hidden until focused
  - `<a href="#main" class="sr-only">Skip to main content</a>`
- **Loading Text**:
  - Visible text for screen readers
  - `<span class="sr-only">Loading routines...</span>`
- **Icon Button Labels**:
  - Hidden label for screen readers
  - `<span class="sr-only">Delete</span><TrashIcon />`

**Screen Reader Testing**:
- **Tools**: NVDA (Windows), JAWS (Windows), VoiceOver (macOS/iOS)
- **Test Flows**:
  - Create routine (full wizard)
  - Add exercise to division
  - View load history
  - Delete routine (confirmation)
- **Success Criteria**:
  - All content readable
  - All actions discoverable
  - Logical reading order
  - Clear context for dynamic changes

### Visual Accessibility

**Color Contrast** (WCAG AA Standards):
- **Text on Background**: Minimum 4.5:1 ratio
  - Body text (16px): 4.5:1
  - Large text (18px+ or 14px bold): 3:1
- **UI Components**: Minimum 3:1 ratio
  - Buttons: 3:1 (border/background vs surrounding)
  - Form inputs: 3:1 (border vs background)
  - Icons: 3:1 (icon vs background)

**Contrast Examples** (Tailwind Colors):
- ✅ Good: Black text on white background (21:1)
- ✅ Good: Gray-900 on white (18.26:1)
- ✅ Good: Gray-700 on white (10.36:1)
- ⚠️ Borderline: Gray-500 on white (4.57:1) - barely passes
- ❌ Fail: Gray-400 on white (2.93:1) - fails AA

**Color Independence** (Don't Rely Solely on Color):
- **Progressive Overload Indicators**:
  - Don't use only green/red arrows
  - Also use arrow direction (↑/↓) and text ("Improving"/"Regressing")
- **Form Validation**:
  - Don't use only red border for errors
  - Also use red X icon and error text
- **Active State**:
  - Don't use only color for active routine
  - Also use "Active" badge text

**Text Size** (Readable Without Zoom):
- **Minimum Body Text**: 16px (1rem)
- **Small Text**: 14px (0.875rem) minimum for labels/helper text
- **Never Below 12px**: Avoid text smaller than 12px
- **Relative Units**: Use rem/em for scalability (not px)

**Touch Targets** (Mobile Accessibility):
- **Minimum Size**: 44px × 44px (WCAG AA)
- **Recommended**: 48px × 48px (Material Design)
- **Spacing**: 8px minimum between touch targets
- **Buttons**: Full width on mobile for primary actions

**Motion** (Respect User Preferences):
- **Prefers Reduced Motion**:
  - Detect via CSS media query: `@media (prefers-reduced-motion: reduce)`
  - Disable or reduce animations for users who prefer less motion
  - Replace slide/fade transitions with instant state changes
- **Example**:
  ```css
  /* Default: Animation enabled */
  .modal {
    transition: opacity 200ms ease-out;
  }

  /* Reduced motion: Instant transition */
  @media (prefers-reduced-motion: reduce) {
    .modal {
      transition: opacity 0ms;
    }
  }
  ```

**Focus Visible vs Focus** (Better UX):
- **Focus**: Shows outline on mouse click (annoying)
- **Focus-Visible**: Shows outline only on keyboard focus (better)
- **Implementation**:
  - Use `:focus-visible` pseudo-class
  - Hide focus outline on mouse click
  - Show focus outline on keyboard navigation

**Accessibility Testing Tools**:
- **Automated**: axe DevTools, Lighthouse, WAVE
- **Manual**: Screen reader testing, keyboard navigation testing
- **Continuous**: Include a11y checks in CI/CD pipeline

---

## 12. Text Content Requirements

### Text Map Location

**File**: `src/domains/routines/routines.text-map.ts` (EXISTS - EXTEND)

### New Keys to Define

**Routine Editor Wizard** (Multi-Step Flow):
```typescript
routineWizard: {
  stepBasicInfo: {
    title: 'Routine Details',
    heading: 'Give your routine a name',
    name: {
      label: 'Routine Name',
      placeholder: 'e.g., Push Pull Legs',
      required: 'Routine name is required',
      minLength: 'Routine name must be at least 3 characters',
      maxLength: 'Routine name must be less than 100 characters'
    },
    next: 'Next: Add Divisions',
    cancel: 'Cancel'
  },
  stepDivisions: {
    title: 'Training Divisions',
    heading: 'Add training divisions',
    description: 'Organize your routine into training divisions (e.g., Push, Pull, Legs)',
    addDivision: 'Add Division',
    empty: 'No divisions yet. Add your first division to get started.',
    next: 'Next: Add Exercises',
    back: 'Back',
    cancel: 'Cancel'
  },
  stepExercises: {
    title: 'Exercises',
    heading: 'Add exercises to each division',
    description: 'Select exercises and configure sets, reps, weight, and more',
    empty: 'No exercises yet. Add exercises to your divisions.',
    next: 'Review & Save',
    back: 'Back',
    cancel: 'Cancel'
  },
  stepReview: {
    title: 'Review Routine',
    heading: 'Review your routine',
    description: 'Check everything looks good before saving',
    summary: {
      routineName: 'Routine Name',
      divisions: 'Training Divisions',
      totalExercises: 'Total Exercises'
    },
    save: 'Save Routine',
    back: 'Back',
    cancel: 'Cancel'
  },
  progress: {
    step: 'Step {current} of {total}',
    stepLabel: {
      basicInfo: 'Details',
      divisions: 'Divisions',
      exercises: 'Exercises',
      review: 'Review'
    }
  }
}
```

**Training Division** (New Concept):
```typescript
trainingDivision: {
  heading: 'Training Divisions',
  add: 'Add Division',
  edit: 'Edit Division',
  delete: 'Delete Division',
  name: {
    label: 'Division Name',
    placeholder: 'e.g., Push Day, Upper Body',
    required: 'Division name is required',
    minLength: 'Division name must be at least 3 characters',
    maxLength: 'Division name must be less than 100 characters',
    duplicate: 'Division name already exists. Try "{suggestion}"'
  },
  frequency: {
    label: 'Frequency',
    placeholder: 'How many times per week?',
    required: 'Frequency is required',
    help: 'How many times per week will you train this division?',
    min: 'Frequency must be at least 1',
    max: 'Frequency must be at most 7',
    badge: {
      timesPerWeek: '{count}x/week',
      singular: '1x per week',
      plural: '{count}x per week'
    }
  },
  description: {
    label: 'Description (optional)',
    placeholder: 'e.g., Chest, shoulders, triceps',
    maxLength: 'Description must be less than 200 characters',
    help: 'Brief description of what this division focuses on'
  },
  exerciseCount: {
    singular: '1 exercise',
    plural: '{count} exercises',
    none: 'No exercises'
  },
  delete: {
    confirm: {
      title: 'Delete Division?',
      message: 'This division has {count} exercises. All exercises will be removed.',
      messageNoExercises: 'Are you sure you want to delete this division?',
      yes: 'Delete Division',
      no: 'Cancel'
    }
  }
}
```

**Exercise Configuration** (Enhanced):
```typescript
exerciseConfig: {
  title: '{exercise}',
  subtitle: 'Configure exercise details',
  sections: {
    target: 'Target Configuration',
    video: 'Form Video',
    history: 'Load History',
    notes: 'Notes'
  },
  sets: {
    label: 'Target Sets',
    placeholder: '3',
    required: 'Sets is required',
    min: 'Sets must be at least 1',
    max: 'Sets must be at most 10',
    help: 'Number of sets to perform'
  },
  reps: {
    label: 'Target Reps',
    placeholder: '8-12',
    required: 'Reps is required',
    maxLength: 'Reps must be less than 20 characters',
    help: 'Number of reps (e.g., 10, 8-12, AMRAP)',
    examples: 'Examples: 10, 8-12, AMRAP'
  },
  weight: {
    label: 'Target Weight (kg)',
    placeholder: '50',
    help: 'Leave blank or enter 0 for bodyweight exercises',
    min: 'Weight must be 0 or greater',
    max: 'Weight must be less than 500 kg',
    unit: 'kg',
    bodyweight: 'Bodyweight'
  },
  rest: {
    label: 'Rest Between Sets',
    placeholder: 'Select rest time',
    help: 'Rest time between sets',
    unit: 'seconds',
    noRest: 'No rest timer',
    quickSelect: {
      30: '30 seconds',
      60: '1 minute',
      90: '1.5 minutes',
      120: '2 minutes',
      180: '3 minutes',
      custom: 'Custom'
    }
  },
  videoUrl: {
    label: 'Video URL (optional)',
    placeholder: 'https://youtube.com/watch?v=...',
    help: 'Paste a YouTube URL to add a form demonstration video',
    invalid: 'Please enter a valid YouTube URL',
    unavailable: 'Video unavailable. URL saved but may not play.',
    preview: 'Video Preview',
    play: 'Play Video',
    remove: 'Remove Video'
  },
  notes: {
    label: 'Notes (optional)',
    placeholder: 'Add coaching cues, form tips, or personal insights...',
    help: 'Notes will be visible during your workout',
    maxLength: 'Notes must be less than 500 characters',
    characterCount: '{count}/{max} characters',
    expand: 'Add Notes',
    collapse: 'Hide Notes'
  },
  save: 'Save Exercise',
  cancel: 'Cancel',
  saveSuccess: 'Exercise saved successfully',
  saveError: 'Failed to save exercise'
}
```

**Load History** (New Feature):
```typescript
loadHistory: {
  heading: 'Load History',
  subheading: 'Previous workouts for this exercise',
  empty: 'No previous workouts recorded for this exercise.',
  table: {
    headers: {
      date: 'Date',
      setsReps: 'Sets × Reps',
      weight: 'Weight',
      volume: 'Volume'
    },
    row: {
      setsReps: '{sets} × {reps}',
      weight: '{weight}kg',
      volume: '{volume}kg',
      indicator: {
        improving: 'Improving',
        maintaining: 'Maintaining',
        regressing: 'Lower than last'
      }
    }
  },
  fullHistory: {
    title: 'Full History - {exercise}',
    summary: {
      heading: 'Summary Stats',
      maxWeight: 'Max Weight: {weight}kg ({date})',
      maxReps: 'Max Reps: {reps} @ {weight}kg ({date})',
      maxVolume: 'Max Volume: {volume}kg ({date})',
      totalWorkouts: 'Total Workouts: {count}',
      prBadge: 'PR'
    },
    chart: {
      title: 'Weight Over Time',
      xAxis: 'Date',
      yAxis: 'Weight (kg)'
    },
    filters: {
      dateRange: 'Date Range',
      last7Days: 'Last 7 days',
      last30Days: 'Last 30 days',
      last3Months: 'Last 3 months',
      allTime: 'All time'
    },
    sort: {
      label: 'Sort by',
      dateNewest: 'Date (newest)',
      dateOldest: 'Date (oldest)',
      weightHighest: 'Weight (highest)',
      weightLowest: 'Weight (lowest)',
      volumeHighest: 'Volume (highest)',
      volumeLowest: 'Volume (lowest)'
    },
    close: 'Close'
  },
  viewFull: 'View Full History'
}
```

**Video Player** (New Feature):
```typescript
videoPlayer: {
  title: '{exercise} - Form Demonstration',
  loading: 'Loading video...',
  error: {
    unavailable: 'This video is unavailable.',
    explanation: 'It may have been deleted or set to private.',
    viewOnYoutube: 'View on YouTube'
  },
  close: 'Close Video',
  controls: {
    play: 'Play',
    pause: 'Pause',
    mute: 'Mute',
    unmute: 'Unmute',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen'
  }
}
```

**Progressive Overload** (New Feature):
```typescript
progressiveOverload: {
  indicators: {
    improving: {
      label: 'Improving',
      description: 'Volume increased by {percent}%',
      icon: '↑'
    },
    maintaining: {
      label: 'Maintaining',
      description: 'Volume similar to last workout',
      icon: '→'
    },
    regressing: {
      label: 'Lower',
      description: 'Volume decreased by {percent}%',
      icon: '↓'
    }
  },
  comparison: {
    heading: 'Last Workout ({date})',
    sets: '{sets} sets',
    reps: '{reps} reps',
    weight: '{weight}kg',
    volume: 'Volume: {volume}kg',
    attemptingPr: 'You\'re going for a new personal record! 🏆',
    attemptingIncrease: 'You\'re attempting +{increase}kg from last time. Progressive overload! ↑',
    maintaining: 'Same weight as last time. Try for more reps! →',
    decreasing: 'Lower weight than last time. Deload or recovery day? ↓'
  }
}
```

**Confirmation Dialogs** (Enhanced):
```typescript
confirmations: {
  deleteRoutine: {
    title: 'Delete Routine?',
    messageWithHistory: 'This routine has workout history. It will be archived instead of deleted to preserve your data.',
    messageWithoutHistory: 'This routine will be permanently deleted. This action cannot be undone.',
    confirm: 'Archive Routine',
    confirmDelete: 'Delete Routine',
    cancel: 'Cancel'
  },
  deleteDivision: {
    title: 'Delete Division?',
    messageWithExercises: 'This division has {count} exercises. All exercises will be removed from the routine.',
    messageWithoutExercises: 'Are you sure you want to delete this division?',
    confirm: 'Delete Division',
    cancel: 'Cancel'
  },
  deleteExercise: {
    title: 'Remove Exercise?',
    message: 'Are you sure you want to remove {exercise} from this division?',
    confirm: 'Remove Exercise',
    cancel: 'Cancel'
  }
}
```

**Toasts/Notifications**:
```typescript
notifications: {
  success: {
    routineSaved: 'Routine saved successfully',
    routineDeleted: 'Routine deleted',
    routineArchived: 'Routine archived',
    routineActivated: '{name} is now your active routine',
    divisionAdded: 'Division added',
    divisionDeleted: 'Division deleted',
    exerciseAdded: '{exercise} added to {division}',
    exerciseRemoved: '{exercise} removed',
    prAchieved: 'New Personal Record! 🏆'
  },
  error: {
    routineSaveFailed: 'Failed to save routine',
    routineDeleteFailed: 'Failed to delete routine',
    routineLoadFailed: 'Failed to load routine',
    divisionSaveFailed: 'Failed to save division',
    exerciseSaveFailed: 'Failed to save exercise',
    historyLoadFailed: 'Failed to load workout history',
    videoLoadFailed: 'Failed to load video',
    networkError: 'Network error. Please check your connection.',
    genericError: 'Something went wrong. Please try again.'
  }
}
```

### Tone and Voice

**Overall Tone**: Encouraging, supportive, clear

**Voice Characteristics**:
- **Active Voice**: "Add a division" (not "A division can be added")
- **Second Person**: "Your routines" (not "The user's routines")
- **Concise**: Short sentences, clear actions
- **Encouraging**: "You're going for a new PR!" (not "PR attempt detected")
- **Helpful**: "Leave blank for bodyweight exercises" (not "Optional")

**Examples**:
- ✅ Good: "Add your first division to get started"
- ❌ Bad: "No divisions have been added yet"
- ✅ Good: "You're improving! Volume increased by 10%"
- ❌ Bad: "Volume increase detected: 10%"

---

## 13. Implementation Checklist

### Phase 1: Foundation (Week 1)

**Database & Domain Layer**:
- [ ] Migrate `RoutineDay` to `TrainingDivision` (schema changes)
- [ ] Add `frequency`, `description` fields to divisions
- [ ] Add `videoId` field to `RoutineExercise`
- [ ] Add database constraints (frequency 1-7, unique division names)
- [ ] Create migration script for existing routines
- [ ] Test migration on staging database

**Text Maps**:
- [ ] Extend `routines.text-map.ts` with new keys
- [ ] Add wizard step text
- [ ] Add division configuration text
- [ ] Add exercise configuration text (enhanced)
- [ ] Add load history text
- [ ] Add video player text
- [ ] Add notification text

**Repository Layer**:
- [ ] Create `getDivisionsByRoutineId()` function
- [ ] Create `createDivision()` function
- [ ] Create `updateDivision()` function
- [ ] Create `deleteDivision()` function
- [ ] Create `getExerciseHistory()` function (query `WorkoutSet`)
- [ ] Add tests for repository functions

### Phase 2: Core Components (Week 2)

**Reusable UI Components** (Molecules):
- [ ] Create `FrequencySelector` component
- [ ] Create `ProgressStepper` component
- [ ] Create `FrequencyBadge` component
- [ ] Enhance `EmptyState` component (if needed)
- [ ] Create `ConfirmationDialog` wrapper (using shadcn AlertDialog)

**Domain Components** (Routines):
- [ ] Create `DivisionEditor` component
- [ ] Create `DivisionCard` component (display)
- [ ] Enhance `ExerciseCard` component (add video thumbnail, notes preview)
- [ ] Create `ExerciseConfigurationPanel` component
- [ ] Enhance `ExerciseSelector` component (fuzzy search, exclude added)

**Video Components**:
- [ ] Create `VideoUrlInput` component (validation, preview)
- [ ] Create `VideoThumbnail` component
- [ ] Create `VideoPlayerModal` component (YouTube iframe)
- [ ] Add error handling for video load failures

### Phase 3: Load History (Week 2-3)

**Data Fetching**:
- [ ] Create `useExerciseHistory()` React Query hook
- [ ] Query `WorkoutSet` filtered by exerciseId + userId
- [ ] Calculate volume, PRs, indicators
- [ ] Add caching strategy (staleTime: 5 minutes)

**Load History Components**:
- [ ] Create `LoadHistoryDisplay` component (compact table)
- [ ] Create `LoadHistoryFullView` component (modal/sheet)
- [ ] Create `ProgressiveOverloadIndicator` component (arrows)
- [ ] Create `PRBadge` component (trophy icon)
- [ ] Add simple line chart (weight over time) using charting library

**Progressive Overload**:
- [ ] Calculate volume comparison (current vs previous)
- [ ] Show indicator (↑/→/↓) based on comparison
- [ ] Show contextual feedback messages
- [ ] Highlight PR attempts during workout

### Phase 4: Routine Editor Redesign (Week 3-4)

**Multi-Step Wizard**:
- [ ] Create `RoutineEditorWizard` component
- [ ] Create `StepBasicInfo` component
- [ ] Create `StepDivisions` component
- [ ] Create `StepExercises` component
- [ ] Create `StepReview` component
- [ ] Add step navigation (Next/Back buttons)
- [ ] Add progress indicator
- [ ] Add form validation per step

**Single-Page Editor** (Edit Mode):
- [ ] Redesign `RoutineEditorForm` component (accordion layout)
- [ ] Add inline division editing
- [ ] Add inline exercise configuration
- [ ] Add drag-and-drop reordering (@dnd-kit or react-beautiful-dnd)
- [ ] Add auto-save functionality (debounced)

**Form Handling**:
- [ ] Set up React Hook Form with Zod validation
- [ ] Create `divisionSchema`, `exerciseConfigSchema`
- [ ] Add inline error display
- [ ] Add optimistic UI updates (React Query mutations)

### Phase 5: Pages & Integration (Week 4)

**Pages**:
- [ ] Enhance `/routines/page.tsx` (add filters, search, sort)
- [ ] Create `/routines/new/page.tsx` (wizard flow)
- [ ] Create `/routines/[id]/page.tsx` (detail view)
- [ ] Create `/routines/[id]/edit/page.tsx` (editor)

**Navigation**:
- [ ] Update sidebar navigation (if needed)
- [ ] Add breadcrumbs for deep pages
- [ ] Add back button handling

**Server Actions**:
- [ ] Create `createRoutineWithDivisions()` action
- [ ] Create `updateRoutineWithDivisions()` action
- [ ] Create `deleteDivision()` action
- [ ] Create `addExerciseToDivision()` action
- [ ] Add session validation to all actions
- [ ] Add error handling and logging

### Phase 6: Responsive & Accessibility (Week 4-5)

**Responsive Design**:
- [ ] Test mobile layouts (< 640px)
- [ ] Test tablet layouts (640px - 1024px)
- [ ] Test desktop layouts (> 1024px)
- [ ] Optimize touch targets (44px minimum)
- [ ] Implement bottom sheets for mobile modals
- [ ] Test drag-and-drop on touch devices

**Accessibility**:
- [ ] Add ARIA labels to all interactive elements
- [ ] Add ARIA live regions for dynamic content
- [ ] Test keyboard navigation (Tab, Enter, Esc, Arrow keys)
- [ ] Add focus management (modal open/close)
- [ ] Test screen reader compatibility (NVDA, VoiceOver)
- [ ] Verify color contrast (WCAG AA minimum)
- [ ] Add skip to main content link
- [ ] Test with `prefers-reduced-motion`

**Accessibility Audit**:
- [ ] Run axe DevTools (0 critical violations)
- [ ] Run Lighthouse (Accessibility score > 90)
- [ ] Manual keyboard navigation test
- [ ] Manual screen reader test

### Phase 7: Testing & Polish (Week 5)

**Unit Tests**:
- [ ] Test repository functions
- [ ] Test React Query hooks
- [ ] Test form validation schemas
- [ ] Test utility functions (volume calculation, PR detection)

**Component Tests** (Testing Library):
- [ ] Test `FrequencySelector` interactions
- [ ] Test `DivisionEditor` form validation
- [ ] Test `ExerciseConfigurationPanel` form submission
- [ ] Test `LoadHistoryDisplay` data display
- [ ] Test `VideoPlayerModal` error states

**Integration Tests**:
- [ ] Test routine creation flow (wizard)
- [ ] Test routine editing flow
- [ ] Test division reordering (drag-and-drop)
- [ ] Test exercise configuration save
- [ ] Test load history query

**Performance**:
- [ ] Lighthouse performance score > 80
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] Optimize images (video thumbnails)
- [ ] Lazy load video iframes
- [ ] Code splitting for large components

**Polish**:
- [ ] Add loading skeletons for all async operations
- [ ] Add error boundaries for graceful error handling
- [ ] Add optimistic UI updates for all mutations
- [ ] Add confirmation dialogs for destructive actions
- [ ] Add toast notifications for success/error feedback
- [ ] Add empty states for all lists
- [ ] Smooth transitions and animations
- [ ] Consistent spacing and typography

### Phase 8: Documentation & Handoff (Week 5)

**Documentation**:
- [ ] Document component props (JSDoc)
- [ ] Document Server Actions (JSDoc)
- [ ] Document data flow (routine → divisions → exercises)
- [ ] Document state management strategy
- [ ] Create user guide (how to create routine)
- [ ] Create developer guide (how to extend)

**Handoff to Parent**:
- [ ] Provide implementation summary
- [ ] Provide list of files created/modified
- [ ] Provide testing checklist
- [ ] Provide deployment notes
- [ ] Provide known issues (if any)

---

## 14. Important Notes

### User Testing Recommended

**High-Impact Features**:
- [ ] Frequency concept clarity (do users understand "3x per week"?)
- [ ] Routine creation wizard flow (is it intuitive?)
- [ ] Load history display (is it helpful?)
- [ ] Video integration UX (do users find videos easily?)

**Testing Method**:
- Recruit 5-10 users from target audience
- Task-based usability testing (create routine, add video, view history)
- Think-aloud protocol (users narrate their actions)
- Post-task survey (SUS - System Usability Scale)

**Success Metrics**:
- 80% task completion rate
- < 5 minutes to create first routine
- 4+ out of 5 satisfaction rating

### Accessibility is Mandatory

**WCAG 2.1 AA Compliance**: Not a nice-to-have, it's a requirement
- All interactive elements keyboard accessible
- All images/icons have alt text or ARIA labels
- Color contrast meets minimum ratios
- Screen reader compatible
- Focus indicators visible
- No reliance on color alone for information

**Testing**: Include accessibility checks in CI/CD pipeline (axe-core)

### Mobile-First Philosophy

**Design for Mobile, Enhance for Desktop**:
- Start with mobile layout (320px width)
- Test on real devices (not just browser DevTools)
- Touch targets 44px minimum
- Gestures feel natural (swipe, long-press)
- Bottom sheets instead of modals
- Sticky headers/footers for key actions

**Performance**: Mobile users may have slower connections
- Optimize images (WebP, lazy loading)
- Minimize JavaScript bundle size
- Use skeleton loading (not spinners)
- Defer non-critical resources

### Content Before Chrome

**Prioritize Content Over Decoration**:
- Focus on user's goals (create routine, track progress)
- Remove unnecessary UI elements (fewer borders, shadows)
- Use whitespace effectively (breathing room)
- Avoid "design for design's sake" (every element serves a purpose)

**Content-First Approach**:
- Write content first, design around it
- Test with real data (not Lorem Ipsum)
- Ensure readability (line length, line height, font size)

### Consistency is Key

**Reference Existing Patterns First**:
- Use existing components (shadcn/ui, project molecules)
- Follow established text map patterns
- Match existing color schemes (primary, secondary, destructive)
- Maintain consistent spacing scale (4px, 8px, 16px, 24px)
- Use consistent terminology ("division" not "day")

**Component Reuse**:
- If a component exists, use it (don't create duplicate)
- If a component is similar, enhance it (don't create variant)
- If a component is missing, create it (and document for future use)

### Iterate, Don't Perfect

**MVP First, Enhancements Later**:
- Get core functionality working first (create routine, add exercises)
- Add polish later (animations, advanced filters)
- Gather user feedback early and often
- Be prepared to change based on feedback

**Design is Never Done**:
- Plan for iteration (don't over-engineer)
- Collect analytics (which features are used?)
- Monitor support requests (what's confusing?)
- Evolve design based on data

---

## 15. Success Metrics

### Usability

**Metric**: Task completion rate for "Create routine with divisions"
- **Target**: 80% success rate
- **Measurement**: User testing (5-10 users)

**Metric**: Time to create first routine
- **Target**: < 5 minutes (median)
- **Measurement**: User testing + analytics (track time from /routines/new to save)

**Metric**: Error rate (form validation errors per session)
- **Target**: < 2 errors per routine creation
- **Measurement**: Analytics (track validation error events)

### Efficiency

**Metric**: Routine creation task completion time
- **Target**: < 3 minutes for experienced users
- **Measurement**: Analytics (time from start to save)

**Metric**: Number of steps to create routine
- **Target**: 4 steps (Basic Info → Divisions → Exercises → Review)
- **Measurement**: Design spec (no measurement needed)

### Satisfaction

**Metric**: User satisfaction rating (post-creation survey)
- **Target**: 4.0+ out of 5 stars
- **Measurement**: In-app survey after first routine creation

**Metric**: Feature adoption rate (% of users who add videos)
- **Target**: 40% of exercises have video within 60 days
- **Measurement**: Database query (COUNT exercises with videoId)

**Metric**: Load history views per week
- **Target**: 50% of active users view history weekly
- **Measurement**: Analytics (track "view history" events)

### Accessibility

**Metric**: Keyboard-only task completion rate
- **Target**: 100% of tasks completable without mouse
- **Measurement**: Manual testing (keyboard navigation only)

**Metric**: Screen reader task completion rate
- **Target**: 100% of tasks completable with screen reader
- **Measurement**: Manual testing (NVDA/VoiceOver)

**Metric**: Automated accessibility violations
- **Target**: 0 critical violations (axe-core)
- **Measurement**: Automated testing in CI/CD

### Performance

**Metric**: Page load time (P95)
- **Target**: < 2 seconds on 4G connection
- **Measurement**: Lighthouse performance score, Real User Monitoring (RUM)

**Metric**: Time to Interactive (TTI)
- **Target**: < 3 seconds
- **Measurement**: Lighthouse performance score

**Metric**: Largest Contentful Paint (LCP)
- **Target**: < 2.5 seconds
- **Measurement**: Lighthouse performance score

---

## Next Steps for Parent Agent

This UX/UI architecture plan is now complete and ready for implementation. The parent agent should:

1. **Review this UX plan** to validate design decisions and user flows
2. **Coordinate with shadcn-builder agent** to provide component specifications:
   - Which shadcn/ui components are needed
   - Custom component requirements (FrequencySelector, LoadHistoryDisplay, etc.)
   - Props and state management for each component
3. **Coordinate with domain-architect** to ensure data structures support UX needs:
   - Division frequency logic
   - Exercise history queries
   - PR calculation logic
4. **Execute implementation** following the checklist above (Phase 1 through Phase 8)
5. **Conduct user testing** with prototype or beta version before full rollout

**Critical Collaboration Points**:
- **shadcn-builder**: Provide component specs from Section 4 (Component Architecture)
- **domain-architect**: Validate data model supports frequency concept, video storage, history queries
- **Parent**: Implement step-by-step, test continuously, gather feedback early

**Implementation Priority**:
1. Foundation: Database migration, text maps, repository layer
2. Core Components: FrequencySelector, DivisionEditor, ExerciseConfigurationPanel
3. Load History: Query logic, display components, progressive overload indicators
4. Routine Editor: Wizard flow for creation, accordion layout for editing
5. Polish: Responsive design, accessibility, testing, documentation

**Estimated Timeline**: 5 weeks (following checklist above)

**Files Impacted**:
- **Pages**: 4 files (list, new, detail, edit)
- **Components**: 15+ new domain components
- **Molecules**: 5+ new reusable components
- **Text Maps**: 1 extended file (`routines.text-map.ts`)
- **Repository**: 1 enhanced file (`routines/repository.ts`)
- **Schema**: 1 enhanced file (`routines/schema.ts`)
- **Actions**: 1 enhanced file (`routines/actions.ts`)
- **Hooks**: 2+ new React Query hooks

---

**Design Philosophy Reminder**:

- **Empathy**: Understand user needs (flexibility, progress tracking, form reference)
- **Simplicity**: Remove complexity (frequency is simpler than fixed days)
- **Consistency**: Follow established patterns (shadcn/ui, text maps, architecture)
- **Feedback**: Users never wonder what's happening (loading, success, error states)
- **Accessibility**: Design for everyone (keyboard, screen reader, color blind)
- **Iteration**: Design evolves based on feedback (start MVP, enhance later)

---

## Appendix: Wireframe Text Descriptions

### A1: Routines List Page (Mobile)

```
┌───────────────────────────────────────┐
│ ☰  My Routines           [+ Create]  │ ← Sticky Header
├───────────────────────────────────────┤
│                                       │
│ [All] [Active] [Archived]            │ ← Filter Tabs
│                                       │
│ ┌───────────────────────────────────┐│
│ │ Push Pull Legs          [⋮]      ││ ← Routine Card
│ │ ┌───────┐                        ││
│ │ │Active │                        ││
│ │ └───────┘                        ││
│ │                                  ││
│ │ 3 divisions • 15 exercises      ││
│ │                                  ││
│ │ [View]          [Edit]          ││
│ └──────────────────────────────────┘│
│                                       │
│ ┌───────────────────────────────────┐│
│ │ Upper Lower                       ││
│ │                                  ││
│ │ 2 divisions • 10 exercises      ││
│ │                                  ││
│ │ [View]          [Edit]          ││
│ └──────────────────────────────────┘│
│                                       │
└───────────────────────────────────────┘
```

### A2: Routine Editor Wizard - Step 1 (Mobile)

```
┌───────────────────────────────────────┐
│ ←  Routine Details          [Cancel] │ ← Sticky Header
├───────────────────────────────────────┤
│                                       │
│ [●───○───○───○]                      │ ← Progress Stepper
│ Details  Divisions  Exercises  Review│
│                                       │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │ Give your routine a name        │ │
│ │                                 │ │
│ │ Routine Name                    │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ Push Pull Legs              │ │ │
│ │ └─────────────────────────────┘ │ │
│ │                                 │ │
│ │ e.g., Push Pull Legs            │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                       │
└───────────────────────────────────────┘
│ [Next: Add Divisions]                │ ← Sticky Footer
└───────────────────────────────────────┘
```

### A3: Routine Editor Wizard - Step 2 (Mobile)

```
┌───────────────────────────────────────┐
│ ←  Training Divisions       [Cancel] │
├───────────────────────────────────────┤
│                                       │
│ [●───●───○───○]                      │
│ Details  Divisions  Exercises  Review│
│                                       │
│ Add training divisions                │
│ Organize your routine into training  │
│ divisions (e.g., Push, Pull, Legs)   │
│                                       │
│ ┌───────────────────────────────────┐│
│ │ Push Day              [🗑️]        ││ ← Division Card
│ │                                   ││
│ │ Division Name                     ││
│ │ ┌───────────────────────────────┐ ││
│ │ │ Push                          │ ││
│ │ └───────────────────────────────┘ ││
│ │                                   ││
│ │ Frequency                         ││
│ │ [1][2][3][4][5][6][7]            ││ ← Frequency Selector
│ │                                   ││
│ │ Description (optional)            ││
│ │ ┌───────────────────────────────┐ ││
│ │ │ Chest, shoulders, triceps     │ ││
│ │ └───────────────────────────────┘ ││
│ └───────────────────────────────────┘│
│                                       │
│ [+ Add Division]                      │
│                                       │
└───────────────────────────────────────┘
│ [Back]          [Next: Add Exercises]│
└───────────────────────────────────────┘
```

### A4: Exercise Configuration Panel (Mobile Bottom Sheet)

```
┌───────────────────────────────────────┐
│ ─────                                 │ ← Drag Handle
│ Bench Press                           │
│                                  [✕]  │
├───────────────────────────────────────┤
│                                       │
│ ▼ Target Configuration                │ ← Collapsible Section
│                                       │
│ Target Sets                           │
│ ┌─────────────────────┐  [−]  [+]    │
│ │ 3                   │              │
│ └─────────────────────┘              │
│                                       │
│ Target Reps                           │
│ ┌─────────────────────────────────┐  │
│ │ 8-12                            │  │
│ └─────────────────────────────────┘  │
│ Examples: 10, 8-12, AMRAP            │
│                                       │
│ Target Weight (kg)                    │
│ ┌─────────────────────┐  [−]  [+]    │
│ │ 50                  │              │
│ └─────────────────────┘              │
│ Leave blank for bodyweight           │
│                                       │
│ Rest Between Sets                     │
│ [30s] [60s] [90s] [120s] [180s]      │
│                                       │
│ ─────────────────────────────────── │
│                                       │
│ ▶ Form Video                          │ ← Collapsed
│                                       │
│ ─────────────────────────────────── │
│                                       │
│ ▶ Load History                        │ ← Collapsed
│                                       │
│ ─────────────────────────────────── │
│                                       │
│ ▶ Notes                               │ ← Collapsed
│                                       │
└───────────────────────────────────────┘
│ [Save Exercise]                       │
└───────────────────────────────────────┘
```

### A5: Load History Full View (Mobile Sheet)

```
┌───────────────────────────────────────┐
│ ─────                                 │
│ Bench Press - Full History       [✕] │
├───────────────────────────────────────┤
│                                       │
│ ┌─ Summary Stats ────────────────┐   │
│ │ Max Weight: 50kg (Nov 3) 🏆    │   │
│ │ Max Reps: 12 @ 45kg (Oct 27)   │   │
│ │ Max Volume: 1620kg (Oct 27) 🏆 │   │
│ │ Total Workouts: 24             │   │
│ └─────────────────────────────────┘   │
│                                       │
│ ┌─ Weight Over Time ─────────────┐   │
│ │      Weight (kg)                │   │
│ │  50 ┤        ●                  │   │
│ │  48 ┤      ●   ●                │   │
│ │  46 ┤    ●                      │   │
│ │  44 ┤  ●                        │   │
│ │  42 ┤●                          │   │
│ │     └────────────────────────  │   │
│ │     Oct  Oct  Oct  Nov         │   │
│ └─────────────────────────────────┘   │
│                                       │
│ [Last 30 days ▼]  [Date (newest) ▼]  │
│                                       │
│ Nov 3, 2025                           │
│ 3 × 10 @ 50kg                     ↑  │
│ Volume: 1500kg                        │
│                                       │
│ Oct 30                                │
│ 3 × 10 @ 47.5kg                   ↑  │
│ Volume: 1425kg                        │
│                                       │
│ Oct 27                                │
│ 3 × 12 @ 45kg                     →  │
│ Volume: 1620kg                        │
│                                       │
│ (scrollable...)                       │
│                                       │
└───────────────────────────────────────┘
```

### A6: Video Player Modal (Desktop)

```
┌─────────────────────────────────────────────┐
│                                         [✕] │
│                                             │
│ Bench Press - Form Demonstration           │
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │                                         ││
│ │                                         ││
│ │          YouTube Video Player           ││
│ │                                         ││
│ │                                         ││
│ │                                         ││
│ │          [▶️ Play / ⏸️ Pause]           ││
│ │                                         ││
│ └─────────────────────────────────────────┘│
│                                             │
└─────────────────────────────────────────────┘
```

---

**End of UI/UX Architecture Plan**
