# Code Style & Formatting Rules

**Mandatory code style and formatting standards enforced by ESLint and Prettier.**

---

## 1. Prettier Configuration

All code MUST be formatted according to these Prettier rules:

### Basic Formatting

✅ **ALWAYS**:
- Use **2 spaces** for indentation (never tabs)
- Add **semicolons** at the end of statements
- Use **single quotes** for strings (except JSX attributes)
- Use **double quotes** for JSX attributes
- **No trailing commas** in objects, arrays, or function parameters
- Arrow functions: **avoid parentheses** when possible (`x => x` not `(x) => x`)
- Tailwind classes automatically sorted by `prettier-plugin-tailwindcss`

**Correct examples**:

```tsx
// ✅ Single quotes for strings
const message = 'Hello world';

// ✅ Double quotes in JSX
<Button className="btn-primary" aria-label="Submit form" />

// ✅ Arrow function without parentheses (single param)
const double = x => x * 2;

// ✅ Arrow function with parentheses (multiple params or no params)
const sum = (a, b) => a + b;
const greet = () => 'Hello';

// ✅ No trailing commas
const user = {
  name: 'John',
  age: 30
};

const numbers = [1, 2, 3];

function example(a, b, c) {
  return a + b + c;
}

// ✅ Semicolons always
const value = 42;
```

**Incorrect examples**:

```tsx
// ❌ Wrong: Double quotes for regular strings
const message = "Hello world";

// ❌ Wrong: Single quotes in JSX
<Button className='btn-primary' />

// ❌ Wrong: Unnecessary parentheses
const double = (x) => x * 2;

// ❌ Wrong: Trailing commas
const user = {
  name: 'John',
  age: 30,
};

// ❌ Wrong: Missing semicolons
const value = 42
```

---

## 2. ESLint Rules

### TypeScript Rules

✅ **ALWAYS**:
- **No unused variables** - Remove or prefix with underscore
- **No explicit `any` type** - Use proper types or `unknown`
- Use TypeScript strict mode

**Correct examples**:

```tsx
// ✅ All variables used
const userName = 'John';
console.log(userName);

// ✅ Prefix unused params with underscore
function handleClick(_event: React.MouseEvent) {
  console.log('clicked');
}

// ✅ Proper types instead of any
function processData(data: User[]): string[] {
  return data.map(user => user.name);
}

// ✅ Use unknown for truly unknown types
function parseJSON(text: string): unknown {
  return JSON.parse(text);
}
```

**Incorrect examples**:

```tsx
// ❌ Unused variable
const userName = 'John';
const userAge = 30; // Error: userAge is never used

// ❌ Using explicit any
function processData(data: any) { // Error: explicit any not allowed
  return data;
}

// ❌ Implicit any in catch
try {
  // code
} catch (error) { // Error: implicit any type
  console.log(error);
}

// ✅ Correct: Type the error
try {
  // code
} catch (error) {
  const err = error as Error;
  console.log(err.message);
}
```

### React & JSX Rules

✅ **ALWAYS**:
- Use **double quotes** for JSX attributes
- Properly escape entities or use proper quote types
- No custom fonts in pages (use Next.js font optimization)

**Correct examples**:

```tsx
// ✅ Double quotes in JSX
<Button className="primary" onClick={handleClick}>
  Click me
</Button>

// ✅ Proper apostrophe handling
<p>Don&apos;t use unescaped quotes</p>
<p>{"Don't use unescaped quotes"}</p>

// ✅ Next.js font optimization
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
```

**Incorrect examples**:

```tsx
// ❌ Single quotes in JSX
<Button className='primary' />

// ❌ Unescaped apostrophes
<p>Don't do this</p> // Error: unescaped entity

// ❌ Custom fonts in page
<link href="https://fonts.googleapis.com/..." /> // Error
```

### JavaScript/General Rules

✅ **ALWAYS**:
- **Semicolons required** - Always end statements with `;`
- **camelCase** for variable names (exceptions: `api_url`, `Geist_Mono`)
- **Avoid console statements** in production code (warnings only)
- **No trailing commas** in function parameters
- **No space before function parentheses** (except async/generator)

**Correct examples**:

```tsx
// ✅ Semicolons
const value = 42;
const result = calculate();

// ✅ camelCase naming
const userName = 'John';
const isActive = true;
const getUserData = () => {};

// ✅ Allowed exceptions
const apiUrl = 'https://api.example.com'; // api_url allowed
const Geist_Mono = Font(); // Geist_Mono allowed

// ✅ No console in production (use proper logging)
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info');
}

// ✅ Function definitions
function calculate() {
  return 42;
}

const sum = (a, b) => a + b;

async function fetchData() {
  return await api.get();
}

// ✅ No trailing commas in parameters
function example(a, b, c) {
  return a + b + c;
}
```

**Incorrect examples**:

```tsx
// ❌ Missing semicolons
const value = 42
const result = calculate()

// ❌ Wrong naming conventions
const user_name = 'John'; // Error: use camelCase
const IsActive = true; // Error: variables should start lowercase

// ❌ Console.log in code
console.log('User data:', data); // Warning: no console

// ❌ Space before function parens
function calculate () { // Error: no space before ()
  return 42;
}

// ❌ Trailing comma in function params
function example(
  a,
  b,
  c, // Error: no trailing comma
) {
  return a + b + c;
}
```

### Disabled Rules (Special Cases)

These rules are **intentionally disabled** in specific contexts:

1. **`space-before-function-paren`**: Disabled to allow flexibility in function declarations
2. **`no-unused-vars`**: Disabled in favor of TypeScript's rule (`@typescript-eslint/no-unused-vars`)

---

## 3. File & Component Ignores

**Automatically ignored from linting**:
- `./src/components/ui/**` - shadcn/ui components are pre-built and shouldn't be modified

---

## 4. Quick Reference Checklist

Before committing code, verify:

- [ ] Code formatted with Prettier (run `npm run format`)
- [ ] No ESLint errors (run `npm run lint`)
- [ ] Single quotes for strings, double quotes for JSX attributes
- [ ] Semicolons at end of statements
- [ ] No trailing commas
- [ ] Arrow functions use minimal parentheses
- [ ] No unused variables (remove or prefix with `_`)
- [ ] No `any` types (use proper types or `unknown`)
- [ ] camelCase naming (except allowed exceptions)
- [ ] No console.log statements
- [ ] Tailwind classes sorted automatically

---

## 5. IDE Setup

### VSCode Settings (Recommended)

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### Useful Scripts

```bash
# Format all files
npm run format

# Check formatting without fixing
npm run format:check

# Lint and fix
npm run lint

# Lint without fixing
npm run lint:check
```

---

## 6. Common Violations & Fixes

### Violation: Unused Variable

```tsx
// ❌ Error
const userName = 'John';
const userAge = 30; // unused

// ✅ Fix 1: Use it
const userName = 'John';
const userAge = 30;
console.log(userName, userAge);

// ✅ Fix 2: Remove it
const userName = 'John';

// ✅ Fix 3: Prefix with _ if needed for future
const userName = 'John';
const _userAge = 30; // ok to be unused
```

### Violation: Explicit Any

```tsx
// ❌ Error
function processData(data: any) {
  return data;
}

// ✅ Fix: Use proper type
function processData(data: User[]) {
  return data;
}

// ✅ Fix: Use generic
function processData<T>(data: T) {
  return data;
}

// ✅ Fix: Use unknown if truly unknown
function processData(data: unknown) {
  if (isUser(data)) {
    return data;
  }
}
```

### Violation: Console Statement

```tsx
// ❌ Warning
console.log('Debug:', data);

// ✅ Fix 1: Remove it
// (just remove the console.log)

// ✅ Fix 2: Use in development only
if (process.env.NODE_ENV === 'development') {
  console.log('Debug:', data);
}

// ✅ Fix 3: Use proper error handling
try {
  // code
} catch (error) {
  console.error('Error:', error); // console.error is allowed for errors
}
```

### Violation: Quote Style

```tsx
// ❌ Error: Wrong quotes
const message = "Hello";
<Button className='primary' />

// ✅ Fix
const message = 'Hello';
<Button className="primary" />
```

---

## Verification Checklist for Agents

Before generating or modifying code:

- [ ] I will use single quotes for all strings
- [ ] I will use double quotes for JSX attributes
- [ ] I will add semicolons to all statements
- [ ] I will avoid trailing commas
- [ ] I will use minimal parentheses in arrow functions
- [ ] I will remove all unused variables or prefix with `_`
- [ ] I will never use `any` type (use proper types or `unknown`)
- [ ] I will use camelCase for all names (except allowed exceptions)
- [ ] I will not add console.log statements
- [ ] I will let Prettier sort Tailwind classes automatically
