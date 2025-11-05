# Phase 1B Core Workflow - shadcn/ui Component Selection Plan

**Created**: 2025-11-04
**Session**: phase1-ui-20251103
**Type**: shadcn Component Selection

## 1. shadcn/ui Components Required

### New Components to Install

**Installation Commands**:
```bash
pnpm dlx shadcn@latest add badge progress dialog dropdown-menu toast skeleton avatar sheet
```

**Components**:

#### `badge`
- **Purpose**: Active routine indicator on routine cards, exercise count badges
- **Radix Primitive**: N/A (pure CSS component)
- **Key Props**: `variant` (default, secondary, destructive, outline)
- **Accessibility**: Semantic span with proper color contrast
- **Usage**:
  - Routines List: "Active" badge on currently active routine
  - Dashboard: Status indicators

#### `progress`
- **Purpose**: Exercise progress bar in active workout session
- **Radix Primitive**: `@radix-ui/react-progress`
- **Key Props**: `value` (0-100), `max` (default 100), `className`
- **Accessibility**: ARIA progress bar with automatic state announcements
- **Usage**:
  - Active Workout: "Exercise 1 of 6" visual progress indicator
  - Shows completion percentage through workout

#### `dialog`
- **Purpose**: Exit workout confirmation, delete routine confirmation
- **Radix Primitive**: `@radix-ui/react-dialog`
- **Key Props**: `open`, `onOpenChange`, modal overlay, auto-focus trap
- **Accessibility**:
  - Focus trap (prevents tabbing outside)
  - Escape key closes
  - ARIA dialog role
  - Screen reader announcements
- **Usage**:
  - Active Workout: "Exit Workout?" confirmation to prevent data loss
  - Routines List: "Delete Routine?" / "Archive Routine?" confirmation

#### `dropdown-menu`
- **Purpose**: "More actions" menu on routine cards (Archive, Delete)
- **Radix Primitive**: `@radix-ui/react-dropdown-menu`
- **Key Props**: `open`, `onOpenChange`, trigger, items, separators
- **Accessibility**:
  - Keyboard navigation (Arrow keys, Enter, Escape)
  - Focus management
  - ARIA menu role
  - Screen reader support
- **Usage**:
  - Routines List: Overflow menu (⋯) with Archive and Delete options

#### `toast`
- **Purpose**: Success/error notifications (set completed, routine activated, auto-save status)
- **Radix Primitive**: `@radix-ui/react-toast`
- **Key Props**: `variant`, `duration`, `title`, `description`, `action`
- **Accessibility**:
  - ARIA live region (polite announcements)
  - Screen reader friendly
  - Dismissible with keyboard
  - Auto-dismiss timer
- **Usage**:
  - Active Workout: "Set 2 completed", "Saving...", "Saved"
  - Routines List: "Push-Pull-Legs activated", "Routine deleted"
  - Dashboard: Error messages

#### `skeleton`
- **Purpose**: Loading states for dashboard stats, routines list, workout session
- **Radix Primitive**: N/A (pure CSS animation component)
- **Key Props**: `className` for custom sizing
- **Accessibility**: Hidden from screen readers (aria-hidden), announces loading state separately
- **Usage**:
  - Dashboard: Stats cards skeleton (3 shimmer cards)
  - Routines List: Routine cards skeleton (3-6 cards)
  - Active Workout: Exercise name and inputs skeleton

#### `avatar`
- **Purpose**: User profile picture in app header
- **Radix Primitive**: `@radix-ui/react-avatar`
- **Key Props**: `src`, `alt`, `fallback` (initials)
- **Accessibility**:
  - Alt text for images
  - Fallback for missing images
  - ARIA label for user context
- **Usage**:
  - App Header: User profile picture with initials fallback

#### `sheet`
- **Purpose**: Mobile navigation drawer (hamburger menu)
- **Radix Primitive**: `@radix-ui/react-dialog` (adapted)
- **Key Props**: `open`, `onOpenChange`, `side` (left, right, top, bottom)
- **Accessibility**:
  - Focus trap
  - Escape key closes
  - Overlay click closes
  - ARIA dialog role
  - Keyboard navigation
- **Usage**:
  - Mobile Navigation: Slide-in drawer from left with main navigation links
  - Opens from hamburger button in header

### Existing Components to Reuse

#### `button`
- **Location**: `@/components/ui/button.tsx`
- **Usage**: All CTAs and actions across Phase 1B
- **New Contexts**:
  - Dashboard: "Start Workout" primary CTA, quick action links
  - Routines List: "Create Routine", "View", "Edit", "Activate"
  - Active Workout: "Complete Set" (green variant), "Next Exercise", "Finish Workout"
  - Number inputs: +/- increment buttons
- **Variants Needed**:
  - `default` - Primary actions
  - `destructive` - Delete actions
  - `outline` - Secondary actions
  - `ghost` - Tertiary actions, icon buttons
  - `success` - Complete Set button (custom green variant)

#### `card`
- **Location**: `@/components/ui/card.tsx`
- **Usage**: Container component for all card-based layouts
- **New Contexts**:
  - Dashboard: Stats cards, Train Today hero card, session cards
  - Routines List: Routine cards with actions
  - Empty states: Centered content cards

#### `input`
- **Location**: `@/components/ui/input.tsx`
- **Usage**: Text and number inputs
- **New Contexts**:
  - Active Workout: Weight and reps inputs (type="number")
  - Number Input Component: Base input for custom +/- component
  - Workout Summary: Session notes textarea

#### `label`
- **Location**: `@/components/ui/label.tsx`
- **Usage**: Form field labels throughout
- **New Contexts**:
  - Active Workout: "Weight (kg)", "Reps" labels
  - Workout Summary: "Rate your session", "Session notes"

#### `separator`
- **Location**: `@/components/ui/separator.tsx`
- **Usage**: Visual dividers
- **New Contexts**:
  - Active Workout: Section dividers between header, progress, and exercise content
  - Dashboard: Between sections

#### `alert`
- **Location**: `@/components/ui/alert.tsx`
- **Usage**: Error states and important messages
- **New Contexts**:
  - Dashboard: "Failed to load dashboard" error
  - Routines List: Error loading routines
  - Active Workout: Connection loss warning

## 2. Component Composition Strategy

### Primary Composition: `Dialog` for Confirmations

**Base Component**: `dialog` from `@/components/ui/dialog`
**Composition Approach**: Use Dialog + DialogContent + DialogHeader + DialogFooter

**Example Structure**:
```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Exit Workout Confirmation
<Dialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{workoutsTextMap.active.exit.confirmTitle}</DialogTitle>
      <DialogDescription>
        {workoutsTextMap.active.exit.confirmMessage}
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="ghost" onClick={cancelExit}>
        {workoutsTextMap.active.exit.continueWorkout}
      </Button>
      <Button variant="destructive" onClick={confirmExit}>
        {workoutsTextMap.active.exit.exitButton}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Primary Composition: `DropdownMenu` for Routine Actions

**Base Component**: `dropdown-menu` from `@/components/ui/dropdown-menu`
**Composition Approach**: DropdownMenu + Trigger + Content + Items

**Example Structure**:
```typescript
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"

// Routine Card Actions
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" aria-label={routinesTextMap.routines.actions.more}>
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={handleArchive}>
      {routinesTextMap.routines.actions.archive}
    </DropdownMenuItem>
    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
      {routinesTextMap.routines.actions.delete}
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Primary Composition: `Toast` for Feedback

**Base Component**: `toast` from `@/components/ui/toast`
**Composition Approach**: Use toast() function with options

**Example Structure**:
```typescript
import { useToast } from "@/components/ui/use-toast"

// In component
const { toast } = useToast()

// Set completed
const handleCompleteSet = () => {
  // ... complete set logic
  toast({
    title: workoutsTextMap.active.toast.setCompleted.replace('{number}', setNumber),
    duration: 2000,
  })
}

// Routine activated
const handleActivate = () => {
  // ... activate routine logic
  toast({
    title: routinesTextMap.routines.toast.activated.replace('{name}', routineName),
    duration: 3000,
  })
}

// Error
const handleError = () => {
  toast({
    variant: "destructive",
    title: "Error",
    description: errorMessage,
    duration: 5000,
  })
}
```

### Primary Composition: `Sheet` for Mobile Navigation

**Base Component**: `sheet` from `@/components/ui/sheet`
**Composition Approach**: Sheet + Trigger + Content

**Example Structure**:
```typescript
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

// Mobile Navigation
<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" aria-label="Open menu">
      <Menu className="h-6 w-6" />
    </Button>
  </SheetTrigger>
  <SheetContent side="left">
    <nav aria-label="Main navigation">
      <ul className="space-y-4">
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/routines">Routines</Link></li>
        <li><Link href="/history">History</Link></li>
        <li><Link href="/library">Library</Link></li>
      </ul>
    </nav>
  </SheetContent>
</Sheet>
```

### Composition Patterns

**Pattern 1: Skeleton Loading State**
**Components**: `skeleton`, `card`
**Structure**:
```typescript
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

// Dashboard Stats Loading
<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
  {[...Array(3)].map((_, i) => (
    <Card key={i} className="p-4">
      <Skeleton className="h-8 w-8 rounded-full mb-2" /> {/* Icon */}
      <Skeleton className="h-6 w-16 mb-1" /> {/* Value */}
      <Skeleton className="h-4 w-20" /> {/* Label */}
    </Card>
  ))}
</div>
```

**Pattern 2: Progress Bar with Text**
**Components**: `progress`
**Structure**:
```typescript
import { Progress } from "@/components/ui/progress"

// Exercise Progress
<div>
  <p className="text-sm text-muted-foreground mb-2">
    {workoutsTextMap.active.progress.current
      .replace('{current}', currentExercise)
      .replace('{total}', totalExercises)}
  </p>
  <Progress value={(currentExercise / totalExercises) * 100} className="h-2" />
</div>
```

**Pattern 3: Badge on Card**
**Components**: `badge`, `card`
**Structure**:
```typescript
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

// Active Routine Card
<Card>
  <div className="flex items-center justify-between">
    <h3>{routineName}</h3>
    {isActive && (
      <Badge variant="default">
        {routinesTextMap.routines.active.badge}
      </Badge>
    )}
  </div>
  {/* Card content */}
</Card>
```

**Pattern 4: Avatar with Fallback**
**Components**: `avatar`
**Structure**:
```typescript
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// User Profile in Header
<Avatar>
  <AvatarImage src={user.avatarUrl} alt={user.name} />
  <AvatarFallback>{user.initials}</AvatarFallback>
</Avatar>
```

## 3. Component Variants and Customization

### Using Built-in Variants

**Component**: `button`
**Available Variants**:
- `variant`: default, destructive, outline, secondary, ghost, link
- `size`: default, sm, lg, icon
- `className`: Additional Tailwind classes

**Usage Example**:
```typescript
// Complete Set button (needs custom success variant)
<Button
  variant="default"
  size="lg"
  className="w-full h-14 bg-green-500 hover:bg-green-600 text-white"
  onClick={handleCompleteSet}
>
  {workoutsTextMap.active.actions.completeSet}
</Button>

// Ghost icon button for dropdown trigger
<Button variant="ghost" size="icon">
  <MoreVertical className="h-4 w-4" />
</Button>

// Destructive for delete confirmation
<Button variant="destructive" onClick={handleDelete}>
  {routinesTextMap.routines.delete.confirmDelete}
</Button>
```

**Component**: `badge`
**Available Variants**:
- `variant`: default, secondary, destructive, outline
- `className`: Additional Tailwind classes

**Usage Example**:
```typescript
// Active routine badge
<Badge variant="default">{routinesTextMap.routines.active.badge}</Badge>

// Exercise count badge
<Badge variant="secondary">{exerciseCount} exercises</Badge>
```

**Component**: `toast`
**Available Variants**:
- `variant`: default, destructive
- `duration`: Auto-dismiss time (ms)
- `action`: Optional action button

**Usage Example**:
```typescript
// Success toast
toast({
  title: "Set completed",
  duration: 2000,
})

// Error toast
toast({
  variant: "destructive",
  title: "Failed to save",
  description: "Your progress will be retried automatically.",
  duration: 5000,
})
```

### Custom Variants (if absolutely necessary)

**Component**: `button` - Success Variant for "Complete Set"
**Approach**: Use className to apply green background (success color)
**Do NOT modify**: `@/components/ui/button.tsx`

**Alternative Approach**: Extend button variants in Tailwind config
```typescript
// tailwind.config.js (if needed)
{
  theme: {
    extend: {
      colors: {
        success: {
          DEFAULT: '#10b981', // green-500
          foreground: '#ffffff',
        }
      }
    }
  }
}
```

Then use className:
```typescript
<Button className="bg-success hover:bg-success/90">
  Complete Set
</Button>
```

## 4. shadcn/ui Accessibility Features

### Built-in Accessibility

**From Radix UI Primitives**:

1. **Dialog Component** (`@radix-ui/react-dialog`)
   - **Keyboard Navigation**: Escape closes, Tab cycles through focusable elements
   - **ARIA Attributes**: `role="dialog"`, `aria-labelledby`, `aria-describedby`
   - **Focus Management**: Auto-focuses first element, traps focus, restores focus on close
   - **Screen Reader**: Announces dialog open/close, content accessible

2. **DropdownMenu Component** (`@radix-ui/react-dropdown-menu`)
   - **Keyboard Navigation**: Arrow keys navigate items, Enter activates, Escape closes
   - **ARIA Attributes**: `role="menu"`, `aria-haspopup`, `aria-expanded`
   - **Focus Management**: Auto-focuses first item, returns focus to trigger
   - **Screen Reader**: Announces menu state, item count, current selection

3. **Progress Component** (`@radix-ui/react-progress`)
   - **Keyboard Navigation**: N/A (display only)
   - **ARIA Attributes**: `role="progressbar"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
   - **Focus Management**: Not focusable (display only)
   - **Screen Reader**: Announces progress percentage and label

4. **Toast Component** (`@radix-ui/react-toast`)
   - **Keyboard Navigation**: Tab to action buttons, Escape dismisses
   - **ARIA Attributes**: `role="status"` or `role="alert"` (live region)
   - **Focus Management**: Optional focus on action button
   - **Screen Reader**: Polite announcements (non-interruptive)

5. **Avatar Component** (`@radix-ui/react-avatar`)
   - **Keyboard Navigation**: N/A (display only)
   - **ARIA Attributes**: `alt` text for images
   - **Focus Management**: Not focusable (display only)
   - **Screen Reader**: Announces image alt text or fallback text

6. **Sheet Component** (Dialog variant)
   - **Keyboard Navigation**: Escape closes, Tab cycles through content
   - **ARIA Attributes**: `role="dialog"`, side-specific behaviors
   - **Focus Management**: Focus trap, restores focus on close
   - **Screen Reader**: Announces sheet open/close, drawer metaphor

### Accessibility Requirements

**Note**: Pass to UX designer for full a11y plan. shadcn handles primitives.

**Labels**: Ensure all interactive elements have accessible labels
```typescript
// Button with aria-label
<Button aria-label="Open menu" variant="ghost" size="icon">
  <Menu />
</Button>

// Progress with aria-label
<Progress
  value={progress}
  aria-label={`Exercise ${current} of ${total} complete`}
/>
```

**Descriptions**: Use helper text where needed
```typescript
// Dialog with description
<DialogDescription>
  Your progress will be saved as a draft. You can resume later.
</DialogDescription>
```

**Error States**: Use error variants for validation
```typescript
// Error toast
toast({
  variant: "destructive",
  title: "Error",
  description: errorMessage,
})
```

## 5. Installation Verification

After installation, verify:

1. **Components exist**:
   - `src/components/ui/badge.tsx`
   - `src/components/ui/progress.tsx`
   - `src/components/ui/dialog.tsx`
   - `src/components/ui/dropdown-menu.tsx`
   - `src/components/ui/toast.tsx`
   - `src/components/ui/toaster.tsx`
   - `src/components/ui/use-toast.ts`
   - `src/components/ui/skeleton.tsx`
   - `src/components/ui/avatar.tsx`
   - `src/components/ui/sheet.tsx`

2. **Dependencies installed**: Check `package.json` for:
   - `@radix-ui/react-dialog`
   - `@radix-ui/react-dropdown-menu`
   - `@radix-ui/react-progress`
   - `@radix-ui/react-toast`
   - `@radix-ui/react-avatar`

3. **Types available**: TypeScript recognizes all components

4. **Imports work**: Can import from `@/components/ui/`

## 6. Integration Notes

### Props to Configure

**Dialog**:
- `open` (boolean) - Control visibility
- `onOpenChange` (function) - Handle close events
- `modal` (boolean) - Default true (backdrop overlay)

**DropdownMenu**:
- `open` (boolean) - Control visibility
- `onOpenChange` (function) - Handle open/close
- `align` ("start" | "center" | "end") - Menu alignment

**Progress**:
- `value` (number 0-100) - Progress percentage
- `max` (number) - Default 100
- `className` - Custom height/colors

**Toast**:
- `title` (string) - Main message
- `description` (string) - Optional details
- `variant` ("default" | "destructive") - Style
- `duration` (number) - Auto-dismiss time (ms)
- `action` (ReactNode) - Optional action button

**Badge**:
- `variant` ("default" | "secondary" | "destructive" | "outline")
- `className` - Custom colors/sizing

**Sheet**:
- `open` (boolean) - Control visibility
- `onOpenChange` (function) - Handle open/close
- `side` ("left" | "right" | "top" | "bottom") - Slide direction

**Avatar**:
- `src` (string) - Image URL
- `alt` (string) - Alt text
- `fallback` (string) - Initials or icon

**Skeleton**:
- `className` - Custom size/shape

### Event Handlers Needed

**Dialog**:
- `onOpenChange` - Handle close events (user clicks outside, presses Escape)

**DropdownMenu**:
- `onSelect` - Handle item selection (fires before menu closes)
- `onOpenChange` - Handle menu open/close

**Toast**:
- `onDismiss` - Optional callback when toast is dismissed
- Action button `onClick` - Handle action

**Sheet**:
- `onOpenChange` - Handle drawer open/close

### Styling Considerations

**Tailwind Classes**: All components accept `className` prop
```typescript
<Progress className="h-2 w-full" />
<Badge className="text-xs px-2 py-1" />
<Skeleton className="h-8 w-24 rounded-md" />
```

**CSS Variables**: shadcn uses CSS variables for theming
- Already configured in `globals.css`
- Components automatically use theme colors
- No additional configuration needed

**Dark Mode**: Automatic with shadcn
- All components respect dark mode classes
- Uses `class` strategy (default Next.js 15)
- Toggle dark mode with `<html className="dark">`

## 7. Important Notes

⚠️ **NEVER modify shadcn source files** in `@/components/ui/`

⚠️ **Composition over modification**: Wrap, don't edit

💡 **Check registry first**: All 8 components exist in shadcn registry

💡 **Use variants**: Don't create new components for style changes

📝 **Coordinate with UX designer**: For full component architecture (custom molecules/organisms)

### Component Installation Order

**Recommended order** (dependencies first):
1. `badge` - No dependencies
2. `skeleton` - No dependencies
3. `avatar` - No dependencies
4. `progress` - No dependencies
5. `dialog` - May be used by toast/sheet
6. `dropdown-menu` - Independent
7. `toast` - May depend on dialog
8. `sheet` - May depend on dialog

**Single command installs all**:
```bash
pnpm dlx shadcn@latest add badge progress dialog dropdown-menu toast skeleton avatar sheet
```

### Testing After Installation

**Manual verification checklist**:
- [ ] Import each component: `import { Badge } from "@/components/ui/badge"`
- [ ] Check TypeScript types: Hover over component in IDE
- [ ] Test in dev mode: Create test page with all components
- [ ] Verify responsive behavior: Test on mobile viewport
- [ ] Check dark mode: Toggle dark class on html element
- [ ] Validate accessibility: Tab through interactive components

## 8. Next Steps for Parent Agent

1. **Run installation command**:
   ```bash
   pnpm dlx shadcn@latest add badge progress dialog dropdown-menu toast skeleton avatar sheet
   ```

2. **Verify components** in `src/components/ui/`:
   - badge.tsx
   - progress.tsx
   - dialog.tsx
   - dropdown-menu.tsx
   - toast.tsx (+ toaster.tsx + use-toast.ts)
   - skeleton.tsx
   - avatar.tsx
   - sheet.tsx

3. **Add Toaster to root layout** (required for toast to work):
   ```typescript
   // src/app/layout.tsx
   import { Toaster } from "@/components/ui/toaster"

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Toaster />
         </body>
       </html>
     )
   }
   ```

4. **Coordinate with UX designer** for:
   - Full component architecture plan
   - Custom molecules and organisms
   - Text map implementation
   - Page assembly

5. **Begin implementation** of Phase 1B views:
   - Create text maps first
   - Build custom shared components (number-input, star-rating, stat-card, empty-state)
   - Build domain-specific components
   - Assemble pages

6. **Test** responsive breakpoints and accessibility

7. **Phase 1B complete**: Ready for business logic integration

---

**shadcn/ui Component Selection Complete** ✅

**Summary**:
- **8 NEW components** to install
- **7 EXISTING components** to reuse
- **15 total shadcn components** in project
- **All Radix primitives** provide automatic accessibility
- **Zero modifications** needed to shadcn source files
- **Composition-first** approach for customization
