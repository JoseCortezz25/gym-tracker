# Phase 1 UI Views - UX/UI Design Plan

**Created**: 2025-11-03
**Phase**: Phase 1 - Core MVP
**Complexity**: High
**User Impact**: Critical

## 1. Executive Summary

This plan defines the UI structure and component architecture for all Phase 1 views. The focus is on creating the **visual structure and layout FIRST**, without implementing business logic or data fetching. This allows rapid prototyping and user feedback before building functionality.

**Design Philosophy**:
- Mobile-first responsive design
- Clear visual hierarchy
- Minimal cognitive load
- Immediate feedback on user actions
- Accessibility from the ground up

**Total Views to Implement**: 9 main views + 3 sub-views

---

## 2. Implementation Order (Recommended)

**Priority-based sequence for maximum value**:

### Phase 1A - Authentication Foundation (Week 1)
1. Login Page
2. Register Page
3. Password Recovery Page

### Phase 1B - Core Workout Flow (Week 2-3)
4. Dashboard (Home)
5. Routines List Page
6. Active Workout Session Page

### Phase 1C - Management & History (Week 3-4)
7. Create/Edit Routine Page
8. Exercise Library Page
9. Workout History Page

### Phase 1D - Detail Views (Week 4)
10. Routine Detail Page
11. Workout Session Detail Page
12. Exercise Detail Page (library)

**Rationale**: This order allows early testing of the core workout flow while authentication is being finalized.

---

## 3. View Inventory & Architecture

### 3.1 Authentication Views

#### View 1: Login Page
**Route**: `/login`
**Layout Group**: `(auth)`
**User Goal**: Access my account quickly and securely

**Page Purpose**: Enable existing users to authenticate and access their data.

**Layout Structure** (Mobile-first):
```
┌─────────────────────────────┐
│         [Logo/App Name]     │  ← Centered branding
│                             │
│  ┌───────────────────────┐ │
│  │  Email               │ │  ← Input field
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │  Password  [eye icon]│ │  ← Password with toggle
│  └───────────────────────┘ │
│                             │
│  [ ] Remember me            │  ← Checkbox
│                             │
│  ┌───────────────────────┐ │
│  │   Login (Primary)     │ │  ← Primary CTA
│  └───────────────────────┘ │
│                             │
│  Forgot password?           │  ← Link (subtle)
│                             │
│  ────── or ──────           │  ← Divider
│                             │
│  ┌───────────────────────┐ │
│  │  Create Account       │ │  ← Secondary action
│  └───────────────────────┘ │
└─────────────────────────────┘
```

**Component Hierarchy**:
- **Organism**: `login-page` (domain: auth)
  - **Molecule**: `login-form` (domain: auth)
    - **Atom**: `email-input` (component: ui/input)
    - **Atom**: `password-input` with eye toggle (component: molecules/input)
    - **Atom**: `checkbox` (component: ui/checkbox)
    - **Atom**: `button` primary (component: ui/button)
  - **Atom**: `link` - forgot password (component: ui/link)
  - **Atom**: `separator` - "or" divider (component: ui/separator)
  - **Atom**: `button` secondary - register (component: ui/button)

**shadcn/ui Components Needed**:
- `input` - Email field
- `button` - Primary and secondary actions
- `checkbox` - Remember me
- `separator` - Visual divider
- `label` - Form labels

**Custom Components Needed**:
- `password-input` (molecules) - Input with show/hide toggle (already exists: `eye-password.tsx`)

**Responsive Breakpoints**:
- **Mobile (< 640px)**: Single column, full-width inputs, card takes 90% width
- **Tablet (640px - 1024px)**: Centered card max-width 400px
- **Desktop (> 1024px)**: Centered card max-width 420px

**Accessibility**:
- Form has `role="form"` and `aria-label="Login form"`
- Email input has `type="email"` and `autocomplete="email"`
- Password has `type="password"` and `autocomplete="current-password"`
- Error messages have `aria-live="polite"` for screen readers
- Tab order: Email → Password → Remember me → Login → Forgot password → Register

**States**:
- **Default**: Clean form, ready for input
- **Loading**: Button shows spinner, form disabled
- **Error**: Red border on invalid field, error message below
- **Success**: Brief success message, then redirect

**Text Map Keys** (`domains/auth/auth.text-map.ts`):
- `login.heading`: "Welcome Back"
- `login.email.label`: "Email"
- `login.email.placeholder`: "your@email.com"
- `login.password.label`: "Password"
- `login.password.placeholder`: "Enter your password"
- `login.rememberMe.label`: "Remember me"
- `login.submit`: "Login"
- `login.forgotPassword`: "Forgot your password?"
- `login.noAccount`: "Don't have an account?"
- `login.register`: "Create Account"
- `login.error.invalidCredentials`: "Invalid email or password"
- `login.error.generic`: "Something went wrong. Please try again."

---

#### View 2: Register Page
**Route**: `/register`
**Layout Group**: `(auth)`
**User Goal**: Create an account quickly to start tracking workouts

**Page Purpose**: Enable new users to create an account with minimal friction.

**Layout Structure** (Mobile-first):
```
┌─────────────────────────────┐
│    Create Your Account      │  ← Heading
│                             │
│  ┌───────────────────────┐ │
│  │  Email               │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │  Password  [eye]     │ │
│  └───────────────────────┘ │
│  • At least 8 characters    │  ← Password requirements
│  • Contains letter & number │
│                             │
│  ┌───────────────────────┐ │
│  │  Confirm Password    │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │   Create Account      │ │  ← Primary CTA
│  └───────────────────────┘ │
│                             │
│  Already have an account?   │
│  Login                      │  ← Link to login
└─────────────────────────────┘
```

**Component Hierarchy**:
- **Organism**: `register-page` (domain: auth)
  - **Molecule**: `register-form` (domain: auth)
    - **Atom**: `email-input` (ui/input)
    - **Atom**: `password-input` with eye (molecules/input)
    - **Molecule**: `password-requirements` (domain: auth) - List of checks
    - **Atom**: `password-input` confirm (molecules/input)
    - **Atom**: `button` primary (ui/button)
  - **Atom**: `text` + `link` - Login prompt (ui/text, ui/link)

**shadcn/ui Components Needed**:
- `input` - Email field
- `button` - Submit action
- `label` - Form labels
- `alert` - Success/error messages

**Custom Components Needed**:
- `password-requirements` (domain: auth) - Shows password validation rules with checkmarks

**Responsive Breakpoints**:
- **Mobile (< 640px)**: Full-width form, stacked layout
- **Tablet/Desktop**: Centered card, max-width 440px

**Accessibility**:
- Password requirements announced as aria-live region
- Each requirement has aria-label describing status
- Confirm password has aria-describedby pointing to requirements
- Validation errors clearly associated with fields

**States**:
- **Default**: Empty form
- **Typing Password**: Requirements update in real-time (green checks)
- **Password Mismatch**: Confirm field shows error
- **Submitting**: Button loading state
- **Success**: Success message + auto-redirect to dashboard
- **Error**: Inline error messages (e.g., "Email already exists")

**Text Map Keys** (`domains/auth/auth.text-map.ts`):
- `register.heading`: "Create Your Account"
- `register.email.label`: "Email"
- `register.email.placeholder`: "your@email.com"
- `register.password.label`: "Password"
- `register.password.placeholder`: "Create a password"
- `register.confirmPassword.label`: "Confirm Password"
- `register.confirmPassword.placeholder`: "Re-enter your password"
- `register.requirements.heading`: "Password must:"
- `register.requirements.minLength`: "Be at least 8 characters"
- `register.requirements.hasLetter`: "Contain at least one letter"
- `register.requirements.hasNumber`: "Contain at least one number"
- `register.submit`: "Create Account"
- `register.hasAccount`: "Already have an account?"
- `register.login`: "Login"
- `register.success`: "Account created successfully!"
- `register.error.emailExists`: "This email is already registered"
- `register.error.passwordMismatch`: "Passwords do not match"

---

#### View 3: Password Recovery Page
**Route**: `/forgot-password`
**Layout Group**: `(auth)`
**User Goal**: Reset my password when I've forgotten it

**Page Purpose**: Allow users to request a password reset via email.

**Layout Structure** (Mobile-first):
```
┌─────────────────────────────┐
│    Reset Your Password      │
│                             │
│  We'll send a reset link to │
│  your email address         │
│                             │
│  ┌───────────────────────┐ │
│  │  Email               │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │  Send Reset Link      │ │
│  └───────────────────────┘ │
│                             │
│  ← Back to Login            │
└─────────────────────────────┘

# After submission:
┌─────────────────────────────┐
│    ✉ Check Your Email       │
│                             │
│  We've sent a password reset│
│  link to:                   │
│  user@example.com           │
│                             │
│  Didn't receive it?         │
│  Resend                     │
│                             │
│  ← Back to Login            │
└─────────────────────────────┘
```

**Component Hierarchy**:
- **Organism**: `password-recovery-page` (domain: auth)
  - **Molecule**: `password-recovery-form` (domain: auth)
    - **Atom**: `email-input` (ui/input)
    - **Atom**: `button` primary (ui/button)
  - **Molecule**: `success-message` (domain: auth) - shown after submit
  - **Atom**: `link` - back to login (ui/link)

**shadcn/ui Components Needed**:
- `input` - Email field
- `button` - Submit action
- `alert` - Success state

**Responsive Breakpoints**:
- **Mobile/Tablet/Desktop**: Centered card, max-width 400px

**Accessibility**:
- Clear instructions before form
- Success state announced to screen readers
- Focus management: after submit, focus goes to success message

**States**:
- **Default**: Form with instructions
- **Submitting**: Loading state on button
- **Success**: Email sent confirmation
- **Error**: Email not found message

**Text Map Keys** (`domains/auth/auth.text-map.ts`):
- `passwordRecovery.heading`: "Reset Your Password"
- `passwordRecovery.instructions`: "We'll send a reset link to your email address"
- `passwordRecovery.email.label`: "Email"
- `passwordRecovery.email.placeholder`: "your@email.com"
- `passwordRecovery.submit`: "Send Reset Link"
- `passwordRecovery.backToLogin`: "Back to Login"
- `passwordRecovery.success.heading`: "Check Your Email"
- `passwordRecovery.success.message`: "We've sent a password reset link to:"
- `passwordRecovery.success.notReceived`: "Didn't receive it?"
- `passwordRecovery.success.resend`: "Resend"
- `passwordRecovery.error.emailNotFound`: "No account found with this email"

---

### 3.2 Core Application Views

#### View 4: Dashboard (Home)
**Route**: `/dashboard`
**Layout Group**: `(app)` with sidebar layout
**User Goal**: See my current status and quick access to start training

**Page Purpose**: Central hub showing activity summary and primary action (train today).

**Layout Structure** (Mobile-first):
```
Mobile:
┌─────────────────────────────┐
│ ☰  Gym Tracker    [Profile] │  ← Header with hamburger
├─────────────────────────────┤
│                             │
│  🔥 Streak: 5 days          │  ← Stats cards
│  📊 This Week: 3 workouts   │
│                             │
│  ┌───────────────────────┐ │
│  │  TRAIN TODAY          │ │  ← Primary CTA (large)
│  │  Push Day             │ │
│  └───────────────────────┘ │
│                             │
│  Recent Activity            │  ← Section heading
│  ┌───────────────────────┐ │
│  │ Yesterday              │ │  ← Session card
│  │ Pull Day • 45 min      │ │
│  │ 📈 8 exercises         │ │
│  └───────────────────────┘ │
│  ┌───────────────────────┐ │
│  │ 2 days ago             │ │
│  │ Leg Day • 60 min       │ │
│  │ 📈 10 exercises        │ │
│  └───────────────────────┘ │
│                             │
│  Quick Actions              │
│  • My Routines              │
│  • Exercise Library         │
│  • View History             │
└─────────────────────────────┘

Desktop (> 1024px):
┌─────────────────────────────────────────┐
│  [Sidebar]  │  Main Content             │
│             │                           │
│  Dashboard  │  Welcome back, User!      │
│  Routines   │                           │
│  History    │  ┌────┐ ┌────┐ ┌────┐   │
│  Library    │  │ 🔥 │ │ 📊 │ │ 💪 │   │  ← Stats grid
│  Goals      │  │ 5  │ │ 3  │ │ 12 │   │
│             │  └────┘ └────┘ └────┘   │
│             │  Streak  Week  Total     │
│             │                           │
│             │  ┌─────────────────────┐ │
│             │  │  TRAIN TODAY        │ │  ← Large CTA
│             │  │  Push Day           │ │
│             │  └─────────────────────┘ │
│             │                           │
│             │  Recent Activity          │
│             │  ┌─────┐ ┌─────┐        │
│             │  │ ... │ │ ... │        │  ← 2-column grid
│             │  └─────┘ └─────┘        │
└─────────────────────────────────────────┘
```

**Component Hierarchy**:
- **Template**: `app-layout` (components/layout)
  - **Organism**: `header` (components/organisms) - Mobile header with hamburger
  - **Organism**: `sidebar` (components/organisms) - Desktop navigation
  - **Organism**: `dashboard-page` (domains/workouts)
    - **Molecule**: `stats-summary` (domains/workouts)
      - **Atom**: `stat-card` (components/molecules) - Streak, weekly count, etc.
    - **Molecule**: `train-today-card` (domains/workouts) - Primary CTA
    - **Molecule**: `recent-activity-list` (domains/workouts)
      - **Atom**: `session-card` (domains/workouts) - Summary of past session
    - **Molecule**: `quick-actions` (components/molecules) - Link list

**shadcn/ui Components Needed**:
- `card` - Stat cards, session cards
- `button` - Train today CTA
- `separator` - Between sections
- `skeleton` - Loading states
- `avatar` - User profile (header)
- `sheet` - Mobile navigation drawer

**Custom Components Needed**:
- `stat-card` - Shows icon, value, label
- `session-card` - Compact session summary
- `train-today-card` - Large prominent CTA with routine info

**Responsive Breakpoints**:
- **Mobile (< 640px)**: Stacked layout, hamburger menu, full-width cards
- **Tablet (640px - 1024px)**: 2-column stats grid, hamburger menu
- **Desktop (> 1024px)**: Sidebar navigation, 3-column stats grid

**Accessibility**:
- Main heading h1: "Dashboard" (visually hidden, for screen readers)
- Stats have aria-label: "Current streak: 5 days"
- Train today button is keyboard accessible, large touch target
- Recent sessions are list with semantic ul/li

**States**:
- **Loading**: Skeleton placeholders for stats and sessions
- **Empty State**: "No workouts yet. Create a routine to get started!"
- **Active Routine**: Shows Train Today card
- **No Active Routine**: "Set up your first routine" CTA

**Text Map Keys** (`domains/workouts/workouts.text-map.ts`):
- `dashboard.heading`: "Dashboard"
- `dashboard.welcome`: "Welcome back, {name}!"
- `dashboard.stats.streak.label`: "Day Streak"
- `dashboard.stats.weeklyWorkouts.label`: "This Week"
- `dashboard.stats.totalWorkouts.label`: "Total Workouts"
- `dashboard.trainToday.heading`: "Train Today"
- `dashboard.trainToday.button`: "Start Workout"
- `dashboard.trainToday.noRoutine`: "No routine scheduled for today"
- `dashboard.recentActivity.heading`: "Recent Activity"
- `dashboard.recentActivity.empty`: "No workouts yet. Start your first session!"
- `dashboard.quickActions.heading`: "Quick Actions"
- `dashboard.quickActions.routines`: "My Routines"
- `dashboard.quickActions.library`: "Exercise Library"
- `dashboard.quickActions.history`: "View History"

---

#### View 5: Routines List Page
**Route**: `/routines`
**Layout Group**: `(app)`
**User Goal**: View all my workout routines and create new ones

**Page Purpose**: Manage all workout routines (view, create, edit, activate).

**Layout Structure** (Mobile-first):
```
┌─────────────────────────────┐
│  My Routines                │  ← Page heading
│                             │
│  ┌───────────────────────┐ │
│  │  + Create Routine     │ │  ← Primary action
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │ ⭐ Push-Pull-Legs     │ │  ← Active routine (badge)
│  │ 6 days • 42 exercises  │ │
│  │                        │ │
│  │ [View] [Edit] [••]    │ │  ← Actions
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │ Full Body Split        │ │  ← Inactive routine
│  │ 3 days • 18 exercises  │ │
│  │                        │ │
│  │ [Activate] [Edit] [••]│ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │ No routines yet?       │ │  ← Empty state (if none)
│  │ Create your first!     │ │
│  └───────────────────────┘ │
└─────────────────────────────┘
```

**Component Hierarchy**:
- **Organism**: `routines-page` (domains/routines)
  - **Atom**: `button` - Create routine (ui/button)
  - **Molecule**: `routine-list` (domains/routines)
    - **Atom**: `routine-card` (domains/routines) - Individual routine
      - **Atom**: `badge` - Active status (ui/badge)
      - **Atom**: `button` group - Actions (ui/button)
      - **Molecule**: `dropdown-menu` - More options (ui/dropdown-menu)
  - **Molecule**: `empty-state` - No routines (components/molecules)

**shadcn/ui Components Needed**:
- `card` - Routine card
- `badge` - Active routine indicator
- `button` - Create, View, Edit, Activate
- `dropdown-menu` - More actions (delete, archive)
- `dialog` - Confirmation modals (delete routine)
- `skeleton` - Loading state

**Custom Components Needed**:
- `routine-card` - Displays routine summary with actions
- `empty-state` - Encourages creating first routine

**Responsive Breakpoints**:
- **Mobile (< 640px)**: Single column, full-width cards
- **Tablet (640px - 1024px)**: 2-column grid
- **Desktop (> 1024px)**: 3-column grid or 2-column with larger cards

**Accessibility**:
- Each routine card is a landmark with descriptive aria-label
- Active routine announced: "Active routine: Push-Pull-Legs"
- Action buttons have clear labels
- Delete confirmation modal traps focus

**States**:
- **Loading**: Skeleton cards
- **Empty**: Encouragement to create first routine
- **With Routines**: Grid of routine cards
- **Deleting**: Confirmation modal

**Text Map Keys** (`domains/routines/routines.text-map.ts`):
- `routines.heading`: "My Routines"
- `routines.create`: "Create Routine"
- `routines.active.badge`: "Active"
- `routines.card.days`: "{count} days"
- `routines.card.exercises`: "{count} exercises"
- `routines.actions.view`: "View"
- `routines.actions.edit`: "Edit"
- `routines.actions.activate`: "Activate"
- `routines.actions.archive`: "Archive"
- `routines.actions.delete`: "Delete"
- `routines.delete.confirm.title`: "Delete Routine?"
- `routines.delete.confirm.message`: "This routine has workout history. It will be archived instead of deleted."
- `routines.delete.confirm.yes`: "Archive"
- `routines.delete.confirm.no`: "Cancel"
- `routines.empty.heading`: "No routines yet"
- `routines.empty.message`: "Create your first routine to start tracking workouts"
- `routines.empty.action`: "Create Routine"

---

#### View 6: Active Workout Session Page
**Route**: `/workout/active`
**Layout Group**: `(app)` - Full-screen, no sidebar
**User Goal**: Record my workout in real-time with minimal friction

**Page Purpose**: Active session interface for recording sets, reps, and weights.

**Layout Structure** (Mobile-first):
```
┌─────────────────────────────┐
│ ← Exit    Push Day   [✓]    │  ← Sticky header
│    ⏱ 00:15:32               │  ← Timer
├─────────────────────────────┤
│                             │
│  Exercise 1 of 6            │  ← Progress indicator
│  ──────■─────────            │
│                             │
│  Bench Press                │  ← Current exercise
│  Target: 3 sets x 10 @ 60kg│  ← Reference from routine
│                             │
│  Set 1  ✓                   │  ← Completed set (green)
│  60kg x 10 reps             │
│                             │
│  Set 2  (Current)           │  ← Active set
│  ┌─────┐  ┌─────┐          │
│  │ 60  │  │ 10  │  [✓]     │  ← Input + complete button
│  └─────┘  └─────┘          │
│   kg       reps             │
│  [−] [+]  [−] [+]           │  ← Quick adjusters
│                             │
│  Set 3                      │  ← Not started
│  60kg x 10 reps (planned)   │
│                             │
│  [Copy Set 1]               │  ← Helper button
│  [Add Set]                  │
│                             │
│  Notes (optional)           │
│  ┌───────────────────────┐ │
│  │                       │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │  Next Exercise ›      │ │  ← Next action
│  └───────────────────────┘ │
└─────────────────────────────┘

# After all exercises:
┌─────────────────────────────┐
│  Workout Complete!          │
│                             │
│  ⏱ Duration: 45 min         │
│  💪 Exercises: 6            │
│  📊 Total Volume: 3,450 kg  │
│                             │
│  Rate your session:         │
│  ⭐⭐⭐⭐⭐                   │  ← Star rating
│                             │
│  Notes (optional)           │
│  ┌───────────────────────┐ │
│  │ Felt great today!     │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │  Finish Workout       │ │
│  └───────────────────────┘ │
└─────────────────────────────┘
```

**Component Hierarchy**:
- **Organism**: `active-workout-page` (domains/workouts)
  - **Organism**: `workout-header` (domains/workouts) - Sticky header with timer
  - **Molecule**: `exercise-progress` (domains/workouts) - Progress bar
  - **Organism**: `exercise-tracker` (domains/workouts) - Current exercise
    - **Molecule**: `exercise-header` (domains/workouts) - Name and target
    - **Molecule**: `set-list` (domains/workouts)
      - **Molecule**: `set-input` (domains/workouts) - Weight/reps inputs
        - **Atom**: `number-input` (ui/input)
        - **Atom**: `button` - increment/decrement (ui/button)
        - **Atom**: `button` - complete set (ui/button)
    - **Atom**: `button` - Copy set (ui/button)
    - **Atom**: `button` - Add set (ui/button)
    - **Atom**: `textarea` - Notes (ui/textarea)
  - **Molecule**: `workout-summary` (domains/workouts) - Completion screen
    - **Molecule**: `star-rating` (components/molecules)
    - **Atom**: `textarea` - Session notes (ui/textarea)
    - **Atom**: `button` - Finish (ui/button)

**shadcn/ui Components Needed**:
- `input` - Weight and reps
- `button` - Multiple actions
- `progress` - Exercise progress bar
- `textarea` - Notes
- `dialog` - Exit confirmation
- `toast` - Set completed feedback

**Custom Components Needed**:
- `number-input` - Input with +/- buttons
- `set-input` - Combined weight + reps input
- `star-rating` - 1-5 star selector
- `workout-timer` - Running timer display

**Responsive Breakpoints**:
- **Mobile (< 640px)**: Full-screen, large touch targets (48x48px minimum)
- **Tablet/Desktop**: Centered content, max-width 600px

**Accessibility**:
- Number inputs have aria-label: "Weight in kilograms"
- Each set has role="group" with aria-label
- Complete button has immediate feedback (toast + visual change)
- Timer announced periodically for screen readers (every 5 min)
- Exit confirmation: "You have unsaved data. Are you sure?"

**States**:
- **Active**: Recording current set
- **Set Completed**: Green checkmark, auto-advance to next set
- **Exercise Completed**: Smooth transition to next exercise
- **All Completed**: Summary screen
- **Exit Confirmation**: Modal if workout in progress

**Text Map Keys** (`domains/workouts/workouts.text-map.ts`):
- `workout.active.exit`: "Exit"
- `workout.active.finish`: "Finish"
- `workout.active.timer`: "Duration"
- `workout.active.progress`: "Exercise {current} of {total}"
- `workout.active.target`: "Target: {sets} sets x {reps} @ {weight}kg"
- `workout.active.set`: "Set {number}"
- `workout.active.weight.label`: "Weight (kg)"
- `workout.active.reps.label`: "Reps"
- `workout.active.complete`: "Complete Set"
- `workout.active.copySet`: "Copy Set {number}"
- `workout.active.addSet`: "Add Set"
- `workout.active.notes.label`: "Notes (optional)"
- `workout.active.nextExercise`: "Next Exercise"
- `workout.active.exit.confirm.title`: "Exit Workout?"
- `workout.active.exit.confirm.message`: "Your progress will be saved as draft"
- `workout.summary.heading`: "Workout Complete!"
- `workout.summary.duration`: "Duration: {time}"
- `workout.summary.exercises`: "Exercises: {count}"
- `workout.summary.volume`: "Total Volume: {volume} kg"
- `workout.summary.rating.label`: "Rate your session"
- `workout.summary.notes.label`: "Session notes (optional)"
- `workout.summary.finish`: "Finish Workout"

---

#### View 7: Create/Edit Routine Page
**Route**: `/routines/new` or `/routines/[id]/edit`
**Layout Group**: `(app)`
**User Goal**: Set up my weekly workout plan with exercises and targets

**Page Purpose**: Build a structured routine with days and exercises.

**Layout Structure** (Mobile-first):
```
┌─────────────────────────────┐
│ ← Back  New Routine         │  ← Header
├─────────────────────────────┤
│                             │
│  Routine Name               │
│  ┌───────────────────────┐ │
│  │ Push-Pull-Legs        │ │  ← Input
│  └───────────────────────┘ │
│                             │
│  Days                       │
│  ┌──────────────────────┐  │
│  │  Day 1: Push          │  │  ← Collapsible day
│  │  └ Exercises: 6       │  │
│  │  [Edit]               │  │
│  └──────────────────────┘  │
│  ┌──────────────────────┐  │
│  │  Day 2: Pull          │  │
│  │  └ Exercises: 5       │  │
│  │  [Edit]               │  │
│  └──────────────────────┘  │
│  ┌──────────────────────┐  │
│  │  + Add Day            │  │
│  └──────────────────────┘  │
│                             │
│  ┌───────────────────────┐ │
│  │  Save Routine         │ │  ← Primary action
│  └───────────────────────┘ │
└─────────────────────────────┘

# When editing a day:
┌─────────────────────────────┐
│ ← Back  Day 1: Push         │
├─────────────────────────────┤
│  Day Name                   │
│  ┌───────────────────────┐ │
│  │ Push                  │ │
│  └───────────────────────┘ │
│                             │
│  Exercises                  │
│  ┌───────────────────────┐ │
│  │ 1. Bench Press        │ │  ← Draggable (mobile: up/down)
│  │    3 sets x 10 @ 60kg │ │
│  │    [Edit] [Remove]    │ │
│  └───────────────────────┘ │
│  ┌───────────────────────┐ │
│  │ 2. Incline DB Press   │ │
│  │    3 sets x 12 @ 25kg │ │
│  │    [Edit] [Remove]    │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │ + Add Exercise        │ │  ← Opens library picker
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │  Save Day             │ │
│  └───────────────────────┘ │
└─────────────────────────────┘

# Add Exercise Modal:
┌─────────────────────────────┐
│  Add Exercise         [×]   │
├─────────────────────────────┤
│  ┌───────────────────────┐ │
│  │ 🔍 Search exercises   │ │  ← Search input
│  └───────────────────────┘ │
│                             │
│  Chest                      │  ← Category filter tabs
│  ─────                      │
│  ┌───────────────────────┐ │
│  │ Bench Press           │ │  ← Exercise list
│  │ [+]                   │ │
│  └───────────────────────┘ │
│  ┌───────────────────────┐ │
│  │ Incline DB Press      │ │
│  │ [+]                   │ │
│  └───────────────────────┘ │
│                             │
│  [Create Custom Exercise]   │  ← Link
└─────────────────────────────┘

# Configure Exercise Modal (after selecting):
┌─────────────────────────────┐
│  Bench Press          [×]   │
├─────────────────────────────┤
│  Target Sets                │
│  ┌───────────────────────┐ │
│  │ 3                     │ │  ← Number input
│  └───────────────────────┘ │
│                             │
│  Target Reps                │
│  ┌───────────────────────┐ │
│  │ 10                    │ │
│  └───────────────────────┘ │
│                             │
│  Target Weight (optional)   │
│  ┌───────────────────────┐ │
│  │ 60                    │ │
│  └───────────────────────┘ │
│                             │
│  Notes (optional)           │
│  ┌───────────────────────┐ │
│  │                       │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │  Add to Day           │ │
│  └───────────────────────┘ │
└─────────────────────────────┘
```

**Component Hierarchy**:
- **Organism**: `routine-editor-page` (domains/routines)
  - **Molecule**: `routine-form` (domains/routines)
    - **Atom**: `input` - Routine name (ui/input)
    - **Molecule**: `day-list` (domains/routines)
      - **Molecule**: `day-card` (domains/routines) - Collapsible day
      - **Atom**: `button` - Add day (ui/button)
  - **Organism**: `day-editor` (domains/routines) - Full-screen day edit
    - **Atom**: `input` - Day name (ui/input)
    - **Molecule**: `exercise-list` (domains/routines)
      - **Molecule**: `exercise-item` (domains/routines) - Draggable
    - **Atom**: `button` - Add exercise (ui/button)
  - **Organism**: `exercise-picker-modal` (domains/routines)
    - **Atom**: `input` - Search (ui/input)
    - **Molecule**: `tabs` - Categories (ui/tabs)
    - **Molecule**: `exercise-grid` (domains/routines)
  - **Organism**: `exercise-config-modal` (domains/routines)
    - **Atom**: `input` - Sets, reps, weight (ui/input)
    - **Atom**: `textarea` - Notes (ui/textarea)

**shadcn/ui Components Needed**:
- `input` - Text and number fields
- `button` - Various actions
- `card` - Day and exercise cards
- `dialog` - Modals for picking and configuring
- `tabs` - Exercise categories
- `accordion` - Collapsible days (alternative to cards)
- `textarea` - Notes

**Custom Components Needed**:
- `draggable-list` - Reorder exercises (could use dnd-kit)
- `exercise-picker` - Search and select from library

**Responsive Breakpoints**:
- **Mobile (< 640px)**: Full-screen modals, stacked layout
- **Tablet/Desktop**: Sidebar modals, 2-column layout

**Accessibility**:
- Drag handles have keyboard alternative (up/down buttons)
- Modals trap focus
- Clear labels for all inputs
- Remove buttons have confirmation

**States**:
- **Creating**: Empty form
- **Editing**: Pre-filled with routine data
- **Adding Exercise**: Modal open
- **Configuring Exercise**: Nested modal or screen
- **Saving**: Loading state

**Text Map Keys** (`domains/routines/routines.text-map.ts`):
- `routineEditor.new.title`: "New Routine"
- `routineEditor.edit.title`: "Edit Routine"
- `routineEditor.name.label`: "Routine Name"
- `routineEditor.name.placeholder`: "e.g., Push-Pull-Legs"
- `routineEditor.days.heading`: "Days"
- `routineEditor.day.exercises`: "{count} exercises"
- `routineEditor.addDay`: "Add Day"
- `routineEditor.save`: "Save Routine"
- `dayEditor.title`: "Day {number}: {name}"
- `dayEditor.name.label`: "Day Name"
- `dayEditor.name.placeholder`: "e.g., Push"
- `dayEditor.exercises.heading`: "Exercises"
- `dayEditor.exercise.sets`: "{sets} sets x {reps}"
- `dayEditor.exercise.edit`: "Edit"
- `dayEditor.exercise.remove`: "Remove"
- `dayEditor.addExercise`: "Add Exercise"
- `dayEditor.save`: "Save Day"
- `exercisePicker.title`: "Add Exercise"
- `exercisePicker.search.placeholder`: "Search exercises"
- `exercisePicker.category.all`: "All"
- `exercisePicker.category.chest`: "Chest"
- `exercisePicker.category.back`: "Back"
- `exercisePicker.category.legs`: "Legs"
- `exercisePicker.createCustom`: "Create Custom Exercise"
- `exerciseConfig.title`: "{exercise}"
- `exerciseConfig.sets.label`: "Target Sets"
- `exerciseConfig.reps.label`: "Target Reps"
- `exerciseConfig.weight.label`: "Target Weight (kg)"
- `exerciseConfig.notes.label`: "Notes (optional)"
- `exerciseConfig.add`: "Add to Day"

---

#### View 8: Exercise Library Page
**Route**: `/library`
**Layout Group**: `(app)`
**User Goal**: Browse available exercises and create custom ones

**Page Purpose**: View all exercises (predefined + custom) with filtering.

**Layout Structure** (Mobile-first):
```
┌─────────────────────────────┐
│  Exercise Library           │
├─────────────────────────────┤
│  ┌───────────────────────┐ │
│  │ 🔍 Search...          │ │  ← Search input
│  └───────────────────────┘ │
│                             │
│  All  Chest  Back  Legs ... │  ← Category tabs
│  ───                        │
│                             │
│  ┌───────────────────────┐ │
│  │ + Create Exercise     │ │  ← Create custom
│  └───────────────────────┘ │
│                             │
│  Predefined (50)            │  ← Section
│  ┌───────────────────────┐ │
│  │ Bench Press           │ │  ← Exercise card
│  │ Chest                 │ │
│  │ [View]                │ │
│  └───────────────────────┘ │
│  ┌───────────────────────┐ │
│  │ Squat                 │ │
│  │ Legs                  │ │
│  │ [View]                │ │
│  └───────────────────────┘ │
│                             │
│  My Custom (2)              │  ← Section
│  ┌───────────────────────┐ │
│  │ Cable Crossover High  │ │
│  │ Chest                 │ │
│  │ [Edit] [Delete]       │ │
│  └───────────────────────┘ │
└─────────────────────────────┘

# Exercise Detail Modal:
┌─────────────────────────────┐
│  Bench Press          [×]   │
├─────────────────────────────┤
│  Category: Chest            │
│                             │
│  Description:               │
│  Compound movement targeting│
│  chest, shoulders, triceps. │
│  Performed lying on bench.  │
│                             │
│  Your Stats (if available): │
│  • Current PR: 80kg         │
│  • Last performed: 2 days ago│
│  • Times used: 24           │
│                             │
│  ┌───────────────────────┐ │
│  │  View Progress        │ │  ← Link to analytics
│  └───────────────────────┘ │
└─────────────────────────────┘
```

**Component Hierarchy**:
- **Organism**: `exercise-library-page` (domains/exercises)
  - **Atom**: `input` - Search (ui/input)
  - **Molecule**: `tabs` - Categories (ui/tabs)
  - **Atom**: `button` - Create exercise (ui/button)
  - **Molecule**: `exercise-list` (domains/exercises)
    - **Molecule**: `exercise-card` (domains/exercises)
  - **Organism**: `exercise-detail-modal` (domains/exercises)
    - **Molecule**: `exercise-stats` (domains/exercises)

**shadcn/ui Components Needed**:
- `input` - Search field
- `tabs` - Category filters
- `button` - Create and actions
- `card` - Exercise cards
- `dialog` - Detail modal
- `badge` - Category indicator
- `skeleton` - Loading state

**Custom Components Needed**:
- `exercise-card` - Shows exercise with category
- `exercise-stats` - User's stats for that exercise

**Responsive Breakpoints**:
- **Mobile (< 640px)**: Single column list
- **Tablet (640px - 1024px)**: 2-column grid
- **Desktop (> 1024px)**: 3-column grid

**Accessibility**:
- Search has aria-label and debounced input
- Category tabs keyboard navigable
- Each exercise card has descriptive aria-label
- Exercise detail announced when modal opens

**States**:
- **Loading**: Skeleton cards
- **Empty Search**: "No exercises found for '{query}'"
- **No Custom**: Hide "My Custom" section
- **Detail Modal**: Shows exercise info

**Text Map Keys** (`domains/exercises/exercises.text-map.ts`):
- `library.heading`: "Exercise Library"
- `library.search.placeholder`: "Search exercises"
- `library.create`: "Create Exercise"
- `library.category.all`: "All"
- `library.category.chest`: "Chest"
- `library.category.back`: "Back"
- `library.category.legs`: "Legs"
- `library.category.shoulders`: "Shoulders"
- `library.category.arms`: "Arms"
- `library.category.core`: "Core"
- `library.category.cardio`: "Cardio"
- `library.predefined.heading`: "Predefined ({count})"
- `library.custom.heading`: "My Custom ({count})"
- `library.empty.search`: "No exercises found for '{query}'"
- `library.card.view`: "View"
- `library.card.edit`: "Edit"
- `library.card.delete`: "Delete"
- `exerciseDetail.title`: "{exercise}"
- `exerciseDetail.category`: "Category: {category}"
- `exerciseDetail.description.label`: "Description"
- `exerciseDetail.stats.heading`: "Your Stats"
- `exerciseDetail.stats.pr`: "Current PR: {weight}kg"
- `exerciseDetail.stats.lastPerformed`: "Last performed: {date}"
- `exerciseDetail.stats.timesUsed`: "Times used: {count}"
- `exerciseDetail.viewProgress`: "View Progress"

---

#### View 9: Workout History Page
**Route**: `/history`
**Layout Group**: `(app)`
**User Goal**: Review my past workout sessions

**Page Purpose**: Browse and filter completed workout sessions.

**Layout Structure** (Mobile-first):
```
┌─────────────────────────────┐
│  Workout History            │
├─────────────────────────────┤
│  ┌──────┐  ┌──────┐        │
│  │ Last │  │ All  │  [▼]   │  ← Filters (date, routine)
│  │ Week │  │Routines│       │
│  └──────┘  └──────┘        │
│                             │
│  ┌───────────────────────┐ │
│  │ Today                 │ │  ← Session card
│  │ Push Day • 45 min     │ │
│  │ 💪 6 exercises        │ │
│  │ 📊 2,850 kg volume    │ │
│  │ ⭐⭐⭐⭐⭐            │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │ Yesterday             │ │
│  │ Pull Day • 50 min     │ │
│  │ 💪 5 exercises        │ │
│  │ 📊 3,100 kg volume    │ │
│  │ ⭐⭐⭐⭐☆            │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │ 2 days ago            │ │
│  │ Leg Day • 60 min      │ │
│  │ 💪 8 exercises        │ │
│  │ 📊 4,200 kg volume    │ │
│  │ ⭐⭐⭐⭐⭐            │ │
│  └───────────────────────┘ │
│                             │
│  [Load More]                │  ← Pagination
└─────────────────────────────┘

# Empty State:
┌─────────────────────────────┐
│  No workouts yet            │
│                             │
│  📋 Start your first        │
│     workout to see          │
│     your history here       │
│                             │
│  ┌───────────────────────┐ │
│  │  Go to Dashboard      │ │
│  └───────────────────────┘ │
└─────────────────────────────┘
```

**Component Hierarchy**:
- **Organism**: `history-page` (domains/workouts)
  - **Molecule**: `history-filters` (domains/workouts)
    - **Atom**: `select` - Date range (ui/select)
    - **Atom**: `select` - Routine filter (ui/select)
  - **Molecule**: `session-list` (domains/workouts)
    - **Molecule**: `session-summary-card` (domains/workouts)
  - **Atom**: `button` - Load more (ui/button)
  - **Molecule**: `empty-state` (components/molecules)

**shadcn/ui Components Needed**:
- `select` - Filter dropdowns
- `card` - Session cards
- `button` - Load more
- `skeleton` - Loading state

**Custom Components Needed**:
- `session-summary-card` - Compact session display
- `star-display` - Read-only star rating

**Responsive Breakpoints**:
- **Mobile (< 640px)**: Single column, full-width cards
- **Tablet/Desktop**: 2-column grid or larger cards

**Accessibility**:
- Filters have clear labels
- Each session card is clickable with descriptive label
- Star ratings use aria-label: "Rated 4 out of 5 stars"
- Infinite scroll alternative: "Load more" button

**States**:
- **Loading**: Skeleton cards
- **Empty**: Encouragement to start first workout
- **With History**: List of sessions
- **Filtered**: Show filter tags

**Text Map Keys** (`domains/workouts/workouts.text-map.ts`):
- `history.heading`: "Workout History"
- `history.filter.date.label`: "Date Range"
- `history.filter.date.lastWeek`: "Last Week"
- `history.filter.date.lastMonth`: "Last Month"
- `history.filter.date.last3Months`: "Last 3 Months"
- `history.filter.date.all`: "All Time"
- `history.filter.routine.label`: "Routine"
- `history.filter.routine.all`: "All Routines"
- `history.card.duration`: "{duration} min"
- `history.card.exercises`: "{count} exercises"
- `history.card.volume`: "{volume} kg volume"
- `history.loadMore`: "Load More"
- `history.empty.heading`: "No workouts yet"
- `history.empty.message`: "Start your first workout to see your history here"
- `history.empty.action`: "Go to Dashboard"

---

#### View 10: Routine Detail Page
**Route**: `/routines/[id]`
**Layout Group**: `(app)`
**User Goal**: See full details of a specific routine

**Page Purpose**: View complete routine structure with all days and exercises.

**Layout Structure** (Mobile-first):
```
┌─────────────────────────────┐
│ ← Back  Push-Pull-Legs      │
│         ⭐ Active            │  ← Active badge if active
├─────────────────────────────┤
│  ┌───────────────────────┐ │
│  │ [Edit Routine]        │ │  ← Actions
│  │ [Activate] [Archive]  │ │
│  └───────────────────────┘ │
│                             │
│  6 days • 42 total exercises│  ← Summary
│                             │
│  ──── Day 1: Push ────      │  ← Day section
│  1. Bench Press             │
│     3 sets x 10 @ 60kg      │
│  2. Incline DB Press        │
│     3 sets x 12 @ 25kg      │
│  3. DB Flyes                │
│     3 sets x 15 @ 15kg      │
│  ... (3 more)               │
│                             │
│  ──── Day 2: Pull ────      │
│  1. Deadlift                │
│     3 sets x 8 @ 100kg      │
│  ... (4 more)               │
│                             │
│  ──── Day 3: Legs ────      │
│  ... (exercises)            │
│                             │
│  ┌───────────────────────┐ │
│  │  Start Workout        │ │  ← Primary CTA
│  └───────────────────────┘ │
└─────────────────────────────┘
```

**Component Hierarchy**:
- **Organism**: `routine-detail-page` (domains/routines)
  - **Molecule**: `routine-header` (domains/routines)
    - **Atom**: `badge` - Active status (ui/badge)
    - **Molecule**: `action-buttons` (domains/routines)
  - **Molecule**: `routine-summary` (domains/routines)
  - **Molecule**: `day-list` (domains/routines)
    - **Molecule**: `day-section` (domains/routines)
      - **Molecule**: `exercise-list-item` (domains/routines)

**shadcn/ui Components Needed**:
- `badge` - Active indicator
- `button` - Actions
- `separator` - Between days
- `card` - Optional wrapper

**Responsive Breakpoints**:
- **Mobile/Tablet/Desktop**: Single column, readable width

**Accessibility**:
- Days have heading hierarchy (h2)
- Exercise list uses semantic list
- Start workout button is prominent

**States**:
- **Loading**: Skeleton
- **Active Routine**: Shows badge and different CTA
- **Inactive Routine**: Shows "Activate" option

**Text Map Keys** (`domains/routines/routines.text-map.ts`):
- `routineDetail.back`: "Back"
- `routineDetail.active.badge`: "Active"
- `routineDetail.edit`: "Edit Routine"
- `routineDetail.activate`: "Activate"
- `routineDetail.archive`: "Archive"
- `routineDetail.summary`: "{days} days • {exercises} total exercises"
- `routineDetail.day.heading`: "Day {number}: {name}"
- `routineDetail.exercise.config`: "{sets} sets x {reps} @ {weight}kg"
- `routineDetail.startWorkout`: "Start Workout"

---

#### View 11: Workout Session Detail Page
**Route**: `/history/[id]`
**Layout Group**: `(app)`
**User Goal**: Review a completed workout session in detail

**Page Purpose**: See all exercises and sets from a past session.

**Layout Structure** (Mobile-first):
```
┌─────────────────────────────┐
│ ← Back  Push Day            │
│         Nov 3, 2025         │
├─────────────────────────────┤
│  ⏱ Duration: 45 min         │
│  💪 Exercises: 6            │
│  📊 Volume: 2,850 kg        │
│  ⭐⭐⭐⭐⭐                  │  ← Rating
│                             │
│  Session Notes:             │
│  "Felt great today!"        │
│                             │
│  ──── Exercises ────        │
│                             │
│  1. Bench Press             │
│     Set 1: 60kg x 10 ✓      │
│     Set 2: 60kg x 10 ✓      │
│     Set 3: 60kg x 9 ✓       │
│     💬 "Last rep was hard"  │  ← Exercise note
│                             │
│  2. Incline DB Press        │
│     Set 1: 25kg x 12 ✓      │
│     Set 2: 25kg x 12 ✓      │
│     Set 3: 25kg x 11 ✓      │
│                             │
│  ... (4 more exercises)     │
│                             │
│  ┌───────────────────────┐ │
│  │  Repeat Workout       │ │  ← Action
│  └───────────────────────┘ │
└─────────────────────────────┘
```

**Component Hierarchy**:
- **Organism**: `session-detail-page` (domains/workouts)
  - **Molecule**: `session-header` (domains/workouts)
  - **Molecule**: `session-stats` (domains/workouts)
  - **Molecule**: `session-notes` (domains/workouts)
  - **Molecule**: `exercise-detail-list` (domains/workouts)
    - **Molecule**: `exercise-detail-item` (domains/workouts)
      - **Molecule**: `set-list` (domains/workouts)

**shadcn/ui Components Needed**:
- `separator` - Between sections
- `button` - Repeat workout
- `card` - Optional wrapper

**Responsive Breakpoints**:
- **Mobile/Tablet/Desktop**: Single column, readable width

**Accessibility**:
- Stats have descriptive aria-labels
- Exercise sections use heading hierarchy
- Completed sets have visual indicator (checkmark)

**States**:
- **Loading**: Skeleton
- **Loaded**: Full session data

**Text Map Keys** (`domains/workouts/workouts.text-map.ts`):
- `sessionDetail.back`: "Back"
- `sessionDetail.date`: "{date}"
- `sessionDetail.duration`: "Duration: {time}"
- `sessionDetail.exercises`: "Exercises: {count}"
- `sessionDetail.volume`: "Volume: {volume} kg"
- `sessionDetail.notes.heading`: "Session Notes"
- `sessionDetail.exercises.heading`: "Exercises"
- `sessionDetail.set`: "Set {number}: {weight}kg x {reps}"
- `sessionDetail.exerciseNote`: "Note: {note}"
- `sessionDetail.repeatWorkout`: "Repeat Workout"

---

#### View 12: Exercise Detail Page (from Library)
**Route**: `/library/[id]`
**Layout Group**: `(app)`
**User Goal**: See detailed info and my history with this exercise

**Page Purpose**: View exercise description and personal statistics.

**Layout Structure** (Mobile-first):
```
┌─────────────────────────────┐
│ ← Back  Bench Press         │
├─────────────────────────────┤
│  Category: Chest            │
│                             │
│  Description                │
│  Compound movement targeting│
│  pectorals, anterior deltoids│
│  and triceps. Performed lying│
│  on a flat bench.           │
│                             │
│  ──── Your Stats ────       │
│                             │
│  💪 Current PR: 80kg        │
│  📈 Last performed: 2 days ago│
│  🔄 Times used: 24          │
│  📊 Avg weight: 65kg        │
│                             │
│  ──── Recent History ────   │
│  ┌───────────────────────┐ │
│  │ Nov 3 • Push Day      │ │
│  │ 60kg x 10, 10, 9      │ │
│  └───────────────────────┘ │
│  ┌───────────────────────┐ │
│  │ Nov 1 • Push Day      │ │
│  │ 60kg x 10, 10, 10     │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │  View Full Progress   │ │  ← Link to analytics
│  └───────────────────────┘ │
└─────────────────────────────┘
```

**Component Hierarchy**:
- **Organism**: `exercise-detail-page` (domains/exercises)
  - **Molecule**: `exercise-header` (domains/exercises)
  - **Molecule**: `exercise-description` (domains/exercises)
  - **Molecule**: `exercise-stats` (domains/exercises)
  - **Molecule**: `recent-history-list` (domains/exercises)
    - **Molecule**: `history-item` (domains/exercises)

**shadcn/ui Components Needed**:
- `badge` - Category
- `separator` - Between sections
- `button` - View progress
- `card` - History items

**Responsive Breakpoints**:
- **Mobile/Tablet/Desktop**: Single column, readable width

**Accessibility**:
- Stats have semantic structure
- History list is a proper ul/li

**States**:
- **Loading**: Skeleton
- **No Stats**: "You haven't used this exercise yet"
- **With Stats**: Full stats display

**Text Map Keys** (`domains/exercises/exercises.text-map.ts`):
- `exerciseDetail.back`: "Back"
- `exerciseDetail.category`: "Category: {category}"
- `exerciseDetail.description.heading`: "Description"
- `exerciseDetail.stats.heading`: "Your Stats"
- `exerciseDetail.stats.pr`: "Current PR: {weight}kg"
- `exerciseDetail.stats.lastPerformed`: "Last performed: {date}"
- `exerciseDetail.stats.timesUsed`: "Times used: {count}"
- `exerciseDetail.stats.avgWeight`: "Avg weight: {weight}kg"
- `exerciseDetail.stats.empty`: "You haven't used this exercise yet"
- `exerciseDetail.history.heading`: "Recent History"
- `exerciseDetail.history.item`: "{date} • {routine}"
- `exerciseDetail.viewProgress`: "View Full Progress"

---

## 4. Global UI Components Needed

### shadcn/ui Components to Install

**Already needed based on views above**:
1. `button` - Primary, secondary, ghost variants
2. `input` - Text, number, email, password
3. `card` - Container for content blocks
4. `badge` - Status indicators
5. `separator` - Visual dividers
6. `dialog` - Modals
7. `select` - Dropdowns
8. `checkbox` - Form checkboxes
9. `label` - Form labels
10. `textarea` - Multi-line text input
11. `toast` - Notifications
12. `skeleton` - Loading states
13. `avatar` - User profile images
14. `sheet` - Mobile navigation drawer
15. `progress` - Progress bars
16. `dropdown-menu` - Action menus
17. `tabs` - Category filters
18. `accordion` - Collapsible sections (alternative)
19. `alert` - Success/error messages

### Custom Shared Components to Build

**Atoms** (`src/components/atoms/`):
- `logo.tsx` - App logo/branding
- `icon-button.tsx` - Button with only icon
- `star-display.tsx` - Read-only star rating
- `stat-badge.tsx` - Numeric stat with icon

**Molecules** (`src/components/molecules/`):
- `password-input.tsx` (already exists as `eye-password.tsx`) - Password with toggle
- `number-input.tsx` - Input with +/- buttons
- `star-rating.tsx` - Interactive 1-5 star selector
- `empty-state.tsx` - Reusable empty state
- `stat-card.tsx` - Card showing single metric
- `search-input.tsx` - Input with search icon

**Organisms** (`src/components/organisms/`):
- `header.tsx` - Mobile app header with hamburger
- `sidebar.tsx` - Desktop navigation sidebar
- `mobile-nav.tsx` - Mobile navigation drawer (sheet)

**Layouts** (`src/components/layout/`):
- `app-layout.tsx` - Main layout with header/sidebar
- `auth-layout.tsx` - Centered card layout for auth pages

---

## 5. Navigation Structure

### Primary Navigation (Desktop Sidebar)

```
┌─────────────────┐
│ [Logo] Gym      │
│        Tracker  │
├─────────────────┤
│ 📊 Dashboard    │  ← /dashboard
│ 🏋 Routines     │  ← /routines
│ 📋 History      │  ← /history
│ 📚 Library      │  ← /library
│ 🎯 Goals        │  ← /goals (Phase 3)
├─────────────────┤
│ [Avatar]        │
│ User Name       │
│ Settings • Logout│
└─────────────────┘
```

### Mobile Navigation (Bottom or Hamburger)

**Option A - Hamburger Sheet** (Recommended):
- Header with hamburger icon
- Sheet drawer slides from left
- Same structure as desktop sidebar

**Option B - Bottom Navigation**:
- Fixed bottom bar with 4-5 icons
- Dashboard, Routines, History, Library, More

**Recommendation**: Option A (Hamburger) for consistency with desktop and more space for future features.

### Breadcrumbs (Desktop only)

For nested pages:
- `/routines/[id]`: Dashboard > Routines > Push-Pull-Legs
- `/history/[id]`: Dashboard > History > Nov 3, 2025

---

## 6. Design System Specifications

### Color Palette (Tailwind defaults + semantic)

**Primary**:
- Default: blue-600
- Hover: blue-700
- Active: blue-800

**Success**: green-600
**Warning**: amber-500
**Error**: red-600
**Info**: blue-500

**Neutral**:
- Background: white / gray-950 (dark mode)
- Text: gray-900 / gray-50 (dark mode)
- Borders: gray-200 / gray-800 (dark mode)

### Typography Scale

**Headings**:
- h1: text-3xl font-bold (2.25rem)
- h2: text-2xl font-semibold (1.875rem)
- h3: text-xl font-semibold (1.5rem)
- h4: text-lg font-medium (1.125rem)

**Body**:
- Base: text-base (1rem / 16px)
- Small: text-sm (0.875rem / 14px)
- Tiny: text-xs (0.75rem / 12px)

### Spacing Scale (Tailwind)

- Tight: space-y-2 (0.5rem)
- Normal: space-y-4 (1rem)
- Relaxed: space-y-6 (1.5rem)
- Loose: space-y-8 (2rem)

### Border Radius

- Small: rounded-md (0.375rem)
- Default: rounded-lg (0.5rem)
- Large: rounded-xl (0.75rem)
- Full: rounded-full (9999px)

### Shadows

- Small: shadow-sm
- Default: shadow
- Medium: shadow-md
- Large: shadow-lg (modals)

### Transitions

- Fast: duration-150 (hover effects)
- Default: duration-200
- Slow: duration-300 (modals, drawers)

---

## 7. Accessibility Strategy

### Keyboard Navigation

**Global**:
- Tab: Move forward through interactive elements
- Shift+Tab: Move backward
- Enter/Space: Activate buttons/links
- Escape: Close modals/sheets

**Forms**:
- Arrow keys: Navigate radio/checkbox groups
- Enter: Submit form

**Lists**:
- Arrow keys: Navigate items (optional enhancement)

### Screen Reader Support

**Landmarks**:
- `<header>` - App header
- `<nav>` - Navigation
- `<main>` - Main content
- `<aside>` - Sidebar
- `<footer>` - Footer (if applicable)

**ARIA Labels**:
- All interactive elements without visible text
- Stats: "Current streak: 5 days"
- Actions: "Edit routine: Push-Pull-Legs"

**Live Regions**:
- Toast notifications: `aria-live="polite"`
- Error messages: `aria-live="assertive"`

### Focus Management

**Modals**:
- Focus trap within modal
- Return focus to trigger on close
- Escape key closes modal

**Forms**:
- Focus first invalid field on error
- Clear focus indicators (ring-2 ring-offset-2)

### Color Contrast

**WCAG 2.1 AA Minimum**:
- Text: 4.5:1 ratio
- Large text (18px+): 3:1 ratio
- Interactive elements: 3:1 ratio

**Testing**: Use browser DevTools Lighthouse audit

---

## 8. Responsive Design Strategy

### Mobile First Approach

**All CSS starts with mobile (< 640px)**:
```css
.card {
  @apply w-full p-4;
}

@media (min-width: 640px) {
  .card {
    @apply max-w-md;
  }
}
```

### Breakpoint Usage

**Mobile (< 640px)**:
- Single column layouts
- Full-width cards
- Stacked forms
- Bottom sheet modals
- Large touch targets (48x48px minimum)

**Tablet (640px - 1024px)**:
- 2-column grids
- Hamburger navigation still
- Modals max-width 600px

**Desktop (> 1024px)**:
- Sidebar navigation
- 3-column grids
- Modals max-width 800px
- Hover states enabled

### Touch vs Mouse

**Mobile**:
- No hover states (fallback to tap)
- Larger touch targets
- Swipe gestures (optional)

**Desktop**:
- Hover previews
- Tooltips on hover
- Right-click context menus (optional)

---

## 9. Performance Considerations

### Loading States

**Critical Pages** (Dashboard, Active Workout):
- Skeleton screens
- No layout shift
- Load in < 2 seconds

**Secondary Pages**:
- Loading spinner acceptable
- Load in < 3 seconds

### Images & Assets

**Icons**: Use Lucide React (tree-shakeable)
**Logos**: SVG format, inline
**User Avatars**: Lazy load, placeholder initials

### Code Splitting

**Heavy Components**:
- Charts (Phase 2): Dynamic import
- Exercise picker modal: Dynamic import if > 50kb

**Route-based**: Next.js handles automatically

---

## 10. Implementation Coordination

### With Other Agents

**shadcn-builder Agent**:
- Provide list of shadcn/ui components needed (see Section 4)
- Request installation and configuration
- Specify variant customizations if needed

**domain-architect Agent**:
- Request data structure for:
  - User preferences (theme, units)
  - Workout session state (in-progress)
  - Routine activation logic

**nextjs-builder Agent**:
- Provide route structure (all routes listed above)
- Request route groups: `(auth)`, `(app)`
- Request layout compositions

### Files to Create

**Text Maps** (domain-specific):
- `src/domains/auth/auth.text-map.ts`
- `src/domains/routines/routines.text-map.ts`
- `src/domains/workouts/workouts.text-map.ts`
- `src/domains/exercises/exercises.text-map.ts`

**Shared Components** (`src/components/`):
- `atoms/logo.tsx`
- `atoms/stat-badge.tsx`
- `molecules/number-input.tsx`
- `molecules/star-rating.tsx`
- `molecules/empty-state.tsx`
- `molecules/stat-card.tsx`
- `organisms/header.tsx`
- `organisms/sidebar.tsx`
- `layout/app-layout.tsx`
- `layout/auth-layout.tsx`

**Domain Components** (`src/domains/`):
- Auth: `login-form`, `register-form`, `password-recovery-form`, `password-requirements`
- Routines: `routine-card`, `routine-form`, `day-editor`, `exercise-picker`
- Workouts: `session-card`, `train-today-card`, `exercise-tracker`, `workout-timer`
- Exercises: `exercise-card`, `exercise-detail`

**Pages** (`src/app/`):
- `(auth)/login/page.tsx`
- `(auth)/register/page.tsx`
- `(auth)/forgot-password/page.tsx`
- `(app)/dashboard/page.tsx`
- `(app)/routines/page.tsx`
- `(app)/routines/new/page.tsx`
- `(app)/routines/[id]/page.tsx`
- `(app)/routines/[id]/edit/page.tsx`
- `(app)/workout/active/page.tsx`
- `(app)/history/page.tsx`
- `(app)/history/[id]/page.tsx`
- `(app)/library/page.tsx`
- `(app)/library/[id]/page.tsx`

**Layouts**:
- `(auth)/layout.tsx` - Centered card layout
- `(app)/layout.tsx` - App layout with sidebar/header

---

## 11. UX Recommendations

### Critical UX Principles for Gym Tracker

1. **Speed is King**: Users are in the gym, they need to log sets FAST
   - Autofocus inputs
   - +/- buttons for quick weight adjustments
   - "Copy previous set" button
   - Auto-save progress

2. **Prevent Data Loss**: Active workouts are precious
   - Auto-save every input
   - Confirm before exiting active workout
   - Draft sessions saved locally

3. **Visual Feedback**: Every action needs acknowledgment
   - Set completed → green checkmark + haptic (mobile)
   - Loading states on all async actions
   - Toast notifications for success/error

4. **Reduce Cognitive Load**: Simple, clear UI
   - One primary action per screen
   - Clear visual hierarchy
   - Minimal text, maximum clarity

5. **Mobile-First Reality**: Most users will be on mobile in gym
   - Large touch targets (48x48px)
   - Readable text (16px minimum body)
   - One-handed operation where possible

### Micro-interactions

**Set Completion**:
- Button tap → Checkmark animation → Green background → Haptic feedback → Auto-advance

**Exercise Progress**:
- Progress bar fills smoothly
- Celebration animation on last exercise

**Stats Updates**:
- Numbers animate/count up (e.g., streak)
- Milestone achievements (confetti on PR)

---

## 12. Next Steps for Parent Agent

### Phase 1A - Start Here (Week 1)

1. **Request shadcn/ui components** from shadcn-builder:
   - All components listed in Section 4
   - Verify installation and test rendering

2. **Create shared layout components**:
   - `app-layout.tsx` with sidebar/header
   - `auth-layout.tsx` with centered card
   - `header.tsx` and `sidebar.tsx` organisms

3. **Build auth pages** (UI only, no functionality):
   - Login page with mock form
   - Register page with password requirements
   - Password recovery page

4. **Create text maps**:
   - `auth.text-map.ts` with all keys from Section 3.1

**Deliverable**: All auth pages render with correct UI structure, no business logic.

### Phase 1B - Core Flow (Week 2-3)

5. **Build dashboard page** (UI only):
   - Stats cards (mock data)
   - Train today card
   - Recent activity list

6. **Build routines list page**:
   - Routine cards
   - Empty state

7. **Build active workout page**:
   - Exercise tracker
   - Set input interface
   - Summary screen

**Deliverable**: User can navigate through core workout flow (visual only).

### Phase 1C - Management (Week 3-4)

8. **Build routine editor**:
   - Routine form
   - Day editor
   - Exercise picker modal

9. **Build exercise library**:
   - Search and filter UI
   - Exercise cards

10. **Build history page**:
    - Session list
    - Filter UI

**Deliverable**: All Phase 1 views complete with static UI.

### Phase 1D - Detail Views (Week 4)

11. **Build detail pages**:
    - Routine detail
    - Session detail
    - Exercise detail

**Deliverable**: Full Phase 1 UI complete, ready for business logic integration.

---

## 13. Success Criteria

**Phase 1 UI Complete When**:
- ✅ All 12 views render correctly
- ✅ All responsive breakpoints work (mobile/tablet/desktop)
- ✅ Keyboard navigation works throughout
- ✅ Screen reader announces content correctly
- ✅ All text externalized to text maps
- ✅ No console errors or warnings
- ✅ Lighthouse accessibility score > 90
- ✅ No hardcoded strings in components
- ✅ All shadcn/ui components installed and working

**Visual QA Checklist**:
- [ ] Colors consistent with design system
- [ ] Typography scale followed
- [ ] Spacing consistent (4/8/16/24/32px scale)
- [ ] Touch targets minimum 48x48px on mobile
- [ ] Focus indicators visible
- [ ] Loading states implemented
- [ ] Empty states implemented
- [ ] Error states designed (even if not functional yet)

---

## 14. Important Notes

**UI-First Benefits**:
- Early user feedback on design
- Clear visual target for functionality
- Parallel work: UI team and backend team
- Easier to iterate on design before logic is implemented

**Risks to Mitigate**:
- Don't add business logic during UI phase (stay disciplined!)
- Keep components pure/stateless where possible
- Use mock data structures that match expected API shape
- Document any UX decisions that affect backend design

**Coordination Points**:
- Active workout state management needs planning (discuss with domain-architect)
- Text map structure should be reviewed (consistent keys)
- shadcn/ui theme customization (if needed beyond defaults)

---

## 15. Appendix: Route Map

| View                       | Route                    | Layout Group | Priority |
|----------------------------|--------------------------|--------------|----------|
| Login                      | `/login`                 | `(auth)`     | P0       |
| Register                   | `/register`              | `(auth)`     | P0       |
| Password Recovery          | `/forgot-password`       | `(auth)`     | P1       |
| Dashboard                  | `/dashboard`             | `(app)`      | P0       |
| Routines List              | `/routines`              | `(app)`      | P0       |
| Routine Detail             | `/routines/[id]`         | `(app)`      | P1       |
| Create Routine             | `/routines/new`          | `(app)`      | P0       |
| Edit Routine               | `/routines/[id]/edit`    | `(app)`      | P0       |
| Active Workout             | `/workout/active`        | `(app)`      | P0       |
| Workout History            | `/history`               | `(app)`      | P0       |
| Session Detail             | `/history/[id]`          | `(app)`      | P1       |
| Exercise Library           | `/library`               | `(app)`      | P0       |
| Exercise Detail            | `/library/[id]`          | `(app)`      | P1       |

**Total Routes**: 13

---

**End of Plan**

**This plan provides**:
- Complete view inventory
- Wireframe descriptions for every view
- Component breakdown (atomic design)
- shadcn/ui requirements
- Text map structure
- Accessibility strategy
- Responsive design approach
- Implementation order

**Ready for parent agent to execute step-by-step.**
