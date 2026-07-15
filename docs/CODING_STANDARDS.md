# 📝 KisanAI — Coding Standards & Contribution Conventions

> **Issue #52** · Maintainer: [@asheesh109](https://github.com/asheesh109) · Contact: ashishparab03@gmail.com

Consistent code and commit style reduces friction, speeds up code reviews, and makes the history of KisanAI readable for every contributor — from first-time open-source contributors to experienced engineers. This document is the single source of truth for all style, tooling, and workflow expectations.

---

## 📋 Table of Contents

1. [Commit Message Conventions](#-commit-message-conventions)
2. [Branch Naming Conventions](#-branch-naming-conventions)
3. [Code Style & Formatting](#-code-style--formatting)
4. [TypeScript Standards](#-typescript-standards)
5. [React & JSX Standards](#-react--jsx-standards)
6. [Naming Conventions](#-naming-conventions)
7. [File & Folder Organization](#-file--folder-organization)
8. [Comments & Documentation](#-comments--documentation)
9. [Error Handling](#-error-handling)
10. [Testing Standards](#-testing-standards)
11. [Performance Patterns](#-performance-patterns)
12. [Accessibility Standards](#-accessibility-standards)
13. [Security Practices](#-security-practices)
14. [Pre-commit Hook Setup](#-pre-commit-hook-setup)
15. [Pre-PR Checklist](#-pre-pr-checklist)
16. [Code Review Guidelines](#-code-review-guidelines)

---

## ✉️ Commit Message Conventions

KisanAI uses the **[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)** specification. Every commit message must be structured and machine-readable to power automated changelogs and semantic versioning.

### Format

```
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

### Types

| Type | When to use | Triggers version bump? |
|------|-------------|------------------------|
| `feat` | A new feature visible to users | ✅ Minor |
| `fix` | A bug fix | ✅ Patch |
| `docs` | Documentation only changes | ❌ |
| `style` | Formatting, missing semicolons, no logic change | ❌ |
| `refactor` | Code change that neither fixes a bug nor adds a feature | ❌ |
| `perf` | Performance improvement | ✅ Patch |
| `test` | Adding or correcting tests | ❌ |
| `chore` | Build process, dependency updates, tooling | ❌ |
| `ci` | CI configuration changes | ❌ |
| `revert` | Reverts a previous commit | ✅ Patch |
| `build` | Changes to the build system | ❌ |

### Scope (optional but recommended)

The scope should be the area of the codebase affected:

```
feat(crop-analysis): add Gemini Vision disease detection
fix(weather-api): handle timeout on slow connections
docs(readme): update local setup instructions
test(useWeather): add network-error test case
chore(deps): upgrade next to v16
```

Common KisanAI scopes: `crop-analysis`, `weather`, `market`, `auth`, `ui`, `api`, `i18n`, `voice`, `pwa`, `db`

### Rules

- **Subject line**: 50 characters or fewer
- **Imperative mood**: "add feature" not "added feature" or "adds feature"
- **No period** at the end of the subject
- **Body** (optional): Wrap at 72 characters; explain *what* and *why*, not *how*
- **Breaking changes**: Add `!` after the type/scope and a `BREAKING CHANGE:` footer

### Examples ✅

```
feat(crop-analysis): add Hindi-language disease report output

Gemini API now supports multi-lingual output. We pass the locale
from the user's language preference context so farmers receive
results in their native language.

Closes #42
```

```
fix(weather-api): handle timeout on 2G connections

Previously, the fetch call had no timeout, causing infinite loading
spinners on slow rural connections. Added AbortController with a
10s timeout.

Fixes #78
```

```
feat(auth)!: replace session cookies with JWT tokens

BREAKING CHANGE: All existing session cookies are invalidated.
Users must log in again after deploying this change.
```

```
docs(coding-standards): add commit conventions and pre-commit guide

Closes #52
```

### Examples ❌

```
fixed stuff
Updated README
WIP
asdfgh
commit
```

---

## 🌿 Branch Naming Conventions

Branch names must be lowercase, hyphen-separated, and prefixed with a category.

### Format

```
<category>/<short-description>
```

### Categories

| Category | Purpose | Example |
|----------|---------|---------|
| `feat/` | New feature | `feat/voice-crop-diagnosis` |
| `fix/` | Bug fix | `fix/weather-widget-crash` |
| `docs/` | Documentation | `docs/coding-standards-and-commit-conventions` |
| `refactor/` | Code restructure | `refactor/api-layer-abstraction` |
| `test/` | Tests only | `test/useweather-hook-coverage` |
| `chore/` | Tooling, deps | `chore/upgrade-eslint-v9` |
| `ci/` | CI/CD config | `ci/add-github-actions-lint` |
| `hotfix/` | Urgent production fix | `hotfix/market-api-null-crash` |
| `release/` | Release preparation | `release/v1.2.0` |

### Rules

- ✅ Use lowercase letters, numbers, and hyphens only
- ✅ Keep names short but descriptive (2–5 words)
- ✅ Reference issue number if applicable: `feat/voice-diagnosis-#42`
- ❌ No spaces, underscores, or uppercase letters
- ❌ Never commit directly to `main` or `develop`
- ❌ Avoid generic names like `my-branch`, `fix`, `update`

### Examples ✅

```
docs/coding-standards-and-commit-conventions
feat/gemini-multilingual-response
fix/market-price-null-pointer
test/crop-analysis-unit-tests
chore/prettier-config-setup
```

### Examples ❌

```
MyBranch
update_readme
fix
new feature
TEMP
```

---

## 🎨 Code Style & Formatting

### Tooling

KisanAI uses:
- **[ESLint](https://eslint.org/)** — static analysis (`next/core-web-vitals` + `next/typescript`)
- **[Prettier](https://prettier.io/)** — opinionated code formatter
- **[TypeScript](https://www.typescriptlang.org/)** — strict type checking

### Prettier Configuration

Create or confirm `.prettierrc` at the project root:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### ESLint Configuration

The project uses a flat ESLint config (`eslint.config.mjs`):

```js
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default eslintConfig;
```

### Running Checks Locally

```bash
# Lint your code
npm run lint

# Auto-fix lint issues
npm run lint -- --fix

# Format with Prettier
npm run format

# Type-check without emitting JS
npm run type-check
```

> **Before every commit**, run both `lint` and `type-check`. Never push code with TypeScript errors.

---

## 🔷 TypeScript Standards

### Always Use Explicit Types

```typescript
// ✅ Good: Explicit types
interface FarmerProfile {
  id: string;
  name: string;
  district: string;
  crops: string[];
  preferredLanguage: 'en' | 'hi' | 'mr' | 'pa' | 'te';
}

const getFarmerProfile = (farmerId: string): Promise<FarmerProfile> => {
  // implementation
};

// ❌ Bad: Using `any` defeats TypeScript's purpose
const getFarmerProfile = (farmerId: any): any => {
  // implementation
};
```

### Interfaces vs. Types

```typescript
// ✅ Use interfaces for object shapes (they support declaration merging)
interface CropAnalysisResult {
  disease: string;
  confidence: number;
  treatment: string;
  severity: 'low' | 'medium' | 'high';
}

// ✅ Use type aliases for unions, intersections, and primitives
type SupportedLocale = 'en' | 'hi' | 'mr' | 'pa' | 'te';
type ApiStatus = 'idle' | 'loading' | 'success' | 'error';
type Coordinates = [number, number];

// ✅ Extend interfaces instead of duplicating
interface DetailedAnalysis extends CropAnalysisResult {
  imageUrl: string;
  analyzedAt: Date;
}
```

### Generics

```typescript
// ✅ Good: Generic API response wrapper
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

const fetchData = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  const res = await fetch(endpoint);
  if (!res.ok) throw new ApiError(`HTTP ${res.status}`, res.status);
  return res.json();
};

// Usage
const crops = await fetchData<Crop[]>('/api/crops');
```

### Strict Mode

Ensure `tsconfig.json` has strict mode enabled:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

## ⚛️ React & JSX Standards

### Functional Components with TypeScript

```typescript
// ✅ Good
interface WeatherCardProps {
  temperature: number;
  location: string;
  humidity: number;
  onRefresh: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  location,
  humidity,
  onRefresh,
}) => {
  return (
    <div className="weather-card">
      <h2>{location}</h2>
      <p className="temperature">{temperature}°C</p>
      <p className="humidity">Humidity: {humidity}%</p>
      <button onClick={onRefresh} aria-label="Refresh weather data">
        Refresh
      </button>
    </div>
  );
};

// ❌ Bad: Class components (outdated in modern React)
class WeatherCard extends React.Component { /* ... */ }
```

### Custom Hooks

Extract stateful logic into custom hooks (files named `useXxx.ts`):

```typescript
// ✅ Good: Reusable, testable hook
const useWeather = (location: string) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;

    const controller = new AbortController();

    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getWeather(location, { signal: controller.signal });
        setWeather(data);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          setError('Failed to fetch weather data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
    return () => controller.abort(); // cleanup on unmount / location change
  }, [location]);

  return { weather, isLoading, error };
};
```

### Keys in Lists

```typescript
// ✅ Good: Use stable, unique IDs (never array index for dynamic lists)
const CropList: React.FC<{ crops: Crop[] }> = ({ crops }) => (
  <ul>
    {crops.map((crop) => (
      <li key={crop.id}>{crop.name}</li>
    ))}
  </ul>
);

// ❌ Bad: Index as key causes reconciliation bugs when list reorders
{crops.map((crop, index) => <li key={index}>{crop.name}</li>)}
```

---

## 🏷️ Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| Variables & functions | `camelCase` | `cropYieldPerHectare`, `fetchWeatherData` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_IMAGE_SIZE_MB`, `API_TIMEOUT_MS` |
| React components | `PascalCase` | `WeatherCard`, `CropAnalysisForm` |
| Interfaces & types | `PascalCase` | `FarmerProfile`, `ApiResponse` |
| Hooks | `camelCase` with `use` prefix | `useWeather`, `useSpeechRecognition` |
| Boolean variables | `is/has/can` prefix | `isLoading`, `hasError`, `canEdit` |
| Event handlers | `handle` prefix | `handleClick`, `handleFormSubmit` |
| Files (components) | `PascalCase.tsx` | `WeatherCard.tsx` |
| Files (hooks/utils) | `camelCase.ts` | `useWeather.ts`, `validators.ts` |
| CSS modules | `camelCase` selectors | `.weatherCard`, `.primaryButton` |

```typescript
// ✅ Good examples
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;  // UPPER_SNAKE_CASE constant
const isVoiceEnabled = true;               // Boolean prefix
const handleFormSubmit = (data: FormData) => {};  // Event handler
const fetchCropData = async () => {};      // Async function

// ❌ Bad examples
const maxsize = 5000000;     // No convention
const loading = false;       // Ambiguous boolean
const onClick = () => {};    // No 'handle' prefix
const FetchData = () => {};  // PascalCase for function
```

---

## 📁 File & Folder Organization

```
src/
├── app/                        # Next.js App Router pages
│   ├── (public)/               # Route group — public pages
│   │   ├── page.tsx            # Home page
│   │   └── layout.tsx
│   ├── (auth)/                 # Route group — authenticated pages
│   ├── api/                    # API routes
│   │   └── [route]/
│   │       └── route.ts
│   └── layout.tsx              # Root layout
│
├── components/
│   ├── ui/                     # Reusable primitive UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── layout/                 # Layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── [feature]/              # Feature-specific components
│       ├── WeatherCard.tsx
│       └── __tests__/
│           └── WeatherCard.test.tsx
│
├── hooks/                      # Custom React hooks
│   ├── useWeather.ts
│   ├── useSpeechRecognition.ts
│   └── __tests__/
│
├── lib/                        # Pure utilities, clients, helpers
│   ├── gemini.ts               # Gemini API client
│   ├── mongodb.ts              # Database connection
│   └── validators.ts
│
├── types/                      # Global TypeScript types
│   ├── index.ts                # Re-exports
│   ├── api.ts
│   └── models.ts
│
├── constants/                  # App-wide constants
│   ├── api.ts
│   └── messages.ts
│
└── contexts/                   # React context providers
    ├── LanguageContext.tsx
    └── AuthContext.tsx
```

### Import Order

Always organize imports in the following order (ESLint `import/order` enforces this):

```typescript
// 1. Node built-ins
import path from 'path';

// 2. External packages
import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 3. Internal aliases (@ paths)
import { Button } from '@/components/ui/Button';
import { useWeather } from '@/hooks/useWeather';
import { API_TIMEOUT_MS } from '@/constants/api';
import { WeatherData } from '@/types/models';

// 4. Relative imports
import { formatTemperature } from './utils';

// 5. Style imports (last)
import styles from './WeatherCard.module.css';
```

---

## 💬 Comments & Documentation

### Write *Why*, Not *What*

```typescript
// ✅ Good: Explains reasoning
// Limit image size to prevent OOM crashes on 1GB-RAM devices common in rural India
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// Regex ensures state-based farmer IDs: e.g., MH123456, UP987654
const FARMER_ID_REGEX = /^[A-Z]{2}\d{6}$/;

// ❌ Bad: Redundant — the code already says this
const MAX_SIZE = 5242880; // max image size in bytes
const regex = /^[A-Z]{2}\d{6}$/; // regex pattern
```

### JSDoc for All Public Functions

```typescript
/**
 * Analyzes a crop image for diseases using Google Gemini Vision API.
 *
 * @param imageFile - The image file to analyze (max 5 MB)
 * @param locale    - Language for the response ('en' | 'hi' | 'mr')
 * @returns Promise resolving to a disease analysis with treatment advice
 * @throws {ValidationError} When the image exceeds the size limit
 * @throws {ApiError}        When the Gemini API returns a non-2xx response
 *
 * @example
 * ```ts
 * const result = await analyzeCropDisease(file, 'hi');
 * console.log(result.disease);   // "पाउडरी मिल्ड्यू"
 * console.log(result.treatment); // "नीम आधारित कवकनाशी का उपयोग करें"
 * ```
 */
export const analyzeCropDisease = async (
  imageFile: File,
  locale: SupportedLocale = 'en'
): Promise<CropAnalysisResult> => {
  // implementation
};
```

---

## 🚨 Error Handling

### Specific Error Classes

```typescript
// ✅ Good: Typed, named custom errors
export class ValidationError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ApiError extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### Try-Catch Pattern

```typescript
// ✅ Good: Handle each error type specifically
try {
  const result = await fetchWeather(location);
  setWeather(result);
} catch (error) {
  if (error instanceof ValidationError) {
    setError('Invalid location. Please check the name and try again.');
  } else if (error instanceof ApiError && error.statusCode === 429) {
    setError('Rate limit reached. Please wait a moment and retry.');
  } else if (error instanceof ApiError) {
    setError(`Service error (${error.statusCode}). Please try again.`);
  } else {
    setError('An unexpected error occurred. Please refresh the page.');
    console.error('[WeatherFetch] Unknown error:', error);
  }
}

// ❌ Bad: Swallowed or overly generic errors
try {
  const result = await fetchWeather(location);
  setWeather(result);
} catch {
  // silently ignored — never do this
}
```

---

## 🧪 Testing Standards

### Test File Location

Place test files next to the source file in a `__tests__` folder:

```
components/
└── WeatherCard/
    ├── WeatherCard.tsx
    └── __tests__/
        └── WeatherCard.test.tsx
```

### Naming Convention

```typescript
// ✅ Good: Descriptive, behaviour-driven names
describe('WeatherCard', () => {
  describe('rendering', () => {
    it('should display the location name', () => {});
    it('should display temperature in °C', () => {});
  });

  describe('interactions', () => {
    it('should call onRefresh when the Refresh button is clicked', () => {});
    it('should show loading spinner while data is being fetched', () => {});
  });

  describe('error states', () => {
    it('should display an error message on API failure', () => {});
  });
});

// ❌ Bad: Vague names
it('works', () => {});
it('test1', () => {});
it('renders', () => {});
```

### Running Tests

```bash
# Run all tests once
npm test

# Run in watch mode during development
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests in CI mode (no watch, with coverage)
npm run test:ci
```

> **Minimum coverage target**: 70% for new features. Do not reduce existing coverage.

---

## ⚡ Performance Patterns

```typescript
// ✅ useMemo for expensive derived values
const sortedCrops = useMemo(
  () => [...crops].sort((a, b) => a.name.localeCompare(b.name, 'hi')),
  [crops]
);

// ✅ useCallback for stable function references passed as props
const handleDelete = useCallback(
  (id: string) => deleteCrop(id),
  [deleteCrop]
);

// ✅ React.memo to prevent unnecessary re-renders
export const CropCard = React.memo<CropCardProps>(({ crop, onSelect }) => {
  return <div onClick={() => onSelect(crop.id)}>{crop.name}</div>;
});

// ✅ Dynamic imports for heavy components
const DiseaseReport = dynamic(() => import('./DiseaseReport'), {
  loading: () => <Skeleton />,
  ssr: false,
});
```

---

## ♿ Accessibility Standards

```typescript
// ✅ Always provide ARIA labels on icon-only buttons
<button
  onClick={toggleListening}
  aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
  aria-pressed={isListening}
>
  <MicIcon aria-hidden="true" />
</button>

// ✅ Use semantic HTML elements
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/crops">Crop Analysis</a></li>
    </ul>
  </nav>
</header>

// ✅ Associate form labels
<label htmlFor="location-input">Location</label>
<input
  id="location-input"
  type="text"
  placeholder="e.g., Nashik, Maharashtra"
  aria-describedby="location-hint"
/>
<span id="location-hint">Enter your district or city name</span>
```

---

## 🔒 Security Practices

### Environment Variables

```bash
# .env.local — NEVER commit this file
GEMINI_API_KEY=your_secret_key_here          # server-only
MONGODB_URI=mongodb+srv://...               # server-only

# NEXT_PUBLIC_ prefix ONLY for values safe to expose to the browser
NEXT_PUBLIC_APP_URL=https://kisanai.vercel.app
```

```typescript
// ✅ Server-only secrets — use only in API routes / Server Components
const geminiKey = process.env.GEMINI_API_KEY;

// ✅ Public config — safe for client bundles
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

// ❌ Never access server secrets in client components
```

### Input Validation

```typescript
// ✅ Validate before processing
const searchCrops = (query: string): Promise<Crop[]> => {
  if (!query || query.trim().length === 0) {
    throw new ValidationError('Search query is required', 'EMPTY_QUERY');
  }
  if (query.length > 100) {
    throw new ValidationError('Query must be 100 characters or fewer', 'QUERY_TOO_LONG');
  }
  return fetchCrops(sanitize(query));
};
```

---

## 🪝 Pre-commit Hook Setup

Pre-commit hooks automatically run linting and formatting checks **before every commit**, preventing broken code from entering the repository.

### 1. Install Husky and lint-staged

```bash
npm install --save-dev husky lint-staged
```

### 2. Initialize Husky

```bash
npx husky init
```

This creates a `.husky/` directory and adds a `prepare` script to `package.json`.

### 3. Configure the pre-commit hook

Edit `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### 4. Configure lint-staged in `package.json`

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{js,jsx,mjs}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ],
    "*.{css,scss}": [
      "prettier --write"
    ]
  }
}
```

### 5. Full `package.json` scripts block (after setup)

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "prepare": "husky"
  }
}
```

### 6. Add a commit-msg hook (optional but recommended)

Enforce Conventional Commits format using `commitlint`:

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

Create `commitlint.config.js`:

```js
/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'ci', 'revert', 'build'],
    ],
    'subject-max-length': [2, 'always', 72],
    'subject-case': [2, 'always', 'lower-case'],
  },
};
```

Add the commit-msg hook:

```bash
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

### Example: What happens on `git commit`

```
$ git commit -m "feat(crop-analysis): add multilingual disease report"

✔ lint-staged: Running ESLint on 3 files...
✔ lint-staged: Running Prettier on 3 files...
✔ commitlint: Commit message passes Conventional Commits rules

[docs/coding-standards #abc1234] feat(crop-analysis): add multilingual disease report
```

```
$ git commit -m "fixed stuff"

✖ commitlint: subject may not be empty
✖ commitlint: type must be one of: feat, fix, docs ...

husky - commit-msg hook exited with code 1 (error)
```

---

## ✅ Pre-PR Checklist

Before opening a Pull Request, verify **every item** in this checklist:

### Code Quality
- [ ] `npm run lint` passes with **zero errors**
- [ ] `npm run type-check` passes with **zero TypeScript errors**
- [ ] `npm run format:check` passes (no unformatted files)
- [ ] No `console.log` statements left in production code
- [ ] No `// TODO` comments unless tracked in an issue

### Testing
- [ ] New features have corresponding unit/integration tests
- [ ] All existing tests still pass (`npm test`)
- [ ] Coverage has not decreased (`npm run test:coverage`)

### Documentation
- [ ] New public functions have JSDoc comments
- [ ] `README.md` updated if user-facing behavior changed
- [ ] API changes reflected in `docs/api/`

### Conventions
- [ ] Branch name follows `<category>/short-description` pattern
- [ ] All commit messages follow Conventional Commits
- [ ] No `any` types introduced without a justification comment

### PR Description
- [ ] PR title follows Conventional Commits format: `type(scope): description`
- [ ] PR description explains **what** was changed and **why**
- [ ] Linked to the issue number (`Closes #52`)
- [ ] Screenshots/GIFs attached if UI was changed

---

## 👀 Code Review Guidelines

### For Authors

- Keep PRs small and focused — one feature or fix per PR
- Self-review your diff before requesting review
- Respond to all comments before marking conversations resolved
- Avoid force-pushing after review has started (use new commits)

### For Reviewers

- Review within **48 hours** of the PR being opened
- Use clear, constructive language — critique the code, not the author
- Distinguish between **blocking** and **non-blocking** feedback:
  - `[blocking]` — must be addressed before merge
  - `[nit]` — minor suggestion, author's discretion
  - `[question]` — seeking understanding, not requiring change
- Approve only when all blocking comments are resolved

### Merge Strategy

- Use **Squash and Merge** for feature/fix branches to keep `main` history clean
- Use **Merge Commit** only for release branches
- Never force-push to `main` or `develop`

---

## 📚 Additional Resources

| Resource | Link |
|----------|------|
| Conventional Commits Specification | https://www.conventionalcommits.org |
| Semantic Versioning | https://semver.org |
| Next.js Documentation | https://nextjs.org/docs |
| TypeScript Handbook | https://www.typescriptlang.org/docs/ |
| ESLint Docs | https://eslint.org/docs/latest/ |
| Prettier Docs | https://prettier.io/docs/en/ |
| Husky Docs | https://typicode.github.io/husky/ |
| lint-staged Docs | https://github.com/okonet/lint-staged |
| commitlint Docs | https://commitlint.js.org |
| WCAG 2.1 Accessibility | https://www.w3.org/TR/WCAG21/ |
| React Testing Library | https://testing-library.com/docs/react-testing-library/intro/ |

---

<div align="center">

**Questions or suggestions?** Open a [Discussion](https://github.com/asheesh109/KisanAI/discussions) or reach out to the maintainer at ashishparab03@gmail.com.

Made with ❤️ for the KisanAI community · GSSoC '26

</div>
