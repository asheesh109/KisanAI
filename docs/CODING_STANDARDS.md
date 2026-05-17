# Coding Standards 📝

Guidelines for writing code in KisanAI that is consistent, maintainable, and high-quality.

---

## 📋 Table of Contents

1. [TypeScript](#typescript)
2. [React & JSX](#react--jsx)
3. [Naming Conventions](#naming-conventions)
4. [File Organization](#file-organization)
5. [Comments & Documentation](#comments--documentation)
6. [Error Handling](#error-handling)
7. [Testing](#testing)
8. [Performance](#performance)
9. [Accessibility](#accessibility)
10. [Security](#security)

---

## TypeScript

### Type Definitions

```typescript
// ✅ Good: Explicit types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
}

type UserRole = 'admin' | 'contributor' | 'viewer';

const getUserProfile = (userId: string): Promise<UserProfile> => {
  // implementation
};

// ❌ Bad: Using any
const getUserProfile = (userId: any): any => {
  // implementation
};
```

### Interfaces vs Types

```typescript
// ✅ Use interfaces for objects
interface ComponentProps {
  title: string;
  onClick: () => void;
}

// ✅ Use types for unions/primitives
type Status = 'loading' | 'success' | 'error';
type Coordinates = [number, number];

// ✅ Extend interfaces
interface ExtendedProps extends ComponentProps {
  disabled?: boolean;
}
```

### Function Types

```typescript
// ✅ Good: Clear parameter and return types
const calculateYield = (
  cropType: string,
  rainfall: number,
  temperature: number
): number => {
  return rainfall * 0.5 + temperature * 0.3;
};

const processWeatherData = async (
  location: string
): Promise<WeatherData[]> => {
  // implementation
};

// ❌ Bad: Unclear types
const calculate = (a, b, c) => {
  return a * 0.5 + b * 0.3;
};
```

### Generics

```typescript
// ✅ Good: Reusable with generics
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message: string;
}

const fetchData = async <T,>(
  endpoint: string
): Promise<ApiResponse<T>> => {
  // implementation
};

// Usage:
const crops = await fetchData<Crop[]>('/api/crops');
```

---

## React & JSX

### Functional Components

```typescript
// ✅ Good: Functional component with TypeScript
interface WeatherCardProps {
  temperature: number;
  location: string;
  onRefresh: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  location,
  onRefresh,
}) => {
  return (
    <div className="weather-card">
      <h2>{location}</h2>
      <p className="temperature">{temperature}°C</p>
      <button onClick={onRefresh}>Refresh</button>
    </div>
  );
};

// ❌ Bad: Class component (outdated)
class WeatherCard extends React.Component {
  // implementation
}
```

### Hooks Usage

```typescript
// ✅ Good: Custom hooks
const useWeather = (location: string) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      const data = await getWeather(location);
      setWeather(data);
      setLoading(false);
    };

    fetchWeather();
  }, [location]);

  return { weather, loading };
};

// Usage
const { weather, loading } = useWeather('Mumbai');

// ❌ Bad: Logic in component
export const WeatherComponent = ({ location }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // Fetch logic directly in component
    getWeather(location).then(setWeather);
  }, [location]);
};
```

### Props Management

```typescript
// ✅ Good: Destructured props with types
interface FormProps {
  initialValue?: string;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export const Form: React.FC<FormProps> = ({
  initialValue = '',
  onSubmit,
  disabled = false,
  error,
}) => {
  // implementation
};

// ❌ Bad: Props object without destructuring
const Form = (props) => {
  return <input value={props.initialValue} />;
};
```

### Keys in Lists

```typescript
// ✅ Good: Use unique, stable IDs
const CropList: React.FC<{ crops: Crop[] }> = ({ crops }) => {
  return (
    <ul>
      {crops.map((crop) => (
        <li key={crop.id}>{crop.name}</li>
      ))}
    </ul>
  );
};

// ❌ Bad: Using array index as key
{
  crops.map((crop, index) => <li key={index}>{crop.name}</li>);
}

// ❌ Bad: No key at all
{
  crops.map((crop) => <li>{crop.name}</li>);
}
```

---

## Naming Conventions

### Constants

```typescript
// ✅ Good: UPPER_SNAKE_CASE
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const API_TIMEOUT_MS = 5000;
const SUPPORTED_LANGUAGES = ['en', 'hi', 'mr'];
```

### Variables & Functions

```typescript
// ✅ Good: camelCase
const userName = 'John Farmer';
const cropYieldPerHectare = 25;

const calculateYield = () => {};
const fetchWeatherData = async () => {};
```

### Components & Types

```typescript
// ✅ Good: PascalCase
const WeatherCard = () => {};
const CropAnalysisForm = () => {};

interface UserProfile {}
type WeatherData = {};
enum CropType {}
```

### Boolean Variables

```typescript
// ✅ Good: prefix with is/has/can
const isLoading = false;
const hasError = true;
const canEdit = true;
const isVoiceEnabled = true;

// ❌ Bad: ambiguous names
const loading = false;
const error = true;
const editable = true;
```

### Event Handlers

```typescript
// ✅ Good: prefix with handle
const handleClick = () => {};
const handleInputChange = (value: string) => {};
const handleFormSubmit = (data: FormData) => {};

// ❌ Bad: unclear purpose
const onClick = () => {};
const onChange = () => {};
```

---

## File Organization

### Folder Structure

```
src/
├── app/                          # Next.js pages
│   ├── page.jsx                 # Home page
│   ├── layout.jsx               # Root layout
│   ├── [feature]/
│   │   ├── page.jsx            # Feature page
│   │   └── layout.jsx          # Feature layout
│   └── api/                     # API routes
│       └── [route]/
│           └── route.ts
│
├── components/
│   ├── ui/                      # Reusable UI
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── [components]/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   └── [feature]/               # Feature-specific
│       ├── WeatherCard.tsx
│       ├── WeatherWidget.tsx
│       └── __tests__/
│           ├── WeatherCard.test.tsx
│           └── WeatherWidget.test.tsx
│
├── hooks/
│   ├── useWeather.ts
│   ├── useSpeechRecognition.js
│   └── __tests__/
│       ├── useWeather.test.ts
│       └── useSpeechRecognition.test.js
│
├── lib/
│   ├── api.ts                   # API client
│   ├── mongodb.ts              # Database
│   ├── validators.ts           # Validation
│   └── [utilities]/
│
├── types/
│   ├── index.ts                # Exported types
│   ├── api.ts
│   ├── models.ts
│   └── [domain]/
│
├── constants/
│   ├── index.ts
│   ├── api.ts
│   ├── messages.ts
│   └── [feature]/
│
├── contexts/
│   ├── LanguageContext.tsx
│   ├── UserContext.tsx
│   └── [contexts]/
│
└── __tests__/
    ├── components/
    ├── hooks/
    ├── lib/
    └── pages/
```

### Import Organization

```typescript
// ✅ Good: Organized imports
import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { WeatherCard } from '@/components/Weather';
import { useWeather } from '@/hooks/useWeather';
import { API_BASE_URL } from '@/constants/api';
import { WeatherData } from '@/types/weather';

import styles from './styles.module.css';

// ❌ Bad: Random order
import styles from './styles.module.css';
import { WeatherData } from '@/types/weather';
import { FC } from 'react';
import { Button } from '@/components/ui/Button';
```

---

## Comments & Documentation

### Code Comments

```typescript
// ✅ Good: Explains WHY, not WHAT
// Limit image size to prevent memory issues on older mobile devices
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// This regex ensures farmer IDs follow state-based format
const FARMER_ID_REGEX = /^[A-Z]{2}\d{6}$/;

// ❌ Bad: Obvious from code
const MAX_SIZE = 5242880; // max image size
const regex = /^[A-Z]{2}\d{6}$/; // regex pattern
```

### JSDoc Comments

```typescript
// ✅ Good: Complete documentation
/**
 * Analyzes crop disease from image using Google Gemini API
 * @param imageFile - Image file to analyze
 * @param locale - Language for results ('en' | 'hi')
 * @returns Promise with disease analysis and treatment
 * @throws {ValidationError} If image is too large
 * @throws {ApiError} If Gemini API call fails
 * @example
 * const result = await analyzeCropDisease(file, 'hi');
 * console.log(result.disease, result.confidence);
 */
const analyzeCropDisease = async (
  imageFile: File,
  locale: 'en' | 'hi' = 'en'
): Promise<CropAnalysisResult> => {
  // implementation
};

// ❌ Bad: Missing documentation
const analyze = (file) => {
  // implementation
};
```

---

## Error Handling

### Try-Catch Blocks

```typescript
// ✅ Good: Specific error handling
try {
  const result = await fetchWeather(location);
  setWeather(result);
} catch (error) {
  if (error instanceof ValidationError) {
    setError('Invalid location format');
  } else if (error instanceof NetworkError) {
    setError('Network error. Please try again.');
  } else if (error instanceof ApiError) {
    setError(`API error: ${error.message}`);
  } else {
    setError('An unexpected error occurred');
  }
}

// ❌ Bad: Generic catch
try {
  const result = await fetchWeather(location);
  setWeather(result);
} catch (error) {
  setError('Error occurred');
}

// ❌ Bad: Swallow errors
try {
  const result = await fetchWeather(location);
  setWeather(result);
} catch {
  // Silently fail
}
```

### Custom Error Classes

```typescript
// ✅ Good: Custom errors
class ValidationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class ApiError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'ApiError';
  }
}
```

---

## Testing

### Test Structure

```typescript
// ✅ Good: Clear test organization
describe('useWeather Hook', () => {
  describe('successful fetch', () => {
    it('should fetch weather data for given location', async () => {
      const { result } = renderHook(() => useWeather('Mumbai'));
      
      await waitFor(() => {
        expect(result.current.weather).toBeDefined();
      });
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      const { result } = renderHook(() => useWeather('Invalid'));
      
      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });
  });
});
```

### Test Naming

```typescript
// ✅ Good: Clear, descriptive names
it('should display loading spinner while fetching weather', () => {});
it('should show error message on API failure', () => {});
it('should update weather when location changes', () => {});

// ❌ Bad: Unclear names
it('works', () => {});
it('test loading', () => {});
```

---

## Performance

### Optimization Patterns

```typescript
// ✅ Good: useMemo for expensive calculations
const MemoizedWeatherCard = React.memo(({ data }) => {
  const analysis = useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);

  return <div>{analysis}</div>;
});

// ✅ Good: useCallback for stable functions
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### Lazy Loading

```typescript
// ✅ Good: Code splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'));

export const Page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
};
```

---

## Accessibility

### ARIA Labels

```typescript
// ✅ Good: ARIA labels
const VoiceButton = () => {
  const [isListening, setIsListening] = useState(false);

  return (
    <button
      onClick={() => setIsListening(!isListening)}
      aria-label={isListening ? 'Stop listening' : 'Start listening'}
      aria-pressed={isListening}
      className="voice-button"
    >
      <Icon name={isListening ? 'mic-on' : 'mic-off'} />
    </button>
  );
};
```

### Semantic HTML

```typescript
// ✅ Good: Semantic elements
export const Header = () => {
  return (
    <header className="app-header">
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/crops">Crops</a></li>
        </ul>
      </nav>
    </header>
  );
};

// ❌ Bad: Generic divs
const Header = () => {
  return (
    <div className="header">
      <div className="nav">
        <div className="nav-link">Home</div>
      </div>
    </div>
  );
};
```

---

## Security

### Input Validation

```typescript
// ✅ Good: Validate all inputs
const searchCrops = (query: string) => {
  if (!query || query.trim().length === 0) {
    throw new ValidationError('Search query required');
  }

  if (query.length > 100) {
    throw new ValidationError('Query too long');
  }

  return fetchCrops(query);
};

// ✅ Good: Sanitize outputs
const displayUserComment = (comment: string) => {
  // Escape HTML entities
  return <div>{sanitizeHtml(comment)}</div>;
};
```

### Environment Variables

```typescript
// ✅ Good: Only expose necessary variables
// NEXT_PUBLIC_ prefix only for client-side safe variables
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Server-side secrets never in client code
// Only use in API routes or server components
const dbPassword = process.env.MONGODB_PASSWORD;
```

---

## Linting & Formatting

### ESLint

```bash
# Check style
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Prettier

```bash
# Format code
npm run format
```

---

## Code Review Checklist

- [ ] Types are explicit (no `any`)
- [ ] Naming is clear and follows conventions
- [ ] Functions are small and focused
- [ ] Error handling is comprehensive
- [ ] Tests cover happy path and errors
- [ ] Comments explain "why", not "what"
- [ ] No console.logs (except in dev)
- [ ] Performance considered (memo, callback)
- [ ] Accessibility standards met
- [ ] Security vulnerabilities addressed

---

<div align="center">

### Questions About Coding Standards?

[Start a Discussion](https://github.com/yourusername/KisanAI/discussions)

</div>
