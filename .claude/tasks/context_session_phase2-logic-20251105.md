# Session Context: Phase 2 Business Logic & Data Layer Implementation

**Session ID**: `phase2-logic-20251105`
**Created**: 2025-11-05
**Status**: 🔄 Active
**Objective**: Implement Phase 2 business logic, data layer, and integrate with Phase 1 UI

---

## Session Overview

**Goal**: Implement complete business logic layer following repository pattern, domain-driven design, and Next.js 15 best practices. This phase connects the UI structure from Phase 1 with real data, authentication, and workout tracking functionality.

**Approach**: Following domain-driven architecture with clear separation of concerns:
- Repository layer for data access
- Domain entities and business rules
- Use cases for application logic
- API routes for client-server communication
- State management for UI integration

**Related Files**:
- Previous Session: `.claude/tasks/context_session_phase1-ui-20251103.md`
- PRD: `product.md`
- Constraints: `.claude/knowledge/critical-constraints.md`
- Architecture: `.claude/knowledge/architecture-patterns.md`
- Business Rules: `.claude/knowledge/business-rules.md`

**Key Constraints**:
- ✅ Repository pattern for all data access (no direct DB imports in UI)
- ✅ Domain entities with business logic
- ✅ Server Actions for mutations
- ✅ React Server Components for data fetching
- ✅ Type-safe API contracts with zod
- ✅ Optimistic updates where appropriate
- ✅ Error handling at all layers

---

## Implementation Phases

### Phase 2A - Foundation (Current)
- [ ] Review architecture patterns and critical constraints
- [ ] Plan domain entities and repository contracts
- [ ] Plan API routes and Server Actions architecture
- [ ] Define database schema
- [ ] Set up authentication strategy

### Phase 2B - Authentication & User Management
- [ ] Implement auth repository
- [ ] Create auth API routes/Server Actions
- [ ] Integrate with UI (login, register, password recovery)
- [ ] Session management

### Phase 2C - Routines Domain
- [ ] Implement routines repository
- [ ] Create routines use cases
- [ ] Implement routines API routes/Server Actions
- [ ] Integrate with routines pages

### Phase 2D - Workouts Domain
- [ ] Implement workouts repository
- [ ] Create workout session state management
- [ ] Implement workout tracking logic
- [ ] Integrate with dashboard and active workout pages
- [ ] Auto-save mechanism

### Phase 2E - Exercise Library
- [ ] Implement exercises repository
- [ ] Create exercise CRUD operations
- [ ] Integrate with exercise library page

---

## [2025-11-05 10:00] parent-agent: Phase 2 Session Initialized

**Task**: Created session for Phase 2 Business Logic & Data Layer implementation

**Status**: 🔄 Active

**Context from Phase 1**:
- ✅ Complete UI structure implemented (6 pages, 20+ components)
- ✅ All text externalized (235+ keys)
- ✅ Navigation and layout complete
- ✅ Mock data in place, ready for real data integration

**Key Decisions**:
- Following repository pattern strictly (critical constraint)
- Using Server Actions for mutations (Next.js 15 best practice)
- React Server Components for data fetching
- Optimistic updates for active workout (speed critical)
- Local storage + server sync for data integrity

**Next Steps**:
1. Review critical constraints and architecture patterns
2. Invoke domain-architect agent to plan domain entities and business rules
3. Invoke nextjs-builder agent to plan API architecture and data flow
4. Begin implementation starting with auth layer

---

## [2025-11-05 16:30] domain-architect: Phase 2 Domain Architecture Plan Complete

**Task**: Created comprehensive business logic architecture plan for all 4 domains (auth, routines, workouts, exercises)

**Plan Created**: `.claude/plans/phase2-domain-architecture.md`

**Status**: ✅ Complete and Ready for Implementation

### Key Accomplishments

**1. Domain Entities Designed**
- ✅ **Auth Domain**: User, AuthSession, credentials types with NextAuth integration
- ✅ **Routines Domain**: Routine, RoutineDay, RoutineExercise (OPTION A: fixed structure from PRD)
- ✅ **Workouts Domain**: WorkoutSession, WorkoutExercise, WorkoutSet with auto-save support
- ✅ **Exercises Domain**: Exercise (predefined + custom), categories, filters

**2. Architectural Pattern Clarification**
- ✅ Using **Server Actions pattern** (NOT traditional Repository pattern)
- ✅ Combines validation + authorization + logic + persistence in single layer
- ✅ Follows `.claude/knowledge/architecture-patterns.md` section 4.1
- ✅ More efficient for Next.js 15 with RSC than traditional 3-layer architecture

**3. State Management Strategy**
- ✅ **React Query** for ALL server data (users, routines, workouts, exercises)
- ✅ **Zustand** ONLY for UI state (timers, filters, sidebar - NOT backend data)
- ✅ **useState** for local component state
- ✅ **React Hook Form** for complex forms (registration, routine editor)
- ⚠️ **CRITICAL**: Enforced rule that Zustand must NEVER be used for server data (PRD section 9.6)

**4. Business Rules Documented**
- ✅ Password requirements: 8+ chars, 1 letter, 1 number (PRD 8.1)
- ✅ Only 1 active routine at a time (PRD 9.2.2)
- ✅ Preserve workout history when deleting routines (PRD 9.2.3)
- ✅ No duplicate exercises in routine day (PRD 9.2.5)
- ✅ Only 1 active workout session at a time (PRD 9.3.1)
- ✅ Auto-save workout sets to prevent data loss (PRD US-4.2)

**5. Zod Validation Schemas**
- ✅ Complete schemas for all domains with business rule validation
- ✅ Shared client/server validation (DRY principle)
- ✅ TypeScript types inferred from schemas (type safety)

**6. Server Actions Design**
- ✅ All Server Actions include mandatory session validation
- ✅ Structured error responses with success/error/data pattern
- ✅ Business rule enforcement at action level
- ✅ Cache invalidation with revalidatePath for Next.js
- ✅ Examples include: registerUser, createRoutine, startWorkoutSession, createCustomExercise

**7. React Query Hooks**
- ✅ Custom hooks for each domain (use-auth, use-routines, use-workout-session, use-exercises)
- ✅ Optimistic updates for workout session (instant UI feedback)
- ✅ Automatic cache invalidation on mutations
- ✅ Proper staleTime configuration based on data change frequency

**8. Integration Points Mapped**
- ✅ Auth → All domains (userId dependency)
- ✅ Routines → Exercises (routine references exercises)
- ✅ Workouts → Routines (sessions can be based on routine)
- ✅ Workouts → Exercises (sessions track exercise performance)

**9. Error Handling Strategy**
- ✅ Custom error classes (ValidationError, AuthenticationError, BusinessRuleError)
- ✅ Structured error responses in Server Actions
- ✅ Global error handling in QueryClient
- ✅ Automatic retry logic with auth error exclusion

**10. Implementation Order**
- ✅ Week 1: Database + Exercises domain (no dependencies)
- ✅ Week 2: Routines domain + Auth domain
- ✅ Week 3-4: Workouts domain (most complex, auto-save)
- ✅ Week 4: Polish, testing, error handling

### Architectural Decisions Made

**Decision 1: Server Actions > Repository Pattern**
- **Reasoning**: Next.js 15 native, less boilerplate, automatic type safety
- **Trade-off**: Less abstraction, but we won't change database, so unnecessary abstraction is waste

**Decision 2: React Query for Server State**
- **Reasoning**: Automatic caching, optimistic updates, background refetching, error handling
- **Alternative Rejected**: Zustand for server state (manual cache management, no auto-refetch)

**Decision 3: OPTION A (Fixed Exercise Structure)**
- **Reasoning**: Covers 80% of use cases, simpler UX, faster development (saves 1-2 weeks)
- **Future**: Can implement OPTION B (flexible sets) in Phase 2+ if users request

**Decision 4: Auto-Save with Optimistic Updates**
- **Reasoning**: Prevents data loss, better UX (instant feedback), handles network failures gracefully
- **Implementation**: React Query's onMutate/onError/onSettled pattern

### Files to Create

**Auth Domain** (`src/domains/auth/`):
- `types.ts` - User, AuthSession, credentials types
- `schema.ts` - registerSchema, loginSchema, password validation
- `actions.ts` - registerUser, loginUser, logoutUser, resetPassword
- `hooks/use-auth.ts` - useLogin, useRegister, useLogout
- `errors.ts` - AuthError, InvalidCredentialsError

**Routines Domain** (`src/domains/routines/`):
- `types.ts` - Routine, RoutineDay, RoutineExercise
- `schema.ts` - createRoutineSchema, addExerciseSchema
- `actions.ts` - createRoutine, activateRoutine, archiveRoutine
- `hooks/use-routines.ts` - useRoutines, useCreateRoutine

**Workouts Domain** (`src/domains/workouts/`):
- `types.ts` - WorkoutSession, WorkoutExercise, WorkoutSet
- `schema.ts` - startSessionSchema, logSetSchema
- `actions.ts` - startSession, logSet, completeSession
- `stores/active-session-store.ts` - Zustand store for UI state only (timer, rest)
- `hooks/use-workout-session.ts` - useActiveSession, useLogSet

**Exercises Domain** (`src/domains/exercises/`):
- `types.ts` - Exercise, ExerciseCategory
- `schema.ts` - createCustomExerciseSchema, exerciseFiltersSchema
- `actions.ts` - getAllExercises, createCustomExercise
- `hooks/use-exercises.ts` - useExercises, useCreateCustomExercise

**Infrastructure** (`src/lib/`, `prisma/`):
- `lib/auth.ts` - NextAuth configuration (UPDATE)
- `lib/db.ts` - Prisma client (UPDATE)
- `lib/errors.ts` - Global error classes (NEW)
- `prisma/schema.prisma` - Complete database schema (NEW)
- `prisma/seed.ts` - Seed predefined exercises (NEW)

### Critical Notes for Parent Agent

1. **MANDATORY Session Validation**: ALL Server Actions must validate session first
   ```typescript
   const session = await auth();
   if (!session?.user) return { success: false, error: 'Unauthorized' };
   ```

2. **State Management Rule**: Use React Query for server data, NEVER Zustand
   - ✅ Correct: `const { data: workouts } = useWorkouts();` (React Query)
   - ❌ Wrong: `const workouts = useWorkoutStore(s => s.workouts);` (Zustand for server data)

3. **Auto-Save Pattern**: Use optimistic updates for workout session
   - Update cache immediately (onMutate)
   - Rollback if server fails (onError)
   - Background refetch to sync (onSettled)

4. **Business Rules**: Enforce at Server Action level, not just UI validation
   - Example: "Only 1 active routine" enforced in activateRoutine action

5. **Error Handling**: Use structured responses, not thrown errors
   ```typescript
   return { success: false, error: 'User-friendly message' };
   ```

### Questions for Parent Agent

**Q1: Password Reset Email Service** (Priority: P1, Blocker: Phase 2C)
- Options: Resend, SendGrid, AWS SES
- Recommendation: Resend (simplest for MVP)

**Q2: Session Storage Strategy** (Priority: P2, Blocker: Phase 2D)
- Options: Server only, localStorage + server, IndexedDB + server
- Recommendation: Server only for MVP, localStorage + server for Phase 2+

**Q3: Real-Time Progress** (Priority: P3, Not blocking)
- Options: No real-time, polling, WebSocket
- Recommendation: No real-time for MVP (single-user app)

### Next Steps

**For Parent Agent**:
1. Review plan (`.claude/plans/phase2-domain-architecture.md`)
2. Decide on pending questions (Q1, Q2, Q3)
3. Begin implementation with Phase 2A (Database + Exercises domain)
4. Follow implementation order (Exercises → Routines → Auth → Workouts)

**Dependencies**:
- Database setup (Prisma schema + migrations)
- NextAuth configuration
- React Query setup in app
- Seed data for predefined exercises

**Success Criteria**:
- ✅ All 4 domains have complete entity definitions
- ✅ All Server Actions have session validation
- ✅ All data fetching uses React Query (NOT Zustand)
- ✅ Auto-save works for workout session
- ✅ Business rules enforced at action level

---

## [2025-11-05 18:45] nextjs-builder: Phase 2 Next.js Architecture Plan Complete

**Task**: Created comprehensive Next.js 15 App Router architecture plan integrating Server Actions, RSC boundaries, React Query, and authentication

**Plan Created**: `.claude/plans/phase2-nextjs-architecture.md`

**Status**: ✅ Complete and Ready for Implementation

### Key Accomplishments

**1. App Router Structure Defined**
- ✅ Complete file structure with route groups: (auth) and (app)
- ✅ RSC/Client Component boundaries clearly marked for all pages
- ✅ Loading states (loading.tsx) for all async routes
- ✅ Error boundaries (error.tsx) for all routes
- ✅ Middleware for route protection at app level

**2. RSC Strategy Clarified**
- ✅ **Default to Server Components** (no "use client" unless necessary)
- ✅ Login page: Client Component (form interactivity)
- ✅ Register page: Client Component (React Hook Form)
- ✅ Dashboard page: Server Component (fetches stats)
- ✅ Routines page: Server Component (fetches routines, passes to client)
- ✅ Active workout page: Client Component (real-time logging, useState)
- ✅ History pages: Server Component (static historical data)

**3. Server Actions Implementation Pattern**
- ✅ Mandatory session validation template
- ✅ Structured error response format (success/error/data/errors)
- ✅ Cache revalidation strategy (revalidatePath per mutation)
- ✅ Authorization checks for role-based access
- ✅ Helper functions for reusable session validation
- ✅ Business rule enforcement at action level

**4. React Query Configuration**
- ✅ QueryProvider setup with global error handling
- ✅ Stale time strategy per data type (10min exercises, 2min routines, 30sec active session)
- ✅ Optimistic updates pattern for workout session auto-save
- ✅ Cache invalidation on mutations
- ✅ Retry logic excluding 401/403 errors
- ✅ React Query DevTools integration

**5. Authentication Integration**
- ✅ NextAuth v5 configuration with Credentials provider
- ✅ Middleware for route protection (public vs protected routes)
- ✅ Session access in Server Components (direct auth() call)
- ✅ Session access in Client Components (React Query hook)
- ✅ JWT session strategy with 7-day expiry
- ✅ Custom login/register pages

**6. Form Handling Strategy**
- ✅ Simple forms: useActionState + Server Actions (login, password reset)
- ✅ Complex forms: React Hook Form + zodResolver (registration, routine editor)
- ✅ Progressive enhancement with useFormStatus
- ✅ Decision matrix for choosing form strategy
- ✅ Server-side validation in all cases

**7. Caching Strategy**
- ✅ Next.js 4 cache layers explained
- ✅ Data Cache configuration (revalidate, cache options)
- ✅ Path-based revalidation (revalidatePath after mutations)
- ✅ Tag-based revalidation (optional, for granular control)
- ✅ React Query stale time per data type
- ✅ Caching decision matrix (exercises: 24h, routines: on mutation, etc.)

**8. Performance Optimizations**
- ✅ Parallel data fetching with Promise.all
- ✅ Streaming with Suspense boundaries
- ✅ Granular loading states (multiple Suspense per page)
- ✅ Image optimization with next/image
- ✅ Dynamic imports for heavy components
- ✅ Prefetching on hover
- ✅ Pagination with keepPreviousData

**9. Data Flow Patterns Documented**
- ✅ Pattern A: Server Component direct fetch (static pages)
- ✅ Pattern B: Server Component + Client Component with React Query (mutations)
- ✅ Pattern C: Client-only fetch (real-time pages)
- ✅ When to use each pattern
- ✅ Passing data from Server → Client Components

**10. Migration Steps from Phase 1 to Phase 2**
- ✅ Week-by-week implementation plan
- ✅ Phase 2A: Foundation (dependencies, QueryProvider, NextAuth, Prisma)
- ✅ Phase 2B: Auth domain (register, login, logout)
- ✅ Phase 2C: Exercises domain (fetch, filter, custom)
- ✅ Phase 2D: Routines domain (CRUD, activate, archive)
- ✅ Phase 2E: Dashboard integration (real stats)
- ✅ Phase 2F: Workouts domain (active session, auto-save)
- ✅ Phase 2G: Polish (loading, error states, testing)

### Architectural Decisions Made

**Decision 1: React Server Components by Default**
- **Pattern**: Start with Server Component → Add "use client" only when necessary
- **Reasoning**: Better performance, smaller bundle, SEO-friendly
- **When Client Component**: Browser APIs, useState/useEffect, event handlers, third-party libraries

**Decision 2: Server Actions for All Mutations**
- **Pattern**: Server Actions = validation + authorization + logic + persistence
- **Reasoning**: Type-safe, automatic serialization, built-in Next.js 15 optimization
- **Mandatory**: Session validation in every action

**Decision 3: React Query for Server State Management**
- **Pattern**: React Query for ALL server data (not Zustand)
- **Reasoning**: Automatic caching, optimistic updates, background refetching, error handling
- **Critical Rule**: Zustand ONLY for UI state (sidebar, filters, timers)

**Decision 4: Middleware + Server Actions for Route Protection**
- **Pattern**: 3-layer validation (Middleware → Server Action → Client UI)
- **Reasoning**: Defense in depth, prevents URL hacking, graceful redirects
- **Implementation**: Middleware intercepts routes, Server Actions re-validate

**Decision 5: useActionState for Simple Forms**
- **Pattern**: useActionState + useFormStatus for 1-3 field forms
- **Reasoning**: Progressive enhancement, native React 19 hooks, simpler than React Hook Form
- **Use cases**: Login, password reset, simple mutations

**Decision 6: React Hook Form for Complex Forms**
- **Pattern**: React Hook Form + zodResolver for 3+ field forms
- **Reasoning**: Better validation UX, minimal re-renders, dynamic fields
- **Use cases**: Registration, routine editor, profile settings

**Decision 7: Optimistic Updates for Auto-Save**
- **Pattern**: onMutate → onError (rollback) → onSettled (sync)
- **Reasoning**: Instant feedback, handles network failures gracefully
- **Use case**: Workout session set logging (critical UX requirement)

**Decision 8: Suspense for All Async Operations**
- **Pattern**: Wrap async Server Components in Suspense with fallback
- **Reasoning**: Streaming, progressive loading, better perceived performance
- **Implementation**: Multiple Suspense boundaries per page (granular loading)

### Integration with Domain Architect Plan

**✅ Server Actions Pattern Alignment**
- Next.js builder plan uses exact Server Action template from domain-architect
- Session validation, error responses, cache revalidation all match

**✅ React Query Hooks Match**
- Stale time, optimistic updates, cache invalidation match domain-architect design
- useRoutines, useWorkoutSession, useExercises hooks follow domain-architect patterns

**✅ Business Rules Enforced**
- "Only 1 active routine" enforced at Server Action level (activateRoutine)
- "Auto-save sets" implemented with optimistic updates (logSet)
- All validation schemas from domain-architect integrated into forms

**✅ State Management Strategy Consistent**
- React Query for server data (workouts, routines, exercises)
- Zustand ONLY for UI state (active-session-store for timers/rest)
- useState for local component state
- React Hook Form for complex forms

### Files to Create/Update

**Infrastructure** (NEW):
- `src/lib/providers/query-provider.tsx` - React Query setup
- `src/lib/auth-utils.ts` - Reusable session validation
- `src/middleware.ts` - Route protection

**Auth Domain** (from domain-architect, now integrated):
- Server Actions in `src/domains/auth/actions.ts`
- React Query hooks in `src/domains/auth/hooks/use-auth.ts`
- Updated pages: login (useActionState), register (React Hook Form)

**Routines Domain** (from domain-architect, now integrated):
- Server Actions in `src/domains/routines/actions.ts`
- React Query hooks in `src/domains/routines/hooks/use-routines.ts`
- Updated page: routines page → Server Component

**Workouts Domain** (from domain-architect, now integrated):
- Server Actions in `src/domains/workouts/actions.ts`
- React Query hooks with optimistic updates in `src/domains/workouts/hooks/use-workout-session.ts`
- Updated page: active workout → Client Component with real logic

**Exercises Domain** (from domain-architect, now integrated):
- Server Actions in `src/domains/exercises/actions.ts`
- React Query hooks in `src/domains/exercises/hooks/use-exercises.ts`

**Pages to Update** (from Phase 1 UI to Phase 2 logic):
- `src/app/layout.tsx` - Add QueryProvider wrapper
- `src/app/(app)/layout.tsx` - Fetch session, protect routes
- `src/app/(app)/dashboard/page.tsx` - Server Component, fetch real stats
- `src/app/(app)/routines/page.tsx` - Server Component, fetch routines
- `src/app/(app)/workout/active/page.tsx` - Client Component, real-time logging
- `src/app/(auth)/login/page.tsx` - useActionState + Server Action
- `src/app/(auth)/register/page.tsx` - React Hook Form + zodResolver

### Critical Implementation Notes

**1. RSC/Client Component Rule**
- ALWAYS start with Server Component (no "use client")
- ONLY add "use client" when: browser APIs, useState/useEffect, event handlers
- Pass data from Server → Client Components as props

**2. Server Action Session Validation**
- EVERY Server Action MUST validate session first
- Use `requireAuth()` helper for cleaner code
- Return structured errors: `{ success: false, error: 'message' }`

**3. React Query vs Zustand**
- React Query for ALL server data (users, routines, workouts, exercises)
- Zustand ONLY for UI state (sidebar open, filters, timer)
- NEVER use Zustand for backend data (violates critical constraint)

**4. Cache Revalidation**
- ALWAYS call revalidatePath after mutations
- Revalidate ALL affected routes (e.g., routine mutation → /routines AND /dashboard)
- Auto-save (logSet) should NOT revalidate (silent operation)

**5. Optimistic Updates Pattern**
- onMutate: Update cache immediately, save previous state
- onError: Rollback to previous state
- onSettled: Invalidate queries to sync with server

**6. Form Strategy**
- 1-3 fields, simple validation → useActionState
- 3+ fields, complex validation → React Hook Form
- ALWAYS validate on server (never trust client)

**7. Suspense Boundaries**
- EVERY async Server Component MUST be wrapped in Suspense
- Multiple Suspense boundaries for granular loading (better UX)
- Fallback should match component shape (skeleton)

### Performance Checklist

- [ ] Parallel data fetching with Promise.all
- [ ] Suspense boundaries for streaming
- [ ] Image optimization with next/image
- [ ] Dynamic imports for heavy components
- [ ] Prefetching on hover/focus
- [ ] React Query stale time configured
- [ ] Cache revalidation after mutations
- [ ] No unnecessary Client Components

### Testing Checklist

- [ ] Session validation works in middleware
- [ ] Session validation works in Server Actions
- [ ] Unauthorized redirects to login
- [ ] Login/register/logout flow works
- [ ] Routines CRUD operations work
- [ ] Only 1 active routine enforced
- [ ] Workout session starts from routine
- [ ] Auto-save works for sets
- [ ] Optimistic updates rollback on error
- [ ] Cache invalidation after mutations
- [ ] Loading states display
- [ ] Error boundaries catch errors

### Questions for Parent Agent

**All questions from domain-architect still apply:**

**Q1: Password Reset Email Service** (Priority: P1)
- Options: Resend, SendGrid, AWS SES
- Recommendation: Resend (simplest for MVP)
- Blocker: Phase 2B (Auth domain)

**Q2: Session Storage Strategy** (Priority: P2)
- Options: Server only, localStorage + server, IndexedDB + server
- Recommendation: Server only for MVP (simpler, matches plan)
- Blocker: Phase 2F (Workouts domain)
- Note: Active session already uses React Query for real-time sync

**Q3: Real-Time Progress** (Priority: P3)
- Options: No real-time, polling, WebSocket
- Recommendation: No real-time for MVP (React Query refetchInterval sufficient)
- Not blocking

### Next Steps

**For Parent Agent**:
1. Review both plans:
   - Domain architecture: `.claude/plans/phase2-domain-architecture.md`
   - Next.js architecture: `.claude/plans/phase2-nextjs-architecture.md`
2. Decide on pending questions (Q1, Q2, Q3)
3. Begin implementation with Phase 2A:
   - Install dependencies (React Query, NextAuth)
   - Setup QueryProvider
   - Configure NextAuth v5
   - Create middleware
   - Setup Prisma schema + migrations
   - Seed exercises
4. Follow migration steps sequentially (2A → 2B → 2C → 2D → 2E → 2F → 2G)

**Dependencies Before Starting Implementation**:
- Database provider decision (Prisma supports PostgreSQL, MySQL, SQLite)
- Email service for password reset (Q1)
- Environment variables for NextAuth secret

**Success Criteria**:
- ✅ All pages use correct RSC/Client Component pattern
- ✅ All Server Actions have session validation
- ✅ All mutations invalidate cache correctly
- ✅ React Query used for ALL server data
- ✅ Zustand used ONLY for UI state
- ✅ Optimistic updates work for workout session
- ✅ Forms use correct strategy (useActionState vs React Hook Form)
- ✅ Middleware protects routes
- ✅ Suspense boundaries everywhere
- ✅ No critical constraints violated

---

