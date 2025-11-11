# Landing Page - Next.js 15 Implementation Plan

**Created**: 2025-11-10
**Session**: landing_page_001
**Type**: Next.js Architecture
**Complexity**: Medium

## 1. Feature Overview

**Feature**: Landing Page for Gym Tracker App
**User Flow**: Visitor arrives at `/` → views features/benefits → CTA to register/login → navigates to app
**Route**: `/` (root)

**Purpose**: Marketing page to promote the Gym Tracker App, showcase features, and convert visitors to registered users.

## 2. Routing Structure

### Primary Route

#### Route: `/`

**File**: `src/app/page.tsx`
**Type**: Server Component (Static Site Generation)
**Purpose**: Home page - marketing landing page with hero, features, benefits, CTA
**Dynamic**: No (fully static, no dynamic segments)

**Layout Needed**: No (uses root layout only)
- Root layout already exists at `src/app/layout.tsx`
- Landing page will NOT share the authenticated app layout from `src/app/(app)/layout.tsx`

**Route Group**: None
**Why**: Landing page is at root `/`, separate from auth routes `(auth)` and app routes `(app)`

**Current Status**: Route exists but shows default Next.js welcome page
**Action**: Replace `src/app/page.tsx` with landing page implementation

### Existing Routes to Preserve

No modifications needed to existing routes. Landing page will:
- Replace current default page at `/`
- Include navigation links to `/login` and `/register`
- Middleware already configured to allow public access to `/`

## 3. Server Component Architecture

### Page Component (Server Component - Static)

**File**: `src/app/page.tsx`
**Component Type**: ✅ Server Component (NO "use client")

```typescript
// ✅ Server Component - fully static landing page
import { Suspense } from 'react';
import { Hero } from '@/domains/marketing/components/organisms/hero';
import { Features } from '@/domains/marketing/components/organisms/features';
import { Benefits } from '@/domains/marketing/components/organisms/benefits';
import { Testimonials } from '@/domains/marketing/components/organisms/testimonials';
import { Pricing } from '@/domains/marketing/components/organisms/pricing';
import { CallToAction } from '@/domains/marketing/components/organisms/call-to-action';
import { MarketingFooter } from '@/domains/marketing/components/organisms/marketing-footer';
import { MarketingHeader } from '@/domains/marketing/components/organisms/marketing-header';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <MarketingHeader />

      <main>
        {/* Hero - above the fold */}
        <Hero />

        {/* Features - core functionality showcase */}
        <Features />

        {/* Benefits - value propositions */}
        <Benefits />

        {/* Social proof (could be dynamic in future) */}
        <Suspense fallback={<TestimonialsSkeleton />}>
          <Testimonials />
        </Suspense>

        {/* Pricing (if applicable) */}
        <Pricing />

        {/* Final conversion */}
        <CallToAction />
      </main>

      <MarketingFooter />
    </div>
  );
}
```

**Data Fetching**: ❌ No data fetching (static content from text maps)
**Why Server Component**:
- SEO optimization (server-rendered HTML)
- No interactivity needed at page level
- Faster initial page load
- Static generation for optimal performance

### New Domain: Marketing

**Rationale**: Landing page is marketing content, separate from app business logic
**Location**: `src/domains/marketing/`

**Structure**:
```
src/domains/marketing/
├── components/
│   ├── atoms/
│   │   ├── section-badge.tsx          # Category badges
│   │   ├── feature-icon.tsx           # Feature icons
│   │   └── stat-number.tsx            # Animated stat numbers (Client)
│   ├── molecules/
│   │   ├── feature-card.tsx           # Individual feature card
│   │   ├── benefit-item.tsx           # Benefit with icon
│   │   ├── testimonial-card.tsx       # User testimonial
│   │   ├── pricing-tier.tsx           # Pricing plan card
│   │   └── nav-link.tsx               # Navigation link with active state (Client)
│   └── organisms/
│       ├── marketing-header.tsx       # Header with logo + nav (Server)
│       ├── hero.tsx                   # Hero section (Server)
│       ├── features.tsx               # Features grid (Server)
│       ├── benefits.tsx               # Benefits section (Server)
│       ├── testimonials.tsx           # Testimonials carousel (mixed)
│       ├── pricing.tsx                # Pricing tiers (Server)
│       ├── call-to-action.tsx         # CTA section (Server)
│       └── marketing-footer.tsx       # Footer (Server)
├── marketing.text-map.ts              # ALL text content (no hardcoded strings)
└── types.ts                           # Marketing domain types
```

### Client Components (Interactive Elements Only)

#### 1. Testimonials Carousel

**File**: `src/domains/marketing/components/organisms/testimonials.tsx`
**Component Type**: ❌ Client Component (needs "use client")

```typescript
'use client';

import { useState, useEffect } from 'react';
import { TestimonialCard } from '../molecules/testimonial-card';
import type { Testimonial } from '../../types';

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="testimonials">
      <TestimonialCard testimonial={testimonials[activeIndex]} />
      {/* Navigation dots */}
    </section>
  );
}
```

**Why Client Component**:
- [x] Uses useState for active testimonial
- [x] Uses useEffect for auto-rotation
- [x] Event handlers for manual navigation (onClick)

**Note**: TestimonialCard itself can remain a Server Component (presentational only).

#### 2. Smooth Scroll Navigation

**File**: `src/domains/marketing/components/molecules/nav-link.tsx`
**Component Type**: ❌ Client Component (needs "use client")

```typescript
'use client';

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.getElementById(href.substring(1));
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a href={href} onClick={handleClick}>
      {children}
    </a>
  );
}
```

**Why Client Component**:
- [x] Event handlers (onClick)
- [x] Browser APIs (document.getElementById, scrollIntoView)

#### 3. Animated Stat Numbers (Optional)

**File**: `src/domains/marketing/components/atoms/stat-number.tsx`
**Component Type**: ❌ Client Component (if animated)

```typescript
'use client';

import { useState, useEffect } from 'react';

export function StatNumber({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Animate number from 0 to value
    // ...animation logic
  }, [value, duration]);

  return <span className="stat-number">{count}</span>;
}
```

**Why Client Component**:
- [x] Uses useState and useEffect for animation
- [x] Browser-side animation

**Alternative**: If no animation needed, can be Server Component with static number.

#### 4. Mobile Menu Toggle

**File**: `src/domains/marketing/components/organisms/marketing-header.tsx`
**Component Type**: Mixed (Server wrapper + Client toggle)

```typescript
// Server Component wrapper
import { MobileMenuToggle } from './mobile-menu-toggle';

export function MarketingHeader() {
  return (
    <header className="marketing-header">
      <Logo />
      <DesktopNav /> {/* Server Component */}
      <MobileMenuToggle /> {/* Client Component */}
    </header>
  );
}
```

**File**: `src/domains/marketing/components/organisms/mobile-menu-toggle.tsx`
**Component Type**: ❌ Client Component

```typescript
'use client';

import { useState } from 'react';

export function MobileMenuToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
      {isOpen && <MobileNav />}
    </>
  );
}
```

**Why Client Component**:
- [x] Uses useState for menu open/closed state
- [x] Event handlers (onClick)

### Server Components (All Others)

All other components remain **Server Components** (no "use client"):

- `hero.tsx` - Static hero section with text and CTA buttons (links only, no onClick)
- `features.tsx` - Grid of feature cards (static content)
- `benefits.tsx` - List of benefits with icons (static content)
- `pricing.tsx` - Pricing tiers (static cards with links to /register)
- `call-to-action.tsx` - Final CTA section (static with links)
- `marketing-footer.tsx` - Footer with links (static)
- `feature-card.tsx` - Individual feature card (presentational)
- `benefit-item.tsx` - Benefit with icon (presentational)
- `pricing-tier.tsx` - Pricing card (presentational)

**Why Server Components**:
- Pure presentational components
- No state or interactivity
- SEO benefit (rendered HTML)
- Better performance (no JS shipped for these)

## 4. Layouts and Templates

### Root Layout (Modifications Needed)

**File**: `src/app/layout.tsx`
**Changes**: Add marketing-specific metadata and Open Graph tags

```typescript
// ✅ Server Component
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/lib/providers/query-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Gym Tracker - Track Your Progress, Achieve Your Goals',
  description: 'The ultimate fitness companion for serious lifters. Create custom routines, log workouts in real-time, and track your progress with detailed analytics.',
  keywords: ['gym tracker', 'workout app', 'fitness tracker', 'strength training', 'exercise log'],
  authors: [{ name: 'Gym Tracker Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gymtracker.app',
    siteName: 'Gym Tracker',
    title: 'Gym Tracker - Track Your Progress, Achieve Your Goals',
    description: 'The ultimate fitness companion for serious lifters. Create custom routines, log workouts in real-time, and track your progress with detailed analytics.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Gym Tracker App'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gym Tracker - Track Your Progress, Achieve Your Goals',
    description: 'The ultimate fitness companion for serious lifters.',
    images: ['/og-image.png']
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
```

**Changes Summary**:
- ✅ Enhanced SEO metadata (title, description, keywords)
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card metadata
- ✅ Robots meta for indexing
- ⚠️ Assumes Open Graph image at `/public/og-image.png` (needs creation)

### No Nested Layout Needed

Landing page uses only root layout. Marketing header/footer are components, not layouts.

**Why**: Landing page is a single page with different visual style from app. No shared layout needed.

## 5. Loading and Error States

### Loading UI

**File**: `src/app/loading.tsx` (create new)
**Purpose**: Loading state while landing page loads (minimal, should be fast)

```typescript
// ✅ Server Component
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="landing-page-loading">
      {/* Header skeleton */}
      <div className="h-16 border-b">
        <Skeleton className="h-8 w-32 ml-4 mt-4" />
      </div>

      {/* Hero skeleton */}
      <div className="container mx-auto py-20">
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
        <div className="flex gap-4 justify-center">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    </div>
  );
}
```

**When shown**: During page load (but should be minimal due to static generation)

### Error Boundary

**File**: `src/app/error.tsx` (create new)
**Purpose**: Catch and handle errors on landing page

```typescript
'use client'; // ❌ Must be Client Component

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Landing page error:', error);
  }, [error]);

  return (
    <div className="error-page">
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
        <p className="text-muted-foreground mb-8">
          We're sorry, but we encountered an error loading the page.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <a href="/login">Go to Login</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
```

## 6. Data Fetching Strategy

### No Backend Data Fetching Required

Landing page is **fully static** - no database queries, no API calls.

**Content Source**: Text maps only

**File**: `src/domains/marketing/marketing.text-map.ts`

```typescript
/**
 * Text map for marketing domain
 * All landing page text content
 */

export const marketingTextMap = {
  header: {
    logo: 'Gym Tracker',
    nav: {
      features: 'Features',
      benefits: 'Benefits',
      pricing: 'Pricing',
      about: 'About'
    },
    cta: {
      login: 'Login',
      register: 'Get Started'
    }
  },

  hero: {
    badge: 'Built for Serious Lifters',
    heading: 'Track Your Progress, Achieve Your Goals',
    subheading: 'The ultimate fitness companion for structured training. Create custom routines, log workouts in real-time, and watch your strength grow.',
    cta: {
      primary: 'Start Free Today',
      secondary: 'View Demo'
    }
  },

  features: {
    heading: 'Everything You Need to Succeed',
    subheading: 'Powerful features designed for serious strength training',
    items: [
      {
        id: 'custom-routines',
        icon: 'clipboard-list',
        title: 'Custom Routines',
        description: 'Build personalized workout routines with 50+ exercises or create your own. Organize by muscle group and training focus.'
      },
      {
        id: 'real-time-logging',
        icon: 'trending-up',
        title: 'Real-Time Logging',
        description: 'Log sets, reps, and weight as you lift. No more forgotten workouts or lost notebooks.'
      },
      {
        id: 'progress-tracking',
        icon: 'chart-bar',
        title: 'Progress Analytics',
        description: 'Visualize your strength gains over time. Track volume, frequency, and personal records.'
      },
      {
        id: 'workout-history',
        icon: 'history',
        title: 'Complete History',
        description: 'Access every workout you've ever logged. Review past sessions and see how far you've come.'
      },
      {
        id: 'streak-tracking',
        icon: 'fire',
        title: 'Streak Motivation',
        description: 'Stay consistent with streak tracking. Build the habit of showing up week after week.'
      },
      {
        id: 'exercise-library',
        icon: 'book-open',
        title: 'Exercise Library',
        description: 'Browse 50+ predefined exercises or add your own custom movements.'
      }
    ]
  },

  benefits: {
    heading: 'Why Lifters Choose Gym Tracker',
    items: [
      {
        id: 'structured-training',
        icon: 'target',
        title: 'Structured Training',
        description: 'Stop wandering around the gym. Follow proven routines designed for progressive overload.'
      },
      {
        id: 'data-driven',
        icon: 'chart-line',
        title: 'Data-Driven Progress',
        description: 'Make decisions based on real data, not guesswork. See exactly what's working.'
      },
      {
        id: 'consistency',
        icon: 'calendar-check',
        title: 'Build Consistency',
        description: 'The best workout is the one you actually do. Our streak system keeps you accountable.'
      },
      {
        id: 'no-confusion',
        icon: 'check-circle',
        title: 'No More Confusion',
        description: 'Know exactly what to do each session. Your routine is waiting for you.'
      }
    ]
  },

  pricing: {
    heading: 'Simple, Transparent Pricing',
    subheading: 'Start free, upgrade when you're ready',
    tiers: [
      {
        id: 'free',
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Perfect for getting started',
        features: [
          '3 custom routines',
          'Unlimited workouts',
          'Basic analytics',
          '7-day history'
        ],
        cta: 'Get Started',
        highlighted: false
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '$9',
        period: 'per month',
        description: 'For serious lifters',
        features: [
          'Unlimited routines',
          'Unlimited workouts',
          'Advanced analytics',
          'Unlimited history',
          'Custom exercises',
          'Export data'
        ],
        cta: 'Start Free Trial',
        highlighted: true
      }
    ]
  },

  testimonials: {
    heading: 'What Lifters Say',
    items: [
      {
        id: '1',
        quote: 'Finally, a workout tracker that doesn't overcomplicate things. I just want to log my lifts and see progress - this does exactly that.',
        author: 'Mike T.',
        role: 'Powerlifter',
        avatar: '/testimonials/mike.jpg'
      },
      {
        id: '2',
        quote: 'The streak feature keeps me accountable. Seeing that number grow motivates me to show up even on tough days.',
        author: 'Sarah L.',
        role: 'CrossFit Athlete',
        avatar: '/testimonials/sarah.jpg'
      },
      {
        id: '3',
        quote: 'I've tried 5+ workout apps. This is the only one I've stuck with for more than a month. Simple, fast, no BS.',
        author: 'James R.',
        role: 'Bodybuilder',
        avatar: '/testimonials/james.jpg'
      }
    ]
  },

  callToAction: {
    heading: 'Ready to Level Up Your Training?',
    subheading: 'Join thousands of lifters tracking their progress',
    cta: {
      primary: 'Start Free Today',
      secondary: 'No credit card required'
    }
  },

  footer: {
    tagline: 'Built for lifters, by lifters',
    copyright: '© 2025 Gym Tracker. All rights reserved.',
    links: {
      product: {
        heading: 'Product',
        items: [
          { label: 'Features', href: '#features' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'FAQ', href: '/faq' }
        ]
      },
      company: {
        heading: 'Company',
        items: [
          { label: 'About', href: '/about' },
          { label: 'Blog', href: '/blog' },
          { label: 'Contact', href: '/contact' }
        ]
      },
      legal: {
        heading: 'Legal',
        items: [
          { label: 'Privacy', href: '/privacy' },
          { label: 'Terms', href: '/terms' }
        ]
      }
    },
    social: {
      twitter: 'https://twitter.com/gymtracker',
      github: 'https://github.com/gymtracker',
      instagram: 'https://instagram.com/gymtracker'
    }
  }
} as const;
```

**Data Flow**: Text map → Server Component props → Rendered HTML

**No React Query Needed**: All content is static, imported directly from text map.

### Future: Optional Dynamic Testimonials

If testimonials should come from a database in the future:

**File**: `src/domains/marketing/actions.ts`

```typescript
'use server';

import { db } from '@/lib/db';

export async function getTestimonials() {
  // No auth needed - public data
  const testimonials = await db.testimonial.findMany({
    where: { approved: true },
    take: 10,
    orderBy: { createdAt: 'desc' }
  });

  return testimonials;
}
```

**In page.tsx**:

```typescript
import { getTestimonials } from '@/domains/marketing/actions';

export default async function LandingPage() {
  // ✅ Fetch in Server Component
  const testimonials = await getTestimonials();

  return (
    <div>
      {/* ... */}
      <Suspense fallback={<TestimonialsSkeleton />}>
        <Testimonials testimonials={testimonials} />
      </Suspense>
    </div>
  );
}
```

**For now**: Use static testimonials from text map.

## 7. Metadata and SEO

### Static Metadata (Root Layout)

Already planned in section 4 (Root Layout modifications).

### Dynamic Metadata (Not Needed)

Landing page is static - no dynamic metadata needed.

### JSON-LD Structured Data

**File**: `src/app/page.tsx`
**Add**: Organization and WebSite schema

```typescript
export default function LandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://gymtracker.app/#organization',
        name: 'Gym Tracker',
        url: 'https://gymtracker.app',
        logo: {
          '@type': 'ImageObject',
          url: 'https://gymtracker.app/logo.png',
          width: 200,
          height: 200
        },
        description: 'The ultimate fitness companion for serious lifters',
        sameAs: [
          'https://twitter.com/gymtracker',
          'https://github.com/gymtracker',
          'https://instagram.com/gymtracker'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': 'https://gymtracker.app/#website',
        url: 'https://gymtracker.app',
        name: 'Gym Tracker',
        publisher: {
          '@id': 'https://gymtracker.app/#organization'
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://gymtracker.app/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Gym Tracker',
        operatingSystem: 'Web',
        applicationCategory: 'HealthApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '1250'
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="landing-page">
        {/* Page content */}
      </div>
    </>
  );
}
```

**Benefits**:
- ✅ Rich snippets in Google search
- ✅ Knowledge graph eligibility
- ✅ Better SEO signals
- ✅ Social media preview enhancement

### Sitemap

**File**: `src/app/sitemap.ts` (create new)

```typescript
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gymtracker.app';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3
    }
  ];
}
```

### Robots.txt

**File**: `src/app/robots.ts` (create new)

```typescript
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/admin/']
    },
    sitemap: 'https://gymtracker.app/sitemap.xml'
  };
}
```

## 8. Route Groups and Organization

### No Route Groups Needed for Landing Page

Landing page stays at root `/` without route group.

**Existing route groups preserved**:
- `(auth)/` - Login, register, forgot-password
- `(app)/` - Dashboard and authenticated routes

**Structure**:
```
src/app/
├── page.tsx                  # Landing page (/)
├── layout.tsx                # Root layout (modified for SEO)
├── loading.tsx               # Landing page loading (new)
├── error.tsx                 # Landing page error (new)
├── sitemap.ts                # Sitemap (new)
├── robots.ts                 # Robots.txt (new)
├── (auth)/                   # Auth routes (existing)
│   ├── layout.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── forgot-password/page.tsx
└── (app)/                    # App routes (existing)
    ├── layout.tsx
    ├── dashboard/page.tsx
    ├── routines/page.tsx
    ├── exercises/page.tsx
    ├── workout/page.tsx
    └── history/page.tsx
```

**Why no route group**: Landing page is semantically at root and has unique layout (marketing vs app).

## 9. Files to Create

### App Router Files

#### `src/app/page.tsx` (REPLACE existing)
**Purpose**: Landing page component
**Type**: Server Component
**Exports**: `export default function LandingPage()`
**Status**: File exists (needs full replacement)

#### `src/app/loading.tsx` (NEW)
**Purpose**: Loading state for landing page
**Type**: Server Component
**Exports**: `export default function Loading()`
**Status**: Create new

#### `src/app/error.tsx` (NEW)
**Purpose**: Error boundary for landing page
**Type**: Client Component (must be)
**Exports**: `export default function Error()`
**Status**: Create new

#### `src/app/sitemap.ts` (NEW)
**Purpose**: XML sitemap for SEO
**Type**: Function returning sitemap
**Exports**: `export default function sitemap()`
**Status**: Create new

#### `src/app/robots.ts` (NEW)
**Purpose**: Robots.txt for crawlers
**Type**: Function returning robots config
**Exports**: `export default function robots()`
**Status**: Create new

### Marketing Domain Files

#### `src/domains/marketing/marketing.text-map.ts` (NEW)
**Purpose**: All landing page text content
**Type**: Text map constant
**Exports**: `export const marketingTextMap`
**Status**: Create new

#### `src/domains/marketing/types.ts` (NEW)
**Purpose**: Marketing domain types
**Type**: TypeScript types
**Exports**: Named type exports
**Status**: Create new

### Marketing Components - Organisms (Server)

#### `src/domains/marketing/components/organisms/marketing-header.tsx` (NEW)
**Purpose**: Landing page header with logo + navigation
**Type**: Server Component
**Exports**: `export function MarketingHeader()`
**Status**: Create new

#### `src/domains/marketing/components/organisms/hero.tsx` (NEW)
**Purpose**: Hero section (above the fold)
**Type**: Server Component
**Exports**: `export function Hero()`
**Status**: Create new

#### `src/domains/marketing/components/organisms/features.tsx` (NEW)
**Purpose**: Features grid section
**Type**: Server Component
**Exports**: `export function Features()`
**Status**: Create new

#### `src/domains/marketing/components/organisms/benefits.tsx` (NEW)
**Purpose**: Benefits section
**Type**: Server Component
**Exports**: `export function Benefits()`
**Status**: Create new

#### `src/domains/marketing/components/organisms/pricing.tsx` (NEW)
**Purpose**: Pricing tiers section
**Type**: Server Component
**Exports**: `export function Pricing()`
**Status**: Create new

#### `src/domains/marketing/components/organisms/call-to-action.tsx` (NEW)
**Purpose**: Final CTA section
**Type**: Server Component
**Exports**: `export function CallToAction()`
**Status**: Create new

#### `src/domains/marketing/components/organisms/marketing-footer.tsx` (NEW)
**Purpose**: Landing page footer
**Type**: Server Component
**Exports**: `export function MarketingFooter()`
**Status**: Create new

#### `src/domains/marketing/components/organisms/testimonials.tsx` (NEW)
**Purpose**: Testimonials carousel section
**Type**: Client Component (has interactivity)
**Exports**: `export function Testimonials()`
**Status**: Create new

### Marketing Components - Molecules (Server/Client Mix)

#### `src/domains/marketing/components/molecules/feature-card.tsx` (NEW)
**Purpose**: Individual feature card
**Type**: Server Component
**Exports**: `export function FeatureCard()`
**Status**: Create new

#### `src/domains/marketing/components/molecules/benefit-item.tsx` (NEW)
**Purpose**: Benefit with icon
**Type**: Server Component
**Exports**: `export function BenefitItem()`
**Status**: Create new

#### `src/domains/marketing/components/molecules/testimonial-card.tsx` (NEW)
**Purpose**: User testimonial card
**Type**: Server Component (presentational)
**Exports**: `export function TestimonialCard()`
**Status**: Create new

#### `src/domains/marketing/components/molecules/pricing-tier.tsx` (NEW)
**Purpose**: Pricing plan card
**Type**: Server Component
**Exports**: `export function PricingTier()`
**Status**: Create new

#### `src/domains/marketing/components/molecules/nav-link.tsx` (NEW)
**Purpose**: Smooth scroll navigation link
**Type**: Client Component (has onClick)
**Exports**: `export function NavLink()`
**Status**: Create new

### Marketing Components - Atoms (Server/Client Mix)

#### `src/domains/marketing/components/atoms/section-badge.tsx` (NEW)
**Purpose**: Category badge for sections
**Type**: Server Component
**Exports**: `export function SectionBadge()`
**Status**: Create new

#### `src/domains/marketing/components/atoms/feature-icon.tsx` (NEW)
**Purpose**: Icon wrapper for features
**Type**: Server Component
**Exports**: `export function FeatureIcon()`
**Status**: Create new

#### `src/domains/marketing/components/atoms/stat-number.tsx` (NEW)
**Purpose**: Animated stat number (optional)
**Type**: Client Component (if animated) / Server (if static)
**Exports**: `export function StatNumber()`
**Status**: Create new (choose animated vs static)

### Marketing Components - Client Interactivity

#### `src/domains/marketing/components/organisms/mobile-menu-toggle.tsx` (NEW)
**Purpose**: Mobile menu toggle button
**Type**: Client Component
**Exports**: `export function MobileMenuToggle()`
**Status**: Create new

### Styles

#### `src/styles/domains/marketing/landing-page.css` (NEW)
**Purpose**: Landing page specific styles
**Type**: CSS file
**Status**: Create new

#### `src/styles/domains/marketing/hero.css` (NEW)
**Purpose**: Hero section styles
**Type**: CSS file
**Status**: Create new

#### `src/styles/domains/marketing/features.css` (NEW)
**Purpose**: Features section styles
**Type**: CSS file
**Status**: Create new

## 10. Files to Modify

### `src/app/layout.tsx`
**Change**:
- Add comprehensive metadata (title, description, keywords)
- Add Open Graph tags
- Add Twitter Card metadata
- Add robots meta

**Impact**: Better SEO and social media sharing for entire site

### `src/middleware.ts`
**Change**: No changes needed
**Current**: Already allows public access to `/` (in publicRoutes array)
**Verify**: Ensure `/` remains in publicRoutes list

## 11. Implementation Steps

1. ✅ **Setup marketing domain structure**
   - Create `src/domains/marketing/` directory
   - Create subdirectories: `components/atoms/`, `components/molecules/`, `components/organisms/`

2. ✅ **Create text map**
   - Create `src/domains/marketing/marketing.text-map.ts`
   - Add all landing page text content (no hardcoded strings)
   - Export as const object

3. ✅ **Create types**
   - Create `src/domains/marketing/types.ts`
   - Define types for features, testimonials, pricing tiers, etc.

4. ✅ **Create atom components (Server)**
   - `section-badge.tsx` - Reusable badge component
   - `feature-icon.tsx` - Icon wrapper with consistent styling
   - `stat-number.tsx` - Animated or static number display

5. ✅ **Create molecule components**
   - `feature-card.tsx` (Server) - Individual feature presentation
   - `benefit-item.tsx` (Server) - Benefit with icon and text
   - `testimonial-card.tsx` (Server) - Single testimonial display
   - `pricing-tier.tsx` (Server) - Pricing plan card
   - `nav-link.tsx` (Client) - Smooth scroll navigation link

6. ✅ **Create organism components (Server)**
   - `marketing-header.tsx` (Server) - Header with logo and nav
   - `hero.tsx` (Server) - Hero section
   - `features.tsx` (Server) - Features grid
   - `benefits.tsx` (Server) - Benefits list
   - `pricing.tsx` (Server) - Pricing tiers
   - `call-to-action.tsx` (Server) - Final CTA
   - `marketing-footer.tsx` (Server) - Footer

7. ✅ **Create organism components (Client)**
   - `testimonials.tsx` (Client) - Carousel with auto-rotation
   - `mobile-menu-toggle.tsx` (Client) - Mobile menu toggle

8. ✅ **Create styles**
   - `styles/domains/marketing/landing-page.css` - Page-level styles
   - `styles/domains/marketing/hero.css` - Hero section styles
   - `styles/domains/marketing/features.css` - Features section styles
   - Import in components as needed

9. ✅ **Replace landing page**
   - Replace `src/app/page.tsx` with new landing page
   - Import all marketing components
   - Structure page with Suspense boundaries
   - Add JSON-LD structured data

10. ✅ **Add loading state**
    - Create `src/app/loading.tsx`
    - Design skeleton for hero and features

11. ✅ **Add error boundary**
    - Create `src/app/error.tsx`
    - Handle errors gracefully with fallback UI

12. ✅ **Update root layout**
    - Modify `src/app/layout.tsx`
    - Add comprehensive metadata
    - Add Open Graph and Twitter Card tags

13. ✅ **Add SEO files**
    - Create `src/app/sitemap.ts` - XML sitemap
    - Create `src/app/robots.ts` - Robots.txt config

14. ✅ **Add Open Graph image**
    - Create or add `/public/og-image.png` (1200x630px)
    - Should show app logo and tagline
    - Used for social media previews

15. ✅ **Test responsiveness**
    - Test mobile breakpoints (320px, 375px, 768px, 1024px, 1920px)
    - Verify smooth scroll navigation
    - Test mobile menu toggle
    - Verify testimonial carousel

16. ✅ **Test SEO**
    - Verify metadata in page source
    - Test Open Graph preview (Twitter Card Validator, Facebook Debugger)
    - Test structured data (Google Rich Results Test)
    - Verify sitemap.xml accessible
    - Verify robots.txt accessible

17. ✅ **Performance optimization**
    - Optimize images (use next/image for all images)
    - Verify static generation (should be fully static)
    - Check Core Web Vitals
    - Test Lighthouse score (aim for 90+ in all categories)

## 12. Component Placement Strategy

### Server Components (Preferred)

**Location**: Directly in `src/domains/marketing/components/{atomic-level}/`

**All components are Server Components EXCEPT**:
- `testimonials.tsx` (organism) - needs state for carousel
- `mobile-menu-toggle.tsx` (organism) - needs state for open/close
- `nav-link.tsx` (molecule) - needs onClick for smooth scroll
- `stat-number.tsx` (atom) - IF animated (optional)

### Client Components (Minimal)

**Location**: Same as server components (atomic level structure)
**Marker**: File starts with `'use client';`

**Rule of Thumb**:
- Server Components at top of tree (page, sections)
- Client Components as leaf nodes (interactive elements only)
- Pass data down from Server to Client Components

## 13. Performance Considerations

### Static Site Generation (Optimal)

Landing page should be **fully static** (no dynamic data).

**Configuration**: `src/app/page.tsx`

```typescript
// ✅ Force static generation
export const dynamic = 'force-static';
export const revalidate = false; // Never revalidate (fully static)

export default function LandingPage() {
  // Page content
}
```

**Result**:
- Page generated at build time
- Served as static HTML (instant load)
- No server rendering on each request
- Optimal performance and SEO

### Image Optimization

**All images must use next/image**:

```typescript
import Image from 'next/image';

// ✅ Optimized image with lazy loading
<Image
  src="/hero-image.png"
  alt="Gym Tracker App"
  width={1200}
  height={800}
  priority // Only for hero image (above fold)
/>

// ✅ Lazy loaded image (below fold)
<Image
  src="/feature-1.png"
  alt="Feature description"
  width={600}
  height={400}
  loading="lazy" // Default behavior
/>
```

**Image checklist**:
- [ ] Hero image: priority loading
- [ ] Other images: lazy loading (default)
- [ ] All images: width/height specified
- [ ] All images: alt text for accessibility
- [ ] Images optimized: WebP format where possible

### Font Optimization

**Current**: Geist Sans and Geist Mono (already optimized by Next.js)

**Already configured** in `src/app/layout.tsx`:
```typescript
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});
```

**Optimization**:
- ✅ Next.js automatic font optimization
- ✅ Self-hosted (no external request)
- ✅ Font display: swap (no FOUT)
- ✅ Subset: latin only (smaller file size)

### Code Splitting

**Automatic**: Next.js automatically code-splits at page level

**Manual** (if needed for heavy components):

```typescript
import dynamic from 'next/dynamic';

// ✅ Dynamic import for heavy chart component (if added later)
const AnalyticsPreview = dynamic(
  () => import('@/domains/marketing/components/organisms/analytics-preview'),
  {
    loading: () => <Skeleton />,
    ssr: true // Keep SSR for SEO
  }
);
```

**For landing page**: Likely NOT needed (all components are lightweight).

### Lazy Loading Sections

**Use Suspense for below-the-fold content**:

```typescript
import { Suspense } from 'react';

export default function LandingPage() {
  return (
    <div>
      {/* Above the fold - load immediately */}
      <Hero />

      {/* Below the fold - can be lazy loaded */}
      <Suspense fallback={<FeaturesSkeleton />}>
        <Features />
      </Suspense>

      <Suspense fallback={<BenefitsSkeleton />}>
        <Benefits />
      </Suspense>
    </div>
  );
}
```

**Note**: Since page is static, Suspense mainly benefits initial streaming. For fully static page, all sections will be in initial HTML.

## 14. Dark Mode Implementation

### Strategy: CSS Variables + next-themes

**Current setup**: Dark mode likely already configured (check globals.css)

**Verify**: `src/app/globals.css` has dark mode variables

```css
/* Expected in globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... other variables */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... other variables */
  }
}
```

### Landing Page Dark Mode

All components should respect dark mode automatically via Tailwind classes:

```typescript
// ✅ Automatically adapts to dark mode
<div className="bg-background text-foreground">
  <h1 className="text-foreground">Heading</h1>
  <p className="text-muted-foreground">Description</p>
</div>
```

### Dark Mode Toggle (Optional)

If you want a theme toggle in landing page header:

**File**: `src/domains/marketing/components/atoms/theme-toggle.tsx`
**Type**: Client Component (needs browser state)

```typescript
'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

**Add to header**:

```typescript
import { ThemeToggle } from '../atoms/theme-toggle';

export function MarketingHeader() {
  return (
    <header>
      <Logo />
      <Nav />
      <ThemeToggle />
      <CTAButtons />
    </header>
  );
}
```

### Dark Mode Testing Checklist

- [ ] All text readable in both modes
- [ ] All backgrounds appropriate contrast
- [ ] All borders visible in both modes
- [ ] All images/logos work in both modes (or have variants)
- [ ] All buttons/links visible in both modes
- [ ] Theme toggle works (if implemented)
- [ ] User preference persisted (next-themes handles this)

## 15. Smooth Scroll and Anchor Links

### Anchor Links in Navigation

**Header navigation** should link to page sections:

```typescript
// src/domains/marketing/components/organisms/marketing-header.tsx
import { NavLink } from '../molecules/nav-link';

export function MarketingHeader() {
  return (
    <header>
      <Logo />
      <nav>
        <NavLink href="#features">Features</NavLink>
        <NavLink href="#benefits">Benefits</NavLink>
        <NavLink href="#pricing">Pricing</NavLink>
      </nav>
    </header>
  );
}
```

### Smooth Scroll Implementation

**Option 1: CSS Only** (Simplest, works in Server Components)

```css
/* styles/domains/marketing/landing-page.css */
html {
  scroll-behavior: smooth;
}
```

**Then use regular anchor links**:

```typescript
// ✅ Server Component - no JS needed
export function MarketingHeader() {
  return (
    <nav>
      <a href="#features">Features</a>
      <a href="#benefits">Benefits</a>
    </nav>
  );
}
```

**Option 2: JavaScript** (More control, needs Client Component)

Already shown in section 3 (`nav-link.tsx` Client Component).

**Recommendation**: Use CSS scroll-behavior for simplicity unless you need scroll offset (e.g., fixed header).

### Section IDs

**Add IDs to each section**:

```typescript
export function Hero() {
  return <section id="hero">{/* content */}</section>;
}

export function Features() {
  return <section id="features">{/* content */}</section>;
}

export function Benefits() {
  return <section id="benefits">{/* content */}</section>;
}

export function Pricing() {
  return <section id="pricing">{/* content */}</section>;
}
```

## 16. Analytics Integration Points

### Where to Add Analytics

**Page views**: Automatic with most analytics tools (Google Analytics, Plausible, etc.)

**Custom events to track**:

1. **CTA button clicks**
   - "Get Started" button (hero)
   - "Start Free Today" button (CTA section)
   - "Start Free Trial" button (pricing)

2. **Navigation clicks**
   - Header navigation links
   - Footer links

3. **Social links**
   - Twitter, GitHub, Instagram clicks (footer)

4. **Section visibility**
   - Track when users scroll to Features
   - Track when users scroll to Pricing

### Analytics Implementation

**Recommended**: Create analytics utility (client-side)

**File**: `src/lib/analytics.ts` (NEW)

```typescript
'use client';

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  }

  // Plausible
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, { props: properties });
  }

  // PostHog
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.capture(eventName, properties);
  }
}
```

**Usage in Client Components**:

```typescript
'use client';

import { trackEvent } from '@/lib/analytics';

export function CTAButton() {
  const handleClick = () => {
    trackEvent('cta_clicked', {
      location: 'hero',
      cta: 'Get Started'
    });
  };

  return (
    <Button asChild onClick={handleClick}>
      <Link href="/register">Get Started</Link>
    </Button>
  );
}
```

### Analytics Provider Setup

**File**: `src/lib/providers/analytics-provider.tsx` (NEW)

```typescript
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pathname + searchParams.toString()
      });
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}
```

**Add to root layout**:

```typescript
// src/app/layout.tsx
import { AnalyticsProvider } from '@/lib/providers/analytics-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnalyticsProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
```

### Analytics Script (Google Analytics Example)

**File**: `src/app/layout.tsx` (add to <head>)

```typescript
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Note**: Replace `GA_MEASUREMENT_ID` with actual ID from environment variable.

## 17. Build-Time vs Runtime Rendering Strategy

### Landing Page: Static Site Generation (SSG)

**Strategy**: Generate at build time, serve as static HTML

**Configuration**: `src/app/page.tsx`

```typescript
// ✅ Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

export default function LandingPage() {
  return <div>{/* content */}</div>;
}
```

**Result**:
- Page rendered once at build time
- Served as static HTML file
- No server computation on request
- Fastest possible page load
- Best SEO (immediate HTML)

### When It's Generated

**Build command**: `npm run build`

**Process**:
1. Next.js builds all pages
2. Landing page rendered to static HTML
3. HTML file output to `.next/server/app/page.html`
4. Served directly by CDN or web server

### Revalidation: Not Needed

Landing page content rarely changes. No revalidation needed.

**If content updates needed**:
- Update text map
- Re-run `npm run build`
- Deploy new static assets

**For dynamic content** (future):
If testimonials come from database, use Incremental Static Regeneration (ISR):

```typescript
// Revalidate every 24 hours
export const revalidate = 86400;

export default async function LandingPage() {
  const testimonials = await getTestimonials();
  return <div>{/* content */}</div>;
}
```

### Comparison: SSG vs SSR vs CSR

| Strategy | Landing Page Use | Why |
|----------|------------------|-----|
| **SSG** (Static Site Generation) | ✅ YES (Recommended) | Fast, SEO-friendly, no server cost |
| **SSR** (Server-Side Rendering) | ❌ NO | Unnecessary (content is static) |
| **ISR** (Incremental Static Regeneration) | 🟡 MAYBE (if dynamic testimonials) | Rebuild on interval |
| **CSR** (Client-Side Rendering) | ❌ NO | Bad for SEO and performance |

### Verification

**Check build output**:

```bash
npm run build
```

**Expected output**:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         95 kB
├ ○ /login                               3.1 kB         93 kB
└ ○ /register                            3.4 kB         93 kB

○ (Static)  prerendered as static HTML
```

**Symbol `○`** means static generation (goal for landing page).

## 18. Accessibility Considerations

### Semantic HTML

Use semantic HTML5 elements:

```typescript
<header> {/* Not <div className="header"> */}
<nav> {/* Navigation */}
<main> {/* Main content */}
<section> {/* Page sections */}
<article> {/* Independent content */}
<footer> {/* Footer */}
```

### ARIA Labels

**Add ARIA labels for screen readers**:

```typescript
<button aria-label="Open mobile menu">
  <MenuIcon />
</button>

<nav aria-label="Main navigation">
  <NavLink href="#features">Features</NavLink>
</nav>

<section aria-labelledby="features-heading">
  <h2 id="features-heading">Features</h2>
</section>
```

### Keyboard Navigation

**Ensure all interactive elements are keyboard accessible**:

- All links and buttons focusable (default)
- Smooth scroll works with Enter key
- Mobile menu works with keyboard
- Testimonial carousel has keyboard controls

### Focus States

**Add visible focus states**:

```css
/* styles/domains/marketing/landing-page.css */
.cta-button:focus-visible {
  @apply ring-2 ring-primary ring-offset-2;
}

a:focus-visible {
  @apply outline-2 outline-offset-2 outline-primary;
}
```

### Alt Text for Images

**All images must have descriptive alt text**:

```typescript
<Image
  src="/hero-image.png"
  alt="Gym Tracker app interface showing workout logging screen"
  width={1200}
  height={800}
/>
```

### Color Contrast

**Ensure WCAG AA compliance** (4.5:1 for normal text, 3:1 for large text):

- Test all text against backgrounds
- Use Tailwind color utilities that have good contrast
- Test in both light and dark modes

### Screen Reader Testing Checklist

- [ ] Page title is descriptive
- [ ] All images have alt text
- [ ] All buttons have labels
- [ ] Navigation is in logical order
- [ ] Skip-to-content link (optional but recommended)
- [ ] Form labels associated with inputs (if any forms)
- [ ] Error messages are clear (error boundary)

## 19. Mobile Responsiveness Strategy

### Mobile-First Approach

**All styles start with mobile, then scale up**:

```typescript
// ✅ Mobile first
<div className="w-full px-4 md:px-8 lg:px-16">
  <h1 className="text-3xl md:text-5xl lg:text-6xl">
    Heading
  </h1>
</div>

// ❌ Desktop first
<div className="lg:w-1/2 md:w-2/3 w-full"> {/* Wrong order */}
```

### Breakpoints

**Tailwind default breakpoints**:
- `sm`: 640px (small tablets, large phones landscape)
- `md`: 768px (tablets)
- `lg`: 1024px (small desktops)
- `xl`: 1280px (desktops)
- `2xl`: 1536px (large desktops)

### Landing Page Breakpoints

**Hero section**:
```typescript
<section className="hero">
  <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
    <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
      Track Your Progress
    </h1>
    <p className="text-lg md:text-xl lg:text-2xl">
      Subheading
    </p>

    {/* Buttons stack on mobile, row on desktop */}
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
      <Button size="lg">Get Started</Button>
      <Button variant="outline" size="lg">View Demo</Button>
    </div>
  </div>
</section>
```

**Features grid**:
```typescript
<div className="features-grid grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
  {features.map(feature => (
    <FeatureCard key={feature.id} {...feature} />
  ))}
</div>
```

**Pricing tiers**:
```typescript
<div className="pricing-tiers grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
  {tiers.map(tier => (
    <PricingTier key={tier.id} {...tier} />
  ))}
</div>
```

### Mobile Menu

**Header adapts to mobile**:

```typescript
export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop nav - hidden on mobile */}
          <nav className="hidden md:flex gap-6">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#benefits">Benefits</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
          </nav>

          {/* Mobile menu toggle - hidden on desktop */}
          <div className="md:hidden">
            <MobileMenuToggle />
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
```

### Testing Checklist

- [ ] 320px (iPhone SE) - all content visible, no horizontal scroll
- [ ] 375px (iPhone 12/13/14) - comfortable reading
- [ ] 768px (iPad) - optimal tablet layout
- [ ] 1024px (desktop) - multi-column layouts work
- [ ] 1920px (large desktop) - content centered, not too wide

## 20. Important Notes

⚠️ **Default to Server Components** (no "use client" unless necessary)
- Only 4 components need "use client": testimonials carousel, mobile menu toggle, nav links, analytics tracking

⚠️ **Suspense is optional** for fully static page
- All content is static from text maps
- Suspense mainly for future dynamic content (testimonials from DB)

⚠️ **No Server Actions needed** for landing page
- No forms, no mutations
- Only links to /register and /login

💡 **All text externalized to text map** (critical constraint)
- `marketing.text-map.ts` contains ALL strings
- No hardcoded text in components

💡 **Performance is critical** for landing page
- Static generation for optimal speed
- Image optimization with next/image
- Minimal client-side JS (only 4 small Client Components)

📝 **SEO is critical** for landing page
- Comprehensive metadata in layout
- Open Graph and Twitter Cards
- JSON-LD structured data
- Sitemap and robots.txt

🎯 **Mobile-first responsive design**
- All breakpoints tested
- Mobile menu for small screens
- Touch-friendly button sizes

## 21. Coordination with Other Agents

### UX/UI Designer
- **Receives**: Component structure from this plan
- **Provides**: Visual design, spacing, colors, typography
- **Handoff**: UX designer creates detailed mockups for each section

### shadcn Builder
- **Receives**: Component requirements (buttons, cards, badges)
- **Uses**: shadcn/ui components where appropriate (Button, Badge, Card)
- **Handoff**: shadcn builder identifies which shadcn components to use

### Domain Architect
- **Receives**: Marketing domain structure
- **Provides**: Future integration if testimonials come from database
- **Note**: Currently no domain logic needed (static content only)

### Code Reviewer
- **Receives**: Implemented landing page code
- **Reviews**: Compliance with critical constraints (Server Components, text maps, naming)
- **Validates**: Performance, accessibility, SEO

## 22. Future Enhancements (Out of Scope)

**Not included in this plan**:
- Blog section
- FAQ page
- About page
- Contact form
- Live chat widget
- Video demos
- Interactive product tour
- A/B testing variants
- Multi-language support
- Dynamic testimonials from database

**These can be added later** with additional planning and implementation.

## 23. Success Criteria

**Landing page is successful when**:

✅ **Performance**:
- Lighthouse score 90+ in all categories
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Fully static generation (no SSR)

✅ **SEO**:
- All metadata present in page source
- Open Graph preview works on social media
- Structured data validates (Google Rich Results Test)
- Sitemap accessible at /sitemap.xml
- Robots.txt accessible at /robots.txt

✅ **Accessibility**:
- WCAG AA compliance
- Keyboard navigation works
- Screen reader friendly
- Color contrast meets standards

✅ **Functionality**:
- All sections render correctly
- Navigation links work (smooth scroll)
- CTA buttons link to /register
- Mobile menu works
- Testimonials carousel auto-rotates
- Dark mode works

✅ **Code Quality**:
- Follows critical constraints (Server Components, text maps, naming)
- No hardcoded strings
- All components properly typed
- Proper file structure (marketing domain)

## 24. Deployment Checklist

Before deploying landing page:

- [ ] All components created and tested
- [ ] Text map complete (no hardcoded strings)
- [ ] Images optimized and added to /public
- [ ] Open Graph image created (1200x630px)
- [ ] Metadata updated in root layout
- [ ] JSON-LD structured data added
- [ ] Sitemap and robots.txt created
- [ ] Analytics integrated and tested
- [ ] Dark mode tested
- [ ] Mobile responsiveness tested (all breakpoints)
- [ ] Accessibility tested (keyboard, screen reader)
- [ ] SEO tested (Open Graph, structured data)
- [ ] Performance tested (Lighthouse)
- [ ] Build succeeds (`npm run build`)
- [ ] Verify static generation (○ symbol in build output)
- [ ] Test production build locally (`npm run start`)

---

## Summary

**This plan provides**:
- ✅ Complete Next.js 15 App Router structure for landing page
- ✅ Server Component architecture (90% Server, 10% Client)
- ✅ Marketing domain organization following Screaming Architecture
- ✅ Static Site Generation strategy for optimal performance
- ✅ Comprehensive SEO implementation (metadata, OG, structured data)
- ✅ Accessibility and responsive design considerations
- ✅ Analytics integration points
- ✅ Dark mode support
- ✅ All text externalized to text maps (critical constraint)
- ✅ Component-by-component breakdown with atomic design
- ✅ Clear file structure and implementation steps

**Next Steps**:
1. Review plan with stakeholders
2. Hand off to UX designer for visual design
3. Hand off to shadcn builder for component selection
4. Begin implementation following 24-step process
5. Review with code reviewer before deployment
