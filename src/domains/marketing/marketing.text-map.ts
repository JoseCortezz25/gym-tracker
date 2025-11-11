/**
 * Text map for marketing domain
 * All text content for landing page
 */

export const marketingTextMap = {
  // Hero Section
  hero: {
    headline: 'Stop Guessing. Start Progressing.',
    subheadline:
      'The complete training system for serious lifters who want structured workouts, measurable results, and zero BS.',
    primaryCta: 'Start Training Free',
    secondaryCta: 'See How It Works',
    trustSignal: 'Free to start. No credit card required.'
  },

  // Features Section
  features: {
    heading: 'Everything You Need to Train Smart',
    subheading:
      'Track progress, build routines, and achieve your fitness goals',
    items: [
      {
        title: 'Custom Routines',
        description:
          'Create multi-day training splits with exact sets, reps, and weight targets. From Push/Pull/Legs to Upper/Lower splits.',
        icon: 'calendar'
      },
      {
        title: 'Real-Time Logging',
        description:
          'Log weight and reps during your workout. No more forgetting between sets. Live timer tracks session duration.',
        icon: 'timer'
      },
      {
        title: 'Track Your Progress',
        description:
          'See your consecutive training days. Weekly and monthly stats keep you accountable and motivated.',
        icon: 'trending-up'
      }
    ]
  },

  // Benefits Section (Expanded from UX plan)
  benefits: {
    heading: 'Sound Familiar?',
    subheading: 'Stop spinning your wheels. Start making real progress.',
    items: [
      {
        title: 'Lost in the Gym?',
        description:
          'No plan means no progress. Random workouts lead to plateaus and wasted time.',
        solution: 'Build structured multi-day splits in minutes'
      },
      {
        title: 'Forgetting Your Numbers?',
        description:
          "Can't remember last week's weights? Paper notebooks get lost. Notes apps are messy.",
        solution: 'Instant access to every previous workout'
      },
      {
        title: 'Losing Motivation?',
        description:
          "Without tracking, you can't see improvement. No visible progress kills consistency.",
        solution: 'Watch your streak grow and celebrate real wins'
      }
    ]
  },

  // Social Proof Section
  social: {
    heading: 'Built for Lifters, by Lifters',
    testimonials: [
      {
        quote: 'Finally stopped plateauing',
        content:
          "Tracking my volume week-to-week showed me I wasn't actually progressing. Now I add weight strategically and my lifts are climbing again.",
        author: 'Alex M.',
        role: '6 months using'
      },
      {
        quote: "Best workout tracker I've used",
        content:
          "I've tried 5+ apps. This one nails the balance: structured routines + flexible tracking. No bloat, just what matters.",
        author: 'Sarah K.',
        role: 'Powerlifter'
      },
      {
        quote: 'The streak feature is addictive',
        content:
          'Seeing that 45-day streak keeps me from skipping workouts. Plus the history is incredible for analyzing what works.',
        author: 'Jordan T.',
        role: 'Bodybuilding'
      }
    ]
  },

  // Registration Section (Inline CTA)
  registration: {
    heading: 'Ready to Stop Guessing and Start Growing?',
    subheading: 'Join lifters who track every rep and build real progress.',
    emailPlaceholder: 'your@email.com',
    passwordPlaceholder: 'Create a password',
    submitButton: 'Start Training Free',
    trustSignals: [
      'No credit card required',
      'Setup in under 5 minutes',
      'Free forever'
    ],
    hasAccount: 'Already have an account?',
    login: 'Login'
  },

  // Footer
  footer: {
    tagline: 'Track every rep. Build real progress.',
    copyright: '2025 Gym Tracker. All rights reserved.',
    links: {
      product: {
        title: 'Product',
        items: [
          { label: 'Features', href: '#features' },
          { label: 'FAQ', href: '#faq' }
        ]
      },
      legal: {
        title: 'Legal',
        items: [
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms of Service', href: '/terms' }
        ]
      }
    }
  },

  // FAQ Section
  faq: {
    heading: 'Frequently Asked Questions',
    items: [
      {
        question: 'Can I use my own routines?',
        answer:
          'Yes! Create completely custom splits or use pre-built templates. Configure every detail: exercises, sets, reps, rest periods, and notes.'
      },
      {
        question: 'Does it work on mobile?',
        answer:
          "Yes, it's a responsive web app that works perfectly on any device - phone, tablet, or desktop."
      },
      {
        question: 'Is my data safe?',
        answer:
          'Absolutely. All data is securely stored with encryption. Only you have access to your workout information.'
      },
      {
        question: 'What if I change routines?',
        answer:
          'You can have multiple routines and switch between them anytime. Your complete workout history is always preserved.'
      },
      {
        question: 'Are there exercises for beginners?',
        answer:
          'Yes! The library includes 50+ exercises for all levels, from basic compound movements to advanced variations.'
      }
    ]
  },

  // Stats (for showcasing app features)
  stats: {
    exercises: '50+',
    exercisesLabel: 'Pre-built Exercises',
    categories: '8',
    categoriesLabel: 'Muscle Groups',
    tracking: 'Complete',
    trackingLabel: 'Workout History'
  },

  // Feature Deep Dive (for accordion/expandable section)
  featureDetails: {
    heading: 'Everything You Get',
    items: [
      {
        title: 'Routine Builder',
        description:
          'Create custom training splits (Push/Pull/Legs, Upper/Lower, Full Body). Configure weekly frequency per division. Assign exercises with sets, reps, and target weights. Add video references and form notes. Archive or delete routines with safeguards.'
      },
      {
        title: 'Exercise Management',
        description:
          '50+ categorized exercises included. Create custom exercises for your gym equipment. Search and filter by muscle group. Detailed descriptions and form tips provided.'
      },
      {
        title: 'Workout Experience',
        description:
          'Start from active routine or create ad-hoc workouts. Log weight and reps in real-time. Automatic session timer. Add extra sets on the fly. Rate workouts (1-5 stars). Add session notes for qualitative tracking.'
      },
      {
        title: 'Progress Analytics',
        description:
          'Track consecutive day streaks. View weekly, monthly, and total workout counts. Monitor total volume (weight × reps). Access complete history with filters. Detailed breakdowns by exercise.'
      }
    ]
  }
} as const;
