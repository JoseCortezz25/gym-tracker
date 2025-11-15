# Workout Splits - shadcn/ui Component Selection Plan

**Created**: 2025-11-13
**Session**: workout-splits-20251113_200040
**Type**: shadcn Component Selection

## 1. shadcn/ui Components Required

### New Components to Install (3 components)

**Installation Command**:
```bash
pnpm dlx shadcn@latest add calendar radio-group alert-dialog
```

#### `calendar` (NEW)
- **Purpose**: Base component for habit tracking calendar widget
- **Radix Primitive**: Uses `react-day-picker` library with `date-fns`
- **Key Props**:
  - `mode`: "single" for displaying dates
  - `selected`: Currently selected date (optional for display-only)
  - `modifiers`: Custom day styling (e.g., workout completion days)
  - `modifiersClassNames`: CSS classes for custom day states
  - `disabled`: Disable specific dates
  - `captionLayout`: "buttons" or "dropdown" for month/year navigation
- **Accessibility**: Full keyboard navigation, ARIA labels for dates, screen reader announcements
- **Customization**: Supports custom day rendering via `modifiers` and `modifiersClassNames`
- **Usage in this feature**: Habit tracking calendar showing workout completion dots/checkmarks on completed days

#### `radio-group` (NEW)
- **Purpose**: Pre-assessment frequency selection (3-6 days per week)
- **Radix Primitive**: `@radix-ui/react-radio-group`
- **Key Props**:
  - `value`: Currently selected value
  - `onValueChange`: Callback when selection changes
  - `orientation`: "vertical" or "horizontal"
- **Accessibility**: Keyboard navigation (arrow keys), ARIA radio group, screen reader support
- **Usage in this feature**: Pre-assessment step 1 - frequency selection

#### `alert-dialog` (NEW)
- **Purpose**: Confirmation dialogs (exit workout, finalize workout, re-run assessment)
- **Radix Primitive**: `@radix-ui/react-alert-dialog`
- **Key Props**:
  - `open`: Boolean to control visibility
  - `onOpenChange`: Callback when dialog state changes
- **Accessibility**: Focus trap, Escape key closes, ARIA alert dialog, focus returns to trigger
- **Sub-components**: `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel`
- **Usage in this feature**:
  - Finalize workout confirmation
  - Exit workout without saving (if unsaved changes)
  - Re-run pre-assessment warning (will replace current splits)

### Existing Components to Reuse (15 components)

#### `card` (EXISTING)
- **Location**: `@/components/ui/card.tsx`
- **Usage**: Workout split cards on dashboard, exercise detail containers
- **Variants**: Default (no variants defined, uses className for customization)
- **Sub-components**: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- **Composition Strategy**:
  - Wrap in custom `WorkoutSplitCard` component with split-specific layout
  - Use `CardHeader` for split badge and title
  - Use `CardContent` for exercise count and progress
  - Add custom border/shadow for "current workout" state

#### `button` (EXISTING)
- **Location**: `@/components/ui/button.tsx`
- **Usage**: All CTAs and actions (start workout, finalize, navigate, submit forms)
- **Variants**:
  - `variant`: "default", "destructive", "outline", "secondary", "ghost", "link"
  - `size`: "default", "sm", "lg", "icon"
- **Key Props**: `asChild` (for composition with other components)
- **Usage in this feature**:
  - "Start Workout" (primary variant, large size)
  - "Finalize Workout" (primary variant, full width on mobile)
  - "Begin Assessment" (primary variant)
  - "Continue" / "Back" (outline variant for stepper navigation)
  - Exercise detail trigger (ghost variant for inline links)

#### `badge` (EXISTING)
- **Location**: `@/components/ui/badge.tsx`
- **Usage**: Split labels (A, B, C), status indicators ("Current", "Completed")
- **Variants**: "default", "secondary", "destructive", "outline"
- **Usage in this feature**:
  - Split letter badges: "A", "B", "C" (custom color based on split)
  - "Current" indicator (primary variant with border)
  - "Completed" status (secondary variant with checkmark icon)

#### `checkbox` (EXISTING)
- **Location**: `@/components/ui/checkbox.tsx`
- **Usage**: Exercise completion checkboxes in workout split detail view
- **Radix Primitive**: `@radix-ui/react-checkbox`
- **Key Props**: `checked`, `onCheckedChange`, `disabled`
- **Accessibility**: Keyboard toggle (Space key), ARIA checkbox, screen reader support
- **Composition Strategy**: Combine with Label and custom layout in `ExerciseChecklistItem` component

#### `sheet` (EXISTING)
- **Location**: `@/components/ui/sheet.tsx`
- **Usage**: Bottom sheet for exercise detail on mobile
- **Radix Primitive**: `@radix-ui/react-dialog` (styled as sheet)
- **Key Props**: `side`: "top", "right", "bottom", "left" (use "bottom" for mobile)
- **Sub-components**: `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetFooter`
- **Accessibility**: Focus trap, Escape closes, ARIA dialog, focus returns to trigger
- **Usage in this feature**: Exercise detail view on mobile (< 768px)

#### `dialog` (EXISTING)
- **Location**: `@/components/ui/dialog.tsx`
- **Usage**: Pre-assessment modal, exercise detail on desktop (> 768px)
- **Radix Primitive**: `@radix-ui/react-dialog`
- **Sub-components**: `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`
- **Accessibility**: Focus trap, Escape closes, ARIA dialog, focus returns to trigger
- **Usage in this feature**:
  - Pre-assessment multi-step modal
  - Exercise detail view on desktop

#### `progress` (EXISTING)
- **Location**: `@/components/ui/progress.tsx`
- **Usage**: Workout completion progress bar ("X of Y exercises")
- **Radix Primitive**: `@radix-ui/react-progress`
- **Key Props**: `value` (0-100 percentage)
- **Accessibility**: ARIA progressbar, screen reader announces percentage
- **Usage in this feature**:
  - Workout split detail: "3 of 8 exercises completed"
  - Calculated as: `(completedCount / totalCount) * 100`

#### `input` (EXISTING)
- **Location**: `@/components/ui/input.tsx`
- **Usage**: Weight and reps number inputs in exercise detail
- **Key Props**: `type="number"`, `min`, `max`, `step`, `placeholder`
- **Validation**: Use with React Hook Form or native HTML5 validation
- **Usage in this feature**:
  - Weight input: `type="number"`, `min="0"`, `max="999"`, `step="0.5"`, placeholder="kg"
  - Reps input: `type="number"`, `min="1"`, `max="999"`, `step="1"`, placeholder="reps"

#### `textarea` (EXISTING)
- **Location**: `@/components/ui/textarea.tsx`
- **Usage**: Set notes, workout notes (optional)
- **Key Props**: `maxLength`, `rows`, `placeholder`
- **Usage in this feature**:
  - Set notes: `maxLength="500"`, `rows="3"`, placeholder="Form cues, difficulty, etc."
  - Character counter: Display "0/500" below textarea

#### `label` (EXISTING)
- **Location**: `@/components/ui/label.tsx`
- **Usage**: Form field labels (weight, reps, notes)
- **Radix Primitive**: `@radix-ui/react-label`
- **Accessibility**: Properly associates label with input via `htmlFor`
- **Usage in this feature**: All form inputs (weight, reps, notes, pre-assessment fields)

#### `skeleton` (EXISTING)
- **Location**: `@/components/ui/skeleton.tsx`
- **Usage**: Loading states for workout split cards, exercise list, calendar
- **Usage in this feature**:
  - Dashboard loading: 3-4 skeleton cards in grid
  - Exercise list loading: 5-8 skeleton rows
  - Calendar loading: Skeleton grid matching calendar layout
  - Exercise detail loading: Skeleton for image, video, form fields

#### `collapsible` (EXISTING)
- **Location**: `@/components/ui/collapsible.tsx`
- **Usage**:
  - Expandable set rows (already implemented in `set-row-expandable.tsx`)
  - Calendar widget collapse on mobile
- **Radix Primitive**: `@radix-ui/react-collapsible`
- **Key Props**: `open`, `onOpenChange`
- **Sub-components**: `CollapsibleTrigger`, `CollapsibleContent`
- **Usage in this feature**:
  - Calendar widget: Collapsible on mobile to save screen space
  - Set rows: Reuse existing pattern from `set-row-expandable.tsx`

#### `sonner` (Toast - EXISTING)
- **Location**: `@/components/ui/sonner.tsx`
- **Usage**: Success/error feedback notifications
- **Library**: `sonner` toast library
- **Key Features**: Auto-dismiss, action buttons, custom styling, promise-based toasts
- **Usage in this feature**:
  - Success: "Workout complete! Great job!" (auto-dismiss 4s)
  - Error: "Failed to save weight. Please try again." (with retry button)
  - Info: "Offline mode - your data will sync when online" (manual dismiss)

#### `separator` (EXISTING)
- **Location**: `@/components/ui/separator.tsx`
- **Usage**: Visual dividers between sections
- **Radix Primitive**: `@radix-ui/react-separator`
- **Key Props**: `orientation`: "horizontal" or "vertical"
- **Usage in this feature**:
  - Between dashboard sections (splits grid and calendar)
  - Between exercise detail sections (description, video, form, history)

#### `select` (EXISTING)
- **Location**: `@/components/ui/select.tsx`
- **Usage**: Pre-assessment dropdowns (optional - can use RadioGroup instead)
- **Radix Primitive**: `@radix-ui/react-select`
- **Sub-components**: `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue`
- **Accessibility**: Keyboard navigation, ARIA combobox, screen reader support
- **Usage in this feature**: Alternative to RadioGroup for frequency selection (if design prefers dropdown)

#### `accordion` (EXISTING - Optional)
- **Location**: `@/components/ui/accordion.tsx`
- **Usage**: Optional alternative to Collapsible for calendar widget or FAQ sections
- **Radix Primitive**: `@radix-ui/react-accordion`
- **Note**: Collapsible is simpler for single-item collapse; use Accordion for multi-item FAQ or help sections

#### `tabs` (EXISTING - Optional)
- **Location**: `@/components/ui/tabs.tsx`
- **Usage**: Optional for switching between workout splits or history views (future feature)
- **Radix Primitive**: `@radix-ui/react-tabs`
- **Note**: Not needed for MVP Phase 1; defer to Phase 3 for customization/history tabs

#### `avatar` (EXISTING - Optional)
- **Location**: `@/components/ui/avatar.tsx`
- **Usage**: Optional for user profile display in dashboard header
- **Note**: Not part of core workout splits feature; may be used in app-wide navigation

#### `dropdown-menu` (EXISTING - Optional)
- **Location**: `@/components/ui/dropdown-menu.tsx`
- **Usage**: Optional for workout split actions (edit, delete, customize - Phase 3)
- **Note**: Defer to Phase 3 for advanced customization features

#### `alert` (EXISTING - Optional)
- **Location**: `@/components/ui/alert.tsx`
- **Usage**: Optional for inline warning/info messages (e.g., "Complete pre-assessment first")
- **Note**: Toast (Sonner) preferred for most feedback; Alert for persistent inline messages only

## 2. Component Composition Strategy

### Primary Composition: `Calendar` for Habit Tracking

**Base Component**: `calendar` from `@/components/ui/calendar.tsx`
**Composition Approach**: Extend with custom modifiers for workout completion days

**HabitCalendar Component Structure**:
```typescript
import { Calendar } from "@/components/ui/calendar"

interface HabitCalendarProps {
  workoutCompletionDates: Date[] // Array of dates when workouts were completed
  currentDate?: Date
  onDateSelect?: (date: Date | undefined) => void
}

export function HabitCalendar({ workoutCompletionDates, currentDate, onDateSelect }: HabitCalendarProps) {
  return (
    <Calendar
      mode="single"
      selected={currentDate}
      onSelect={onDateSelect}
      modifiers={{
        completed: workoutCompletionDates,
        today: new Date(),
      }}
      modifiersClassNames={{
        completed: "bg-primary text-primary-foreground font-semibold relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary-foreground",
        today: "border-2 border-primary",
      }}
      className="rounded-lg border shadow-sm"
      disabled={(date) => date > new Date()} // Disable future dates
    />
  )
}
```

**Customization Details**:
- **Completed days**: Background color + small dot indicator below date number
- **Today**: Bold border (not just background) for better visibility
- **Future dates**: Disabled (cannot select or mark as completed)
- **Multi-indicator for a11y**: Background color + dot + font weight (not color-only)

### Composition Pattern: Sheet (Mobile) vs Dialog (Desktop)

**Pattern**: Responsive modal pattern using `useMediaQuery`
**Components**: `Sheet` (mobile), `Dialog` (desktop)

**Example Structure**:
```typescript
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ExerciseDetailProps {
  exercise: Exercise
  isOpen: boolean
  onClose: () => void
}

export function ExerciseDetail({ exercise, isOpen, onClose }: ExerciseDetailProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader>
            <SheetTitle>{exercise.name}</SheetTitle>
          </SheetHeader>
          {/* Exercise detail content */}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{exercise.name}</DialogTitle>
        </DialogHeader>
        {/* Exercise detail content */}
      </DialogContent>
    </Dialog>
  )
}
```

**Why this pattern**:
- **Mobile**: Sheet from bottom is more natural for mobile UX (thumb-friendly)
- **Desktop**: Modal dialog is standard desktop pattern
- **Single source of truth**: Content is identical, only container changes
- **Accessibility**: Both Sheet and Dialog provide focus trap, Escape key, ARIA dialog

### Composition Pattern: Card + Badge + Progress

**Pattern**: Custom `WorkoutSplitCard` composing shadcn primitives
**Components**: `Card`, `Badge`, `Progress`, `Button`

**Example Structure**:
```typescript
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface WorkoutSplitCardProps {
  splitLetter: string
  exerciseCount: number
  completedCount: number
  isCurrent: boolean
  onStartWorkout: () => void
}

export function WorkoutSplitCard({
  splitLetter,
  exerciseCount,
  completedCount,
  isCurrent,
  onStartWorkout
}: WorkoutSplitCardProps) {
  const progressPercentage = (completedCount / exerciseCount) * 100

  return (
    <Card className={isCurrent ? "border-2 border-primary shadow-lg" : ""}>
      <CardHeader className="flex flex-row items-center justify-between">
        <Badge variant={isCurrent ? "default" : "secondary"}>
          {splitLetter}
        </Badge>
        {isCurrent && <Badge variant="outline">Current</Badge>}
      </CardHeader>
      <CardContent>
        <CardTitle className="text-2xl">Workout {splitLetter}</CardTitle>
        <p className="text-sm text-muted-foreground">{exerciseCount} exercises</p>
        <Progress value={progressPercentage} className="mt-2" />
        <p className="text-xs text-muted-foreground mt-1">
          {completedCount} of {exerciseCount} completed
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onStartWorkout}
          variant={isCurrent ? "default" : "outline"}
          className="w-full"
        >
          {isCurrent ? "Continue Workout" : "Start Workout"}
        </Button>
      </CardFooter>
    </Card>
  )
}
```

### Composition Pattern: Checkbox + Label + Button (Exercise Checklist)

**Pattern**: Custom `ExerciseChecklistItem` combining Checkbox with tap-to-expand
**Components**: `Checkbox`, `Label`, `Button` (ghost variant)

**Example Structure**:
```typescript
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface ExerciseChecklistItemProps {
  exerciseId: string
  exerciseName: string
  isCompleted: boolean
  onToggleComplete: (exerciseId: string) => void
  onOpenDetail: (exerciseId: string) => void
}

export function ExerciseChecklistItem({
  exerciseId,
  exerciseName,
  isCompleted,
  onToggleComplete,
  onOpenDetail
}: ExerciseChecklistItemProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <Checkbox
        id={`exercise-${exerciseId}`}
        checked={isCompleted}
        onCheckedChange={() => onToggleComplete(exerciseId)}
      />
      <Label
        htmlFor={`exercise-${exerciseId}`}
        className={`flex-1 cursor-pointer ${isCompleted ? "line-through opacity-60" : ""}`}
      >
        {exerciseName}
      </Label>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onOpenDetail(exerciseId)}
      >
        Details
      </Button>
    </div>
  )
}
```

### Composition Pattern: Form with React Hook Form

**Pattern**: Pre-assessment multi-step form using RadioGroup
**Components**: `RadioGroup`, `Label`, `Button`, `Dialog`

**Example Structure**:
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { preAssessmentSchema } from "./schema"

export function PreAssessmentForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(preAssessmentSchema)
  })

  const onSubmit = async (data) => {
    // Submit pre-assessment and generate splits
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label className="text-base font-semibold">
          How many days per week will you train?
        </Label>
        <RadioGroup
          onValueChange={(value) => register("frequency").onChange({ target: { value } })}
          className="mt-3 space-y-2"
        >
          {[3, 4, 5, 6].map((days) => (
            <div key={days} className="flex items-center gap-2">
              <RadioGroupItem value={days.toString()} id={`freq-${days}`} />
              <Label htmlFor={`freq-${days}`} className="cursor-pointer">
                {days} days per week
              </Label>
            </div>
          ))}
        </RadioGroup>
        {errors.frequency && (
          <p className="text-sm text-destructive mt-1">{errors.frequency.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Continue
        </Button>
      </div>
    </form>
  )
}
```

## 3. Component Variants and Customization

### Using Built-in Variants

#### Button Variants
**Component**: `button`
**Available Variants**:
- `variant`: "default" (primary), "destructive" (red), "outline" (bordered), "secondary" (muted), "ghost" (transparent), "link" (text-only)
- `size`: "default", "sm", "lg", "icon"
- `className`: Additional Tailwind classes (e.g., "w-full" for full-width)

**Usage Examples**:
```typescript
// Primary CTA (Start Workout, Finalize)
<Button variant="default" size="lg" className="w-full">
  Start Workout
</Button>

// Secondary action (Back, Cancel)
<Button variant="outline" size="default">
  Back
</Button>

// Inline link (View Details)
<Button variant="ghost" size="sm">
  Details
</Button>

// Destructive action (Delete, Exit without saving)
<Button variant="destructive" size="default">
  Exit Without Saving
</Button>
```

#### Badge Variants
**Component**: `badge`
**Available Variants**:
- `variant`: "default" (primary), "secondary" (muted), "destructive" (red), "outline" (bordered)

**Usage Examples**:
```typescript
// Split letter badge (custom colors via className)
<Badge variant="secondary" className="bg-blue-500 text-white">
  A
</Badge>

// Current workout indicator
<Badge variant="default" className="border-2">
  Current
</Badge>

// Completed status
<Badge variant="outline" className="text-green-600">
  Completed
</Badge>
```

#### Card Variants
**Component**: `card`
**No built-in variants**: Use `className` for customization

**Usage Examples**:
```typescript
// Current workout card (highlighted border)
<Card className="border-2 border-primary shadow-lg">
  {/* Card content */}
</Card>

// Default workout card
<Card className="border border-border shadow-sm">
  {/* Card content */}
</Card>

// Hover effect on cards
<Card className="border border-border hover:shadow-md transition-shadow cursor-pointer">
  {/* Card content */}
</Card>
```

### Custom Variants (Using CVA)

**⚠️ ONLY if shadcn doesn't provide what's needed**

For `WorkoutSplitCard`, we can use CVA (class-variance-authority) in the custom component:

```typescript
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const splitCardVariants = cva(
  "rounded-lg border transition-all duration-200",
  {
    variants: {
      status: {
        current: "border-2 border-primary shadow-lg",
        upcoming: "border border-border shadow-sm",
        completed: "border border-border opacity-75",
      },
    },
    defaultVariants: {
      status: "upcoming",
    },
  }
)

interface WorkoutSplitCardProps extends VariantProps<typeof splitCardVariants> {
  // ... other props
}

export function WorkoutSplitCard({ status, ...props }: WorkoutSplitCardProps) {
  return (
    <Card className={cn(splitCardVariants({ status }))}>
      {/* Card content */}
    </Card>
  )
}
```

**Note**: This is a COMPOSITION pattern - we're NOT modifying `@/components/ui/card.tsx`, but creating a new component that uses it.

## 4. shadcn/ui Accessibility Features

### Built-in Accessibility (Automatic from Radix UI)

#### Keyboard Navigation
- **Dialog/Sheet**: Tab to focus elements, Escape to close, focus trap while open
- **RadioGroup**: Arrow keys to navigate options, Space/Enter to select
- **Checkbox**: Space to toggle, Tab to navigate
- **Calendar**: Arrow keys to navigate dates, Enter to select, Page Up/Down for month navigation
- **Button**: Tab to focus, Enter/Space to activate

#### ARIA Attributes (Automatic)
- **Dialog**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`
- **AlertDialog**: `role="alertdialog"`, `aria-modal="true"`
- **RadioGroup**: `role="radiogroup"`, `aria-checked`, `aria-labelledby`
- **Checkbox**: `role="checkbox"`, `aria-checked`, `aria-labelledby`
- **Progress**: `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- **Sheet**: `role="dialog"`, `aria-modal="true"`

#### Focus Management
- **Dialog/Sheet**: Focus trap (cannot Tab out), focus returns to trigger on close
- **AlertDialog**: Focus on cancel/action button, Escape to close
- **Calendar**: Focus visible on selected date

#### Screen Reader Support
- **Progress**: Announces percentage (e.g., "50% complete")
- **Checkbox**: Announces state (e.g., "Exercise 1, checked")
- **RadioGroup**: Announces selected option and group label
- **Dialog**: Announces title and description on open
- **Button**: Announces label and state (disabled, loading)

### Accessibility Requirements (Manual Implementation)

**Note**: Pass to UX designer for full a11y plan. shadcn handles primitives.

#### Labels
- **Requirement**: All form inputs must have associated labels
- **Implementation**: Use `<Label>` component with `htmlFor` matching input `id`
- **Example**:
  ```tsx
  <Label htmlFor="weight-input">Weight (kg)</Label>
  <Input id="weight-input" type="number" />
  ```

#### Descriptions
- **Requirement**: Helper text for complex inputs
- **Implementation**: Use `aria-describedby` to link helper text
- **Example**:
  ```tsx
  <Label htmlFor="notes">Set Notes</Label>
  <Textarea id="notes" aria-describedby="notes-help" />
  <p id="notes-help" className="text-sm text-muted-foreground">
    Optional. Add form cues or difficulty notes.
  </p>
  ```

#### Error States
- **Requirement**: Error messages must be announced to screen readers
- **Implementation**: Use `aria-invalid` and `aria-describedby` for error messages
- **Example**:
  ```tsx
  <Input
    id="weight"
    type="number"
    aria-invalid={!!errors.weight}
    aria-describedby={errors.weight ? "weight-error" : undefined}
  />
  {errors.weight && (
    <p id="weight-error" className="text-sm text-destructive" role="alert">
      {errors.weight.message}
    </p>
  )}
  ```

#### Color Independence
- **Requirement**: Do not rely on color alone for information
- **Implementation**: Use icons + text + borders (multi-indicator)
- **Examples**:
  - Completed exercises: Checkmark icon + strikethrough + opacity (not just green color)
  - Current workout: "Current" badge + border + shadow (not just color change)
  - Error inputs: Error icon + red border + error text (not just red border)

#### Touch Targets
- **Requirement**: Minimum 44x44px touch targets (WCAG AA)
- **Implementation**: Ensure all buttons, checkboxes, radio buttons meet size requirement
- **shadcn defaults**: Button sizes: `sm` (36px), `default` (40px), `lg` (44px+)
- **Recommendation**: Use `default` or `lg` size for mobile, `sm` for desktop only

#### Motion
- **Requirement**: Respect `prefers-reduced-motion` for animations
- **Implementation**: Use Tailwind `motion-safe:` and `motion-reduce:` prefixes
- **Example**:
  ```tsx
  <div className="motion-safe:animate-fade-in motion-reduce:animate-none">
    {/* Content */}
  </div>
  ```

## 5. Installation Verification

After installation, verify:

1. **Components exist**:
   - Check `@/components/ui/calendar.tsx` exists
   - Check `@/components/ui/radio-group.tsx` exists
   - Check `@/components/ui/alert-dialog.tsx` exists

2. **Dependencies installed**:
   - Verify `package.json` includes:
     - `react-day-picker` (for Calendar)
     - `date-fns` (for Calendar)
     - `@radix-ui/react-radio-group` (for RadioGroup)
     - `@radix-ui/react-alert-dialog` (for AlertDialog)

3. **Types available**:
   - TypeScript recognizes component imports
   - No type errors when importing from `@/components/ui/*`

4. **Imports work**:
   ```tsx
   import { Calendar } from "@/components/ui/calendar"
   import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
   import {
     AlertDialog,
     AlertDialogTrigger,
     AlertDialogContent,
     AlertDialogHeader,
     AlertDialogTitle,
     AlertDialogDescription,
     AlertDialogAction,
     AlertDialogCancel
   } from "@/components/ui/alert-dialog"
   ```

## 6. Integration Notes

### Props to Configure

#### Calendar
- **mode**: "single" (for habit tracker - no selection needed, display only)
- **modifiers**: `{ completed: Date[], today: Date }`
- **modifiersClassNames**: Custom styles for completed days
- **disabled**: Disable future dates
- **className**: Border, shadow, spacing

#### RadioGroup
- **value**: Currently selected frequency (string)
- **onValueChange**: Callback to update form state
- **orientation**: "vertical" (default for stacked options)

#### AlertDialog
- **open**: Boolean state (controlled component)
- **onOpenChange**: Callback to update open state
- **Use sub-components**:
  - `AlertDialogTitle`: "Finalize Workout?"
  - `AlertDialogDescription`: "This will mark all exercises as complete..."
  - `AlertDialogAction`: "Confirm" button
  - `AlertDialogCancel`: "Cancel" button

#### Progress
- **value**: Percentage (0-100)
- **className**: Height, color customization
- **Example**: `value={(3 / 8) * 100}` for "3 of 8 exercises"

#### Sheet (Mobile Exercise Detail)
- **side**: "bottom" (for mobile bottom sheet)
- **open**: Boolean state
- **onOpenChange**: Callback to update open state
- **className**: `h-[90vh]` (90% viewport height for near-fullscreen)

#### Dialog (Desktop Exercise Detail)
- **open**: Boolean state
- **onOpenChange**: Callback to update open state
- **className**: `max-w-2xl` (constrain width on desktop)

### Event Handlers Needed

#### Checkbox (Exercise completion)
- **onCheckedChange**: `(exerciseId: string) => void`
- **Optimistic update**: Immediately check, then sync to server
- **Rollback**: If server fails, uncheck and show error toast

#### Button (Finalize Workout)
- **onClick**: `() => void`
- **Validation**: Ensure all exercises are checked
- **Loading state**: `isLoading` prop, disabled while submitting
- **Success**: Show success toast, update calendar, navigate to dashboard

#### RadioGroup (Pre-assessment)
- **onValueChange**: `(value: string) => void`
- **Integration**: Use with React Hook Form `register` or controlled component

#### Calendar (Date selection - optional)
- **onSelect**: `(date: Date | undefined) => void`
- **Note**: For habit tracker, selection may be disabled (display-only)

### Styling Considerations

#### Tailwind Classes
- **Card hover**: `hover:shadow-md transition-shadow`
- **Button full-width**: `w-full` (mobile), `w-auto` (desktop)
- **Grid layout**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- **Spacing**: `space-y-4` (vertical), `gap-3` (flex/grid)

#### CSS Variables (Theming)
- **Primary color**: `bg-primary`, `text-primary`, `border-primary`
- **Muted text**: `text-muted-foreground`
- **Destructive**: `bg-destructive`, `text-destructive`
- **Border**: `border-border`

#### Dark Mode
- **Automatic**: shadcn components support dark mode via CSS variables
- **No changes needed**: Works out of the box with `next-themes`

#### Responsive Design
- **Mobile-first**: Use Tailwind breakpoints (`md:`, `lg:`)
- **Sheet on mobile**: `useMediaQuery("(max-width: 768px)")`
- **Dialog on desktop**: `useMediaQuery("(min-width: 769px)")`

## 7. Important Notes

### Critical Rules

⚠️ **NEVER modify shadcn source files** in `@/components/ui/`
⚠️ **Composition over modification**: Wrap, don't edit
💡 **Check registry first**: Component might already exist (15 already installed!)
💡 **Use variants**: Don't create new components for style changes
📝 **Coordinate with UX designer**: For full component architecture

### Calendar Component - Custom Day Rendering

**Question**: Does shadcn Calendar component support custom day rendering for habit tracking dots?

**Answer**: ✅ YES! The Calendar component supports custom day rendering via:
1. **`modifiers`**: Define custom day states (e.g., `completed: Date[]`)
2. **`modifiersClassNames`**: Apply CSS classes to matching days
3. **Example**: See `calendar-14` block for "Booked/Unavailable Days" pattern

**Implementation Strategy**:
- Use `modifiers={{ completed: workoutCompletionDates }}` to mark completed days
- Use `modifiersClassNames={{ completed: "..." }}` to style with background + dot indicator
- Use CSS pseudo-element (`::after`) for dot below date number
- Multi-indicator for a11y: Background color + dot + font weight (not color-only)

### Sheet vs Dialog - Responsive Strategy

**Question**: Should we conditionally render Sheet (mobile) vs Dialog (desktop)?

**Answer**: ✅ YES! Use `useMediaQuery` hook for responsive conditional rendering:

```typescript
const isMobile = useMediaQuery("(max-width: 768px)")

if (isMobile) {
  return <Sheet>...</Sheet>
}
return <Dialog>...</Dialog>
```

**Why**:
- **Mobile**: Sheet from bottom is more natural, thumb-friendly
- **Desktop**: Modal dialog is standard desktop UX
- **Single source of truth**: Content component is shared, only container changes

### Alert Dialog for Confirmations

**Question**: What's the best practice for confirmation dialogs?

**Answer**: ✅ Use `AlertDialog` component (to be installed)

**When to use AlertDialog vs Dialog**:
- **AlertDialog**: Destructive actions, confirmations, warnings (user MUST respond)
- **Dialog**: General content, forms, details (user can dismiss easily)

**Examples**:
- ✅ AlertDialog: "Finalize workout?", "Exit without saving?", "Delete split?"
- ✅ Dialog: Pre-assessment form, exercise detail view

### Separator Component

**Question**: Do we need Separator component for visual hierarchy?

**Answer**: ✅ YES! Separator is already installed and useful for:
- Dividing dashboard sections (splits grid and calendar widget)
- Separating exercise detail sections (description, video, form, history)
- Breaking up long forms (pre-assessment steps)

**Usage**:
```tsx
<Separator className="my-4" /> // Horizontal separator with spacing
<Separator orientation="vertical" className="h-full" /> // Vertical separator
```

## 8. Next Steps for Parent Agent

### 1. Run Installation Commands

```bash
# Install missing shadcn components (3 new components)
pnpm dlx shadcn@latest add calendar radio-group alert-dialog
```

### 2. Verify Components in `@/components/ui/`

After installation, check that these files exist:
- `src/components/ui/calendar.tsx` (NEW)
- `src/components/ui/radio-group.tsx` (NEW)
- `src/components/ui/alert-dialog.tsx` (NEW)

Existing components (already installed):
- `src/components/ui/card.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/checkbox.tsx`
- `src/components/ui/sheet.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/progress.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/skeleton.tsx`
- `src/components/ui/collapsible.tsx`
- `src/components/ui/sonner.tsx`
- `src/components/ui/separator.tsx`
- `src/components/ui/select.tsx` (optional)

### 3. Coordinate with Domain Architect

**Needed from domain-architect**:
- Data structure for `workoutCompletionDates: Date[]` (for Calendar)
- Pre-assessment schema validation (for RadioGroup form)
- Exercise completion state management (for Checkbox optimistic updates)

### 4. Coordinate with UX Designer

**Needed from ux-ui-designer**:
- Confirm Calendar widget placement (main page or collapsible sidebar)
- Confirm Sheet (mobile) vs Dialog (desktop) strategy
- Confirm AlertDialog confirmation messages and actions

### 5. Implement Custom Components

After shadcn components are installed, create custom compositions:

#### Custom Components to Build (4 total):

1. **`HabitCalendar`** (extends shadcn Calendar):
   - **Location**: `src/domains/workout-history/components/organisms/habit-calendar.tsx`
   - **Extends**: `@/components/ui/calendar.tsx`
   - **Props**: `workoutCompletionDates: Date[]`, `currentDate?: Date`
   - **Styling**: Custom modifiers for completed days with dot indicator

2. **`WorkoutSplitCard`** (composes Card, Badge, Progress, Button):
   - **Location**: `src/domains/workout-splits/components/molecules/workout-split-card.tsx`
   - **Extends**: `@/components/ui/card.tsx`
   - **Props**: `splitLetter: string`, `exerciseCount: number`, `completedCount: number`, `isCurrent: boolean`
   - **Styling**: Custom border/shadow for current workout state

3. **`ExerciseChecklistItem`** (composes Checkbox, Label, Button):
   - **Location**: `src/domains/workout-splits/components/molecules/exercise-checklist-item.tsx`
   - **Extends**: `@/components/ui/checkbox.tsx`
   - **Props**: `exerciseId: string`, `exerciseName: string`, `isCompleted: boolean`
   - **Interaction**: Checkbox for completion, tap exercise name for details

4. **`WeightHistoryChart`** (custom visualization or recharts):
   - **Location**: `src/domains/exercises/components/organisms/weight-history-chart.tsx`
   - **Library**: Consider `recharts` or simple custom SVG
   - **Props**: `weightHistory: WeightHistoryEntry[]` (date, weight)
   - **Styling**: Simple line chart showing weight progression

### 6. Create Helper Hook: `useMediaQuery`

If not already in project, create media query hook for responsive rendering:

```typescript
// src/hooks/use-media-query.ts
import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}
```

### 7. Test Accessibility Features

After implementation:
- ✅ Keyboard navigation (Tab, Enter, Escape, Arrow keys)
- ✅ Screen reader announcements (test with NVDA/JAWS/VoiceOver)
- ✅ Focus management (focus trap in dialogs, focus return on close)
- ✅ Color contrast (4.5:1 for text, 3:1 for large text)
- ✅ Touch targets (44x44px minimum on mobile)
- ✅ Motion preferences (respect `prefers-reduced-motion`)

## 9. Component Summary

### Total Components: 18 shadcn components

#### NEW (3 components to install):
1. **calendar** - Habit tracking calendar
2. **radio-group** - Pre-assessment frequency selection
3. **alert-dialog** - Confirmation dialogs

#### EXISTING (15 components already installed):
4. **card** - Workout split cards
5. **button** - All CTAs and actions
6. **badge** - Split labels, status indicators
7. **checkbox** - Exercise completion
8. **sheet** - Exercise detail (mobile)
9. **dialog** - Pre-assessment, exercise detail (desktop)
10. **progress** - Workout completion progress bar
11. **input** - Weight and reps inputs
12. **textarea** - Set notes
13. **label** - Form labels
14. **skeleton** - Loading states
15. **collapsible** - Calendar collapse, set rows
16. **sonner** (toast) - Success/error feedback
17. **separator** - Visual dividers
18. **select** - Optional for dropdowns

### Custom Components: 4 custom compositions

1. **HabitCalendar** - Extends Calendar with completion dots
2. **WorkoutSplitCard** - Composes Card + Badge + Progress + Button
3. **ExerciseChecklistItem** - Composes Checkbox + Label + Button
4. **WeightHistoryChart** - Custom chart or recharts integration

---

**End of shadcn Component Selection Plan**
