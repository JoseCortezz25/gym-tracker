# Landing Page - UX/UI Design Plan

**Created**: 2025-11-10
**Session**: landing_page_001
**Complexity**: High
**User Impact**: Critical

## 1. User Context

### User Goals
- **Primary Goal**: Understand what the Gym Tracker App does and why it's valuable for serious lifters
- **Secondary Goals**:
  - Quickly assess if this app meets their training needs
  - Feel confident enough to create an account
  - See visual proof of the app's capabilities (screenshots/mockups)
- **Success Criteria**:
  - User completes registration within 5 minutes of landing
  - User understands at least 3 core features before scrolling to CTA
  - User can navigate landing page on mobile without friction

### User Personas

**Primary Persona: Alex - The Dedicated Lifter**
- **Demographics**: 25-40 years old, lifts 4-6x per week
- **Context**: Training in gym (on phone between sets) or researching tools at home (desktop/tablet)
- **Current Pain Points**:
  - Tired of pen/paper tracking or basic notes apps
  - Wants structured progression without paying for expensive coaching
  - Needs real-time logging that's fast enough between sets
  - Wants historical data to see actual progress over months
- **Motivation**: "I'm serious about my gains. I need a tool that respects my time and tracks what matters."

**Secondary Persona: Jordan - The Beginner with Goals**
- **Demographics**: 18-30 years old, new to structured training
- **Context**: Looking for guidance on how to train properly
- **Pain Points**: Overwhelmed by gym complexity, doesn't know where to start
- **Motivation**: "I want a system that shows me what to do and tracks if I'm improving."

### User Journey

**Entry Point → Registration (5 minutes max)**

1. **Land on hero** (0-5 seconds)
   - See headline communicating value
   - See hero visual showing app in action
   - Immediate "Get Started Free" CTA visible

2. **Scroll to understand features** (5-30 seconds)
   - Scan feature highlights (custom routines, exercise library, progress tracking)
   - See visual proof (app screenshots in context)
   - Read social proof (testimonials, metrics if available)

3. **Decision point** (30-60 seconds)
   - Click CTA (Register now)
   - OR continue scrolling to learn more
   - OR check pricing/features comparison

4. **Registration** (60-180 seconds)
   - Simple email/password form (no friction)
   - Clear value reminder during signup
   - Immediate access to app (no email verification required initially)

5. **Success state**
   - Redirect to dashboard with onboarding tooltip
   - First routine creation prompt
   - Clear next steps

## 2. Interface Architecture

### Information Hierarchy

**Critical Rule: Mobile-first information prioritization**

1. **Primary (Above the fold - all devices)**:
   - Value proposition headline
   - Single sentence explanation
   - Primary CTA (Get Started Free)
   - Hero visual (app screenshot or mockup)

2. **Secondary (First scroll - mobile / Above fold - desktop)**:
   - 3 core features with icons and brief text
   - Visual proof (screenshots in context)
   - Secondary CTA

3. **Tertiary (Further scrolls)**:
   - Full feature list with details
   - Social proof (testimonials, stats)
   - FAQ section
   - Final CTA before footer

### Layout Strategy

**Structure**: Single-page marketing site with smooth scroll sections

**Grid**:
- Mobile: Single column, full-width components
- Tablet: 2-column for features, single column for hero/CTAs
- Desktop: 12-column grid, max-width 1280px container

**Spacing**: Comfortable (breathing room for readability)
- Section padding: Mobile 64px, Desktop 96px
- Content spacing: Mobile 24px, Desktop 32px
- Component spacing: 16px base unit

**Breakpoints**:
- **Mobile (< 640px)**:
  - Stacked layouts
  - Full-width CTAs
  - Hamburger navigation (if nav needed)
  - Hero image below headline
  - Features in single column

- **Tablet (640px - 1024px)**:
  - 2-column feature grid
  - Hero image beside headline
  - Sticky CTA bar on scroll (optional)

- **Desktop (> 1024px)**:
  - 3-column feature grid
  - Hero split layout (50/50 text/visual)
  - Larger typography for impact
  - Fixed header with CTA

### Visual Hierarchy

**Focal Point**: Hero headline + CTA button
- Headline: Largest text on page (48px mobile, 72px desktop)
- CTA: High contrast, unmissable

**Visual Flow**: Z-pattern on desktop, F-pattern on mobile
1. Hero headline (top left/center)
2. Hero visual (top right/below)
3. Primary CTA (below headline)
4. Feature highlights (left to right, top to bottom)
5. Social proof (middle section)
6. Final CTA (bottom)

**Grouping**:
- Features grouped by benefit category (Training, Tracking, Progress)
- Each section has clear visual separation (background color alternation)
- Related elements use proximity and borders

**Contrast**:
- Headlines: Bold weight (700-800), high contrast
- CTAs: Brand color with high luminosity difference
- Dark mode: Essential for target users (training in gyms)

## 3. Interaction Design

### Primary Actions

**Action: "Get Started Free"**
- **Type**: Primary CTA
- **Location**:
  - Hero section (above fold)
  - After features section
  - After social proof section
  - Sticky header on scroll (desktop only)
- **State**:
  - Default: Bold, high contrast (brand color or accent)
  - Hover: Slight scale (1.02), darker shade, subtle shadow
  - Active: Scale down (0.98), deeper color
  - Disabled: N/A (always enabled for registration)
- **Feedback**:
  - Click → Loading spinner in button
  - Smooth scroll to registration form (if inline)
  - OR redirect to /register page
  - Success → Toast "Account created!" → Redirect to dashboard

**Action: "See How It Works"**
- **Type**: Secondary CTA
- **Location**: Hero section, below primary CTA
- **State**:
  - Default: Outline button, secondary color
  - Hover: Filled background, smooth transition
  - Active: Slight scale down
- **Feedback**: Smooth scroll to features/demo section

### Secondary Actions

**Action: "Login"**
- **Type**: Tertiary (link style)
- **Location**: Top right header
- **State**:
  - Default: Text link, muted color
  - Hover: Underline, primary color
- **Feedback**: Redirect to /login page

**Action: "View Exercise Library"**
- **Type**: Tertiary (inline link in features)
- **Location**: Within features section
- **State**: Text link with icon
- **Feedback**: Expand/modal showing exercise preview OR scroll to exercises section

### Micro-interactions

**Scroll Animations**:
- Fade-in on scroll for feature cards (stagger 100ms each)
- Parallax effect on hero background (subtle, dark mode friendly)
- Progress bar at top showing scroll depth (optional)

**Hover Effects**:
- Feature cards: Lift effect (translateY -4px, shadow increase)
- Screenshot images: Slight zoom (scale 1.05), smooth border glow
- Links: Color change + underline slide-in

**Focus States** (Keyboard navigation - critical for a11y):
- All CTAs: 2px outline, primary color, 4px offset
- Tab order: Logo → Nav links → Primary CTA → Secondary CTA → Features → Footer links

**Loading States**:
- Hero section: Skeleton for headline/CTA (if server-rendered with delay)
- CTA click: Spinner replaces text, button stays same size
- Image loading: Low-res placeholder → fade to full image

**Transitions**:
- Section fade-ins: 400ms ease-out
- Button hover: 200ms ease-in-out
- Smooth scroll: 600ms ease-in-out

**Success/Error**:
- Registration success: Toast notification (top right) → Auto redirect after 1.5s
- Form errors: Inline below field, red color, icon, shake animation

### User Input

**Registration Form (Inline or Separate Page)**

**Email Input**:
- **Input Type**: Email field
- **Validation**: Real-time (on blur)
- **Error Messages**:
  - Empty: "Email is required"
  - Invalid format: "Please enter a valid email address"
  - Already exists: "This email is already registered. Try logging in?"
- **Placeholder**: "your@email.com"
- **Helper**: None needed (obvious field)

**Password Input**:
- **Input Type**: Password with toggle visibility
- **Validation**: Real-time (on input for requirements checklist)
- **Error Messages**:
  - Empty: "Password is required"
  - Too short: "Password must be at least 8 characters"
  - Missing requirements: Show checklist (see below)
- **Placeholder**: "Create a password"
- **Helper**: Password requirements checklist (see Content Strategy)

**Password Confirmation** (if included):
- **Input Type**: Password
- **Validation**: On blur
- **Error Messages**: "Passwords do not match"
- **Placeholder**: "Re-enter your password"

## 4. Component Selection

### shadcn/ui Components Needed

- **Button**: Primary, secondary, outline variants for CTAs
- **Card**: Feature highlight cards, testimonial cards
- **Input**: Email, password fields for registration
- **Label**: Form field labels
- **Badge**: "New" or "Popular" tags on features
- **Separator**: Visual dividers between sections
- **Sheet**: Mobile navigation menu (if navigation needed)
- **Skeleton**: Loading states for server-rendered content
- **Alert**: Error/success messages during registration

**Coordinate with shadcn-builder for**:
- Custom landing page button variants (larger sizes, glow effects)
- Hero card wrapper (if hero uses card-style container)
- Feature card animations (hover lift effect)

### Custom Components Needed

**HeroSection** (organism):
- Reason: Complex layout combining headline, subheadline, CTAs, and image
- Not a shadcn component - custom layout logic

**FeatureHighlight** (molecule):
- Reason: Specific to landing page (icon + heading + description card)
- Reusable across feature section

**TestimonialCard** (molecule):
- Reason: Quote + avatar + name + role layout
- Not provided by shadcn

**SectionContainer** (atom):
- Reason: Consistent section padding, max-width, and background alternation
- Layout wrapper for all sections

**ScrollToTopButton** (atom):
- Reason: Fixed position button appearing on scroll
- Simple custom component

## 5. Content Strategy

### Text Requirements

**Text Map**: `src/domains/marketing/marketing.text-map.ts`

**Keys to Define**:

**Hero Section**:
- **Headings**:
  - `hero.headline`: "Track Every Rep. Build Real Progress."
  - `hero.subheadline`: "The workout tracker built for serious lifters who want structured training and real data."
- **Actions**:
  - `hero.cta.primary`: "Get Started Free"
  - `hero.cta.secondary`: "See How It Works"

**Features Section**:
- **Headings**:
  - `features.heading`: "Everything You Need to Train Smarter"
  - `features.subheading`: "From custom routines to complete workout history, we've got you covered."
- **Feature Cards** (3 primary):
  - `features.routineBuilder.title`: "Custom Routine Builder"
  - `features.routineBuilder.description`: "Create unlimited routines with 50+ exercises. Perfect for PPL, Upper/Lower, or your own split."
  - `features.tracking.title`: "Real-Time Workout Logging"
  - `features.tracking.description`: "Log sets, reps, and weight in seconds. No distractions between sets."
  - `features.progress.title`: "Progress That Motivates"
  - `features.progress.description`: "Track your streak, weekly volume, and complete workout history. See your gains over time."
- **Additional Features** (optional extended list):
  - `features.exerciseLibrary.title`: "50+ Exercise Library"
  - `features.exerciseLibrary.description`: "Pre-loaded exercises with instructions. Add your own custom movements."
  - `features.history.title`: "Complete History"
  - `features.history.description`: "Every workout saved. Review past sessions, track volume, and spot trends."

**Social Proof Section**:
- **Headings**:
  - `social.heading`: "Trusted by Lifters Like You"
- **Stats** (if available):
  - `social.stats.workouts`: "{count}+ Workouts Logged"
  - `social.stats.users`: "{count}+ Active Users"
- **Testimonials** (if available):
  - `social.testimonial1.quote`: "Finally, a tracker that doesn't slow me down between sets."
  - `social.testimonial1.author`: "Alex M."
  - `social.testimonial1.role`: "Powerlifter"

**Registration Section**:
- **Headings**:
  - `register.heading`: "Start Tracking Today"
  - `register.subheading`: "Create your free account in seconds. No credit card required."
- **Form**:
  - `register.form.email.label`: "Email"
  - `register.form.email.placeholder`: "your@email.com"
  - `register.form.password.label`: "Password"
  - `register.form.password.placeholder`: "Create a password"
  - `register.form.password.requirements.heading`: "Password must:"
  - `register.form.password.requirements.minLength`: "Be at least 8 characters"
  - `register.form.password.requirements.hasLetter`: "Contain at least one letter"
  - `register.form.password.requirements.hasNumber`: "Contain at least one number"
  - `register.form.submit`: "Create Account"
  - `register.form.hasAccount`: "Already have an account?"
  - `register.form.login`: "Login"
- **Feedback**:
  - `register.success`: "Account created successfully!"
  - `register.error.emailExists`: "This email is already registered."
  - `register.error.generic`: "Something went wrong. Please try again."

**Footer**:
- **Links**:
  - `footer.privacy`: "Privacy Policy"
  - `footer.terms`: "Terms of Service"
  - `footer.contact`: "Contact"
- **Copyright**:
  - `footer.copyright`: "© 2025 Gym Tracker App. All rights reserved."

**Tone**: Confident, direct, respectful of user's time
**Voice**: Active, 2nd person ("You track...", "Your progress...")

### Microcopy

**Empty States**: N/A for landing page

**Error States**:
- Email invalid: "Please enter a valid email address" (calm, instructional)
- Password weak: "Password must be at least 8 characters" (specific, actionable)
- Server error: "Something went wrong. Please try again." (apologetic, solution-oriented)

**Success States**:
- Account created: "Welcome aboard! Redirecting to your dashboard..." (congratulatory, informative)

**Loading States**:
- CTA clicked: "Creating your account..." (informative, patient)
- Page loading: Skeleton UI (no text needed)

## 6. Accessibility Design

### Semantic Structure

**Landmarks**:
- `<header>`: Top bar with logo + login link
- `<main>`: All landing page sections
- `<section>`: Each major section (hero, features, social proof, register, footer)
- `<footer>`: Footer links and copyright
- `<nav>`: If navigation menu is included

**Headings** (logical hierarchy):
- `<h1>`: Hero headline ("Track Every Rep. Build Real Progress.")
- `<h2>`: Section headings (Features, Testimonials, Register)
- `<h3>`: Feature card titles, testimonial names

**Lists**:
- `<ul>`: Feature list, testimonial list, footer links
- `<ol>`: Password requirements (ordered steps)

### Keyboard Navigation

**Tab Order** (logical flow):
1. Skip to content link (hidden, appears on focus)
2. Logo (if linked to home)
3. Login link (header)
4. Primary CTA (Get Started Free)
5. Secondary CTA (See How It Works)
6. Feature cards (if interactive)
7. Registration form fields (email → password → submit)
8. Footer links

**Shortcuts**:
- None needed for landing page (simple flow)

**Focus Management**:
- CTA click → Focus moves to registration form email field
- Form submit → Focus moves to success message (toast) then redirects

**Escape Hatch**:
- If modal registration: ESC key closes modal
- If inline form: No escape needed (user can scroll away)

### Screen Reader Experience

**ARIA Labels**:
- Primary CTA: `aria-label="Create free account"`
- Secondary CTA: `aria-label="Scroll to features section"`
- Logo: `aria-label="Gym Tracker App home"`
- Login link: `aria-label="Login to existing account"`
- Feature icons: `aria-hidden="true"` (decorative, text explains them)

**ARIA Descriptions**:
- Feature cards: `aria-describedby` linking icon to description text
- Password field: `aria-describedby="password-requirements"` (links to requirements list)

**Live Regions**:
- Form errors: `aria-live="polite"` (announces errors after validation)
- Success toast: `aria-live="assertive"` (important, immediate announcement)
- Registration submit: `aria-live="polite"` status="Creating account..."

**Hidden Content**:
- Skip to content link: Visually hidden, appears on focus
- Icon decorations: `aria-hidden="true"` (don't announce to screen readers)

### Visual Accessibility

**Color Contrast** (WCAG AA minimum):
- Headline text on background: 7:1 minimum (AAA preferred)
- Body text on background: 4.5:1 minimum
- CTA button text on button background: 4.5:1 minimum
- Link text on background: 4.5:1 minimum
- Dark mode: Same contrast ratios (use existing theme from globals.css)

**Color Independence**:
- Form errors: Red color + icon + text (not color alone)
- Success states: Green color + checkmark icon + text
- Required fields: Asterisk + "(required)" text, not just red asterisk

**Text Size**:
- Body text: Minimum 16px (18px preferred for readability)
- Buttons: Minimum 16px (18px preferred)
- Small print (footer): Minimum 14px

**Touch Targets** (mobile):
- All buttons: Minimum 44x44px (iOS) or 48x48px (Material)
- Links: Minimum 44px height with padding
- Form inputs: Minimum 44px height

**Motion**:
- Respect `prefers-reduced-motion` media query
- If user prefers reduced motion: disable scroll animations, parallax, hover lifts
- Transitions become instant (0ms duration)

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 7. Responsive Design

### Mobile (< 640px)

**Layout**:
- Single column, stacked sections
- Full-width container (16px horizontal padding)
- Hero image below headline (not beside)
- Features in single column (card per row)

**Navigation**:
- Minimal header: Logo (left) + Login link (right)
- No hamburger menu needed (single page, scroll only)

**Actions**:
- CTAs: Full-width buttons (easier to tap)
- Sticky CTA bar at bottom (optional): "Get Started Free" always visible

**Content**:
- Headline: 32px-40px (smaller than desktop)
- Subheadline: 18px
- Reduced padding between sections (48px instead of 96px)
- Show 3 core features, hide extended features list (or collapse)

**Images**:
- Hero image: Full-width, aspect ratio 16:9
- Feature screenshots: Full-width cards, tappable to enlarge

### Tablet (640px - 1024px)

**Layout**:
- 2-column grid for features (2 per row)
- Hero: Image beside headline (50/50 split or 60/40)
- Container max-width: 768px

**Navigation**:
- Same as mobile (minimal header)
- OR horizontal nav if multiple pages needed

**Actions**:
- CTAs: Auto-width (not full-width), centered
- Sticky header CTA appears on scroll

**Content**:
- Headline: 48px-56px
- Body text: 18px
- Section padding: 72px

**Images**:
- Hero image: 50% width, aspect ratio 4:3
- Feature screenshots: 2-up grid

### Desktop (> 1024px)

**Layout**:
- 3-column grid for features (3 per row)
- Hero: 50/50 split (headline left, image right)
- Container max-width: 1280px
- Centered with auto margins

**Navigation**:
- Fixed header with logo (left), nav links (center), login + CTA (right)
- Header becomes sticky on scroll with shadow

**Actions**:
- Primary CTA: Large size (px-8 py-4)
- Secondary CTA: Medium size (px-6 py-3)
- Header CTA: Compact size (px-6 py-2)

**Content**:
- Headline: 64px-72px (maximum impact)
- Subheadline: 20px-24px
- Body text: 18px
- Section padding: 96px-128px
- Show all features (extended list)

**Additional Features**:
- Parallax scroll on hero background (subtle, 20% speed)
- Hover animations on feature cards (lift + shadow)
- Larger screenshots (can show more UI detail)

## 8. States & Feedback

### Loading States

**Initial Page Load**:
- Hero section: Skeleton for headline (1 line, 72px height) + CTA (button shape)
- Features: Skeleton cards (3 cards, shimmer effect)
- Images: Low-res blur placeholder → fade to full res (use Next.js Image with blur)

**CTA Click (Registration)**:
- Button text changes to spinner icon + "Creating account..."
- Button stays same size (prevents layout shift)
- Button disabled during loading (no double-submit)

**Optimistic Updates**:
- Not applicable for landing page (no data mutations visible)

### Error States

**Form Validation Errors** (inline):
- Display below field immediately on blur
- Red text + alert icon
- Specific message (see Content Strategy)
- Field border turns red

**System Errors** (toast):
- Email already exists: Toast notification (top right), warning variant
- Server error: Toast notification, destructive variant
- Message disappears after 5 seconds OR user dismisses

**Recovery**:
- Inline error: User fixes field → error disappears on next blur/input
- Toast error: User clicks "Try Again" → re-submit form
- Email exists error: Link to "Login instead" in toast

### Empty States

**No data applicable** (landing page shows static content)

### Success States

**Registration Success**:
- Toast notification: "Welcome aboard! Redirecting to your dashboard..."
- Success icon (checkmark) + green background
- Auto-dismiss after 1.5 seconds → redirect to /dashboard
- If redirect fails: Show "Continue to Dashboard" button

**Next Steps**:
- After redirect: Dashboard shows onboarding tooltip
- "Create your first routine to get started" prompt
- OR Quick-start guide modal (optional)

## 9. User Flow Diagram

```
[User lands on page]
    ↓
[Sees hero: Headline + CTA + Image]
    ↓
[Scrolls down]
    ↓
[Reads 3 core features]
    ↓
[Decision Point: Interested?]
    ├─→ [NO: Exits page] → End
    └─→ [YES: Continues scrolling]
             ↓
        [Views social proof / testimonials]
             ↓
        [Decision Point: Convinced?]
             ├─→ [NO: Exits or scrolls more] → End
             └─→ [YES: Clicks CTA "Get Started Free"]
                      ↓
                 [Registration form appears (inline or /register page)]
                      ↓
                 [Fills email]
                      ↓
                 [Fills password → Sees requirements checklist]
                      ↓
                 [Clicks "Create Account"]
                      ↓
                 [Loading state: Button shows spinner]
                      ↓
                 [Validation]
                      ├─→ [Error: Email exists] → Toast error + "Login instead" link → [/login]
                      ├─→ [Error: Server issue] → Toast error + "Try again" → [Stay on form]
                      └─→ [Success] → Toast success → [Redirect to /dashboard after 1.5s]
                                                            ↓
                                                       [Dashboard loads]
                                                            ↓
                                                       [Onboarding tooltip: "Create first routine"]
                                                            ↓
                                                       [User starts using app]
```

## 10. Design Specifications

### Spacing Scale

**Tight** (for dense information):
- Component internal padding: 8px-12px
- Use for: Inline form helpers, badge padding

**Normal** (default):
- Card padding: 16px-24px
- Section internal spacing: 32px-48px
- Use for: Most components, feature cards, text blocks

**Relaxed** (for breathing room):
- Section padding (vertical): 64px-96px (mobile), 96px-128px (desktop)
- Hero section padding: 80px-120px (mobile), 120px-160px (desktop)
- Use for: Major section separation, hero section

### Typography

**Headings**:
- H1 (Hero headline):
  - Mobile: 32px-40px, weight 800, line-height 1.1
  - Desktop: 64px-72px, weight 800, line-height 1.1
- H2 (Section headings):
  - Mobile: 28px-32px, weight 700, line-height 1.2
  - Desktop: 40px-48px, weight 700, line-height 1.2
- H3 (Feature titles):
  - All: 20px-24px, weight 600, line-height 1.3

**Body**:
- Paragraph: 16px-18px, weight 400, line-height 1.6
- Subheadline: 18px-20px, weight 400, line-height 1.5

**Labels**:
- Form labels: 14px, weight 500, line-height 1.4
- Badges: 12px, weight 600, uppercase, letter-spacing 0.05em

**Font Family**: Use existing Geist Sans (from globals.css)

### Color Usage

**Primary** (from existing theme):
- When to use: Primary CTAs, active states, focus outlines
- Specific: `--primary` (dark gray in light mode, light gray in dark mode)
- Override suggestion: Use accent color for CTA buttons (more eye-catching)

**Secondary** (from existing theme):
- When to use: Secondary CTAs, hover states
- Specific: `--secondary`

**Accent**:
- When to use: Call-to-action buttons (primary CTA)
- Recommendation: Consider using blue-600 or brand color for maximum conversion
- Dark mode: Use brighter accent (blue-400) for visibility

**Semantic**:
- Success: Green (from theme chart colors or custom green-500)
  - Use for: Success toasts, password requirement met icons
- Warning: Orange/Yellow (chart-4 or custom)
  - Use for: Email exists error (less severe than destructive)
- Error: Red (--destructive)
  - Use for: Form validation errors, server errors
- Info: Blue (chart-1 or custom)
  - Use for: Informational messages, hints

**Background Alternation** (section backgrounds):
- Section 1 (Hero): `--background` (white in light, dark in dark mode)
- Section 2 (Features): `--muted` (light gray in light, darker gray in dark)
- Section 3 (Social Proof): `--background`
- Section 4 (Register): `--muted`
- Section 5 (Footer): `--card` (slightly different from background)

**Dark Mode Priority**:
- Default: Dark mode ON (target users train in gyms)
- Light mode: Available but secondary
- Use existing dark mode theme from globals.css (oklch colors)

## 11. Performance Considerations

**Critical Path** (what loads first):
1. Hero section (headline, CTA, hero image placeholder)
2. Above-fold CSS (inline critical CSS)
3. Navigation (logo, login link)
4. JS for CTA interactions

**Lazy Loading**:
- Below-fold images: `loading="lazy"` attribute
- Feature screenshots: Load on scroll intersection
- Testimonial avatars: Lazy load
- Footer content: Lowest priority

**Image Optimization**:
- Use Next.js `<Image>` component for all images
- Hero image:
  - Responsive sizes: 640w, 768w, 1024w, 1280w
  - Priority: `priority={true}` (preload)
  - Format: WebP with JPEG fallback
  - Quality: 85
- Feature screenshots:
  - Lazy load: `loading="lazy"`
  - Blur placeholder: Use `placeholder="blur"`
  - Format: WebP
  - Quality: 80
- Testimonial avatars:
  - Small size: 64x64px or 80x80px
  - Format: WebP
  - Quality: 75

**Animation Budget**:
- Limit simultaneous animations to 3-4 elements
- Use `will-change: transform` sparingly (only on hover targets)
- Prefer `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left` (causes reflow)

**Performance Goals**:
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s (hero headline + CTA)
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1 (use size hints on images)

## 12. Implementation Coordination

### Agent Collaboration

**shadcn-builder**:
- Provide component requirements:
  - Button: Need "xl" size variant for hero CTA (px-8 py-4, text-lg)
  - Button: Need "glow" variant for dark mode (subtle shadow/border glow)
  - Card: Feature card variant with hover lift effect
  - Input: Password with toggle visibility (eye icon)
  - Badge: "New" badge variant (small, accent color)
  - Alert: Inline error variant (red, icon + text)
  - Skeleton: Hero skeleton (custom shapes for headline + CTA)

**domain-architect**:
- Provide data structure needs:
  - Marketing domain: `src/domains/marketing/`
  - Text map structure: `marketing.text-map.ts`
  - No server actions needed (registration uses auth domain)
  - Types needed: Feature, Testimonial (for content structure)

**nextjs-builder**:
- Provide route requirements:
  - Landing page: `app/page.tsx` (root route)
  - Registration: `app/(auth)/register/page.tsx` (existing)
  - Server Components for static sections (hero, features, social proof)
  - Client Component for registration form
  - Metadata for SEO (title, description, og:image)

### Files Impacted

**New Files**:
- `src/app/page.tsx` (landing page - replaces existing home)
- `src/domains/marketing/marketing.text-map.ts` (landing page text)
- `src/domains/marketing/components/organisms/hero-section.tsx`
- `src/domains/marketing/components/organisms/features-section.tsx`
- `src/domains/marketing/components/organisms/social-proof-section.tsx`
- `src/domains/marketing/components/organisms/register-section.tsx`
- `src/domains/marketing/components/molecules/feature-card.tsx`
- `src/domains/marketing/components/molecules/testimonial-card.tsx`
- `src/domains/marketing/components/atoms/section-container.tsx`
- `src/domains/marketing/types.ts` (Feature, Testimonial types)
- `src/styles/domains/marketing/landing-page.css` (if custom styles needed)

**Modified Files**:
- `src/app/layout.tsx` (may need to adjust for landing page layout)
- `src/components/ui/button.tsx` (add "xl" size variant)

**Assets Needed**:
- Hero image: App screenshot or mockup (1280x720px, WebP)
- Feature screenshots: 3-6 screenshots (800x600px, WebP)
- Testimonial avatars: 3-5 images (80x80px, WebP) - Optional
- Logo: SVG or high-res PNG

## 13. Important Notes

**User testing recommended**: Yes - High-impact feature
- A/B test headlines: "Track Every Rep" vs. "Build Real Progress"
- A/B test CTA copy: "Get Started Free" vs. "Start Tracking Today"
- Test registration inline vs. separate page

**Accessibility is mandatory**: Not a nice-to-have
- WCAG AA minimum, AAA preferred for text contrast
- Full keyboard navigation required
- Screen reader testing with NVDA/JAWS
- Mobile touch target testing (44px minimum)

**Mobile-first**: Design for smallest screen first
- 90% of target users will access from phone (training in gym or researching on commute)
- Dark mode is default (gyms have low light)
- Fast load time is critical (gym wifi is often slow)

**Content before chrome**: Prioritize content over decoration
- Minimize decorative elements that don't communicate value
- Every section should answer: "What's in it for me?"
- Use real screenshots (not illustrations) to build trust

**Iterate**: Design is never truly done
- Plan for A/B testing post-launch
- Collect analytics: scroll depth, CTA click rates, registration conversion
- Monitor: Where users drop off in registration flow

**Consistency**: Reference existing patterns first
- Use existing auth text map structure (see `auth.text-map.ts`)
- Use existing dark mode theme (see `globals.css`)
- Use existing dashboard components for visual consistency (StatCard, EmptyState patterns)

## 14. Success Metrics

**Usability** (how to measure ease of use):
- Task success rate: Can user find and click CTA within 30 seconds?
- Navigation clarity: Can user understand value proposition in < 10 seconds?
- Form completion rate: % of users who start registration and complete it

**Efficiency** (task completion time):
- Time to first CTA click: < 30 seconds average
- Time to registration complete: < 180 seconds average (from landing to dashboard)
- Scroll depth: % of users who scroll past features section (target: 60%+)

**Satisfaction** (user feedback):
- Post-registration survey: "How easy was it to understand what we do?" (1-5 scale, target: 4+)
- NPS score: "How likely are you to recommend this app?" (target: 8+)

**Accessibility** (screen reader testing, keyboard-only):
- All CTAs reachable by Tab key: 100% success
- All form fields have labels: 100% success
- Color contrast ratios meet WCAG AA: 100% success
- Touch targets meet 44px minimum: 100% success

**Performance** (load time, interaction latency):
- LCP (Largest Contentful Paint): < 2.5s (target: 1.5s)
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- Registration form submit latency: < 1s (optimistic updates)

**Conversion Metrics** (primary success metric):
- Landing → Registration start: Target 15-25%
- Registration start → Complete: Target 70-85%
- Overall landing → Account created: Target 10-20%

---

## 15. Section-by-Section Wireframe Structure

### Section 1: Hero Section

**Purpose**: Immediate value communication + primary CTA

**Desktop Layout (1280px container)**:
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]                                      [Login]         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐  ┌────────────────────────────┐   │
│  │                      │  │                            │   │
│  │  [Hero Headline]     │  │   [Hero Image/Screenshot]  │   │
│  │  72px, Bold          │  │   App in action            │   │
│  │                      │  │   1280x720px               │   │
│  │  [Subheadline]       │  │                            │   │
│  │  20px, Regular       │  │                            │   │
│  │                      │  │                            │   │
│  │  [Get Started Free]  │  │                            │   │
│  │  [See How It Works]  │  │                            │   │
│  │                      │  │                            │   │
│  └──────────────────────┘  └────────────────────────────┘   │
│                                                               │
│                    Padding: 120px top/bottom                  │
└─────────────────────────────────────────────────────────────┘
```

**Mobile Layout (< 640px)**:
```
┌─────────────────────────┐
│ [Logo]         [Login]  │
├─────────────────────────┤
│                         │
│   [Hero Headline]       │
│   40px, Bold            │
│                         │
│   [Subheadline]         │
│   18px, Regular         │
│                         │
│   [Get Started Free]    │
│   (Full-width button)   │
│                         │
│   [See How It Works]    │
│   (Full-width outline)  │
│                         │
│   [Hero Image]          │
│   Full-width, 16:9      │
│                         │
│   Padding: 64px top/bot │
└─────────────────────────┘
```

**Components Used**:
- `HeroSection` (organism, custom)
- `Button` (shadcn, primary and secondary variants)
- Next.js `<Image>` for hero visual

**Accessibility**:
- H1 on headline
- Alt text on hero image: "Gym Tracker App dashboard showing workout logging interface"
- CTAs have aria-labels

---

### Section 2: Features Section

**Purpose**: Communicate core value propositions

**Desktop Layout (3-column grid)**:
```
┌─────────────────────────────────────────────────────────────┐
│                   [Section Heading]                          │
│                   "Everything You Need to Train Smarter"     │
│                   [Section Subheading]                       │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  [Icon]      │  │  [Icon]      │  │  [Icon]      │       │
│  │  Custom      │  │  Real-Time   │  │  Progress    │       │
│  │  Routines    │  │  Logging     │  │  Tracking    │       │
│  │              │  │              │  │              │       │
│  │  Description │  │  Description │  │  Description │       │
│  │  text here   │  │  text here   │  │  text here   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│                   Padding: 96px top/bottom                    │
└─────────────────────────────────────────────────────────────┘
```

**Mobile Layout (single column)**:
```
┌─────────────────────────┐
│  [Section Heading]      │
│  32px, Bold             │
│                         │
│  ┌───────────────────┐  │
│  │ [Icon] Feature 1  │  │
│  │ Custom Routines   │  │
│  │ Description...    │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │ [Icon] Feature 2  │  │
│  │ Real-Time Logging │  │
│  │ Description...    │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │ [Icon] Feature 3  │  │
│  │ Progress Tracking │  │
│  │ Description...    │  │
│  └───────────────────┘  │
│                         │
│  Padding: 64px top/bot  │
└─────────────────────────┘
```

**Components Used**:
- `FeaturesSection` (organism, custom)
- `FeatureCard` (molecule, custom)
- `Card` (shadcn, for card container)
- Icons from `lucide-react` (Dumbbell, Clock, TrendingUp, etc.)

**Accessibility**:
- H2 on section heading
- H3 on each feature title
- Icons are decorative (`aria-hidden="true"`)
- Feature cards in `<ul>` list

**Interactions**:
- Fade-in on scroll (Intersection Observer)
- Hover: Card lifts 4px, shadow increases
- Focus: 2px outline on entire card

---

### Section 3: Social Proof Section

**Purpose**: Build trust with testimonials and stats

**Desktop Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│                   [Section Heading]                          │
│                   "Trusted by Lifters Like You"              │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  "Quote text │  │  "Quote text │  │  "Quote text │       │
│  │   from user" │  │   from user" │  │   from user" │       │
│  │              │  │              │  │              │       │
│  │  [Avatar]    │  │  [Avatar]    │  │  [Avatar]    │       │
│  │  Name        │  │  Name        │  │  Name        │       │
│  │  Role        │  │  Role        │  │  Role        │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│                   Padding: 96px top/bottom                    │
└─────────────────────────────────────────────────────────────┘
```

**Mobile Layout**:
```
┌─────────────────────────┐
│  [Section Heading]      │
│                         │
│  ┌───────────────────┐  │
│  │ "Quote text from  │  │
│  │  user here..."    │  │
│  │                   │  │
│  │ [Avatar] Name     │  │
│  │ Role/Context      │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │ "Quote text from  │  │
│  │  user here..."    │  │
│  │                   │  │
│  │ [Avatar] Name     │  │
│  │ Role/Context      │  │
│  └───────────────────┘  │
│                         │
│  Padding: 64px top/bot  │
└─────────────────────────┘
```

**Components Used**:
- `SocialProofSection` (organism, custom)
- `TestimonialCard` (molecule, custom)
- `Card` (shadcn, for card container)
- `Avatar` (shadcn, for user avatars)

**Accessibility**:
- H2 on section heading
- Each testimonial in `<blockquote>` with `<cite>` for attribution
- Avatar alt text: "Photo of [Name]"

**Interactions**:
- Fade-in on scroll
- Optional: Horizontal scroll/carousel on mobile if more than 2 testimonials

---

### Section 4: Registration Section

**Purpose**: Convert visitors to users

**Desktop Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│              [Section Heading]                                │
│              "Start Tracking Today"                           │
│              [Subheading]                                     │
│              "Create your free account in seconds"            │
│                                                               │
│              ┌───────────────────────────┐                    │
│              │  [Email Input]            │                    │
│              │  your@email.com           │                    │
│              └───────────────────────────┘                    │
│                                                               │
│              ┌───────────────────────────┐                    │
│              │  [Password Input] [👁️]   │                    │
│              │  ••••••••                 │                    │
│              └───────────────────────────┘                    │
│                                                               │
│              Password must:                                   │
│              ✓ Be at least 8 characters                       │
│              ✓ Contain at least one letter                    │
│              ✓ Contain at least one number                    │
│                                                               │
│              [Create Account]                                 │
│              (Full-width primary button)                      │
│                                                               │
│              Already have an account? [Login]                 │
│                                                               │
│              Padding: 96px top/bottom                         │
└─────────────────────────────────────────────────────────────┘
```

**Mobile Layout**: Same as desktop, but form full-width

**Components Used**:
- `RegisterSection` (organism, custom)
- `Input` (shadcn, email and password types)
- `Label` (shadcn)
- `Button` (shadcn, primary for submit)
- `Alert` (shadcn, for inline errors)
- Password requirements component (reuse from auth domain)

**Accessibility**:
- H2 on section heading
- All inputs have labels (visible)
- Password requirements: `<ol>` with checkmarks
- Form submit: `aria-live="polite"` for status updates
- Error messages: `aria-live="polite"`, linked to inputs with `aria-describedby`

**Interactions**:
- Email validation on blur
- Password requirements update in real-time (checkmarks appear)
- Submit button shows loading spinner
- Success → Toast → Redirect

---

### Section 5: Footer

**Purpose**: Legal links, contact, copyright

**Desktop Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  [Privacy Policy]  [Terms of Service]  [Contact]             │
│                                                               │
│  © 2025 Gym Tracker App. All rights reserved.                │
│                                                               │
│                   Padding: 48px top/bottom                    │
└─────────────────────────────────────────────────────────────┘
```

**Mobile Layout**: Same, but links stack vertically if needed

**Components Used**:
- `Footer` (organism, custom or from layout)
- `Separator` (shadcn, line above footer)

**Accessibility**:
- `<footer>` landmark
- Links have sufficient color contrast
- Links have `:hover` and `:focus` states

---

## 16. Visual Design Recommendations

### Color Psychology & Theme

**Primary Color Strategy**:
- **Use Case**: Trust, reliability, professionalism
- **Recommendation**: Keep existing dark/light gray as base (from theme)
- **Accent for CTAs**:
  - Consider blue-600 (conveys trust, action) OR
  - Consider orange-600 (conveys energy, gym vibe)
  - Current theme uses muted colors - recommend adding accent override for landing page CTAs

**Dark Mode as Default**:
- Target users train in gyms (low light environments)
- Dark mode reduces eye strain during workouts
- Use existing dark theme from `globals.css` (oklch colors are well-balanced)
- Ensure hero image works on both light and dark backgrounds

**Background Strategy**:
- Alternating section backgrounds for visual separation:
  - Hero: Pure background (`--background`)
  - Features: Muted background (`--muted`)
  - Social Proof: Pure background
  - Register: Muted background with subtle gradient
  - Footer: Card background (`--card`)

**Semantic Color Usage**:
- Success (green): Password requirements met, registration success
- Warning (orange): Email already exists (not severe error)
- Error (red): Form validation errors, server failures
- Info (blue): Tooltips, helper text

### Imagery Strategy

**Screenshots vs Mockups vs Icons**:

**Use Screenshots** (preferred):
- Why: Builds trust, shows real product
- Where: Hero image, feature section examples
- Requirements: High-quality (2x resolution), recent UI, compelling use case
- Example: Dashboard showing workout in progress, history page with data

**Use Icons** (supporting):
- Why: Quick visual cues, lightweight
- Where: Feature cards (Dumbbell, Clock, TrendingUp, BarChart icons)
- Style: lucide-react icons (consistent with dashboard)
- Color: Primary color or accent color

**Avoid Mockups/Illustrations**:
- Why: Less trustworthy than real screenshots for SaaS apps
- Exception: If product is not built yet, use high-fidelity mockups

**Image Checklist**:
- [ ] Hero image shows dashboard or workout logging in action
- [ ] Screenshot shows real data (not lorem ipsum)
- [ ] Dark mode screenshots if dark mode is default
- [ ] Mobile screenshots for mobile section (if included)
- [ ] All images optimized (WebP format, < 200KB each)

### Animation & Motion Strategy

**Scroll Animations** (subtle, performance-conscious):
- Fade-in on scroll for section headings and feature cards
- Stagger animations: 100ms delay between cards
- Use Intersection Observer (not scroll event listeners)
- Respect `prefers-reduced-motion`

**Hover Animations** (desktop only):
- Feature cards: Lift 4px, shadow increase, 200ms ease
- CTA buttons: Slight scale (1.02), darker shade, 200ms ease
- Screenshots: Subtle zoom (1.05) or border glow

**Avoid**:
- Auto-playing videos (distracting, performance-heavy)
- Heavy parallax (can cause motion sickness)
- Continuous animations (spinning icons, pulsing elements)

---

## 17. Final Recommendations

**Priority 1 (Must-Have)**:
1. Hero section with clear value prop + CTA
2. 3 core features with icons and descriptions
3. Registration form (email + password)
4. Mobile-responsive design
5. Dark mode support
6. Accessibility (WCAG AA minimum)

**Priority 2 (Should-Have)**:
1. Social proof section (testimonials or stats)
2. App screenshots (real product images)
3. Loading states for registration
4. Error handling for form validation
5. SEO metadata (title, description, og:image)

**Priority 3 (Nice-to-Have)**:
1. Scroll animations (fade-in effects)
2. Sticky CTA header on scroll
3. Extended feature list (more than 3)
4. FAQ section
5. A/B testing setup for headlines/CTAs

**Post-Launch Iteration Plan**:
1. Add analytics: Track scroll depth, CTA clicks, registration conversion
2. A/B test headlines: "Track Every Rep" vs alternatives
3. User testing: Watch 5 users navigate landing page, note friction points
4. Performance optimization: Aim for < 2s LCP
5. Collect user feedback: Post-registration survey

---

**End of UX/UI Design Plan**

This plan is ready for implementation by the parent agent. All sections are designed mobile-first, accessible, and optimized for conversion. Coordinate with shadcn-builder for component specs and nextjs-builder for route implementation.
