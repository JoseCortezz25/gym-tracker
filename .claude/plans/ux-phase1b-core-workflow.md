# Phase 1B Core Workflow - UX/UI Design Plan

**Created**: 2025-11-04
**Session**: phase1-ui-20251103
**Complexity**: High
**User Impact**: Critical

## 1. User Context

### Primary User Personas

**The Gym Regular**
- **Context**: In the gym, phone in hand, between sets, potentially sweaty fingers
- **Goals**: Log sets quickly, track progress, minimal friction
- **Pain Points**: Slow interfaces, too many taps, losing data, tiny buttons
- **Environment**: Noisy gym, distractions, time pressure between sets

**The Routine Planner**
- **Context**: At home, planning next week's workouts
- **Goals**: Create structured routines, organize exercises, set targets
- **Pain Points**: Complex interfaces, can't find exercises, hard to reorder

**The Progress Tracker**
- **Context**: Post-workout, reviewing performance
- **Goals**: See improvements, stay motivated, understand patterns
- **Pain Points**: Can't find history, unclear stats, no visual feedback

### User Journey Map

**Primary Journey: Complete a Workout Session**

```
[Dashboard]
   ↓ User sees "Train Today" CTA
[Tap "Start Workout"]
   ↓ System navigates to active workout
[Active Workout Session]
   ↓ For each exercise:
   ├─ View target (sets/reps/weight)
   ├─ Input actual performance
   ├─ Tap "Complete Set" (3-5 times)
   └─ Move to next exercise
[Workout Complete Screen]
   ↓ Rate session, add notes
[Tap "Finish Workout"]
   ↓ System saves session
[Dashboard with updated stats]
```

**Secondary Journey: Create New Routine**

```
[Dashboard] → [Routines]
   ↓ Tap "Create Routine"
[Routine Editor]
   ↓ Enter routine name
   ↓ Add Day 1
[Day Editor]
   ↓ Add exercises (opens picker)
   ↓ Configure sets/reps/weight
   ↓ Save day
[Routine Editor]
   ↓ Add more days
   ↓ Save routine
[Routines List with new routine]
```

## 2. View 1: Dashboard (Home)

### User Goals
- **Primary**: Quick access to start today's workout
- **Secondary**: See my progress at a glance (streak, weekly count)
- **Tertiary**: Browse recent activity

### Success Criteria
- User can start workout in 2 taps from login
- Stats are immediately visible (no loading delay)
- Recent activity provides context without scrolling

### Information Hierarchy

1. **Primary (Hero Zone)**: Train Today CTA
2. **Secondary (Above Fold)**: Stats cards (streak, weekly workouts)
3. **Tertiary (Scrollable)**: Recent activity list
4. **Quaternary**: Quick action links

### Layout Architecture

#### Mobile (< 640px)
```
┌─────────────────────────────┐
│ ☰  Gym Tracker    [Profile] │ ← Header (sticky)
├─────────────────────────────┤
│                             │
│  ┌─────────────────────┐   │ ← Stats Grid (2 cols)
│  │ 🔥 5   │ 📊 3       │   │
│  │ Streak │ This Week  │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────────┐ ← Hero CTA (full width)
│  │   TRAIN TODAY           │
│  │   Push Day              │ ← Routine name
│  │   [Start Workout →]     │ ← Large button
│  └─────────────────────────┘
│                             │
│  Recent Activity            │ ← Section heading
│  ┌─────────────────────────┐
│  │ Yesterday               │ ← Session card
│  │ Pull Day • 45 min       │
│  │ 💪 8 exercises          │
│  └─────────────────────────┘
│  ┌─────────────────────────┐
│  │ 2 days ago              │
│  │ Leg Day • 60 min        │
│  │ 💪 10 exercises         │
│  └─────────────────────────┘
│                             │
│  Quick Links                │
│  • My Routines              │
│  • Exercise Library         │
│  • View All History         │
└─────────────────────────────┘
```

#### Tablet (640px - 1024px)
```
┌─────────────────────────────┐
│ ☰  Gym Tracker    [Profile] │
├─────────────────────────────┤
│  ┌───────┐ ┌───────┐ ┌───┐ │ ← Stats Grid (3 cols)
│  │ 🔥 5  │ │ 📊 3  │ │💪12│ │
│  │Streak │ │ Week  │ │Tot │ │
│  └───────┘ └───────┘ └───┘ │
│                             │
│  ┌─────────────────────────┐ ← Hero CTA (centered)
│  │    TRAIN TODAY          │
│  │    Push Day             │
│  │    [Start Workout →]    │
│  └─────────────────────────┘
│                             │
│  Recent Activity            │
│  ┌─────────┐ ┌─────────┐  │ ← 2-col grid
│  │Yesterday│ │2 days   │  │
│  │Pull Day │ │Leg Day  │  │
│  └─────────┘ └─────────┘  │
└─────────────────────────────┘
```

#### Desktop (> 1024px)
```
┌──────────────────────────────────────────┐
│ [Sidebar]    │    Main Content           │
│              │                           │
│ Dashboard    │  Welcome back, User!      │ ← Personalized greeting
│ Routines     │                           │
│ History      │  ┌────┐ ┌────┐ ┌────┐   │ ← Stats (horizontal)
│ Library      │  │🔥 5│ │📊 3│ │💪12│   │
│              │  │Day │ │Week│ │Tot │   │
│              │  └────┘ └────┘ └────┘   │
│              │  Streak  This   Total    │
│              │         Week  Workouts   │
│              │                           │
│              │  ┌───────────────────┐   │ ← Hero CTA
│              │  │  TRAIN TODAY      │   │
│              │  │  Push Day         │   │
│              │  │  6 exercises      │   │
│              │  │  [Start Workout →]│   │
│              │  └───────────────────┘   │
│              │                           │
│              │  Recent Activity          │
│              │  ┌───────┐ ┌───────┐    │
│              │  │  ...  │ │  ...  │    │
│              │  └───────┘ └───────┘    │
└──────────────────────────────────────────┘
```

### Component Hierarchy (Atomic Design)

```
📄 dashboard-page (page)
  └─ 🧬 dashboard-organism (domains/workouts/organisms/)
      ├─ 🧬 app-header (components/organisms/)
      │   ├─ 🔬 logo (components/atoms/)
      │   ├─ 🔬 hamburger-button (components/atoms/)
      │   └─ 🔬 avatar (ui/avatar)
      │
      ├─ 🧪 stats-summary (domains/workouts/molecules/)
      │   ├─ 🧪 stat-card (components/molecules/)
      │   │   ├─ 🔬 icon (lucide-react)
      │   │   ├─ 🔬 stat-value (text)
      │   │   └─ 🔬 stat-label (text)
      │   └─ (repeated for each stat)
      │
      ├─ 🧪 train-today-card (domains/workouts/molecules/)
      │   ├─ 🔬 heading (text)
      │   ├─ 🔬 routine-name (text)
      │   ├─ 🔬 exercise-count (text)
      │   └─ 🔬 button (ui/button) - "Start Workout"
      │
      ├─ 🧪 recent-activity-section (domains/workouts/molecules/)
      │   ├─ 🔬 section-heading (text)
      │   └─ 🧪 session-list (domains/workouts/molecules/)
      │       └─ 🧪 session-card (domains/workouts/molecules/)
      │           ├─ 🔬 date-label (text)
      │           ├─ 🔬 routine-name (text)
      │           ├─ 🔬 duration (text with icon)
      │           └─ 🔬 exercise-count (text with icon)
      │
      └─ 🧪 quick-links (components/molecules/)
          ├─ 🔬 section-heading (text)
          └─ 🔬 link-list (ui links)
```

### Interaction Design

#### Primary Actions
1. **Start Workout Button**
   - **Type**: Primary CTA
   - **Location**: Center of viewport, hero card
   - **Size**: Large (min 48px height, full width on mobile)
   - **States**:
     - Default: Blue background, white text, shadow
     - Hover: Blue-700, shadow-lg
     - Active: Blue-800, shadow-sm
     - Disabled: Gray-300 (no active routine)
   - **Feedback**: Immediate navigation to `/workout/active`

#### Secondary Actions
2. **View Session** (on session card tap)
   - **Type**: Tertiary (card tap)
   - **Location**: Recent activity section
   - **Feedback**: Navigate to `/history/[id]`

3. **Quick Links**
   - **Type**: Text links
   - **Location**: Below recent activity
   - **Feedback**: Navigate to respective pages

#### Micro-interactions
- **Stat Cards**: Subtle hover scale (desktop only)
  ```css
  transform: scale(1.02);
  transition: transform 150ms ease;
  ```
- **Session Cards**: Hover shadow increase
- **Train Today Card**: Pulse animation if routine scheduled today
  ```css
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.95; }
  }
  animation: pulse 2s ease-in-out infinite;
  ```

### States & Feedback

#### Loading State
```tsx
<DashboardSkeleton>
  <StatsSkeleton /> {/* 3 shimmer cards */}
  <TrainTodaySkeleton /> {/* Large shimmer rectangle */}
  <RecentActivitySkeleton /> {/* 3 shimmer cards */}
</DashboardSkeleton>
```

#### Empty States

**No Active Routine**
```
┌─────────────────────────────┐
│   No Routine Active         │
│                             │
│   📋 Set up your first      │
│      workout routine        │
│                             │
│   [Create Routine]          │
└─────────────────────────────┘
```

**No Recent Activity**
```
┌─────────────────────────────┐
│   No Workouts Yet           │
│                             │
│   💪 Start your first       │
│      session to see         │
│      history here           │
│                             │
│   [Start Training]          │
└─────────────────────────────┘
```

#### Error State
```tsx
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Failed to Load Dashboard</AlertTitle>
  <AlertDescription>
    {errorMessage}
  </AlertDescription>
  <Button onClick={retry}>Retry</Button>
</Alert>
```

### Accessibility Design

#### Semantic Structure
```html
<main role="main" aria-label="Dashboard">
  <section aria-label="Workout Statistics">
    <h2 class="sr-only">Your Stats</h2>
    <!-- Stats cards -->
  </section>

  <section aria-label="Today's Workout">
    <h2>Train Today</h2>
    <!-- CTA card -->
  </section>

  <section aria-label="Recent Activity">
    <h2>Recent Activity</h2>
    <ul> <!-- Session list -->
      <li> <!-- Each session -->
    </ul>
  </section>
</main>
```

#### Keyboard Navigation
1. **Tab Order**: Header profile → Stats cards → Train Today button → Session cards → Quick links
2. **Enter Key**: Activates focused button/link
3. **Focus Indicators**: Visible ring (ring-2 ring-offset-2 ring-blue-500)

#### Screen Reader Experience
- **Stats**: "Current streak: 5 days", "This week: 3 workouts", "Total workouts: 12"
- **Train Today**: "Start workout: Push Day, 6 exercises"
- **Session Cards**: "Workout from yesterday: Pull Day, 45 minutes, 8 exercises"

### Responsive Strategy

| Breakpoint | Layout | Navigation | Stats Grid | Session Grid |
|------------|--------|------------|------------|--------------|
| **< 640px** | Single column | Hamburger sheet | 2 cols | 1 col (stacked) |
| **640px - 1024px** | Single column | Hamburger sheet | 3 cols | 2 cols |
| **> 1024px** | Sidebar + main | Fixed sidebar | 3 cols horizontal | 2 cols |

### Text Map Keys

**File**: `src/domains/workouts/workouts.text-map.ts`

```typescript
export const workoutsTextMap = {
  dashboard: {
    heading: 'Dashboard',
    welcome: 'Welcome back, {name}!',

    stats: {
      streak: {
        label: 'Day Streak',
        ariaLabel: 'Current streak: {count} days'
      },
      weeklyWorkouts: {
        label: 'This Week',
        ariaLabel: 'This week: {count} workouts'
      },
      totalWorkouts: {
        label: 'Total Workouts',
        ariaLabel: 'Total workouts: {count}'
      }
    },

    trainToday: {
      heading: 'Train Today',
      routineName: '{routineName}',
      exerciseCount: '{count} exercises',
      startButton: 'Start Workout',
      noRoutine: {
        heading: 'No Routine Active',
        message: 'Set up your first workout routine',
        action: 'Create Routine'
      }
    },

    recentActivity: {
      heading: 'Recent Activity',
      empty: {
        heading: 'No Workouts Yet',
        message: 'Start your first session to see history here',
        action: 'Start Training'
      },
      sessionCard: {
        date: '{date}',
        duration: '{duration} min',
        exercises: '{count} exercises',
        ariaLabel: 'Workout from {date}: {routine}, {duration} minutes, {exercises} exercises'
      }
    },

    quickLinks: {
      heading: 'Quick Links',
      routines: 'My Routines',
      library: 'Exercise Library',
      history: 'View All History'
    }
  }
}
```

---

## 3. View 2: Routines List Page

### User Goals
- **Primary**: View all my workout routines
- **Secondary**: Create new routine quickly
- **Tertiary**: Activate/edit existing routines

### Success Criteria
- All routines visible at a glance
- Active routine clearly distinguished
- Create button always accessible
- Actions (Edit, Activate, Delete) easily discoverable

### Information Hierarchy

1. **Primary**: Page heading + Create button
2. **Secondary**: Active routine card (if exists)
3. **Tertiary**: Other routine cards
4. **Quaternary**: Empty state (if no routines)

### Layout Architecture

#### Mobile (< 640px)
```
┌─────────────────────────────┐
│ ☰  My Routines              │ ← Header
├─────────────────────────────┤
│                             │
│  ┌───────────────────────┐ │
│  │  + Create Routine     │ │ ← Primary action (sticky)
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │ ⭐ ACTIVE              │ │ ← Badge
│  │ Push-Pull-Legs        │ │
│  │ 6 days • 42 exercises │ │
│  │                       │ │
│  │ [View] [Edit] [•••]  │ │ ← Action buttons
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │ Full Body Split       │ │
│  │ 3 days • 18 exercises │ │
│  │                       │ │
│  │ [Activate] [Edit][•••]│ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │ Upper/Lower           │ │
│  │ 4 days • 24 exercises │ │
│  │                       │ │
│  │ [Activate] [Edit][•••]│ │
│  └───────────────────────┘ │
└─────────────────────────────┘

// Empty State:
┌─────────────────────────────┐
│  ┌───────────────────────┐ │
│  │  + Create Routine     │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │   📋                  │ │
│  │   No Routines Yet     │ │
│  │                       │ │
│  │   Create your first   │ │
│  │   workout routine to  │ │
│  │   get started         │ │
│  │                       │ │
│  │  [Create Routine]     │ │
│  └───────────────────────┘ │
└─────────────────────────────┘
```

#### Tablet (640px - 1024px)
```
┌─────────────────────────────┐
│  My Routines                │
│                             │
│  [+ Create Routine]         │
│                             │
│  ┌─────────┐ ┌─────────┐  │ ← 2-column grid
│  │ ⭐      │ │         │  │
│  │ Push-   │ │ Full    │  │
│  │ Pull-   │ │ Body    │  │
│  │ Legs    │ │ Split   │  │
│  │         │ │         │  │
│  │[V][E][•]│ │[A][E][•]│  │
│  └─────────┘ └─────────┘  │
└─────────────────────────────┘
```

#### Desktop (> 1024px)
```
┌──────────────────────────────────────────┐
│ [Sidebar]    │    My Routines           │
│              │                           │
│ Dashboard    │  [+ Create Routine]      │
│ Routines     │                           │
│ History      │  ┌──────┐ ┌──────┐ ┌────┐│ ← 3-col grid
│ Library      │  │ ⭐   │ │      │ │    ││
│              │  │Push- │ │Full  │ │Up- ││
│              │  │Pull- │ │Body  │ │per/││
│              │  │Legs  │ │Split │ │Low ││
│              │  │      │ │      │ │    ││
│              │  │[V][E]│ │[A][E]│ │[A] ││
│              │  └──────┘ └──────┘ └────┘│
└──────────────────────────────────────────┘
```

### Component Hierarchy (Atomic Design)

```
📄 routines-page (page)
  └─ 🧬 routines-list-organism (domains/routines/organisms/)
      ├─ 🧪 page-header (components/molecules/)
      │   ├─ 🔬 heading (h1)
      │   └─ 🔬 button - Create (ui/button)
      │
      ├─ 🧪 routine-grid (domains/routines/molecules/)
      │   └─ 🧪 routine-card (domains/routines/molecules/)
      │       ├─ 🔬 badge - Active (ui/badge)
      │       ├─ 🔬 routine-name (h3)
      │       ├─ 🧪 routine-meta (domains/routines/atoms/)
      │       │   ├─ 🔬 days-count (text)
      │       │   └─ 🔬 exercises-count (text)
      │       └─ 🧪 action-group (domains/routines/molecules/)
      │           ├─ 🔬 button - View (ui/button)
      │           ├─ 🔬 button - Edit (ui/button)
      │           ├─ 🔬 button - Activate (ui/button)
      │           └─ 🔬 dropdown-menu - More (ui/dropdown-menu)
      │               ├─ Archive
      │               └─ Delete
      │
      └─ 🧪 empty-state (components/molecules/)
          ├─ 🔬 icon (lucide-react)
          ├─ 🔬 heading (text)
          ├─ 🔬 message (text)
          └─ 🔬 button - Create (ui/button)
```

### Interaction Design

#### Primary Actions
1. **Create Routine Button** (top of page)
   - **Type**: Primary
   - **Location**: Below page heading, sticky on scroll (mobile)
   - **Size**: Full width mobile, auto desktop
   - **Feedback**: Navigate to `/routines/new`

#### Secondary Actions (per routine card)
2. **View Button**
   - **Type**: Secondary/Ghost
   - **Feedback**: Navigate to `/routines/[id]`

3. **Edit Button**
   - **Type**: Secondary/Ghost
   - **Feedback**: Navigate to `/routines/[id]/edit`

4. **Activate Button** (inactive routines only)
   - **Type**: Secondary
   - **Feedback**:
     - Optimistic update: Badge appears immediately
     - Toast: "Push-Pull-Legs activated"
     - Previous active routine becomes inactive

#### Tertiary Actions (dropdown menu)
5. **Archive**
   - **Feedback**: Routine fades out, removed from list, toast confirmation

6. **Delete**
   - **Feedback**: Confirmation dialog appears
   - **Dialog**:
     - If routine has workout history → "Archive instead?" (prevent data loss)
     - If no history → "Delete permanently?"

#### Micro-interactions
- **Card Hover** (desktop): Subtle shadow increase, border highlight
  ```css
  transition: shadow 150ms, border-color 150ms;
  hover:shadow-lg hover:border-blue-300
  ```
- **Active Badge**: Pulse animation
  ```css
  @keyframes badge-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  ```
- **Activate Button**: Success animation (checkmark appears)

### States & Feedback

#### Loading State
```tsx
<RoutinesListSkeleton>
  <ButtonSkeleton /> {/* Create button */}
  <CardSkeleton /> {/* 3-6 routine card skeletons */}
</RoutinesListSkeleton>
```

#### Empty State
```tsx
<EmptyState
  icon={<FileText className="h-12 w-12" />}
  heading={workoutsTextMap.routines.empty.heading}
  message={workoutsTextMap.routines.empty.message}
  action={{
    label: workoutsTextMap.routines.empty.action,
    onClick: () => router.push('/routines/new')
  }}
/>
```

#### Delete Confirmation Dialog
```tsx
<Dialog>
  <DialogTitle>
    {hasHistory
      ? workoutsTextMap.routines.delete.archiveTitle
      : workoutsTextMap.routines.delete.deleteTitle}
  </DialogTitle>
  <DialogDescription>
    {hasHistory
      ? workoutsTextMap.routines.delete.archiveMessage
      : workoutsTextMap.routines.delete.deleteMessage}
  </DialogDescription>
  <DialogActions>
    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
    <Button variant="destructive" onClick={onConfirm}>
      {hasHistory ? 'Archive' : 'Delete'}
    </Button>
  </DialogActions>
</Dialog>
```

#### Success Toast (Activate)
```tsx
<Toast variant="success">
  <CheckCircle className="h-4 w-4" />
  <span>{routineName} activated</span>
</Toast>
```

### Accessibility Design

#### Semantic Structure
```html
<main role="main" aria-label="My Routines">
  <h1>My Routines</h1>

  <button aria-label="Create new routine">
    Create Routine
  </button>

  <section aria-label="Your workout routines">
    <ul role="list">
      <li>
        <article aria-label="Push-Pull-Legs routine, active, 6 days, 42 exercises">
          <!-- Routine card content -->
        </article>
      </li>
    </ul>
  </section>
</main>
```

#### Keyboard Navigation
1. **Tab Order**: Create button → Routine cards (focus on card container) → Action buttons within card → Dropdown menu
2. **Enter/Space**: Activates focused action
3. **Arrow Keys**: Navigate dropdown menu items

#### Screen Reader Experience
- **Active Routine**: "Push-Pull-Legs routine, currently active, 6 days, 42 exercises"
- **Inactive Routine**: "Full Body Split routine, 3 days, 18 exercises"
- **Actions**: "View routine", "Edit routine", "Activate routine", "More actions"
- **Dropdown**: "Archive routine", "Delete routine"

### Responsive Strategy

| Breakpoint | Grid Columns | Card Size | Actions Layout |
|------------|--------------|-----------|----------------|
| **< 640px** | 1 (stacked) | Full width | Horizontal row |
| **640px - 1024px** | 2 | Half width | Horizontal row |
| **> 1024px** | 3 | Third width | Horizontal row |

### Text Map Keys

**File**: `src/domains/routines/routines.text-map.ts`

```typescript
export const routinesTextMap = {
  routines: {
    heading: 'My Routines',
    create: 'Create Routine',

    active: {
      badge: 'Active'
    },

    card: {
      days: '{count} {count, plural, one {day} other {days}}',
      exercises: '{count} {count, plural, one {exercise} other {exercises}}',
      ariaLabel: '{name} routine, {active}, {days} days, {exercises} exercises'
    },

    actions: {
      view: 'View',
      edit: 'Edit',
      activate: 'Activate',
      more: 'More actions',
      archive: 'Archive',
      delete: 'Delete'
    },

    delete: {
      archiveTitle: 'Archive Routine?',
      archiveMessage: 'This routine has workout history. It will be archived instead of deleted to preserve your data.',
      deleteTitle: 'Delete Routine?',
      deleteMessage: 'This routine has no workout history. It will be permanently deleted.',
      confirmArchive: 'Archive',
      confirmDelete: 'Delete',
      cancel: 'Cancel'
    },

    toast: {
      activated: '{name} activated',
      archived: '{name} archived',
      deleted: '{name} deleted',
      error: 'Failed to {action} routine'
    },

    empty: {
      heading: 'No Routines Yet',
      message: 'Create your first workout routine to get started',
      action: 'Create Routine'
    }
  }
}
```

---

## 4. View 3: Active Workout Session Page

### User Goals
- **Primary**: Log sets/reps/weight FAST with minimal friction
- **Secondary**: Track progress through workout
- **Tertiary**: Complete workout and rate session

### Success Criteria
- Complete a set in under 5 seconds (3 taps max)
- No accidental data loss
- Clear visual feedback for every action
- One-handed operation possible

### Context & Constraints

**CRITICAL DESIGN CONSTRAINTS**:
1. User is in the gym, possibly sweaty fingers
2. Between sets, limited time (30-60 seconds)
3. May be fatigued, reduced cognitive capacity
4. Phone may be on gym floor or equipment
5. Needs to reference previous set quickly
6. Must prevent accidental exit

**Design Philosophy**:
- **Speed > Beauty**: Function over form
- **Large Targets**: Minimum 48x48px, prefer 56x56px
- **High Contrast**: Clear in bright gym lighting
- **Immediate Feedback**: No guessing if action worked
- **Auto-Save**: Never lose progress

### Information Hierarchy

1. **Critical (Always Visible)**: Current exercise, set number, input fields
2. **Important (Sticky Header)**: Timer, progress, exit button
3. **Contextual**: Target from routine, previous sets
4. **Optional**: Notes, rest timer

### Layout Architecture

#### Mobile (< 640px) - PRIMARY VIEWPORT
```
┌─────────────────────────────┐
│ ← Exit  Push Day      [✓]   │ ← Sticky header (56px)
│    ⏱ 00:15:32               │    Timer (large font)
├─────────────────────────────┤ ← Divider
│                             │
│  Exercise 1 of 6            │ ← Progress (18px font)
│  ━━━━━━━━━━━━━━━━━━━━━     │    Progress bar
│                             │
│  Bench Press                │ ← Exercise name (24px)
│  Target: 3×10 @ 60kg        │ ← Reference (subtle gray)
│                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━  │ ← Divider
│                             │
│  Set 1  ✓                   │ ← Completed (green)
│  60kg × 10 reps             │    (tap to edit)
│                             │
│  Set 2  (Current)           │ ← Active set (highlighted)
│  ┌───────────────────────┐ │
│  │  Weight (kg)          │ │
│  │  ┌─────────────────┐ │ │
│  │  │      60         │ │ │ ← Large number (32px)
│  │  └─────────────────┘ │ │
│  │  ┌────┐ [───] ┌────┐│ │
│  │  │ − │  60kg  │ + ││ │ ← +/- buttons (56px)
│  │  └────┘        └────┘│ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │  Reps                 │ │
│  │  ┌─────────────────┐ │ │
│  │  │      10         │ │ │
│  │  └─────────────────┘ │ │
│  │  ┌────┐ [───] ┌────┐│ │
│  │  │ − │  10    │ + ││ │
│  │  └────┘        └────┘│ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │   COMPLETE SET  ✓    │ │ ← Primary CTA (56px)
│  └───────────────────────┘ │    Full width, green
│                             │
│  ┌─────────┐ ┌───────────┐│
│  │Copy Set 1│ │  Add Set  ││ ← Helper buttons
│  └─────────┘ └───────────┘│
│                             │
│  Set 3                      │ ← Upcoming set
│  60kg × 10 (planned)        │    (subtle, collapsed)
│                             │
│  Notes (optional)           │ ← Collapsed by default
│  [Tap to add notes]         │
│                             │
│  ┌───────────────────────┐ │
│  │  NEXT EXERCISE  →     │ │ ← Secondary CTA
│  └───────────────────────┘ │    (appears after all sets)
└─────────────────────────────┘

// Workout Complete Screen:
┌─────────────────────────────┐
│  🎉 Workout Complete!       │
├─────────────────────────────┤
│                             │
│  ⏱ Duration: 45:32          │
│  💪 Exercises: 6            │
│  📊 Total Volume: 3,450 kg  │
│  🔥 New PR: Bench Press!    │ ← Celebratory message
│                             │
│  Rate your session:         │
│  ┌───────────────────────┐ │
│  │  ⭐ ⭐ ⭐ ⭐ ⭐       │ │ ← Large stars (48px)
│  └───────────────────────┘ │
│                             │
│  Session notes (optional)   │
│  ┌───────────────────────┐ │
│  │                       │ │
│  │  Felt strong today!   │ │
│  │                       │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │  FINISH WORKOUT  ✓   │ │ ← Primary CTA
│  └───────────────────────┘ │
└─────────────────────────────┘
```

#### Tablet/Desktop - Centered Content
```
┌──────────────────────────────────────┐
│     (same as mobile, centered)       │
│     max-width: 600px                 │
│     Larger touch targets okay        │
└──────────────────────────────────────┘
```

### Component Hierarchy (Atomic Design)

```
📄 active-workout-page (page)
  └─ 🧬 active-workout-organism (domains/workouts/organisms/)
      ├─ 🧬 workout-header (domains/workouts/organisms/)
      │   ├─ 🔬 button - Exit (ui/button)
      │   ├─ 🔬 routine-name (text)
      │   ├─ 🧪 workout-timer (domains/workouts/molecules/)
      │   │   └─ 🔬 time-display (text)
      │   └─ 🔬 button - Finish (ui/button)
      │
      ├─ 🧪 exercise-progress (domains/workouts/molecules/)
      │   ├─ 🔬 progress-text (text)
      │   └─ 🔬 progress-bar (ui/progress)
      │
      ├─ 🧬 exercise-tracker (domains/workouts/organisms/)
      │   ├─ 🧪 exercise-header (domains/workouts/molecules/)
      │   │   ├─ 🔬 exercise-name (h2)
      │   │   └─ 🔬 target-display (text)
      │   │
      │   ├─ 🧪 completed-sets-list (domains/workouts/molecules/)
      │   │   └─ 🧪 completed-set-item (domains/workouts/molecules/)
      │   │       ├─ 🔬 set-number (text)
      │   │       ├─ 🔬 checkmark-icon (lucide)
      │   │       └─ 🔬 set-data (text)
      │   │
      │   ├─ 🧪 active-set-input (domains/workouts/molecules/)
      │   │   ├─ 🧪 number-input - Weight (components/molecules/)
      │   │   │   ├─ 🔬 label (text)
      │   │   │   ├─ 🔬 input (ui/input)
      │   │   │   ├─ 🔬 button - Decrement (ui/button)
      │   │   │   └─ 🔬 button - Increment (ui/button)
      │   │   │
      │   │   ├─ 🧪 number-input - Reps (components/molecules/)
      │   │   │   └─ (same as weight)
      │   │   │
      │   │   └─ 🔬 button - Complete (ui/button) - PRIMARY
      │   │
      │   ├─ 🧪 helper-actions (domains/workouts/molecules/)
      │   │   ├─ 🔬 button - Copy set (ui/button)
      │   │   └─ 🔬 button - Add set (ui/button)
      │   │
      │   ├─ 🧪 upcoming-sets-list (domains/workouts/molecules/)
      │   │   └─ 🧪 upcoming-set-item (domains/workouts/atoms/)
      │   │
      │   ├─ 🧪 exercise-notes (domains/workouts/molecules/)
      │   │   └─ 🔬 textarea (ui/textarea)
      │   │
      │   └─ 🔬 button - Next exercise (ui/button) - SECONDARY
      │
      └─ 🧬 workout-summary (domains/workouts/organisms/)
          ├─ 🧪 celebration-header (domains/workouts/molecules/)
          │   ├─ 🔬 icon (lucide - trophy/party-popper)
          │   └─ 🔬 heading (h1)
          │
          ├─ 🧪 workout-stats (domains/workouts/molecules/)
          │   ├─ 🧪 stat-row (components/molecules/)
          │   └─ (repeated for each stat)
          │
          ├─ 🧪 star-rating (components/molecules/)
          │   └─ 🔬 star buttons (5x)
          │
          ├─ 🧪 session-notes-input (domains/workouts/molecules/)
          │   └─ 🔬 textarea (ui/textarea)
          │
          └─ 🔬 button - Finish (ui/button) - PRIMARY
```

### Interaction Design

#### Critical Interaction: Complete Set

**Goal**: User completes a set in under 5 seconds

**Flow**:
1. User finishes set in gym
2. Picks up phone (auto-populated with previous set values)
3. Adjusts weight/reps if needed (taps +/- buttons or types)
4. Taps "Complete Set" button
5. Immediate feedback:
   - Haptic feedback (vibration)
   - Button green checkmark animation
   - Set moves to "completed" section with green check
   - Next set auto-focuses
   - Toast: "Set 2 completed"
6. User puts phone down, starts rest timer

**Time Breakdown**:
- Unlock phone: ~1s
- Adjust values (if needed): ~2s
- Tap complete: ~0.5s
- Visual confirmation: ~0.5s
- **Total: ~4 seconds**

#### Number Input Design

**Component**: `number-input.tsx`

```tsx
<NumberInput>
  <Label>Weight (kg)</Label>
  <InputGroup>
    <Button
      variant="outline"
      size="lg"
      onClick={decrement}
      aria-label="Decrease weight"
    >
      −
    </Button>

    <Input
      type="number"
      value={value}
      onChange={handleChange}
      className="text-center text-3xl"
      inputMode="numeric"
      pattern="[0-9]*"
    />

    <Button
      variant="outline"
      size="lg"
      onClick={increment}
      aria-label="Increase weight"
    >
      +
    </Button>
  </InputGroup>
</NumberInput>
```

**Interaction Details**:
- **Tap +**: Increments by 2.5kg (standard plate weight)
- **Hold +**: Increments by 2.5kg every 300ms (fast increment)
- **Tap Input**: Opens numeric keyboard for manual entry
- **Blur Input**: Auto-formats to 2 decimal places

#### Primary Actions

1. **Complete Set Button**
   - **Type**: Primary CTA
   - **Size**: 56px height, full width
   - **Location**: Below rep input, above fold
   - **States**:
     - Default: Green background (success color)
     - Hover: Green-600
     - Active: Green-700 + scale(0.98)
     - Disabled: Gray-300 (inputs empty)
   - **Feedback**:
     ```tsx
     onClick={() => {
       // 1. Haptic feedback
       if (navigator.vibrate) navigator.vibrate(50);

       // 2. Visual feedback
       setIsCompleting(true);

       // 3. Optimistic update
       addCompletedSet({ weight, reps });

       // 4. Auto-advance
       setTimeout(() => {
         setIsCompleting(false);
         focusNextSet();
       }, 300);

       // 5. Toast
       toast.success('Set 2 completed');

       // 6. Auto-save (background)
       saveWorkoutProgress();
     }}
     ```

2. **Next Exercise Button**
   - **Type**: Secondary CTA
   - **Visibility**: Only after all sets completed
   - **Feedback**:
     - Smooth scroll to top
     - Exercise name transitions
     - Progress bar animates

3. **Finish Workout Button** (completion screen)
   - **Type**: Primary CTA
   - **Size**: 56px height, full width
   - **Feedback**:
     - Loading state (saving)
     - Success animation (confetti if PR)
     - Navigate to dashboard

#### Secondary Actions

4. **Copy Set Button**
   - **Type**: Ghost button
   - **Feedback**: Values populate inputs, toast: "Copied from Set 1"

5. **Add Set Button**
   - **Type**: Ghost button
   - **Feedback**: New set input appears below

6. **Exit Button** (header)
   - **Type**: Ghost/Danger
   - **Feedback**: Confirmation dialog (prevent data loss)

#### Micro-interactions

**Set Completion Animation**:
```css
@keyframes set-complete {
  0% {
    transform: scale(1);
    background: green-500;
  }
  50% {
    transform: scale(1.05);
    background: green-600;
  }
  100% {
    transform: scale(1) translateY(-100%);
    opacity: 0;
  }
}
```

**Progress Bar Fill**:
```tsx
<Progress
  value={(currentExercise / totalExercises) * 100}
  className="transition-all duration-500 ease-out"
/>
```

**PR Celebration** (if new personal record):
```tsx
{isNewPR && (
  <Confetti
    recycle={false}
    numberOfPieces={200}
    gravity={0.3}
  />
)}
```

### States & Feedback

#### Loading State (Initial)
```tsx
<ActiveWorkoutSkeleton>
  <HeaderSkeleton />
  <ExerciseNameSkeleton />
  <SetInputsSkeleton />
</ActiveWorkoutSkeleton>
```

#### Auto-Save Indicator
```tsx
<div className="fixed bottom-4 right-4 text-sm text-gray-500">
  {isSaving ? (
    <><Loader2 className="animate-spin" /> Saving...</>
  ) : (
    <><Check className="text-green-500" /> Saved</>
  )}
</div>
```

#### Exit Confirmation Dialog
```tsx
<Dialog open={showExitConfirm}>
  <DialogTitle>Exit Workout?</DialogTitle>
  <DialogDescription>
    Your progress will be saved as a draft. You can resume later.
  </DialogDescription>
  <DialogActions>
    <Button variant="ghost" onClick={cancelExit}>
      Continue Workout
    </Button>
    <Button variant="destructive" onClick={confirmExit}>
      Exit
    </Button>
  </DialogActions>
</Dialog>
```

#### Completion Celebration
```tsx
<div className="text-center">
  <Trophy className="h-16 w-16 text-yellow-500 mx-auto animate-bounce" />
  <h1 className="text-3xl font-bold">Workout Complete!</h1>

  {hasNewPR && (
    <div className="bg-yellow-100 border-yellow-400 p-4 rounded">
      <Star className="h-8 w-8 text-yellow-500" />
      <p>New PR: Bench Press - 80kg!</p>
    </div>
  )}
</div>
```

### Accessibility Design

#### Semantic Structure
```html
<main role="main" aria-label="Active Workout Session">
  <header>
    <h1 class="sr-only">Active Workout: Push Day</h1>
    <!-- Timer, exit button -->
  </header>

  <section aria-label="Exercise Progress">
    <p>Exercise 1 of 6</p>
    <progress value="16.67" max="100" />
  </section>

  <section aria-label="Current Exercise: Bench Press">
    <h2>Bench Press</h2>
    <p aria-label="Target: 3 sets of 10 repetitions at 60 kilograms">
      Target: 3×10 @ 60kg
    </p>

    <section aria-label="Completed Sets">
      <ul role="list">
        <li aria-label="Set 1 completed: 60 kilograms, 10 repetitions">
          <!-- Completed set -->
        </li>
      </ul>
    </section>

    <section aria-label="Active Set: Set 2">
      <div role="group" aria-label="Weight input">
        <label for="weight-input">Weight (kg)</label>
        <button aria-label="Decrease weight">−</button>
        <input id="weight-input" type="number" aria-valuemin="0" />
        <button aria-label="Increase weight">+</button>
      </div>

      <button aria-label="Complete set 2 with 60 kilograms and 10 repetitions">
        Complete Set
      </button>
    </section>
  </section>
</main>
```

#### Keyboard Navigation
1. **Tab Order**: Exit → Weight - → Weight input → Weight + → Reps - → Reps input → Reps + → Complete Set → Copy Set → Add Set → Notes → Next Exercise
2. **Enter Key**: Activates focused button
3. **Arrow Up/Down**: Increment/decrement when input focused
4. **Escape**: Opens exit confirmation dialog

#### Screen Reader Experience
- **Exercise Start**: "Now tracking: Bench Press. Target: 3 sets of 10 repetitions at 60 kilograms. Set 1 active."
- **Set Complete**: "Set 1 completed with 60 kilograms and 10 repetitions. Set 2 active."
- **Exercise Complete**: "Bench Press complete. Moving to next exercise: Incline Dumbbell Press."
- **Workout Complete**: "Workout complete! Duration: 45 minutes, 6 exercises, 3,450 kilograms total volume."

### Performance Optimizations

1. **Auto-Save Strategy**:
   - Debounced auto-save (500ms after input change)
   - Save to local storage first (instant)
   - Sync to server in background (optimistic UI)
   - Retry on failure with exponential backoff

2. **Input Optimization**:
   - Use `inputMode="numeric"` for mobile keyboards
   - Use `pattern="[0-9]*"` for iOS numeric keyboard
   - Debounce manual input changes

3. **Animation Budget**:
   - Use `transform` and `opacity` only (GPU-accelerated)
   - Limit simultaneous animations
   - Disable animations on low-end devices

### Text Map Keys

**File**: `src/domains/workouts/workouts.text-map.ts` (continued)

```typescript
export const workoutsTextMap = {
  // ... (dashboard keys)

  active: {
    header: {
      exit: 'Exit',
      finish: 'Finish',
      timer: '{hours}:{minutes}:{seconds}'
    },

    progress: {
      current: 'Exercise {current} of {total}',
      ariaLabel: 'Exercise {current} of {total} complete'
    },

    exercise: {
      target: 'Target: {sets}×{reps} @ {weight}kg',
      targetAriaLabel: 'Target: {sets} sets of {reps} repetitions at {weight} kilograms'
    },

    set: {
      number: 'Set {number}',
      current: '(Current)',
      completed: 'Completed',
      planned: '(planned)',
      completedAriaLabel: 'Set {number} completed: {weight} kilograms, {reps} repetitions'
    },

    input: {
      weight: {
        label: 'Weight (kg)',
        ariaLabel: 'Weight in kilograms',
        decrease: 'Decrease weight',
        increase: 'Increase weight'
      },
      reps: {
        label: 'Reps',
        ariaLabel: 'Number of repetitions',
        decrease: 'Decrease reps',
        increase: 'Increase reps'
      }
    },

    actions: {
      completeSet: 'Complete Set',
      completeSetAriaLabel: 'Complete set {number} with {weight} kilograms and {reps} repetitions',
      copySet: 'Copy Set {number}',
      addSet: 'Add Set',
      nextExercise: 'Next Exercise',
      notes: 'Notes (optional)',
      notesPlaceholder: 'Add notes for this exercise'
    },

    toast: {
      setCompleted: 'Set {number} completed',
      setCopied: 'Copied from Set {number}',
      setAdded: 'Set added',
      exerciseCompleted: '{exercise} completed',
      autoSaving: 'Saving...',
      autoSaved: 'Saved',
      autoSaveFailed: 'Failed to save. Will retry.'
    },

    exit: {
      confirmTitle: 'Exit Workout?',
      confirmMessage: 'Your progress will be saved as a draft. You can resume later.',
      continueWorkout: 'Continue Workout',
      exitButton: 'Exit'
    },

    summary: {
      heading: 'Workout Complete!',
      celebrationHeading: '🎉 Workout Complete!',
      stats: {
        duration: 'Duration',
        durationValue: '{minutes}:{seconds}',
        exercises: 'Exercises',
        exercisesValue: '{count}',
        volume: 'Total Volume',
        volumeValue: '{volume} kg',
        newPR: 'New PR: {exercise}!'
      },
      rating: {
        label: 'Rate your session',
        ariaLabel: 'Rate your session from 1 to 5 stars',
        stars: '{count} {count, plural, one {star} other {stars}}'
      },
      notes: {
        label: 'Session notes (optional)',
        placeholder: 'How did you feel? Any observations?'
      },
      finish: 'Finish Workout',
      finishAriaLabel: 'Finish workout and save session'
    }
  }
}
```

---

## 5. shadcn/ui Component Requirements

### Components Needed for Phase 1B

**Already Installed** (from Phase 1A):
- ✅ `button`
- ✅ `input`
- ✅ `card`
- ✅ `label`
- ✅ `separator`
- ✅ `checkbox`
- ✅ `alert`

**New Components to Install**:
1. **`badge`** - Active routine indicator, exercise count badges
2. **`progress`** - Exercise progress bar in active workout
3. **`dialog`** - Exit confirmation, delete confirmation
4. **`dropdown-menu`** - More actions menu on routine cards
5. **`toast`** - Success/error notifications (set completed, routine activated)
6. **`skeleton`** - Loading states for dashboard and routines list
7. **`avatar`** - User profile in header
8. **`sheet`** - Mobile navigation drawer

### Custom Components to Build

**Components** (`src/components/molecules/`):
1. **`number-input.tsx`** - Input with +/- buttons (active workout)
2. **`star-rating.tsx`** - Interactive 1-5 star selector (workout summary)
3. **`stat-card.tsx`** - Card showing icon + value + label (dashboard stats)
4. **`empty-state.tsx`** - Reusable empty state component

**Domain Components** (`src/domains/`):

**Workouts Domain**:
- `stat-card.tsx` - Dashboard stats display
- `train-today-card.tsx` - Hero CTA card
- `session-card.tsx` - Recent activity item
- `workout-timer.tsx` - Running timer component
- `exercise-tracker.tsx` - Active exercise tracking interface
- `set-input.tsx` - Combined weight + reps input
- `completed-set-item.tsx` - Display completed set
- `workout-summary.tsx` - Completion screen

**Routines Domain**:
- `routine-card.tsx` - Routine display with actions
- `routine-meta.tsx` - Days + exercises count display

---

## 6. Global Considerations

### Navigation Integration

**App Header** (mobile):
```tsx
<header className="sticky top-0 z-50 bg-white border-b">
  <div className="flex items-center justify-between px-4 h-14">
    <button onClick={openSidebar} aria-label="Open menu">
      <Menu className="h-6 w-6" />
    </button>

    <span className="font-semibold">Gym Tracker</span>

    <Avatar>
      <AvatarImage src={user.avatar} />
      <AvatarFallback>{user.initials}</AvatarFallback>
    </Avatar>
  </div>
</header>
```

**Mobile Navigation Sheet**:
```tsx
<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
  <SheetContent side="left">
    <nav aria-label="Main navigation">
      <ul>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/routines">Routines</Link></li>
        <li><Link href="/history">History</Link></li>
        <li><Link href="/library">Library</Link></li>
      </ul>
    </nav>
  </SheetContent>
</Sheet>
```

### Design System Tokens

**Colors** (extend Tailwind config):
```js
colors: {
  success: {
    DEFAULT: '#10b981', // green-500
    dark: '#059669',    // green-600
  },
  warning: {
    DEFAULT: '#f59e0b', // amber-500
  },
  error: {
    DEFAULT: '#ef4444', // red-500
  }
}
```

**Spacing for Touch Targets**:
```js
spacing: {
  'touch': '3rem',    // 48px minimum
  'touch-lg': '3.5rem' // 56px comfortable
}
```

### Typography Scale

**Active Workout Page** (larger for readability):
- Exercise Name: `text-2xl` (1.5rem / 24px)
- Input Values: `text-3xl` (1.875rem / 30px)
- Labels: `text-base` (1rem / 16px)
- Helper Text: `text-sm` (0.875rem / 14px)

### Animation Timing

```css
/* Fast interactions */
.btn-press {
  transition: transform 100ms ease-out;
}

/* Standard transitions */
.card-hover {
  transition: all 200ms ease-out;
}

/* Smooth page transitions */
.page-transition {
  transition: opacity 300ms ease-out;
}

/* Progress animations */
.progress-fill {
  transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 7. Implementation Coordination

### Agent Collaboration

**shadcn-builder Agent**:
- Install new components: `badge`, `progress`, `dialog`, `dropdown-menu`, `toast`, `skeleton`, `avatar`, `sheet`
- Verify components work with existing theme
- Test responsive behavior

**domain-architect Agent** (future):
- Define workout session state structure
- Design auto-save mechanism
- Plan routine activation logic

**Parent Agent** (execution):
1. Create text maps first (`workouts.text-map.ts`, `routines.text-map.ts`)
2. Build custom shared components (`number-input`, `star-rating`, `stat-card`, `empty-state`)
3. Build domain-specific molecules
4. Assemble organisms
5. Create pages
6. Test responsive breakpoints
7. Verify accessibility with Lighthouse

### File Creation Order

**Phase 1: Text Maps**
1. `src/domains/workouts/workouts.text-map.ts`
2. `src/domains/routines/routines.text-map.ts`

**Phase 2: Shared Components**
3. `src/components/molecules/number-input.tsx`
4. `src/components/molecules/star-rating.tsx`
5. `src/components/molecules/stat-card.tsx`
6. `src/components/molecules/empty-state.tsx`

**Phase 3: Domain Components (Workouts)**
7. `src/domains/workouts/atoms/stat-badge.tsx`
8. `src/domains/workouts/molecules/stat-card.tsx`
9. `src/domains/workouts/molecules/train-today-card.tsx`
10. `src/domains/workouts/molecules/session-card.tsx`
11. `src/domains/workouts/molecules/workout-timer.tsx`
12. `src/domains/workouts/molecules/set-input.tsx`
13. `src/domains/workouts/molecules/completed-set-item.tsx`
14. `src/domains/workouts/organisms/exercise-tracker.tsx`
15. `src/domains/workouts/organisms/workout-summary.tsx`

**Phase 4: Domain Components (Routines)**
16. `src/domains/routines/atoms/routine-meta.tsx`
17. `src/domains/routines/molecules/routine-card.tsx`

**Phase 5: Pages**
18. `src/app/(app)/dashboard/page.tsx`
19. `src/app/(app)/routines/page.tsx`
20. `src/app/(app)/workout/active/page.tsx`

---

## 8. Success Metrics

### Usability Metrics
- **Task Completion Time**: Complete a set in < 5 seconds
- **Error Rate**: < 1% accidental exits/data loss
- **User Satisfaction**: Post-workout rating > 4/5 stars average

### Performance Metrics
- **Dashboard Load**: < 1 second to interactive
- **Active Workout Load**: < 0.5 seconds (cached data)
- **Auto-Save Latency**: < 200ms (local storage)

### Accessibility Metrics
- **Lighthouse Score**: > 95/100
- **Keyboard Navigation**: All actions reachable
- **Screen Reader**: Complete session possible without screen

### Technical Metrics
- **Touch Target Size**: 100% of interactive elements ≥ 48x48px
- **Color Contrast**: 100% pass WCAG AA
- **Mobile Performance**: > 90 on mobile Lighthouse

---

## 9. Important Notes

### Critical UX Decisions

1. **Auto-Populate Previous Set Values**
   - **Rationale**: 90% of sets use same weight as previous
   - **Benefit**: Reduces taps from 20+ to 5-10 per exercise
   - **Implementation**: On set completion, copy values to next set

2. **Green "Complete Set" Button**
   - **Rationale**: Green = success, psychologically positive
   - **Benefit**: Encourages action, feels rewarding
   - **Alternative Considered**: Blue (brand) - rejected as less motivating

3. **No Rest Timer (Phase 1)**
   - **Rationale**: Most users know their rest time
   - **Benefit**: Reduces complexity
   - **Future**: Add optional rest timer in Phase 2

4. **Sticky Header with Timer**
   - **Rationale**: User needs to see workout duration always
   - **Benefit**: Context awareness, no scrolling to check time
   - **Trade-off**: Uses 56px of screen space

5. **Confirmation on Exit**
   - **Rationale**: Prevent accidental data loss
   - **Benefit**: User confidence
   - **Trade-off**: Extra tap to exit (worth it)

### Design Trade-offs

**Chosen**: Large touch targets (56px)
**Trade-off**: Less content visible on screen
**Justification**: Accuracy > density in gym environment

**Chosen**: Auto-save every input change
**Trade-off**: More server requests
**Justification**: Data integrity > server load

**Chosen**: One exercise at a time
**Trade-off**: Can't see next exercise while working
**Justification**: Focus > overview during active workout

### Future Enhancements (Not Phase 1)

- Rest timer with notifications
- Workout templates
- Superset tracking
- Exercise video demonstrations
- Progressive overload suggestions
- Workout music integration

---

## 10. Appendix: User Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER JOURNEY: COMPLETE WORKOUT           │
└─────────────────────────────────────────────────────────────┘

[User Opens App]
      ↓
[Dashboard Page]
      ↓ User sees "Train Today: Push Day"
[Tap "Start Workout"]
      ↓ Navigate to /workout/active
[Active Workout Page Loads]
      ↓ Exercise 1: Bench Press
      ↓ Set 1 auto-populated with previous workout data
      ↓
┌─────────────────────────────────────────────────────┐
│  For Each Set (3-5 times per exercise):            │
│                                                     │
│  [User completes set in gym]                       │
│         ↓                                           │
│  [Pick up phone]                                    │
│         ↓                                           │
│  [Adjust weight/reps if needed] ← 0-3 taps        │
│         ↓                                           │
│  [Tap "Complete Set" button] ← 1 tap              │
│         ↓                                           │
│  [Haptic + Visual feedback]                        │
│         ↓                                           │
│  [Set moves to completed section]                  │
│         ↓                                           │
│  [Next set auto-focuses]                           │
│         ↓                                           │
│  [Put phone down, rest]                            │
│         ↓                                           │
│  [Repeat for remaining sets]                       │
└─────────────────────────────────────────────────────┘
      ↓ All sets complete
[Tap "Next Exercise"]
      ↓ Smooth transition
[Exercise 2: Incline DB Press]
      ↓ Repeat set flow
      .
      .
      . (4 more exercises)
      ↓
[All Exercises Complete]
      ↓ Automatic transition
[Workout Summary Screen]
      ↓ Stats displayed: 45 min, 6 exercises, 3,450 kg
      ↓ New PR message (if applicable)
      ↓
[User rates session] ← Tap stars
      ↓
[User adds optional notes]
      ↓
[Tap "Finish Workout"]
      ↓ Confetti animation (if PR)
      ↓ Save to database
      ↓ Navigate to dashboard
[Dashboard with Updated Stats]
      ↓ Streak incremented
      ↓ Weekly count updated
      ↓ Session appears in recent activity
[User exits app feeling accomplished]

┌─────────────────────────────────────────────────────────────┐
│  ALTERNATIVE FLOW: Exit Mid-Workout                         │
└─────────────────────────────────────────────────────────────┘

[User taps "Exit" in header]
      ↓
[Confirmation Dialog]
   "Exit Workout? Your progress will be saved as a draft."
      ↓
   [Continue Workout] ← User reconsiders
      ↓ Back to active workout

   OR

   [Exit] ← User confirms
      ↓ Save draft to local storage + server
      ↓ Navigate to dashboard
[Dashboard]
      ↓ Resume button appears: "Resume: Push Day (3/6 exercises)"
```

---

## 11. Conclusion

### Summary

This UX plan defines three critical views for Phase 1B:

1. **Dashboard**: Central hub with quick workout access and progress overview
2. **Routines List**: Management interface for all workout routines
3. **Active Workout**: Speed-optimized interface for real-time logging

### Key Design Principles Applied

1. **Mobile-First**: Primary design for phone in gym
2. **Speed-Optimized**: Minimize taps, maximize efficiency
3. **Data Integrity**: Auto-save, exit confirmations
4. **Accessibility**: Keyboard nav, screen readers, high contrast
5. **Feedback-Rich**: Every action acknowledged
6. **Encouragement**: Positive language, celebration, gamification

### Ready for Implementation

All components, text maps, interactions, and states are fully specified. Parent agent can execute step-by-step without additional design decisions.

### Next Steps

1. Parent reviews and approves plan
2. shadcn-builder installs new components
3. Parent creates text maps
4. Parent builds custom components
5. Parent assembles pages
6. Parent tests responsive + accessibility
7. Phase 1B complete, ready for business logic integration

---

**Plan Complete** ✓

**Total Components**: 25+ new components
**Total Text Keys**: 100+ keys across 2 text maps
**Total Pages**: 3 pages

**Estimated Implementation Time**: 3-4 days for experienced developer
