# Authentication Views - shadcn/ui Component Selection Plan

**Created**: 2025-11-03
**Session**: phase1-ui-20251103
**Type**: shadcn Component Selection
**Phase**: 1A - Authentication Foundation

## 1. shadcn/ui Components Required

### Existing Components (Already Installed) ✅

**All Phase 1A auth views can be built with currently installed components**:

#### `button`
- **Location**: `@/components/ui/button.tsx`
- **Purpose**:
  - Login: Primary login button, secondary "Create Account" button
  - Register: Primary "Create Account" button
  - Password Recovery: "Send Reset Link" button, "Resend" button
- **Variants Needed**:
  - `default` (primary CTA)
  - `outline` or `secondary` (for "Create Account" link on login)
  - `ghost` or `link` (for "Back to Login" links)
- **Key Props**: `variant`, `size`, `disabled` (loading state)
- **Accessibility**: Built-in keyboard navigation, focus states from Radix

#### `input`
- **Location**: `@/components/ui/input.tsx`
- **Purpose**:
  - Login: Email input, password input base
  - Register: Email input, password input base, confirm password base
  - Password Recovery: Email input
- **Variants**: Standard text input
- **Key Props**: `type`, `placeholder`, `disabled`, `aria-label`, `autoComplete`
- **Accessibility**: Radix provides proper ARIA attributes

#### `card`
- **Location**: `@/components/ui/card.tsx`
- **Purpose**: Container for auth forms (centered card layout)
- **Components**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- **Usage**: Wraps entire login/register/password recovery forms
- **Accessibility**: Semantic structure from Radix

#### `label`
- **Location**: `@/components/ui/label.tsx`
- **Purpose**: Form field labels for all inputs
- **Radix Primitive**: `@radix-ui/react-label`
- **Key Props**: `htmlFor` (associates with input)
- **Accessibility**: Automatic label-input association

#### `separator`
- **Location**: `@/components/ui/separator.tsx`
- **Purpose**: Visual divider (Login: "or" divider between login and register)
- **Radix Primitive**: `@radix-ui/react-separator`
- **Variants**: Horizontal (default)
- **Accessibility**: Proper ARIA role="separator"

#### `checkbox`
- **Location**: `@/components/ui/checkbox.tsx`
- **Purpose**: Login: "Remember me" checkbox
- **Radix Primitive**: `@radix-ui/react-checkbox`
- **Key Props**: `checked`, `onCheckedChange`
- **Accessibility**: Keyboard navigation, proper checked state announcements

#### `alert`
- **Location**: `@/components/ui/alert.tsx`
- **Purpose**:
  - Error messages (invalid credentials, email exists, etc.)
  - Success messages (account created, reset link sent)
- **Components**: `Alert`, `AlertTitle`, `AlertDescription`
- **Variants**: `default`, `destructive` (errors)
- **Accessibility**: Built-in aria-live region

#### `select` (BONUS)
- **Location**: `@/components/ui/select.tsx`
- **Purpose**: Not currently needed for Phase 1A, but already available
- **Note**: Could be used in future for language/region selection on auth pages

### New Components to Install

**NONE REQUIRED** - All Phase 1A authentication views can be implemented with existing shadcn/ui components.

## 2. Component Composition Strategy

### View 1: Login Page Composition

**Base Layout**: `Card` wrapper with centered layout

**Structure**:
```typescript
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

<Card className="w-full max-w-md">
  <CardHeader>
    <CardTitle>{authTextMap.login.heading}</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Email Field */}
    <div>
      <Label htmlFor="email">{authTextMap.login.email.label}</Label>
      <Input
        id="email"
        type="email"
        placeholder={authTextMap.login.email.placeholder}
        autoComplete="email"
      />
    </div>

    {/* Password Field - using custom password-input molecule */}
    <div>
      <Label htmlFor="password">{authTextMap.login.password.label}</Label>
      <PasswordInput
        id="password"
        placeholder={authTextMap.login.password.placeholder}
        autoComplete="current-password"
      />
    </div>

    {/* Remember Me */}
    <div className="flex items-center space-x-2">
      <Checkbox id="remember" />
      <Label htmlFor="remember">{authTextMap.login.rememberMe.label}</Label>
    </div>

    {/* Login Button */}
    <Button className="w-full" variant="default">
      {authTextMap.login.submit}
    </Button>

    {/* Forgot Password Link */}
    <Button variant="link">
      {authTextMap.login.forgotPassword}
    </Button>

    {/* Separator */}
    <Separator />

    {/* Create Account */}
    <Button variant="outline" className="w-full">
      {authTextMap.login.register}
    </Button>
  </CardContent>
</Card>
```

### View 2: Register Page Composition

**Base Layout**: `Card` wrapper

**Structure**:
```typescript
<Card className="w-full max-w-md">
  <CardHeader>
    <CardTitle>{authTextMap.register.heading}</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Email */}
    <Label htmlFor="email">{authTextMap.register.email.label}</Label>
    <Input id="email" type="email" ... />

    {/* Password */}
    <Label htmlFor="password">{authTextMap.register.password.label}</Label>
    <PasswordInput id="password" ... />

    {/* Password Requirements - custom molecule */}
    <PasswordRequirements requirements={...} />

    {/* Confirm Password */}
    <Label htmlFor="confirm">{authTextMap.register.confirmPassword.label}</Label>
    <PasswordInput id="confirm" ... />

    {/* Submit */}
    <Button className="w-full">{authTextMap.register.submit}</Button>

    {/* Login Link */}
    <div>
      <span>{authTextMap.register.hasAccount}</span>
      <Button variant="link">{authTextMap.register.login}</Button>
    </div>
  </CardContent>
</Card>
```

### View 3: Password Recovery Composition

**Base Layout**: `Card` wrapper

**Two States**:

**State 1: Request Reset**
```typescript
<Card className="w-full max-w-md">
  <CardHeader>
    <CardTitle>{authTextMap.passwordRecovery.heading}</CardTitle>
    <CardDescription>{authTextMap.passwordRecovery.instructions}</CardDescription>
  </CardHeader>
  <CardContent>
    <Label htmlFor="email">{authTextMap.passwordRecovery.email.label}</Label>
    <Input id="email" type="email" ... />

    <Button className="w-full">{authTextMap.passwordRecovery.submit}</Button>

    <Button variant="link">{authTextMap.passwordRecovery.backToLogin}</Button>
  </CardContent>
</Card>
```

**State 2: Success (after submission)**
```typescript
<Card className="w-full max-w-md">
  <CardHeader>
    <CardTitle>{authTextMap.passwordRecovery.success.heading}</CardTitle>
  </CardHeader>
  <CardContent>
    <Alert>
      <AlertDescription>
        {authTextMap.passwordRecovery.success.message}
        <strong>{userEmail}</strong>
      </AlertDescription>
    </Alert>

    <div>
      <span>{authTextMap.passwordRecovery.success.notReceived}</span>
      <Button variant="link">{authTextMap.passwordRecovery.success.resend}</Button>
    </div>

    <Button variant="link">{authTextMap.passwordRecovery.backToLogin}</Button>
  </CardContent>
</Card>
```

## 3. Component Variants and Customization

### Using Built-in Variants

#### Button Variants for Auth
```typescript
// Primary CTA (Login, Register, Submit)
<Button variant="default" size="default" className="w-full">
  {text}
</Button>

// Secondary action (Create Account on login page)
<Button variant="outline" className="w-full">
  {text}
</Button>

// Text links (Forgot password, Back to login)
<Button variant="link">
  {text}
</Button>

// Loading state
<Button disabled>
  <LoadingSpinner /> {text}
</Button>
```

#### Alert Variants
```typescript
// Success message
<Alert>
  <AlertDescription>{message}</AlertDescription>
</Alert>

// Error message
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>{error}</AlertDescription>
</Alert>
```

#### Input States
```typescript
// Default
<Input type="email" placeholder="..." />

// Error state (add custom class)
<Input className="border-red-600" aria-invalid="true" />

// Disabled state
<Input disabled />
```

### Custom Variants (Composition, NOT modification)

**NO modifications to `@/components/ui/` files needed.**

All customization will be done through:
1. **Tailwind classes**: `className` prop
2. **Composition**: Wrapping shadcn components in domain-specific molecules

**Example**: Password input with eye toggle will be a **molecule** that composes `Input` + toggle icon:

```typescript
// src/domains/auth/molecules/password-input.tsx
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export function PasswordInput({ ...props }) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        {...props}
      />
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-1/2 -translate-y-1/2"
        onClick={() => setShow(!show)}
      >
        {show ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  )
}
```

## 4. shadcn/ui Accessibility Features

### Built-in Accessibility (from Radix UI)

#### Button
- **Keyboard Navigation**: Tab, Enter, Space
- **ARIA Attributes**: `role="button"`, `aria-disabled`
- **Focus Management**: Automatic focus ring
- **Screen Reader**: Button text announced

#### Input
- **ARIA Attributes**: `aria-label`, `aria-invalid`, `aria-describedby`
- **Keyboard Navigation**: Standard text input
- **Screen Reader**: Label association via `htmlFor`

#### Checkbox
- **Keyboard Navigation**: Space to toggle, Tab to navigate
- **ARIA Attributes**: `role="checkbox"`, `aria-checked`
- **Focus Management**: Visible focus indicator
- **Screen Reader**: "Checkbox, checked/unchecked" announcement

#### Alert
- **ARIA Live Region**: `aria-live="polite"` (default) or `assertive` (errors)
- **Role**: `role="alert"`
- **Screen Reader**: Announces content changes

#### Separator
- **ARIA Role**: `role="separator"`
- **Screen Reader**: Announced as separator
- **Keyboard Navigation**: Not focusable (decorative)

### Accessibility Requirements for Auth Views

**These are HANDLED by shadcn/ui automatically**:

✅ **Form Labels**: Radix Label component handles `htmlFor` association
✅ **Keyboard Navigation**: All interactive elements are keyboard accessible
✅ **Focus Management**: Tab order is logical and visual focus is clear
✅ **Error Announcements**: Alert component uses aria-live regions
✅ **Input Validation**: aria-invalid attribute supported on Input

**Additional Requirements** (to be handled by parent agent during implementation):

1. **Form Structure**: Use `<form>` element with `role="form"` and `aria-label="Login form"`
2. **Error Messages**: Associate errors with inputs using `aria-describedby`
3. **Loading States**: Disable form during submission, announce state change
4. **Success Feedback**: Use Alert component for success messages (auto-announced)

## 5. Installation Verification

### Already Installed ✅

All required components are already installed:
- ✅ `button` exists at `@/components/ui/button.tsx`
- ✅ `input` exists at `@/components/ui/input.tsx`
- ✅ `card` exists at `@/components/ui/card.tsx`
- ✅ `label` exists at `@/components/ui/label.tsx`
- ✅ `separator` exists at `@/components/ui/separator.tsx`
- ✅ `checkbox` exists at `@/components/ui/checkbox.tsx`
- ✅ `alert` exists at `@/components/ui/alert.tsx`
- ✅ `select` exists at `@/components/ui/select.tsx` (bonus, not needed for 1A)

### No Installation Required

**Installation Command**: NONE - all components already available

## 6. Integration Notes

### Props to Configure

#### Button
- `variant`: "default" | "outline" | "ghost" | "link" | "destructive"
- `size`: "default" | "sm" | "lg"
- `disabled`: boolean (for loading states)
- `type`: "button" | "submit" | "reset"

#### Input
- `type`: "text" | "email" | "password"
- `placeholder`: string
- `autoComplete`: "email" | "current-password" | "new-password"
- `disabled`: boolean
- `aria-invalid`: boolean (for errors)
- `aria-describedby`: string (error message id)

#### Card
- `className`: for width constraints (e.g., "max-w-md")
- No specific configuration needed, composition-based

#### Label
- `htmlFor`: string (input id)
- `className`: for custom styling if needed

#### Checkbox
- `checked`: boolean
- `onCheckedChange`: (checked: boolean) => void
- `disabled`: boolean

#### Alert
- `variant`: "default" | "destructive"
- No event handlers needed (display only)

#### Separator
- `orientation`: "horizontal" | "vertical"
- `className`: for spacing

### Event Handlers Needed

**Note**: Phase 1A is UI-only, so event handlers will be placeholder functions.

#### Login Page
- `onSubmit`: Form submission (prevent default, show loading)
- `onClick`: "Forgot password" link navigation
- `onClick`: "Create account" link navigation
- `onCheckedChange`: Remember me checkbox

#### Register Page
- `onSubmit`: Form submission
- `onChange`: Password input (to update requirements validation)
- `onChange`: Confirm password (to check match)
- `onClick`: "Login" link navigation

#### Password Recovery
- `onSubmit`: Form submission (request reset)
- `onClick`: "Resend" button (success state)
- `onClick`: "Back to login" navigation

### Styling Considerations

#### Tailwind Classes for Auth Layout
```typescript
// Centered card container
<div className="min-h-screen flex items-center justify-center p-4">
  <Card className="w-full max-w-md">
    ...
  </Card>
</div>

// Form spacing
<div className="space-y-4">
  {/* form fields */}
</div>

// Field spacing
<div className="space-y-2">
  <Label>...</Label>
  <Input>...</Input>
</div>

// Full-width buttons
<Button className="w-full">...</Button>
```

#### CSS Variables
- **Dark Mode**: shadcn/ui supports dark mode automatically via CSS variables
- **Theme Customization**: If needed, modify `globals.css` variables (NOT component files)

#### Mobile Responsive
- **Mobile (< 640px)**: Card takes 90% width (`w-full max-w-md`)
- **Tablet/Desktop**: Card max-width 400-440px
- **Touch Targets**: Buttons already have minimum 44px height (shadcn default)

## 7. Custom Components Needed

### Domain-Specific Molecules (NOT shadcn modifications)

**These compose shadcn/ui components, they don't modify them.**

#### 1. `password-input.tsx` (domain: auth)
- **Purpose**: Input field with show/hide password toggle
- **Composition**:
  - `Input` from shadcn/ui (base)
  - `Button` from shadcn/ui (toggle icon)
  - `Eye` and `EyeOff` icons from Lucide React
- **Location**: `src/domains/auth/molecules/password-input.tsx`
- **Props**: Same as Input, plus optional `showToggle?: boolean`

#### 2. `password-requirements.tsx` (domain: auth)
- **Purpose**: Shows real-time password validation (Register page)
- **Composition**:
  - List of requirement text from `authTextMap.register.requirements`
  - Check icons (green) or X icons (gray) based on validation
  - Uses plain `<ul>` with Tailwind styling
- **Location**: `src/domains/auth/molecules/password-requirements.tsx`
- **Props**: `requirements: { minLength: boolean, hasLetter: boolean, hasNumber: boolean }`
- **Accessibility**: Each requirement has aria-label describing status

**Example**:
```typescript
export function PasswordRequirements({ requirements }) {
  return (
    <div className="space-y-1 text-sm">
      <p className="font-medium">{authTextMap.register.requirements.heading}</p>
      <ul className="space-y-1">
        <li className={requirements.minLength ? "text-green-600" : "text-gray-400"}>
          {requirements.minLength ? <Check size={16} /> : <X size={16} />}
          {authTextMap.register.requirements.minLength}
        </li>
        {/* ... other requirements */}
      </ul>
    </div>
  )
}
```

## 8. Important Notes

### Radix UI Primitives Used

**All shadcn/ui components for auth are built on these Radix primitives**:

- **Button**: Uses `@radix-ui/react-slot` (for composition)
- **Input**: HTML `<input>` with Tailwind styling (no Radix primitive)
- **Label**: `@radix-ui/react-label`
- **Checkbox**: `@radix-ui/react-checkbox`
- **Separator**: `@radix-ui/react-separator`
- **Alert**: HTML `<div>` with ARIA attributes (no Radix primitive)
- **Card**: HTML `<div>` with Tailwind styling (no Radix primitive)

**Accessibility is automatic** from Radix primitives - no additional work needed.

### Composition Over Modification

⚠️ **NEVER modify files in `@/components/ui/`**
✅ **ALWAYS compose** shadcn components in domain-specific molecules

**Example of CORRECT approach**:
```typescript
// src/domains/auth/molecules/auth-button.tsx
import { Button } from "@/components/ui/button"

export function AuthButton({ children, ...props }) {
  return (
    <Button className="w-full" variant="default" {...props}>
      {children}
    </Button>
  )
}
```

**Example of WRONG approach** ❌:
```typescript
// DON'T DO THIS - modifying ui/button.tsx
// src/components/ui/button.tsx
export function Button({ fullWidth, ...props }) {
  return <button className={fullWidth ? "w-full" : ""} ... />
}
```

### shadcn Component Registry

All components come from: https://ui.shadcn.com/docs/components

**Installation source**: `pnpm dlx shadcn@latest add {component}`

**Already installed components are immutable** - treat as external library.

## 9. Next Steps for Parent Agent

### Phase 1A Implementation Sequence

1. ✅ **Verify components exist** (already done - see section 5)
2. **Create auth layout**:
   - `src/app/(auth)/layout.tsx` - Centered card layout
3. **Create custom molecules**:
   - `src/domains/auth/molecules/password-input.tsx`
   - `src/domains/auth/molecules/password-requirements.tsx`
4. **Implement pages** (using shadcn components + custom molecules):
   - `src/app/(auth)/login/page.tsx`
   - `src/app/(auth)/register/page.tsx`
   - `src/app/(auth)/forgot-password/page.tsx`
5. **Test responsiveness**:
   - Mobile (< 640px)
   - Tablet (640px - 1024px)
   - Desktop (> 1024px)
6. **Test accessibility**:
   - Keyboard navigation (Tab order)
   - Screen reader announcements
   - Focus indicators visible
   - Error messages announced

### Testing Checklist

- [ ] All text comes from `authTextMap` (no hardcoded strings)
- [ ] Cards are centered and responsive
- [ ] Buttons have correct variants (default, outline, link)
- [ ] Inputs have proper autocomplete attributes
- [ ] Labels are associated with inputs (`htmlFor` matches `id`)
- [ ] Checkbox works with keyboard (Space to toggle)
- [ ] Alert component shows success/error states
- [ ] Password input toggle works (show/hide)
- [ ] Password requirements update in real-time (Register page)
- [ ] Focus order is logical (Email → Password → Submit)
- [ ] Loading states disable form during submission

## 10. Summary

### Components Confirmed Sufficient ✅

**ALL Phase 1A authentication views can be built with existing shadcn/ui components.**

**No new installations required.**

**Component Usage**:
- ✅ `button` - All CTAs, links, toggle buttons
- ✅ `input` - Email, password (base)
- ✅ `card` - Form containers
- ✅ `label` - All form labels
- ✅ `checkbox` - Remember me
- ✅ `separator` - Visual divider (login page)
- ✅ `alert` - Success/error messages

**Custom Components Needed** (composition only):
1. `password-input` - Input + eye toggle
2. `password-requirements` - Real-time validation display

**Radix Primitives Provide**:
- Keyboard navigation
- ARIA attributes
- Focus management
- Screen reader support

**Next**: Parent agent implements pages using these components.

---

**End of Plan**
