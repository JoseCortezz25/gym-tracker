# Landing Page - shadcn/ui Component Selection Plan

**Created**: 2025-11-10
**Session**: landing_page_001
**Type**: shadcn Component Selection

## 1. shadcn/ui Components Required

### Existing Components (Already Installed)

The following shadcn components are already available in the project:

#### `button`
- **Location**: `@/components/ui/button.tsx`
- **Purpose**: CTAs, navigation, action triggers throughout landing page
- **Variants**: default, destructive, outline, secondary, ghost, link
- **Sizes**: sm, md, lg, icon
- **Usage**: Hero CTAs, Final CTA section, Pricing cards

#### `card`
- **Location**: `@/components/ui/card.tsx`
- **Purpose**: Pain Points, Features, Testimonials, Pricing sections
- **Components**: Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent
- **Usage**: Feature cards, testimonial cards, pricing comparison cards

#### `avatar`
- **Location**: `@/components/ui/avatar.tsx`
- **Purpose**: Testimonials section (user photos)
- **Components**: Avatar, AvatarImage, AvatarFallback
- **Usage**: Testimonial cards with user photos

#### `badge`
- **Location**: `@/components/ui/badge.tsx`
- **Purpose**: Feature tags, pricing plan labels (e.g., "Most Popular")
- **Variants**: default, secondary, destructive, outline
- **Usage**: Feature categories, pricing plan highlights

#### `separator`
- **Location**: `@/components/ui/separator.tsx`
- **Purpose**: Visual separation between landing page sections
- **Usage**: Between major sections (Hero → Pain Points → Features)

#### `skeleton`
- **Location**: `@/components/ui/skeleton.tsx`
- **Purpose**: Loading states for dynamic content
- **Usage**: Suspense fallbacks for any server-fetched content

### New Components to Install

**Installation Commands**:
```bash
pnpm dlx shadcn@latest add accordion tabs
```

**Components**:

#### `accordion`
- **Purpose**: Feature Deep Dive section, FAQ section
- **Radix Primitive**: `@radix-ui/react-accordion`
- **Key Props**: type ("single" | "multiple"), collapsible, defaultValue
- **Accessibility**: Built-in keyboard navigation (Arrow keys, Home, End), ARIA attributes
- **Usage**:
  - FAQ section: Multiple questions with expandable answers
  - Feature Deep Dive: Expandable feature details

#### `tabs` (OPTIONAL - for Pricing variations)
- **Purpose**: Pricing section (if showing Monthly/Yearly toggle)
- **Radix Primitive**: `@radix-ui/react-tabs`
- **Key Props**: defaultValue, value, onValueChange
- **Accessibility**: Keyboard navigation, ARIA roles
- **Usage**: Toggle between Monthly/Yearly pricing plans

## 2. Component Composition Strategy

### Section 1: Hero

**Composition**: Layout only (no shadcn components needed for structure)

**shadcn Components Used**:
- `Button` (2 instances for CTAs)

**Structure**:
```tsx
<section className="hero">
  <div className="hero__content">
    <h1>Headline</h1>
    <p>Subheadline</p>
    <div className="hero__cta-group">
      <Button size="lg" variant="default">Primary CTA</Button>
      <Button size="lg" variant="outline">Secondary CTA</Button>
    </div>
  </div>
  <div className="hero__image">
    {/* Hero image/illustration */}
  </div>
</section>
```

### Section 2: Pain Points (3-Column Grid)

**Composition**: Card components for each pain point

**shadcn Components Used**:
- `Card` (3 instances)

**Structure**:
```tsx
<section className="pain-points">
  <h2>Pain Points Headline</h2>
  <div className="pain-points__grid">
    {painPoints.map(point => (
      <Card key={point.id}>
        <CardHeader>
          <div className="pain-points__icon">{/* Icon */}</div>
          <CardTitle>{point.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{point.description}</p>
        </CardContent>
      </Card>
    ))}
  </div>
</section>
```

### Section 3: Main Features (6-Feature Grid)

**Composition**: Card components for each feature

**shadcn Components Used**:
- `Card` (6 instances)
- `Badge` (optional, for feature categories)

**Structure**:
```tsx
<section className="features">
  <h2>Features Headline</h2>
  <div className="features__grid">
    {features.map(feature => (
      <Card key={feature.id}>
        <CardHeader>
          <div className="features__icon">{/* Icon */}</div>
          {feature.category && <Badge variant="secondary">{feature.category}</Badge>}
          <CardTitle>{feature.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{feature.description}</CardDescription>
        </CardContent>
      </Card>
    ))}
  </div>
</section>
```

### Section 4: How It Works (3-Step Timeline)

**Composition**: Custom stepper/timeline (no direct shadcn component)

**shadcn Components Used**:
- `Card` (for each step - optional)
- `Badge` (for step numbers)
- `Separator` (between steps - optional)

**Structure**:
```tsx
<section className="how-it-works">
  <h2>How It Works</h2>
  <div className="how-it-works__timeline">
    {steps.map((step, index) => (
      <div key={step.id} className="how-it-works__step">
        <Badge variant="default" className="how-it-works__step-number">
          {index + 1}
        </Badge>
        <Card>
          <CardHeader>
            <CardTitle>{step.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{step.description}</CardDescription>
          </CardContent>
        </Card>
        {index < steps.length - 1 && (
          <Separator orientation="vertical" className="how-it-works__connector" />
        )}
      </div>
    ))}
  </div>
</section>
```

### Section 5: Testimonials (3 Cards)

**Composition**: Card with Avatar

**shadcn Components Used**:
- `Card` (3 instances)
- `Avatar` (3 instances)

**Structure**:
```tsx
<section className="testimonials">
  <h2>What Our Users Say</h2>
  <div className="testimonials__grid">
    {testimonials.map(testimonial => (
      <Card key={testimonial.id}>
        <CardHeader>
          <div className="testimonials__user">
            <Avatar>
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              <AvatarFallback>{testimonial.initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="testimonials__name">{testimonial.name}</CardTitle>
              <CardDescription className="testimonials__role">{testimonial.role}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="testimonials__quote">{testimonial.quote}</p>
        </CardContent>
      </Card>
    ))}
  </div>
</section>
```

### Section 6: Feature Deep Dive (Expandable Accordion)

**Composition**: Accordion component

**shadcn Components Used**:
- `Accordion` (NEW - needs installation)

**Structure**:
```tsx
<section className="feature-deep-dive">
  <h2>Explore All Features</h2>
  <Accordion type="multiple" className="feature-deep-dive__accordion">
    {features.map(feature => (
      <AccordionItem key={feature.id} value={feature.id}>
        <AccordionTrigger>
          <div className="feature-deep-dive__trigger">
            <div className="feature-deep-dive__icon">{/* Icon */}</div>
            <span>{feature.title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <p>{feature.detailedDescription}</p>
          {feature.benefits && (
            <ul className="feature-deep-dive__benefits">
              {feature.benefits.map(benefit => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          )}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
</section>
```

### Section 7: FAQ (Accordion)

**Composition**: Accordion component

**shadcn Components Used**:
- `Accordion` (NEW - needs installation)

**Structure**:
```tsx
<section className="faq">
  <h2>Frequently Asked Questions</h2>
  <Accordion type="single" collapsible className="faq__accordion">
    {faqs.map(faq => (
      <AccordionItem key={faq.id} value={faq.id}>
        <AccordionTrigger>{faq.question}</AccordionTrigger>
        <AccordionContent>{faq.answer}</AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
</section>
```

### Section 8: Pricing (Comparison Cards)

**Composition**: Card components for pricing plans

**shadcn Components Used**:
- `Card` (3 instances for Free/Pro/Enterprise)
- `Button` (CTA in each card)
- `Badge` (for "Most Popular" label)
- `Separator` (between features)
- `Tabs` (OPTIONAL - if toggling Monthly/Yearly)

**Structure (with Tabs)**:
```tsx
<section className="pricing">
  <h2>Choose Your Plan</h2>

  {/* OPTIONAL: Tabs for Monthly/Yearly toggle */}
  <Tabs defaultValue="monthly" className="pricing__tabs">
    <TabsList>
      <TabsTrigger value="monthly">Monthly</TabsTrigger>
      <TabsTrigger value="yearly">Yearly (Save 20%)</TabsTrigger>
    </TabsList>

    <TabsContent value="monthly">
      <div className="pricing__grid">
        {pricingPlans.monthly.map(plan => (
          <Card key={plan.id} className={plan.popular ? 'pricing__card--popular' : ''}>
            <CardHeader>
              {plan.popular && <Badge variant="default">Most Popular</Badge>}
              <CardTitle>{plan.name}</CardTitle>
              <div className="pricing__price">
                <span className="pricing__amount">${plan.price}</span>
                <span className="pricing__period">/month</span>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="pricing__features">
                {plan.features.map(feature => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant={plan.popular ? 'default' : 'outline'}
                className="w-full"
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </TabsContent>

    <TabsContent value="yearly">
      {/* Same structure for yearly pricing */}
    </TabsContent>
  </Tabs>
</section>
```

**Structure (without Tabs)**:
```tsx
<section className="pricing">
  <h2>Choose Your Plan</h2>
  <div className="pricing__grid">
    {pricingPlans.map(plan => (
      <Card key={plan.id} className={plan.popular ? 'pricing__card--popular' : ''}>
        {/* Same card structure as above */}
      </Card>
    ))}
  </div>
</section>
```

### Section 9: Final CTA

**Composition**: Layout with Button

**shadcn Components Used**:
- `Button` (2 instances)

**Structure**:
```tsx
<section className="final-cta">
  <div className="final-cta__content">
    <h2>Ready to Transform Your Training?</h2>
    <p>Join thousands of lifters tracking their progress</p>
    <div className="final-cta__buttons">
      <Button size="lg" variant="default">Get Started Free</Button>
      <Button size="lg" variant="outline">View Demo</Button>
    </div>
  </div>
</section>
```

### Section 10: Footer

**Composition**: Layout only (no shadcn components for structure)

**shadcn Components Used**:
- `Separator` (above footer)
- `Button` (variant="link" for social links - optional)

**Structure**:
```tsx
<Separator className="footer__separator" />
<footer className="footer">
  <div className="footer__content">
    <div className="footer__logo">
      {/* Logo */}
    </div>
    <nav className="footer__links">
      {/* Link groups */}
    </nav>
    <div className="footer__social">
      {/* Social icons */}
    </div>
  </div>
  <Separator className="footer__divider" />
  <div className="footer__copyright">
    <p>&copy; 2025 Gym Tracker. All rights reserved.</p>
  </div>
</footer>
```

## 3. Component Variants and Customization

### Using Built-in Variants

#### Button Variants for Landing Page

**Primary CTAs** (Hero, Final CTA, Pricing):
```tsx
<Button variant="default" size="lg">Get Started Free</Button>
```

**Secondary CTAs** (Hero, Final CTA):
```tsx
<Button variant="outline" size="lg">Learn More</Button>
```

**Pricing Card CTAs**:
```tsx
{/* Popular plan */}
<Button variant="default" className="w-full">Choose Plan</Button>

{/* Other plans */}
<Button variant="outline" className="w-full">Choose Plan</Button>
```

**Link-style buttons** (Footer - optional):
```tsx
<Button variant="link" asChild>
  <a href="/privacy">Privacy Policy</a>
</Button>
```

#### Card Variants for Landing Page

**Default cards** (Features, Pain Points, Testimonials):
```tsx
<Card>
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
</Card>
```

**Pricing cards with custom styling**:
```tsx
{/* Popular plan - add custom class */}
<Card className="pricing__card--popular border-primary shadow-lg">
  {/* Content */}
</Card>

{/* Regular plans */}
<Card className="pricing__card">
  {/* Content */}
</Card>
```

#### Badge Variants for Landing Page

**Pricing labels**:
```tsx
<Badge variant="default">Most Popular</Badge>
```

**Feature categories**:
```tsx
<Badge variant="secondary">{feature.category}</Badge>
```

**Step numbers** (How It Works):
```tsx
<Badge variant="default" className="how-it-works__step-number">
  {index + 1}
</Badge>
```

#### Accordion Variants

**FAQ (single item open)**:
```tsx
<Accordion type="single" collapsible>
  {/* Items */}
</Accordion>
```

**Feature Deep Dive (multiple items open)**:
```tsx
<Accordion type="multiple">
  {/* Items */}
</Accordion>
```

### Custom Variants (if absolutely necessary)

**ONLY if shadcn doesn't provide what's needed**

**Approach**: Add custom Tailwind classes via `className` prop

**Example**: Pricing card highlight
```tsx
{/* Custom border and shadow for popular plan */}
<Card className="border-primary border-2 shadow-2xl transform scale-105">
  {/* Content */}
</Card>
```

**Example**: Hero button group spacing
```tsx
<div className="flex flex-col sm:flex-row gap-4">
  <Button>...</Button>
  <Button>...</Button>
</div>
```

## 4. shadcn/ui Accessibility Features

### Built-in Accessibility (Automatic from Radix)

#### Button
- **Keyboard Navigation**: Tab to focus, Enter/Space to activate
- **ARIA Attributes**: Automatic role="button"
- **Focus Management**: Built-in focus-visible styles
- **Screen Reader**: Announces button text and state

#### Card
- **Semantic HTML**: Uses semantic article/section elements
- **ARIA**: Proper heading hierarchy with CardTitle
- **Screen Reader**: Reads content in logical order

#### Avatar
- **Image Alt**: Supports alt text via AvatarImage
- **Fallback**: AvatarFallback ensures content always visible
- **ARIA**: Proper role="img" for decorative images

#### Accordion
- **Keyboard Navigation**:
  - Tab: Move between accordion triggers
  - Enter/Space: Toggle accordion item
  - Arrow keys: Navigate between items (if type="single")
- **ARIA Attributes**:
  - aria-expanded on triggers
  - aria-controls linking trigger to content
  - role="region" on content panels
- **Focus Management**: Focus stays on trigger after activation
- **Screen Reader**: Announces expanded/collapsed state

#### Tabs
- **Keyboard Navigation**:
  - Arrow keys: Navigate between tabs
  - Home/End: Jump to first/last tab
  - Tab: Move to tab panel content
- **ARIA Attributes**:
  - role="tablist", role="tab", role="tabpanel"
  - aria-selected on active tab
  - aria-controls linking tab to panel
- **Focus Management**: Roving tabindex for tab navigation
- **Screen Reader**: Announces selected tab and panel count

### Accessibility Requirements

**Note**: Pass to UX designer for full a11y plan. shadcn handles primitives.

#### General Requirements

1. **Color Contrast**: Ensure text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
2. **Focus Indicators**: All interactive elements must have visible focus state (automatic with shadcn)
3. **Heading Hierarchy**: Proper h1-h6 structure throughout landing page
4. **Alt Text**: All decorative and informative images need alt text
5. **Touch Targets**: Minimum 44x44px for mobile (shadcn buttons meet this)

#### Section-Specific Requirements

**Hero**:
- h1 for main headline (semantic hierarchy)
- Descriptive alt text for hero image
- Button text should describe action (not "Click here")

**Pain Points / Features**:
- Meaningful icon alt text or aria-label
- CardTitle for proper heading structure
- Consider adding "Learn more about {feature}" for screen readers

**Testimonials**:
- Avatar alt text: "{Name}'s profile photo"
- Quote should use semantic blockquote (add via className or wrapper)
- Author name in CardTitle for proper semantics

**Accordion (FAQ / Feature Deep Dive)**:
- Question/trigger text should be concise and descriptive
- Answer content should be well-structured (use p, ul, ol)
- Consider preloading first FAQ item (defaultValue prop)

**Pricing**:
- Clear price announcement: "$X per month" (screen readers)
- Feature list should use semantic ul/li
- "Most Popular" badge should be announced properly
- Button text should indicate which plan ("Choose Pro Plan")

## 5. Installation Verification

After installation, verify:

1. **Component exists**:
   - `@/components/ui/accordion.tsx`
   - `@/components/ui/tabs.tsx` (if using for pricing)

2. **Dependencies installed**: Check `package.json` for:
   - `@radix-ui/react-accordion`
   - `@radix-ui/react-tabs` (if installed)

3. **Types available**: TypeScript recognizes components
   ```tsx
   import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
   // No TypeScript errors
   ```

4. **Imports work**: Can import from `@/components/ui/`
   ```tsx
   import { Button } from "@/components/ui/button"
   import { Card } from "@/components/ui/card"
   import { Accordion } from "@/components/ui/accordion"
   // All resolve correctly
   ```

## 6. Integration Notes

### Props to Configure

#### Button
- **size**: "lg" for CTAs (Hero, Final CTA), "default" for pricing cards
- **variant**: "default" for primary actions, "outline" for secondary
- **className**: "w-full" for pricing card buttons
- **asChild**: Use for wrapping Next.js Link components

#### Card
- **className**: Custom styling for pricing cards (border, shadow, scale)
- Consider adding hover effects via className

#### Avatar
- **src**: User photo URL from testimonials data
- **alt**: Descriptive alt text "{Name}'s profile photo"
- **fallback**: User initials (calculate from name)

#### Accordion
- **type**: "single" for FAQ (one open at a time), "multiple" for Feature Deep Dive
- **collapsible**: true for FAQ (allow closing all items)
- **defaultValue**: Consider pre-opening first FAQ item
- **className**: Custom spacing and styling

#### Tabs (if using)
- **defaultValue**: "monthly" (default to monthly pricing)
- **onValueChange**: Track selection for analytics (optional)

### Event Handlers Needed

#### Pricing Section
```tsx
// Track plan selection
<Button
  onClick={() => trackEvent('plan_selected', { plan: plan.name })}
>
  Choose Plan
</Button>
```

#### Accordion (Analytics - optional)
```tsx
<Accordion
  onValueChange={(value) => trackEvent('faq_expanded', { question: value })}
>
  {/* Items */}
</Accordion>
```

#### Tabs (Pricing toggle - optional)
```tsx
<Tabs
  onValueChange={(value) => trackEvent('pricing_toggle', { period: value })}
>
  {/* Content */}
</Tabs>
```

### Styling Considerations

#### Tailwind Classes (Mobile-First)

**Grid layouts**:
```tsx
{/* Pain Points (3 columns) */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

{/* Features (6 items, 2-3 columns) */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

{/* Testimonials (3 columns) */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

{/* Pricing (3 columns) */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
```

**Section spacing**:
```tsx
<section className="py-16 md:py-24 lg:py-32">
  {/* Content */}
</section>
```

**Container widths**:
```tsx
<div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
  {/* Content */}
</div>
```

#### CSS Variables (Theming)

shadcn uses CSS variables for theming. Verify these are defined in `globals.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 20 14.3% 4.1%;
    --primary: 24 9.8% 10%;
    /* ... other variables */
  }

  .dark {
    --background: 20 14.3% 4.1%;
    --foreground: 60 9.1% 97.8%;
    --primary: 60 9.1% 97.8%;
    /* ... other variables */
  }
}
```

#### Dark Mode

shadcn components automatically support dark mode via CSS variables:

- **No additional code needed**: Components respond to `.dark` class on `<html>`
- **Toggle implementation**: Will be in app layout (not landing page concern)
- **Test both modes**: Ensure all landing sections look good in light + dark

**Dark mode toggle** (in app layout, not landing page):
```tsx
// app/layout.tsx or theme provider
<html className={theme === 'dark' ? 'dark' : ''}>
  {/* App content */}
</html>
```

## 7. Animation and Motion Libraries

### Recommendation: Framer Motion

**Why Framer Motion**:
- Best React animation library for complex landing page animations
- Server Component compatible (animations in client components)
- Excellent performance with React 19
- Built-in scroll animations, gestures, variants

**Installation**:
```bash
pnpm add framer-motion
```

**Use Cases for Landing Page**:

1. **Hero Section**: Fade in headline, slide up CTAs
2. **Pain Points / Features**: Stagger animation for cards on scroll
3. **How It Works**: Animate timeline steps sequentially
4. **Testimonials**: Carousel/slide animations
5. **Pricing Cards**: Hover scale effects, entrance animations
6. **Accordion**: Smooth expand/collapse (already built into shadcn, but can enhance)

**Example - Feature Cards with Stagger**:
```tsx
'use client'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function FeaturesSection() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {features.map(feature => (
        <motion.div key={feature.id} variants={item}>
          <Card>
            {/* Card content */}
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
```

**Example - Hero Animations**:
```tsx
'use client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="hero">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Your Headline
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Your subheadline
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex gap-4"
      >
        <Button size="lg">Get Started</Button>
        <Button size="lg" variant="outline">Learn More</Button>
      </motion.div>
    </section>
  )
}
```

**Example - Pricing Card Hover**:
```tsx
'use client'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'

export function PricingCard({ plan }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={plan.popular ? 'border-primary' : ''}>
        {/* Card content */}
      </Card>
    </motion.div>
  )
}
```

### Alternative: CSS Animations (Lightweight Option)

If you want to avoid adding Framer Motion dependency:

**Tailwind CSS Animations** (built-in):
```tsx
{/* Fade in on scroll - use Intersection Observer + Tailwind */}
<div className="opacity-0 translate-y-4 transition-all duration-500 data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0">
  {/* Content */}
</div>
```

**CSS @keyframes** (custom animations):
```css
/* globals.css */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}
```

**Recommendation**: Use Framer Motion for richer, more controllable animations. Use CSS for simple effects.

## 8. Responsive Behavior for Each Component

### Mobile-First Approach (CRITICAL)

All layouts MUST start with mobile (default) and scale up with breakpoints:
- `sm`: 640px (small tablets)
- `md`: 768px (tablets)
- `lg`: 1024px (laptops)
- `xl`: 1280px (desktops)
- `2xl`: 1536px (large desktops)

### Section-by-Section Responsive Strategy

#### Hero Section

**Mobile** (default):
```tsx
<section className="py-12 px-4">
  <div className="flex flex-col gap-6 text-center">
    <h1 className="text-4xl font-bold">...</h1>
    <p className="text-lg">...</p>
    <div className="flex flex-col gap-3">
      <Button size="lg" className="w-full">CTA 1</Button>
      <Button size="lg" className="w-full">CTA 2</Button>
    </div>
  </div>
  <div className="mt-8">
    {/* Hero image - full width */}
  </div>
</section>
```

**Tablet & Desktop**:
```tsx
<section className="py-12 md:py-20 lg:py-28 px-4">
  <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-16">
    <div className="flex flex-col gap-6 text-center md:text-left md:w-1/2">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">...</h1>
      <p className="text-lg md:text-xl">...</p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button size="lg" className="w-full sm:w-auto">CTA 1</Button>
        <Button size="lg" className="w-full sm:w-auto">CTA 2</Button>
      </div>
    </div>
    <div className="md:w-1/2">
      {/* Hero image - 50% width on desktop */}
    </div>
  </div>
</section>
```

#### Pain Points (3-Column Grid)

```tsx
<section className="py-16 md:py-24 px-4">
  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12">...</h2>

  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
    {painPoints.map(point => (
      <Card key={point.id}>
        <CardHeader>
          <div className="w-12 h-12 md:w-16 md:h-16 mb-4">
            {/* Icon - scales with breakpoint */}
          </div>
          <CardTitle className="text-xl md:text-2xl">{point.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base md:text-lg">{point.description}</p>
        </CardContent>
      </Card>
    ))}
  </div>
</section>
```

#### Main Features (6-Feature Grid)

```tsx
<section className="py-16 md:py-24 px-4">
  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12">...</h2>

  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
    {features.map(feature => (
      <Card key={feature.id}>
        <CardHeader>
          <div className="w-10 h-10 md:w-12 md:h-12 mb-3">
            {/* Icon */}
          </div>
          <CardTitle className="text-lg md:text-xl">{feature.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm md:text-base">
            {feature.description}
          </CardDescription>
        </CardContent>
      </Card>
    ))}
  </div>
</section>
```

#### How It Works (3-Step Timeline)

**Mobile** (Vertical timeline):
```tsx
<section className="py-16 md:py-24 px-4">
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">...</h2>

  {/* Mobile: Vertical stack */}
  <div className="flex flex-col gap-8 md:hidden">
    {steps.map((step, index) => (
      <div key={step.id} className="relative">
        <Badge className="absolute -left-4 top-0">{index + 1}</Badge>
        <Card className="ml-8">
          <CardHeader>
            <CardTitle>{step.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{step.description}</CardDescription>
          </CardContent>
        </Card>
        {index < steps.length - 1 && (
          <div className="w-px h-8 bg-border ml-4 my-2" />
        )}
      </div>
    ))}
  </div>

  {/* Tablet & Desktop: Horizontal timeline */}
  <div className="hidden md:flex items-start justify-between gap-4">
    {steps.map((step, index) => (
      <div key={step.id} className="flex-1 relative">
        <Badge className="mb-4">{index + 1}</Badge>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl">{step.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm lg:text-base">
              {step.description}
            </CardDescription>
          </CardContent>
        </Card>
        {index < steps.length - 1 && (
          <div className="absolute top-6 left-full w-4 h-px bg-border" />
        )}
      </div>
    ))}
  </div>
</section>
```

#### Testimonials (3 Cards)

```tsx
<section className="py-16 md:py-24 px-4">
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">...</h2>

  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
    {testimonials.map(testimonial => (
      <Card key={testimonial.id}>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 md:w-14 md:h-14">
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              <AvatarFallback>{testimonial.initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base md:text-lg">{testimonial.name}</CardTitle>
              <CardDescription className="text-sm">{testimonial.role}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm md:text-base">{testimonial.quote}</p>
        </CardContent>
      </Card>
    ))}
  </div>
</section>
```

#### Feature Deep Dive (Accordion)

```tsx
<section className="py-16 md:py-24 px-4">
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">...</h2>

  {/* Accordion scales naturally - just adjust spacing */}
  <Accordion type="multiple" className="w-full max-w-3xl mx-auto space-y-4">
    {features.map(feature => (
      <AccordionItem key={feature.id} value={feature.id}>
        <AccordionTrigger className="text-left text-base md:text-lg">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10">
              {/* Icon */}
            </div>
            <span>{feature.title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm md:text-base">
          <p className="mb-4">{feature.detailedDescription}</p>
          {feature.benefits && (
            <ul className="space-y-2">
              {feature.benefits.map(benefit => (
                <li key={benefit} className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          )}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
</section>
```

#### FAQ (Accordion)

```tsx
<section className="py-16 md:py-24 px-4">
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">...</h2>

  {/* FAQ Accordion - centered with max width */}
  <Accordion
    type="single"
    collapsible
    className="w-full max-w-2xl mx-auto space-y-3 md:space-y-4"
  >
    {faqs.map(faq => (
      <AccordionItem key={faq.id} value={faq.id}>
        <AccordionTrigger className="text-left text-base md:text-lg font-medium">
          {faq.question}
        </AccordionTrigger>
        <AccordionContent className="text-sm md:text-base text-muted-foreground">
          {faq.answer}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
</section>
```

#### Pricing (Comparison Cards)

```tsx
<section className="py-16 md:py-24 px-4">
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">...</h2>
  <p className="text-center text-muted-foreground mb-12">...</p>

  {/* Pricing grid - Mobile: 1 column, Tablet: 2 columns (with 3rd below), Desktop: 3 columns */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
    {pricingPlans.map(plan => (
      <Card
        key={plan.id}
        className={cn(
          "flex flex-col",
          plan.popular && "border-primary border-2 shadow-xl md:scale-105"
        )}
      >
        <CardHeader>
          {plan.popular && (
            <Badge variant="default" className="w-fit mb-2">
              Most Popular
            </Badge>
          )}
          <CardTitle className="text-2xl md:text-3xl">{plan.name}</CardTitle>
          <div className="flex items-baseline gap-1 my-4">
            <span className="text-4xl md:text-5xl font-bold">${plan.price}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <CardDescription className="text-sm md:text-base">
            {plan.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-grow">
          <ul className="space-y-3">
            {plan.features.map(feature => (
              <li key={feature} className="flex items-start gap-2 text-sm md:text-base">
                <span className="text-primary mt-1">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter>
          <Button
            variant={plan.popular ? 'default' : 'outline'}
            size="lg"
            className="w-full"
          >
            {plan.cta}
          </Button>
        </CardFooter>
      </Card>
    ))}
  </div>
</section>
```

**Special Case - Popular Card Scaling**:
- Mobile: No scale (all cards same size for readability)
- Desktop: Scale popular card to 105% to make it stand out

```tsx
{/* Mobile: no scale */}
<Card className="border-primary md:scale-105">

{/* Desktop: scale to 105% */}
```

#### Final CTA

```tsx
<section className="py-16 md:py-24 px-4 bg-primary text-primary-foreground">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
      Ready to Transform Your Training?
    </h2>
    <p className="text-lg md:text-xl mb-8 md:mb-12">
      Join thousands of lifters tracking their progress
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        size="lg"
        variant="secondary"
        className="w-full sm:w-auto"
      >
        Get Started Free
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-full sm:w-auto"
      >
        View Demo
      </Button>
    </div>
  </div>
</section>
```

#### Footer

```tsx
<footer className="py-12 md:py-16 px-4 border-t">
  <div className="max-w-7xl mx-auto">
    {/* Footer content - Mobile: stacked, Desktop: columns */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8">
      {/* Logo */}
      <div className="md:col-span-2 lg:col-span-1">
        {/* Logo and tagline */}
      </div>

      {/* Link groups - Stack on mobile, columns on desktop */}
      <div>
        <h3 className="font-semibold mb-4">Product</h3>
        <ul className="space-y-2">
          {/* Links */}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Company</h3>
        <ul className="space-y-2">
          {/* Links */}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Legal</h3>
        <ul className="space-y-2">
          {/* Links */}
        </ul>
      </div>
    </div>

    {/* Copyright - Center on mobile, left-align on desktop */}
    <Separator className="mb-8" />
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
      <p className="text-center md:text-left">
        &copy; 2025 Gym Tracker. All rights reserved.
      </p>
      <div className="flex gap-4">
        {/* Social icons */}
      </div>
    </div>
  </div>
</footer>
```

### Key Responsive Patterns

1. **Grid Layouts**: Always start with `grid-cols-1`, then scale up
   ```tsx
   grid-cols-1 md:grid-cols-2 lg:grid-cols-3
   ```

2. **Flex Direction**: Toggle between column (mobile) and row (desktop)
   ```tsx
   flex flex-col md:flex-row
   ```

3. **Text Sizes**: Scale typography with breakpoints
   ```tsx
   text-4xl md:text-5xl lg:text-6xl
   ```

4. **Spacing**: Increase padding/gaps on larger screens
   ```tsx
   py-12 md:py-20 lg:py-28
   gap-4 md:gap-6 lg:gap-8
   ```

5. **Full Width Buttons (Mobile)**: Use `w-full sm:w-auto` pattern
   ```tsx
   <Button className="w-full sm:w-auto">CTA</Button>
   ```

6. **Container Max Width**: Keep content readable on large screens
   ```tsx
   max-w-7xl mx-auto
   ```

## 9. Important Notes

**NEVER modify shadcn source files** in `@/components/ui/`

**Composition over modification**: Wrap shadcn components, don't edit them

**Check registry first**: Component might already exist (16 components already installed)

**Use variants**: Don't create new components for style changes - use `variant` and `className` props

**Coordinate with UX designer**: For full component architecture, text content, and detailed styling

**All components are RSC by default**: Only add `'use client'` when:
- Using Framer Motion animations
- Adding event handlers (onClick, onChange, etc.)
- Using React hooks (useState, useEffect, etc.)

**Text externalization**: All text content must come from text maps (no hardcoded strings in components)
- Hero headlines, CTAs → `text-maps/landing/hero.ts`
- Pain points, features → `text-maps/landing/features.ts`
- Testimonials → `text-maps/landing/testimonials.ts`
- FAQ → `text-maps/landing/faq.ts`
- Pricing → `text-maps/landing/pricing.ts`

**Icons**: Use Lucide React (already configured in components.json)
```tsx
import { Check, X, ArrowRight } from 'lucide-react'
```

## 10. Next Steps for Parent Agent

1. **Install new components**:
   ```bash
   pnpm dlx shadcn@latest add accordion tabs
   ```

2. **Install Framer Motion** (recommended for animations):
   ```bash
   pnpm add framer-motion
   ```

3. **Verify installations**:
   - Check `@/components/ui/accordion.tsx` exists
   - Check `@/components/ui/tabs.tsx` exists (if installed)
   - Check `package.json` for `framer-motion`

4. **Coordinate with UX Designer** for:
   - Full component architecture
   - Text content and text maps structure
   - Detailed styling (colors, spacing, typography scales)
   - Icon selection (Lucide icons)
   - Image requirements (hero image, feature icons, testimonial avatars)
   - Branding guidelines (logo, colors, fonts)

5. **Implement landing page sections** following composition patterns above

6. **Add animations** using Framer Motion patterns

7. **Test responsive behavior** at all breakpoints:
   - Mobile: 375px, 428px
   - Tablet: 768px, 1024px
   - Desktop: 1280px, 1920px

8. **Test dark mode** - verify all sections work in light + dark themes

9. **Test accessibility**:
   - Keyboard navigation (Tab, Enter, Arrow keys)
   - Screen reader announcements
   - Color contrast (WCAG AA)
   - Focus indicators

10. **Performance optimization**:
    - Lazy load images (Next.js Image component)
    - Code split sections if needed
    - Optimize animations (use `will-change` carefully)

## 11. Summary

### Components to Install
```bash
pnpm dlx shadcn@latest add accordion tabs
```

### Existing Components to Reuse
- `button` - CTAs, navigation
- `card` - All card-based sections (Pain Points, Features, Testimonials, Pricing)
- `avatar` - Testimonials
- `badge` - Pricing labels, step numbers
- `separator` - Section dividers, footer
- `skeleton` - Loading states

### Animation Library
```bash
pnpm add framer-motion
```

### Key Patterns
1. **Mobile-first responsive design** with Tailwind breakpoints
2. **Composition over modification** - never edit shadcn source
3. **RSC by default** - only use `'use client'` for interactivity
4. **Text externalization** - all content from text maps
5. **Accessibility first** - leverage Radix primitives
6. **Dark mode support** - automatic via CSS variables

### File Structure (to be created)
```
src/
├── app/
│   └── (marketing)/
│       └── page.tsx              # Landing page route
├── domains/
│   └── marketing/
│       ├── components/
│       │   ├── hero-section.tsx
│       │   ├── pain-points-section.tsx
│       │   ├── features-section.tsx
│       │   ├── how-it-works-section.tsx
│       │   ├── testimonials-section.tsx
│       │   ├── feature-deep-dive-section.tsx
│       │   ├── faq-section.tsx
│       │   ├── pricing-section.tsx
│       │   ├── final-cta-section.tsx
│       │   └── footer.tsx
│       └── text-maps/
│           ├── hero.ts
│           ├── features.ts
│           ├── testimonials.ts
│           ├── faq.ts
│           └── pricing.ts
└── components/
    └── ui/                       # shadcn components (DO NOT MODIFY)
```

### Radix Primitives Used
- `@radix-ui/react-accordion` → Keyboard navigation, ARIA, focus management
- `@radix-ui/react-tabs` → Tab navigation, ARIA roles
- `@radix-ui/react-avatar` → Image loading, fallback handling
- All other existing Radix primitives from installed components

### Responsive Strategy
- **Mobile**: Single column layouts, stacked buttons, full-width cards
- **Tablet (md)**: 2-column grids, horizontal button groups
- **Desktop (lg)**: 3-column grids, larger typography, more spacing
- **Popular card highlight**: Scale to 105% on desktop only

### Dark Mode
- Automatic support via shadcn CSS variables
- No additional code needed in components
- Toggle implemented in app layout (not landing page concern)
