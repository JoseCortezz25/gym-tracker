# Product Requirements Document (PRD)

**Project**: Gym Tracker - Workout Tracking Application
**Version**: 1.0
**Last Updated**: 2025-11-03
**Document Owner**: Business Analyst Agent

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision](#2-product-vision)
3. [Users and Roles](#3-users-and-roles)
4. [Scope and Phases](#4-scope-and-phases)
5. [PHASE 1: Core MVP - Basic Tracking](#5-phase-1-core-mvp---basic-tracking)
6. [PHASE 2: Analytics & Progress](#6-phase-2-analytics--progress)
7. [PHASE 3: Goals & Recommendations](#7-phase-3-goals--recommendations)
8. [Data Models](#8-data-models)
9. [Business Rules](#9-business-rules)
10. [Technical Requirements](#10-technical-requirements)
11. [Success Metrics](#11-success-metrics)
12. [Risks and Mitigation](#12-risks-and-mitigation)
13. [Pending Questions](#13-pending-questions)
14. [Approval and Changes](#14-approval-and-changes)

---

## 1. Executive Summary

Gym Tracker is a progressive web application designed to help individual users manage and track their gym workouts. The application allows creating custom routines, recording training sessions, visualizing progress over time, and setting performance goals.

The product will be developed in **3 main phases**:

- **Phase 1 (Core MVP)**: Basic system for creating routines, recording exercises, and logging sessions
- **Phase 2 (Analytics)**: Progress visualization, performance charts, and trend analysis
- **Phase 3 (Goals)**: Goal system, intelligent recommendations based on history

**Out of scope**: Nutrition features, sleep tracking, social features, and sharing routines with other users.

---

## 2. Product Vision

### 2.1 Problem to Solve

Users who train at the gym face several challenges:

- **Lack of structure**: They don't have an organized system to plan workouts
- **Data loss**: They record progress on paper or scattered notes that get lost
- **No progress visibility**: Difficult to see improvements over time
- **Demotivation**: Without clear metrics, they lose motivation by not seeing tangible results
- **Inefficiency**: They repeat routines without optimization based on past performance

### 2.2 Value Proposition

Gym Tracker offers:

✅ **Clear organization**: Structured and easy-to-follow routines
✅ **Consistent tracking**: Quick recording of each session with all details
✅ **Progress visibility**: Charts and metrics that show real improvements
✅ **Increased motivation**: Goal and achievement system that maintains engagement
✅ **Continuous optimization**: Recommendations based on performance history

### 2.3 Target Users

**Primary Profile**: Person between 18-45 years old who trains regularly (2-6 times/week) at the gym or at home.

**Experience Levels**:

- **Beginner**: Just starting to train, needs structure and guidance
- **Intermediate**: Has been training for 6+ months, seeks to optimize and improve consistency
- **Advanced**: Experienced athlete, requires detailed tracking and deep analysis

**Main Pain Points**:

- Doesn't know what to train each day
- Forgets what weights/repetitions used last time
- Doesn't see clear progress over time
- Loses motivation due to lack of metrics

---

## 3. Users and Roles

### 3.1 Individual User (only role in MVP)

**Description**: User who creates account, manages their own routines, records workouts, and visualizes their personal progress.

**Capabilities**:

- ✅ Create, edit, and delete workout routines
- ✅ Record complete training sessions
- ✅ View workout history
- ✅ Visualize progress charts (Phase 2)
- ✅ Set and track goals (Phase 3)
- ✅ Receive personalized recommendations (Phase 3)

**Restrictions**:

- ❌ Cannot view data from other users
- ❌ Cannot share routines with others
- ❌ Cannot access nutrition/sleep features (out of scope)

**Main Use Cases**:

1. Create a weekly "Push-Pull-Legs" routine
2. Record chest and biceps training session
3. View bench press weight progress over the last 3 months
4. Set goal to increase squat from 100kg to 120kg in 8 weeks

---

## 4. Scope and Phases

### 4.1 Phase 1: Core MVP - Basic Tracking ✅

**Objective**: Enable creating routines and recording workouts consistently.

**Estimated Duration**: 4-6 weeks

**Includes**:

- ✅ User authentication (registration, login, password recovery)
- ✅ Create workout routines with multiple days
- ✅ Add exercises to routines with configuration (sets, reps, weight)
- ✅ Record training sessions ("Workout Log")
- ✅ View basic history of past sessions
- ✅ Library of predefined exercises (base catalog)

**Success Criteria**:

- User can create a complete routine in < 10 minutes
- User can record a training session in < 5 minutes
- System correctly records all session data

---

### 4.2 Phase 2: Analytics & Progress ✅

**Objective**: Visualize progress and performance over time.

**Estimated Duration**: 3-4 weeks

**Includes**:

- ✅ Progress charts by exercise (weight, total volume)
- ✅ Performance metrics (PRs, estimated 1RM, weekly volume)
- ✅ Period comparison (this month vs last month)
- ✅ Dashboard with activity summary (sessions/week, consistency)
- ✅ Export progress data (CSV, PDF)

**Success Criteria**:

- User can visualize progress for any exercise in < 3 clicks
- Charts load in < 2 seconds
- Dashboard shows relevant metrics clearly

---

### 4.3 Phase 3: Goals & Recommendations ✅

**Objective**: Goal system and intelligent recommendations.

**Estimated Duration**: 4-5 weeks

**Includes**:

- ✅ Create personalized goals (e.g., "increase bench press 10kg in 8 weeks")
- ✅ Track progress towards goals
- ✅ Notifications when approaching or completing goal
- ✅ Progression recommendations (weight/reps increase based on history)
- ✅ Rest suggestions between sessions (based on frequency)
- ✅ Achievement/badge system (gamified motivation)

**Success Criteria**:

- User can create goal in < 2 minutes
- System generates accurate recommendations based on history
- Notifications are relevant and not intrusive

---

### 4.4 Out of Scope ❌

**Explicitly NOT included**:

- ❌ **Phase 4**: Nutrition, sleep, hydration tracking
- ❌ **Phase 5**: Social features, share routines, community
- ❌ Integration with wearables (Apple Watch, Fitbit)
- ❌ AI-generated training plans
- ❌ Virtual coach or chat with trainers
- ❌ Marketplace for routines or paid programs

**Reason**: Maintain focus on core value (workout tracking) before expanding.

---

## 5. PHASE 1: Core MVP - Basic Tracking

### 5.1 Epic: Authentication and User Management

#### US-1.1: New User Registration

**As a** new user
**I want to** register with email and password
**So that** I can create my account and start using the application

**Acceptance Criteria**:

- [ ] Form with fields: email, password, confirm password
- [ ] Validation of unique email (doesn't exist in system)
- [ ] Password minimum 8 characters, includes letter and number
- [ ] Shows inline errors if validation fails
- [ ] After successful registration, sends verification email
- [ ] User can log in immediately after registration

**Priority**: P0 (Critical)
**Complexity**: Small (S)

---

#### US-1.2: User Login

**As a** registered user
**I want to** log in with my credentials
**So that** I can access my account and data

**Acceptance Criteria**:

- [ ] Form with email and password
- [ ] Correct credential validation
- [ ] Clear error message if credentials invalid
- [ ] "Remember me" option to keep session active
- [ ] Redirect to dashboard after successful login
- [ ] Shows loading state during authentication

**Priority**: P0 (Critical)
**Complexity**: Small (S)

---

#### US-1.3: Password Recovery

**As a** user who forgot their password
**I want to** receive an email to reset it
**So that** I can regain access to my account

**Acceptance Criteria**:

- [ ] "Forgot your password?" link on login page
- [ ] Form requests email
- [ ] System sends email with reset link (valid 24 hours)
- [ ] Link directs to page to enter new password
- [ ] New password must meet security requirements
- [ ] After successful reset, user can log in

**Priority**: P1 (High)
**Complexity**: Medium (M)

---

### 5.2 Epic: Routine Management

#### US-2.1: Create New Routine

**As a** user
**I want to** create a workout routine with name and days
**So that** I can organize my weekly workouts

**Acceptance Criteria**:

- [ ] "Create Routine" button visible on dashboard
- [ ] Form to enter routine name (e.g., "Push-Pull-Legs")
- [ ] Option to define days of the week (e.g., Monday, Wednesday, Friday)
- [ ] Save empty routine (without exercises yet)
- [ ] Routine appears in user's routine list
- [ ] Validation: name cannot be empty

**Priority**: P0 (Critical)
**Complexity**: Medium (M)

**UI/UX Notes**:

- Modal or dedicated page for creation
- Checkbox-type day selector
- Option to duplicate existing day

---

#### US-2.2: Add Exercises to Routine

**As a** user
**I want to** add exercises to a specific day of my routine
**So that** I can define what I'll train that day

**Acceptance Criteria**:

- [ ] From routine view, I can select a day
- [ ] "Add Exercise" button available
- [ ] I can search for exercise in library or create a new one
- [ ] Configure for that exercise: sets, repetitions, target weight (optional)
- [ ] Exercise is added to the day's list
- [ ] I can reorder exercises (drag & drop or up/down buttons)
- [ ] I can remove exercise from routine

**Priority**: P0 (Critical)
**Complexity**: Large (L)

**OPTION A - FIXED STRUCTURE (Recommended)**:

- Each exercise has fixed configuration: 3 sets x 10 reps @ 50kg
- When recording session, user enters what they actually did
- Advantage: Simplicity in design and UX
- Disadvantage: Less flexible for advanced routines (e.g., drop sets)

**OPTION B - FLEXIBLE STRUCTURE**:

- Each exercise can have multiple set configurations (e.g., Set 1: 12 reps, Set 2: 10 reps, Set 3: 8 reps)
- More complex to implement and use
- Advantage: Greater flexibility for advanced users
- Disadvantage: More complex UX, higher cognitive load

**RECOMMENDATION**: **OPTION A** for MVP (Phase 1). Fixed structure is sufficient for 80% of use cases, simplifies implementation, and improves UX. Consider OPTION B as improvement in Phase 2 or 3 if users request it.

---

#### US-2.3: Edit Existing Routine

**As a** user
**I want to** modify an existing routine
**So that** I can adjust my training plan

**Acceptance Criteria**:

- [ ] I can change routine name
- [ ] I can add/remove days
- [ ] I can modify exercises (change sets, reps, weight)
- [ ] I can delete exercises
- [ ] Changes are saved immediately or with "Save" button
- [ ] Validation before deleting complete routine (confirmation)

**Priority**: P0 (Critical)
**Complexity**: Medium (M)

---

#### US-2.4: Delete Routine

**As a** user
**I want to** delete a routine I no longer use
**So that** I can keep my routine list organized

**Acceptance Criteria**:

- [ ] "Delete Routine" button visible in routine view
- [ ] Confirmation modal before deleting
- [ ] When deleted, routine disappears from list
- [ ] **Business rule**: If routine has recorded sessions, mark as "archived" instead of deleting (preserve history)
- [ ] User can restore archived routine if needed

**Priority**: P1 (High)
**Complexity**: Medium (M)

---

### 5.3 Epic: Exercise Library

#### US-3.1: View Predefined Exercise Catalog

**As a** user
**I want to** see list of predefined exercises
**So that** I can select common exercises without having to create them

**Acceptance Criteria**:

- [ ] "Exercise Library" page/modal
- [ ] List includes minimum 50 common exercises (bench press, squat, deadlift, etc.)
- [ ] Each exercise has: name, category (chest, back, legs, etc.), basic description
- [ ] Search to filter exercises by name
- [ ] Filter by category (muscle group)
- [ ] When selecting exercise, it's added to current routine

**Priority**: P0 (Critical)
**Complexity**: Medium (M)

**Base Catalog (50 minimum exercises)**:

**Chest (6)**:

- Flat bench press
- Incline dumbbell press
- Dumbbell flyes
- Parallel bar dips
- Dumbbell bench press
- Cable crossover

**Back (8)**:

- Deadlift
- Pull-ups
- Barbell row
- Dumbbell row
- Lat pulldown
- Seated cable row
- Pull-over
- Face pulls

**Legs (8)**:

- Back squat
- Front squat
- Leg press
- Romanian deadlift
- Lunges
- Leg extension
- Leg curl
- Calf raises

**Shoulders (6)**:

- Military press
- Dumbbell press
- Lateral raises
- Front raises
- Rear delt fly
- Shrugs

**Arms (8)**:

- Barbell curl
- Dumbbell curl
- Hammer curl
- Preacher curl
- Skull crushers
- Tricep dips
- Tricep pushdown
- Concentration curl

**Core (8)**:

- Front plank
- Side plank
- Crunches
- Leg raises
- Russian twists
- Mountain climbers
- Ab wheel rollout
- Dead bug

**Cardio (6)**:

- Running (treadmill)
- Stationary bike
- Rowing machine
- Elliptical
- Burpees
- Jump rope

---

#### US-3.2: Create Custom Exercise

**As a** user
**I want to** create an exercise that's not in the catalog
**So that** I can add specific movements from my gym or preferences

**Acceptance Criteria**:

- [ ] "Create Exercise" button in library
- [ ] Form: name, category (dropdown), optional description
- [ ] Exercise is saved in "My Custom Exercises"
- [ ] Custom exercise available when adding to routines
- [ ] Validation: name cannot be empty
- [ ] Custom exercise only visible to that user (not shared)

**Priority**: P1 (High)
**Complexity**: Small (S)

---

### 5.4 Epic: Session Recording (Workout Log)

#### US-4.1: Start Training Session

**As a** user
**I want to** start a session based on my routine
**So that** I can record my workout today

**Acceptance Criteria**:

- [ ] Dashboard shows "Train Today" with suggested routine (based on current day)
- [ ] "Start Workout" button visible
- [ ] When starting, session is created with start timestamp
- [ ] Shows list of planned exercises for that day
- [ ] Optional timer to measure total session duration

**Priority**: P0 (Critical)
**Complexity**: Medium (M)

---

#### US-4.2: Record Completed Exercise

**As a** user during an active session
**I want to** record sets, reps, and weight used for each exercise
**So that** I can document my actual performance

**Acceptance Criteria**:

- [ ] Each exercise in active session shows fields to enter data
- [ ] For each set: weight used, repetitions achieved
- [ ] Checkbox to mark set as completed
- [ ] Shows planned weight/reps as reference
- [ ] When completing all sets of an exercise, it's marked as complete
- [ ] Option to add notes per exercise (e.g., "felt knee pain")
- [ ] Data is saved automatically (don't lose progress if app closes)

**Priority**: P0 (Critical)
**Complexity**: Large (L)

**UI/UX Notes**:

- Quick "number" type input for weight and reps
- +/- buttons to adjust values
- Green color when set completed
- "Copy from previous set" option to facilitate entry

---

#### US-4.3: Finish Training Session

**As a** user
**I want to** mark my session as completed
**So that** I can save all data and see summary

**Acceptance Criteria**:

- [ ] "Finish Workout" button visible during session
- [ ] When finishing, end timestamp is saved
- [ ] System calculates total duration (end - start)
- [ ] Shows summary: exercises completed, total volume lifted, duration
- [ ] Option to add general session note (e.g., "felt very tired")
- [ ] Option to rate session (1-5 stars or emoji)
- [ ] **PENDING QUESTION**: Record "motivation level"? See section 13.2

**Priority**: P0 (Critical)
**Complexity**: Medium (M)

---

#### US-4.4: Modify Session During Workout

**As a** user during active session
**I want to** add or remove exercises that weren't planned
**So that** I can adapt my workout to how I feel that day

**Acceptance Criteria**:

- [ ] "Add Exercise" button during active session
- [ ] I can search in library and add new exercise
- [ ] I can remove planned exercise if I decide not to do it
- [ ] Changes don't affect the original routine (only this session)
- [ ] Session saves actually performed exercises

**Priority**: P1 (High)
**Complexity**: Medium (M)

---

### 5.5 Epic: Workout History

#### US-5.1: View List of Past Sessions

**As a** user
**I want to** see all my recorded training sessions
**So that** I can review my history

**Acceptance Criteria**:

- [ ] "History" page with list of sessions
- [ ] Each session shows: date, routine used, duration, total volume
- [ ] List ordered by date (most recent first)
- [ ] Filter by date range (last week, last month, etc.)
- [ ] Filter by specific routine
- [ ] Click on session opens detailed view

**Priority**: P0 (Critical)
**Complexity**: Medium (M)

---

#### US-5.2: View Past Session Detail

**As a** user
**I want to** see all details of a specific session
**So that** I can remember what I did that day

**Acceptance Criteria**:

- [ ] Shows date, duration, routine used
- [ ] Lists all performed exercises
- [ ] For each exercise: sets, reps, weight used
- [ ] Shows notes if I added any
- [ ] Shows session rating if I gave one
- [ ] Option to edit session (if I made error when recording)

**Priority**: P1 (High)
**Complexity**: Small (S)

---

### 5.6 Epic: Main Dashboard

#### US-6.1: Home Dashboard

**As a** user when opening the app
**I want to** see a summary of my activity and upcoming workouts
**So that** I know what to do today and see my recent progress

**Acceptance Criteria**:

- [ ] Shows active routine and corresponding day for today
- [ ] Prominent "Train Today" button
- [ ] Recent activity summary: sessions in last week, total volume lifted
- [ ] Streak of consecutive days training (motivation)
- [ ] Quick access to: My Routines, History, Library
- [ ] Loads in < 2 seconds

**Priority**: P0 (Critical)
**Complexity**: Large (L)

---

## 6. PHASE 2: Analytics & Progress

### 6.1 Epic: Progress Charts by Exercise

#### US-7.1: View Weight Progress for Specific Exercise

**As a** user
**I want to** see a chart of weight evolution for an exercise
**So that** I know if I'm improving

**Acceptance Criteria**:

- [ ] From library or history, select exercise
- [ ] Chart shows maximum weight used per session over time
- [ ] X-axis: dates, Y-axis: weight (kg)
- [ ] Option to change date range (last month, 3 months, 6 months, all)
- [ ] Shows trend (regression line or curve)
- [ ] Loads in < 2 seconds

**Priority**: P0 (Critical for Phase 2)
**Complexity**: Large (L)

**PENDING QUESTION**: See section 13.3 about what specific metrics to show.

---

#### US-7.2: View Total Volume Progress

**As a** user
**I want to** see total volume evolution (weight x reps x sets) for an exercise
**So that** I can evaluate if I'm increasing work capacity

**Acceptance Criteria**:

- [ ] Chart similar to US-7.1 but with total volume on Y-axis
- [ ] Calculation: Σ (weight x reps) for all sets of that exercise per session
- [ ] Shows trend and comparison with previous period
- [ ] Tooltips on mouse hover show exact value

**Priority**: P1 (High)
**Complexity**: Medium (M)

---

### 6.2 Epic: Performance Metrics

#### US-8.1: Personal Records (PRs) Calculation

**As a** user
**I want to** see my personal records by exercise
**So that** I know my best marks

**Acceptance Criteria**:

- [ ] System identifies maximum weight lifted per exercise
- [ ] Identifies maximum repetitions at a given weight
- [ ] Shows date when that PR was achieved
- [ ] Notification when breaking a PR in active session
- [ ] List of PRs ordered by exercise

**Priority**: P1 (High)
**Complexity**: Medium (M)

---

#### US-8.2: 1RM (One-Rep Max) Estimation

**As a** user
**I want to** see estimation of my 1RM for compound exercises
**So that** I can evaluate my real strength

**Acceptance Criteria**:

- [ ] System calculates 1RM using Epley formula: 1RM = weight x (1 + reps/30)
- [ ] Shows current estimated 1RM and evolution over time
- [ ] Only for main compound exercises (squat, bench press, deadlift)
- [ ] Chart of estimated 1RM evolution

**Priority**: P2 (Medium)
**Complexity**: Medium (M)

---

### 6.3 Epic: Analytics Dashboard

#### US-9.1: Monthly Activity Summary

**As a** user
**I want to** see summary of my activity from last month
**So that** I can evaluate my consistency

**Acceptance Criteria**:

- [ ] Shows: total sessions, average sessions/week, total volume lifted
- [ ] Comparison with previous month (% change)
- [ ] Heatmap calendar showing training days
- [ ] Longest streak of the month
- [ ] Most trained muscle group

**Priority**: P0 (Critical for Phase 2)
**Complexity**: Large (L)

---

#### US-9.2: Period Comparison

**As a** user
**I want to** compare my performance between two periods
**So that** I can see if I'm improving compared to before

**Acceptance Criteria**:

- [ ] Selector for two date ranges (e.g., January vs February)
- [ ] Compares: sessions, volume, PRs broken, consistency
- [ ] Shows absolute and percentage difference
- [ ] Identifies exercises where most improved

**Priority**: P2 (Medium)
**Complexity**: Large (L)

---

### 6.4 Epic: Data Export

#### US-10.1: Export Progress Data

**As a** user
**I want to** export my workout data
**So that** I have backup or analyze outside the app

**Acceptance Criteria**:

- [ ] "Export Data" option in settings
- [ ] CSV format with all sessions and exercises
- [ ] PDF format with main progress charts
- [ ] Email with attached file or direct download
- [ ] Includes configurable date range

**Priority**: P2 (Medium)
**Complexity**: Medium (M)

---

## 7. PHASE 3: Goals & Recommendations

### 7.1 Epic: Goal System

#### US-11.1: Create Personalized Goal

**As a** user
**I want to** set a performance goal
**So that** I have a clear objective to achieve

**Acceptance Criteria**:

- [ ] Form: select exercise, goal type (weight, volume, 1RM), target value, deadline
- [ ] Examples: "Increase bench press from 80kg to 90kg in 8 weeks"
- [ ] System validates goal is realistic (no more than +20% in 4 weeks)
- [ ] Goal is saved and appears on dashboard

**Priority**: P0 (Critical for Phase 3)
**Complexity**: Medium (M)

---

#### US-11.2: Track Progress Towards Goal

**As a** user
**I want to** see how close I am to my goal
**So that** I know if I'm on the right track

**Acceptance Criteria**:

- [ ] Visual progress bar (e.g., 60% complete)
- [ ] Shows current value vs target value
- [ ] Estimates completion date based on current trend
- [ ] Shows warning if trend indicates won't reach goal on time

**Priority**: P0 (Critical for Phase 3)
**Complexity**: Medium (M)

---

#### US-11.3: Goal Notifications

**As a** user
**I want to** receive notifications about my goals
**So that** I stay motivated

**Acceptance Criteria**:

- [ ] Notification when reaching 50% progress
- [ ] Notification when completing full goal (celebration)
- [ ] Notification if 7 days without training (reminder)
- [ ] User can configure notification frequency

**Priority**: P1 (High)
**Complexity**: Medium (M)

---

### 7.2 Epic: Intelligent Recommendations

#### US-12.1: Weight Progression Suggestions

**As a** user
**I want to** receive suggestions for how much weight to add
**So that** I can progress optimally without stalling

**Acceptance Criteria**:

- [ ] System analyzes last 3 sessions of an exercise
- [ ] If achieved all reps of all sets, suggests +2.5kg (accessory exercises) or +5kg (compounds)
- [ ] If failed sets, suggests maintaining current weight
- [ ] If failed many reps, suggests reducing weight 5-10%
- [ ] Notification before starting exercise with suggestion

**Priority**: P0 (Critical for Phase 3)
**Complexity**: Large (L)

**Business Rules**:

- **Compound progression** (squat, press, deadlift): +5kg if completed 3 consecutive sessions with all reps
- **Accessory progression**: +2.5kg if completed 3 consecutive sessions
- **Reduction**: -10% if failed more than 3 reps in 2 consecutive sessions

---

#### US-12.2: Rest Suggestions

**As a** user
**I want to** know when to rest
**So that** I can avoid overtraining

**Acceptance Criteria**:

- [ ] System analyzes training frequency
- [ ] If trained same muscle group < 48 hours ago, suggests rest
- [ ] If 5+ consecutive days training, recommends rest day
- [ ] Subtle notification, non-blocking (user can ignore)

**Priority**: P2 (Medium)
**Complexity**: Medium (M)

---

### 7.3 Epic: Achievement System (Gamification)

#### US-13.1: Badges and Achievements

**As a** user
**I want to** unlock achievements when reaching milestones
**So that** I feel motivated and recognized

**Acceptance Criteria**:

- [ ] Automatic badge system
- [ ] Examples: "First session completed", "10 sessions completed", "7-day streak", "PR in 3 exercises"
- [ ] Notification when unlocking badge
- [ ] Page with all badges (unlocked and locked)
- [ ] Shows progress towards next badge

**Priority**: P2 (Medium)
**Complexity**: Large (L)

**Proposed Badges**:

- 🏋️ **First Rep**: Complete first session
- 🔥 **On Fire**: 7 consecutive days training
- 💪 **Strong**: Achieve 1RM of 100kg bench press
- 📈 **Consistent**: 30 sessions completed
- 🎯 **Goal Crusher**: Complete first goal
- 🏆 **PR Machine**: Break 10 PRs
- 🚀 **Beast Mode**: 100 sessions completed

---

## 8. Data Models

### 8.1 User

**Description**: Represents a registered user in the application.

**Key Attributes**:

| Field        | Type      | Required | Description                |
| ------------ | --------- | -------- | -------------------------- |
| id           | UUID      | Yes      | Unique identifier          |
| email        | String    | Yes      | Unique email (login)       |
| passwordHash | String    | Yes      | Password hash (bcrypt)     |
| name         | String    | No       | Full name                  |
| createdAt    | Timestamp | Yes      | Registration date          |
| lastLoginAt  | Timestamp | No       | Last login                 |

**Relationships**:

- Has many Routines (routines)
- Has many WorkoutSessions (workoutSessions)
- Has many CustomExercises (customExercises)
- Has many Goals (goals)

**Business Rules**:

- Email must be unique in system
- Password must have minimum 8 characters
- Password must include letter and number

---

### 8.2 Exercise

**Description**: Represents an exercise from predefined catalog or custom.

**Key Attributes**:

| Field        | Type      | Required | Description                              |
| ------------ | --------- | -------- | ---------------------------------------- |
| id           | UUID      | Yes      | Unique identifier                        |
| name         | String    | Yes      | Exercise name                            |
| category     | Enum      | Yes      | Muscle group (chest, back, legs, etc.)   |
| description  | String    | No       | Brief description                        |
| isPredefined | Boolean   | Yes      | true: base catalog, false: custom        |
| userId       | UUID      | No       | User ID (if custom)                      |
| createdAt    | Timestamp | Yes      | Creation date                            |

**Enums**:

- **category**: chest, back, legs, shoulders, arms, core, cardio

**Relationships**:

- Belongs to User (if isPredefined = false)
- Used in many RoutineExercises

**Business Rules**:

- If isPredefined = true, userId must be null
- If isPredefined = false, userId is required
- Name cannot be empty

---

### 8.3 Routine

**Description**: Represents a workout routine created by the user.

**Key Attributes**:

| Field      | Type      | Required | Description                 |
| ---------- | --------- | -------- | --------------------------- |
| id         | UUID      | Yes      | Unique identifier           |
| userId     | UUID      | Yes      | Owner user ID               |
| name       | String    | Yes      | Routine name                |
| isActive   | Boolean   | Yes      | Currently in use routine    |
| isArchived | Boolean   | Yes      | Archived routine (deleted)  |
| createdAt  | Timestamp | Yes      | Creation date               |
| updatedAt  | Timestamp | Yes      | Last modification           |

**Relationships**:

- Belongs to User
- Has many RoutineDays (routineDays)
- Used in many WorkoutSessions

**Business Rules**:

- User can have only 1 active routine (isActive = true) at a time
- When activating a routine, others are marked as isActive = false
- Cannot physically delete if has associated WorkoutSessions (mark isArchived = true)

---

### 8.4 RoutineDay

**Description**: Represents a specific day within a routine (e.g., Monday - Push).

**Key Attributes**:

| Field     | Type      | Required | Description                    |
| --------- | --------- | -------- | ------------------------------ |
| id        | UUID      | Yes      | Unique identifier              |
| routineId | UUID      | Yes      | Routine ID                     |
| name      | String    | Yes      | Day name (e.g., "Push Day")    |
| dayOfWeek | Enum      | No       | Suggested day of week          |
| order     | Integer   | Yes      | Display order                  |
| createdAt | Timestamp | Yes      | Creation date                  |

**Enums**:

- **dayOfWeek**: monday, tuesday, wednesday, thursday, friday, saturday, sunday, null

**Relationships**:

- Belongs to Routine
- Has many RoutineExercises (routineExercises)

**Business Rules**:

- Name cannot be empty
- Order must be unique within routine

---

### 8.5 RoutineExercise

**Description**: Relationship between a routine day and an exercise, with planned configuration.

**Key Attributes**:

| Field        | Type      | Required | Description                        |
| ------------ | --------- | -------- | ---------------------------------- |
| id           | UUID      | Yes      | Unique identifier                  |
| routineDayId | UUID      | Yes      | Routine day ID                     |
| exerciseId   | UUID      | Yes      | Exercise ID                        |
| order        | Integer   | Yes      | Order in day                       |
| targetSets   | Integer   | No       | Planned sets                       |
| targetReps   | Integer   | No       | Target repetitions                 |
| targetWeight | Decimal   | No       | Target weight (kg)                 |
| notes        | String    | No       | User notes (e.g., "slow tempo")    |
| createdAt    | Timestamp | Yes      | Creation date                      |

**Relationships**:

- Belongs to RoutineDay
- Belongs to Exercise

**Business Rules**:

- targetSets, targetReps, targetWeight are optional (reference, not mandatory to follow)
- Order must be unique within RoutineDay

**NOTE**: This model follows OPTION A (fixed structure). If OPTION B is implemented in the future, would need additional entity RoutineSet for multiple set configurations.

---

### 8.6 WorkoutSession

**Description**: Represents a training session recorded by the user.

**Key Attributes**:

| Field        | Type      | Required | Description                    |
| ------------ | --------- | -------- | ------------------------------ |
| id           | UUID      | Yes      | Unique identifier              |
| userId       | UUID      | Yes      | User ID                        |
| routineId    | UUID      | No       | Routine used (if applicable)   |
| routineDayId | UUID      | No       | Specific routine day           |
| startedAt    | Timestamp | Yes      | Start time                     |
| completedAt  | Timestamp | No       | Completion time                |
| duration     | Integer   | No       | Duration in minutes (calculated)|
| rating       | Integer   | No       | Rating 1-5 stars               |
| notes        | String    | No       | General session notes          |
| createdAt    | Timestamp | Yes      | Creation date                  |

**Relationships**:

- Belongs to User
- Belongs to Routine (optional, can be free session)
- Belongs to RoutineDay (optional)
- Has many WorkoutExercises (workoutExercises)

**Business Rules**:

- startedAt must be less than completedAt
- duration is calculated automatically: (completedAt - startedAt) in minutes
- rating must be between 1-5 if present

---

### 8.7 WorkoutExercise

**Description**: Represents an exercise performed during a training session.

**Key Attributes**:

| Field            | Type      | Required | Description                    |
| ---------------- | --------- | -------- | ------------------------------ |
| id               | UUID      | Yes      | Unique identifier              |
| workoutSessionId | UUID      | Yes      | Session ID                     |
| exerciseId       | UUID      | Yes      | Exercise ID                    |
| order            | Integer   | Yes      | Order in session               |
| notes            | String    | No       | Exercise-specific notes        |
| createdAt        | Timestamp | Yes      | Creation date                  |

**Relationships**:

- Belongs to WorkoutSession
- Belongs to Exercise
- Has many WorkoutSets (workoutSets)

**Business Rules**:

- Must have at least 1 WorkoutSet
- Order must be unique within session

---

### 8.8 WorkoutSet

**Description**: Represents an individual set performed in an exercise during session.

**Key Attributes**:

| Field             | Type      | Required | Description                 |
| ----------------- | --------- | -------- | --------------------------- |
| id                | UUID      | Yes      | Unique identifier           |
| workoutExerciseId | UUID      | Yes      | Exercise in session ID      |
| setNumber         | Integer   | Yes      | Set number (1, 2, 3, ...)   |
| weight            | Decimal   | Yes      | Weight used (kg)            |
| reps              | Integer   | Yes      | Repetitions achieved        |
| isCompleted       | Boolean   | Yes      | Set completed successfully  |
| createdAt         | Timestamp | Yes      | Creation date               |

**Relationships**:

- Belongs to WorkoutExercise

**Business Rules**:

- weight must be >= 0
- reps must be > 0
- setNumber must be sequential (1, 2, 3, ...)

---

### 8.9 Goal - PHASE 3

**Description**: Represents a performance goal set by the user.

**Key Attributes**:

| Field        | Type      | Required | Description                               |
| ------------ | --------- | -------- | ----------------------------------------- |
| id           | UUID      | Yes      | Unique identifier                         |
| userId       | UUID      | Yes      | User ID                                   |
| exerciseId   | UUID      | Yes      | Target exercise                           |
| goalType     | Enum      | Yes      | Goal type (weight, volume, oneRM)         |
| startValue   | Decimal   | Yes      | Initial value                             |
| targetValue  | Decimal   | Yes      | Target value                              |
| currentValue | Decimal   | Yes      | Current value (updated automatically)     |
| startDate    | Date      | Yes      | Start date                                |
| targetDate   | Date      | Yes      | Deadline                                  |
| isCompleted  | Boolean   | Yes      | Goal completed                            |
| completedAt  | Timestamp | No       | Completion date                           |
| createdAt    | Timestamp | Yes      | Creation date                             |

**Enums**:

- **goalType**: weight (increase max weight), volume (increase total volume), oneRM (increase estimated 1RM)

**Relationships**:

- Belongs to User
- Belongs to Exercise

**Business Rules**:

- targetValue must be > startValue
- targetDate must be > startDate
- System updates currentValue automatically after each relevant session
- Goal is marked isCompleted = true when currentValue >= targetValue

---

### 8.10 Achievement - PHASE 3

**Description**: Represents an achievement or badge unlocked by the user.

**Key Attributes**:

| Field      | Type      | Required | Description        |
| ---------- | --------- | -------- | ------------------ |
| id         | UUID      | Yes      | Unique identifier  |
| userId     | UUID      | Yes      | User ID            |
| badgeType  | Enum      | Yes      | Badge type         |
| unlockedAt | Timestamp | Yes      | Unlock date        |

**Enums**:

- **badgeType**: first_session, streak_7, streak_30, session_10, session_50, session_100, pr_3, pr_10, goal_completed, etc.

**Relationships**:

- Belongs to User

**Business Rules**:

- A user cannot have the same badgeType unlocked twice
- System checks conditions after each session to automatically award badges

---

## 9. Business Rules

### 9.1 Session State Flow

**WorkoutSession State**:

```
NOT_STARTED → IN_PROGRESS → COMPLETED
      ↓             ↓
   CANCELLED   CANCELLED
```

**Definitions**:

| State       | Description                   | Rules                                |
| ----------- | ----------------------------- | ------------------------------------ |
| NOT_STARTED | Session created but not started| startedAt is null                   |
| IN_PROGRESS | Active session                | startedAt exists, completedAt is null|
| COMPLETED   | Finished session              | completedAt exists                   |
| CANCELLED   | Cancelled session             | User cancelled without completing    |

---

### 9.2 Routine Validations

**Rules When Creating/Editing Routine**:

1. **Unique name per user**: User cannot have two routines with same name
2. **Only 1 active routine**: When activating a routine, all others are automatically deactivated
3. **Don't delete with history**: If routine has associated WorkoutSessions, mark as archived instead of deleting
4. **No duplicate days**: Within a routine, cannot have two days with same dayOfWeek
5. **Exercise not duplicated in day**: Within a RoutineDay, cannot have two RoutineExercises with same exerciseId

---

### 9.3 Session Validations

**Rules When Recording Session**:

1. **Only 1 active session**: User cannot have two IN_PROGRESS sessions simultaneously
2. **Coherent timestamps**: startedAt < completedAt
3. **Reasonable duration**: Session cannot last more than 4 hours (warning to user)
4. **Reasonable weight**: When recording set, weight cannot be negative
5. **Reasonable reps**: Reps must be between 1-100 (more than 100 probably is error)

---

### 9.4 Metrics Calculation

**Personal Record (PR)**:

- Weight PR = MAX(weight) for an exerciseId in all user's WorkoutSets
- Updates automatically after each session

**Total Volume**:

- Volume per set = weight × reps
- Volume per exercise = Σ(weight × reps) of all sets of that exercise in session
- Total session volume = Σ(volume per exercise) of entire session

**Estimated 1RM** (Epley Formula):

- 1RM = weight × (1 + reps / 30)
- Calculated only for compound exercises: squat, bench press, deadlift
- Takes the set with highest estimated 1RM from each session

---

### 9.5 Automatic Progression Rules (Phase 3)

**Weight Increase Suggestions**:

| Condition                                                                      | Action                    |
| ------------------------------------------------------------------------------ | ------------------------- |
| Completed all reps of all sets in 3 consecutive sessions (compound exercise)   | Suggest +5kg              |
| Completed all reps of all sets in 3 consecutive sessions (accessory exercise)  | Suggest +2.5kg            |
| Failed 1-2 reps in last session                                                | Maintain current weight   |
| Failed 3+ reps in 2 consecutive sessions                                       | Suggest -10% weight       |

**Compound Exercises**: squat, bench press, deadlift, military press
**Accessory Exercises**: all others

---

### 9.6 Data Permissions and Visibility

**User can access**:

- ✅ Their own routines, sessions, custom exercises, goals
- ✅ Predefined exercise catalog (shared for all)

**User CANNOT access**:

- ❌ Other users' routines
- ❌ Other users' sessions
- ❌ Other users' custom exercises

**Rule**: All data queries must filter by userId of authenticated user.

---

## 10. Technical Requirements

### 10.1 Tech Stack

**Frontend**:

- Framework: **Next.js 15** (App Router)
- Language: **TypeScript 5**
- UI Library: **React 19**
- Styling: **Tailwind CSS v4**
- Components: **shadcn/ui**
- State Management:
  - **React Query** (for server data)
  - **Zustand** (for UI state)
  - **React Hook Form** (for complex forms)

**Backend**:

- **Supabase** saving information
- **Next.js Server Actions** (mutations)
- **Next.js API Routes** (additional endpoints if needed)

**Authentication**:

- **NextAuth.js** (OAuth + credentials)
- Providers: Email/Password (minimum), optional Google/GitHub

**Hosting**:

- **Vercel** (frontend + serverless functions)
- **Supabase** or **Neon** (database)

---

### 10.2 Architecture

**Folder Structure** (Screaming Architecture + Atomic Design):

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── routines/
│   │   ├── workouts/
│   │   ├── analytics/
│   │   └── goals/
│   └── api/               # API routes if needed
│
├── domains/               # Business logic by domain
│   ├── auth/
│   │   ├── components/
│   │   ├── actions.ts     # Server Actions
│   │   ├── schema.ts      # Zod schemas
│   │   └── hooks/
│   ├── routines/
│   │   ├── components/
│   │   ├── actions.ts
│   │   ├── schema.ts
│   │   └── hooks/
│   ├── workouts/
│   │   └── ...
│   ├── analytics/
│   │   └── ...
│   └── goals/
│       └── ...
│
├── components/            # UI components (reusables)
│   ├── ui/               # shadcn/ui components
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
│
├── lib/                  # Generic utilities
│   ├── db.ts            # Prisma client
│   ├── auth.ts          # NextAuth config
│   └── utils.ts
│
└── styles/              # Global styles
    └── globals.css
```

---

### 10.3 Performance Requirements

**Page Load**:

- ⏱️ Dashboard: < 2 seconds (first contentful paint)
- ⏱️ Charts: < 2 seconds to render
- ⏱️ Active session: < 1 second to save each set

**APIs**:

- ⏱️ Server Actions: < 500ms (95th percentile)
- ⏱️ DB queries: < 200ms

**Capacity**:

- 👥 Support for 1000 concurrent users
- 💾 Initial app load: < 500kb (JS bundle)

**Required Optimizations**:

- ✅ React Server Components by default (minimize client JS)
- ✅ Lazy loading of charts (only load when user views them)
- ✅ Proper DB indexing (userId, exerciseId, createdAt)
- ✅ Pagination for session history (show 20 per page)

---

### 10.4 Security Requirements

**Authentication**:

- ✅ Password hashed with **bcrypt** (12 rounds minimum)
- ✅ Secure session tokens (httpOnly cookies)
- ✅ Session expiration: 7 days of inactivity

**Authorization**:

- ✅ Next.js middleware validates session on protected routes
- ✅ Server Actions validate userId in each mutation
- ✅ Queries filter by userId to prevent access to foreign data

**Data Protection**:

- ✅ HTTPS in production (mandatory)
- ✅ Environment variables for secrets (never in code)
- ✅ Rate limiting on APIs (100 req/min per IP)

**Validation**:

- ✅ Validation with Zod on client and server (double layer)
- ✅ Input sanitization (prevent XSS)

---

### 10.5 Accessibility Requirements

**Compliance Level**: **WCAG 2.1 AA**

**Required Implementations**:

- ✅ All interactive elements keyboard accessible
- ✅ Complete navigation with Tab/Enter/Escape
- ✅ Labels and aria-labels on all inputs
- ✅ Minimum color contrast 4.5:1
- ✅ Clear error messages associated with fields
- ✅ Screen reader support (testing with NVDA/VoiceOver)

**Nice to Have (Phase 2+)**:

- ⚪ High contrast mode
- ⚪ Adjustable font sizes

---

### 10.6 Responsive Design Requirements

**Breakpoints**:

- 📱 Mobile: 320px - 767px
- 📲 Tablet: 768px - 1023px
- 💻 Desktop: 1024px+

**Mobile First**: All components are designed first for mobile, then adapted to large screens.

**Mandatory Tests**:

- ✅ iPhone SE (375px)
- ✅ iPhone 14 Pro (393px)
- ✅ iPad (768px)
- ✅ Desktop 1920px

**Mobile Functionality**:

- ✅ All features must be 100% functional on mobile
- ✅ Inputs optimized for touch (buttons minimum 44x44px)
- ✅ Touch gestures where appropriate (swipe, drag)

---

### 10.7 Progressive Web App (PWA)

**Phase 1 (MVP)**:

- ✅ Manifest.json configured
- ✅ App icons (192x192, 512x512)
- ✅ Installable on mobile devices

**Phase 2+**:

- ⚪ Service Worker for basic offline (static asset cache)
- ⚪ Push notifications (for goals and achievements)

---

## 11. Success Metrics

### 11.1 Product KPIs

**Phase 1 (MVP)**:

| Metric                                  | Target                           | Measurement                             |
| --------------------------------------- | -------------------------------- | --------------------------------------- |
| **Registered Users**                    | 50 users in first month          | Count of User.createdAt                 |
| **Completed Sessions**                  | 200 sessions in first month      | Count of WorkoutSession.completedAt     |
| **Weekly Retention**                    | 40% users return in week 2       | % users with 2+ sessions in 2 weeks     |
| **Average Session Recording Time**      | < 5 minutes                      | AVG(completedAt - startedAt)            |

**Phase 2 (Analytics)**:

| Metric                       | Target                  |
| ---------------------------- | ----------------------- |
| **Users Viewing Charts**     | 70% of active users     |
| **Time in Analytics**        | 3+ minutes per visit    |
| **Data Exports**             | 10% of users export     |

**Phase 3 (Goals)**:

| Metric                              | Target                          |
| ----------------------------------- | ------------------------------- |
| **Users with Active Goals**         | 60% of active users             |
| **Completed Goals**                 | 30% of created goals            |
| **Interaction with Recommendations**| 50% users accept suggestions    |

---

### 11.2 Technical KPIs

| Metric                | Target | Tool               |
| --------------------- | ------ | ------------------ |
| **Uptime**            | 99.5%  | Vercel Analytics   |
| **Page Load (Mobile)**| < 2s   | Lighthouse         |
| **Core Web Vitals**   | "Good" | PageSpeed Insights |
| **Error Rate**        | < 1%   | Sentry             |
| **500 Error Rate**    | < 0.5% | Logs               |

---

### 11.3 Success Criteria by Phase

**Phase 1 (MVP) - Considered Successful If**:

- ✅ 50+ registered users in 4 weeks
- ✅ 40% weekly retention
- ✅ Users record average 3+ sessions/week
- ✅ < 5% abandoned sessions (started but not completed)
- ✅ No critical errors in production

**Phase 2 (Analytics) - Considered Successful If**:

- ✅ 70% of active users visit Analytics section
- ✅ Charts load in < 2 seconds
- ✅ 15+ users export data in first week of launch
- ✅ Positive feedback in survey (NPS > 40)

**Phase 3 (Goals) - Considered Successful If**:

- ✅ 60% of users create at least 1 goal
- ✅ 30% of created goals are completed
- ✅ 50% of users accept at least 1 recommendation
- ✅ 15% increase in sessions/week (compared to Phase 1)

---

## 12. Risks and Mitigation

### 12.1 Technical Risks

#### Risk 1: Data Model Complexity

**Category**: Technical
**Severity**: High
**Likelihood**: Medium

**Description**: The data model for routines and sessions is complex (multiple relationships: Routine → RoutineDay → RoutineExercise → Exercise). Design error can require complex migration.

**Impact**: 2-3 week delay if redesign needed in Phase 1.

**Mitigation**:

- ✅ Validate model with 3 real use cases before implementing
- ✅ Create reversible Prisma migrations
- ✅ Implement integration tests for complete flow (create routine → record session)
- ✅ Quick prototype with mock data to validate queries

**Contingency**: If model doesn't work, simplify in MVP (remove RoutineDay, make flat routine)

---

#### Risk 2: Chart Performance with Large Data

**Category**: Technical
**Severity**: Medium
**Likelihood**: Medium

**Description**: User with 200+ recorded sessions may experience slowness in Phase 2 charts.

**Impact**: Degraded UX for power users.

**Mitigation**:

- ✅ Limit chart data to last 6 months by default
- ✅ Implement pagination or lazy loading
- ✅ Aggregate data in backend (calculate averages/totals in query)
- ✅ Cache queries with React Query (staleTime: 5 minutes)

**Contingency**: Offer CSV download if charts are too slow (user analyzes in Excel)

---

### 12.2 Product Risks

#### Risk 3: Users Abandon After Registration

**Category**: Product
**Severity**: High
**Likelihood**: High

**Description**: User registers but doesn't complete first session (weak onboarding).

**Impact**: Low retention, product doesn't demonstrate value.

**Mitigation**:

- ✅ Guided onboarding: "Create your first routine in 3 steps"
- ✅ Pre-loaded example routines (user can clone)
- ✅ Interactive tutorial to record first session
- ✅ Follow-up email if doesn't record session in 3 days

**Contingency**: A/B testing of different onboarding flows

---

#### Risk 4: Lack of Differentiation

**Category**: Business
**Severity**: Medium
**Likelihood**: Medium

**Description**: Many gym tracking apps exist (Strong, JEFIT, Hevy). Gym Tracker may not stand out.

**Impact**: Difficulty attracting users.

**Mitigation**:

- ✅ Focus on simple and fast UX (fewer clicks than competition)
- ✅ Highlight intelligent recommendations (Phase 3) as differentiator
- ✅ Marketing focused on beginner users (less saturated niche)
- ✅ Free and no ads (at least in MVP)

**Contingency**: Pivot to unique features (e.g., integration with local gyms, personalized plans)

---

### 12.3 Resource Risks

#### Risk 5: Incorrect Time Estimates

**Category**: Resources
**Severity**: Medium
**Likelihood**: High

**Description**: Phase 1 estimated at 4-6 weeks may take 8-10 weeks (scope creep, unanticipated bugs).

**Impact**: Launch delay, demotivation.

**Mitigation**:

- ✅ 30% buffer in estimates
- ✅ Weekly progress reviews
- ✅ Strict prioritization: P0 first, P1-P2 only if time allows
- ✅ Minimum viable MVP: if delayed, launch with fewer features

**Contingency**: Reduce scope (e.g., launch without complete exercise library, only 20 basic exercises)

---

## 13. Pending Questions

### 13.1 Clarification Questions - PENDING RESPONSE

The following questions require product owner decision before implementing corresponding features.

---

#### P1: Exercise Structure in Routines (CRITICAL for Phase 1) ✅ RESOLVED

**Question**: How should the exercise structure in routines be?

**OPTION A - Fixed Structure (Recommended for MVP)**:

- Each exercise has single configuration: "3 sets x 10 reps @ 50kg"
- When recording session, user enters actual data for each set
- Simpler to implement and use

**OPTION B - Flexible Structure**:

- Each exercise can have different configuration per set
- Example: "Set 1: 12 reps @ 40kg, Set 2: 10 reps @ 45kg, Set 3: 8 reps @ 50kg" (pyramid)
- More complex but covers advanced cases (drop sets, supersets)

**DECISION MADE**: ✅ **OPTION A - Fixed Structure**

**Decision Date**: 2025-11-03

**Justification**:

- ✅ Covers 80% of use cases (most users do uniform sets)
- ✅ Simpler UX (fewer fields, less confusion)
- ✅ Faster development (saves 1-2 weeks)
- ✅ Simpler data model (fewer entities)
- ⚠️ OPTION B can be implemented in Phase 2+ if users request it

**Impact of this decision**:

- ✅ Unblocks implementation of RoutineExercise and WorkoutSession
- ✅ Allows simplified database design
- ✅ Allows immediate start of Phase 1 development

---

#### P2: "Motivation Level" Visualization in Sessions

**Question**: Should "motivation level" be recorded when finishing session?

**OPTION A - Record Motivation**:

- When finishing session, asks: "How did you feel today?" (1-5 scale or emojis)
- Stored in WorkoutSession as "motivationLevel" field
- Advantage: Data to correlate motivation with performance in Phase 2
- Disadvantage: One more field to fill (may be perceived as burden)

**OPTION B - Don't Record Motivation**:

- Only records general session rating (1-5 stars)
- Simpler, less cognitive load
- Sufficient for MVP

**RECOMMENDATION**: **OPTION B** for MVP, consider OPTION A in Phase 2.

**Justification**:

- ✅ Reduce friction in MVP (fewer fields = complete session faster)
- ✅ General session rating already covers basic feeling
- ⚠️ If in Phase 2 users ask for more granularity, adding motivationLevel is small change (doesn't break existing model)

**Impact if not decided**:

- ⚠️ Minor: Only affects design of complete session form
- ⚠️ Doesn't block development

**Decision Needed For**: WorkoutSession model design (week 2 of Phase 1)

---

#### P3: Specific Metrics for Analytics (Phase 2)

**Question**: What specific metrics to show in Analytics dashboard?

**OPTION A - Basic Metrics**:

- Weight progress per exercise (line chart)
- Total volume per week (bar chart)
- Personal Records (table)
- Consistency (days/week training)

**OPTION B - Advanced Metrics**:

- All of OPTION A, plus:
- Volume by muscle group (e.g., how much chest volume vs back)
- Average intensity (% of 1RM used)
- Work ratio (time under tension)
- Period comparison (this month vs last month)

**RECOMMENDATION**: **OPTION A** for Phase 2 launch, then iterate towards OPTION B.

**Justification**:

- ✅ OPTION A is sufficient for 90% of users
- ✅ Faster development (4 weeks vs 6 weeks)
- ✅ Validate users actually use analytics before investing in complex metrics
- ⚠️ OPTION B requires more complex calculations (may affect performance)

**Impact if not decided**:

- ⚠️ Doesn't block Phase 1
- ⚠️ Needed before starting Phase 2

**Decision Needed For**: Start of Phase 2

---

#### P4: Notification System (Phase 3)

**Question**: What type of notifications to implement?

**OPTION A - In-App Only (within application)**:

- Notifications visible only when user opens app
- Simpler to implement (doesn't require permissions or service worker)
- Example: Red badge on goals icon

**OPTION B - Push Notifications**:

- Real push notifications (mobile + browser)
- Requires user permissions, service worker, integration with service (Firebase, OneSignal)
- More complex but better engagement

**RECOMMENDATION**: **OPTION A** for Phase 3 MVP, OPTION B as later improvement.

**Justification**:

- ✅ OPTION A doesn't require invasive permissions (better initial UX)
- ✅ OPTION A saves 1-2 weeks of development
- ⚠️ If engagement KPI is low, implement OPTION B as improvement

**Impact if not decided**:

- ⚠️ Doesn't block Phase 1 or Phase 2
- ⚠️ Needed before Phase 3

**Decision Needed For**: Start of Phase 3

---

### 13.2 Business Questions - PENDING

#### P5: Monetization Model

**Question**: Will the app be free always or have premium plan?

**OPTION A - 100% Free**:

- All features free, always
- User attraction model
- No restrictions

**OPTION B - Freemium**:

- MVP free (Phase 1)
- Phase 2 (Analytics) partially premium
- Phase 3 (Advanced goals) premium
- Suggested price: $5/month or $40/year

**RECOMMENDATION**: **OPTION A** until reaching 500 users, then evaluate OPTION B.

**Justification**:

- ✅ Initial focus on product validation, not monetization
- ✅ Greater adoption without payment barrier
- ⚠️ If hosting costs exceed budget, implement OPTION B

**Impact if not decided**:

- ⚠️ Doesn't affect technical development until post-MVP
- ⚠️ Does affect marketing strategy

**Decision Needed For**: Before public launch

---

## 14. Approval and Changes

### 14.1 Approval

| Role           | Name | Date | Signature |
| -------------- | ---- | ---- | --------- |
| Product Owner  | TBD  |      |           |
| Tech Lead      | TBD  |      |           |
| UX/UI Designer | TBD  |      |           |

---

### 14.2 Change Log

| Version | Date       | Changes                                | Author           |
| ------- | ---------- | -------------------------------------- | ---------------- |
| 1.0     | 2025-11-03 | Initial document - Complete PRD 3 phases| Business Analyst |

---

### 14.3 Next Steps

Once this PRD is approved:

1. **Resolve Pending Questions (Section 13)** - Especially P1 (exercise structure) before starting development
2. **Launch Specialized Agents**:
   - `domain-architect` → Define domain architecture and entities
   - `ux-ui-designer` → Design wireframes and user flows
   - `nextjs-builder` → Create technical implementation plan
3. **Configure Project**:
   - Initialize repository with Next.js 15
   - Configure Prisma + PostgreSQL
   - Configure NextAuth
   - Install shadcn/ui and base components
4. **Start Phase 1** following P0 priorities

---

## Final Notes

This document is the **source of truth** for the Gym Tracker project. Any changes must be updated here and communicated to all stakeholders.

**Document complete. Ready for approval and execution.**

---

**Prepared by**: Business Analyst Agent
**Based on**: Ideation and discovery session with user
**Methodology**: 7-step discovery process
**Template**: `.claude/tasks/template/product-template.md`
