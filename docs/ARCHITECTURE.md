# KisanAI Architecture

This document gives a high-level overview of KisanAI's architecture and design decisions.

## Overview

- **Frontend:** Next.js (App Router) with React and TypeScript. UI built with Tailwind CSS.
- **Backend / APIs:** Lightweight API routes (serverless functions) under `src/app/api/` and server-side helpers in `src/lib/`.
- **Data:** IndexedDB for local caching, MongoDB for persistent storage (see `src/lib/mongodb.ts`).
- **AI integrations:** Optional connectors to generative models (Gemini/OpenAI) orchestrated via `src/lib/geminiTranslate.ts` and feature toggles.

## Frontend Architecture

- App Router pages live under `src/app/` and use React Server Components where appropriate.
- Shared UI components are in `src/components/` organized by domain and `ui/` primitives.
- State management uses lightweight hooks in `src/hooks/` and context providers in `src/contexts/`.

## Services Layer

- Data access utilities in `src/lib/` wrap remote API calls and local cache.
- Background sync and offline support use `indexedDB.ts` and service-like helpers.

## Hooks Organization

- Reusable hooks live in `src/hooks/` (e.g., `useTasks`, `useSpeechRecognition`, `useSpeechSynthesis`).
- Hooks follow a small-surface API and are well-typed where TypeScript is present.

## API Structure

- Server endpoints are colocated under `src/app/api/...` for Next.js App Router.
- Business logic is intentionally separated into `src/lib/` for testability.

## Reusable Components

- UI primitives and card/list components are in `src/components/ui/` and `src/components/layout/`.
- Accessibility-first approach: prefer semantic elements, aria attributes, and role-based tests.

## AI Integration Plan

1. Provide an abstraction layer in `src/lib/ai/*` to allow multiple providers.
2. Configure provider keys via environment variables and a guarded fallback for local/offline behavior.
3. Add usage quotas, caching of responses, and transparent opt-in prompts for users.

## Deployment Notes

- Recommended hosting: Vercel (Next.js-first). Configure environment variables in project settings.
- Use CI to run linting, typechecks, and tests before merges.
**Architecture Overview**

This document outlines the high-level architecture of KisanAI.

- Framework: Next.js (App Router) — UI and API routes under `src/app/`
- Components: Reusable UI components under `src/components/` and `src/components/ui`
- State & Context: Lightweight context providers (e.g., `LanguageContext`) and hooks under `src/hooks/`
- Data Layer: Static and dynamic data under `src/data/` and service helpers in `src/lib/` (indexedDB, mongodb helpers)
- AI integration: optional Gemini/Generative API wrappers located in `src/lib/geminiTranslate.ts` and feature pages (guarded by fallbacks)
- Testing: Jest + @testing-library/react with mocks in `jest.setup.js` and tests under `src/__tests__/`.

Data flow
- UI components call hooks → hooks call lib helpers → lib fetches from APIs / indexedDB → components render.

Build & CI
- CI workflow runs lint, type-check, tests and build (see .github/workflows/ci.yml).

Diagram
- Add architecture diagram: docs/architecture-diagram.png (placeholder)
# Architecture Documentation 🏗️

High-level system design and technical architecture of KisanAI.

---

## 📋 Overview

KisanAI follows a modern **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│         Client Layer (Browser)              │
│  React Components + Tailwind CSS            │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│      Next.js API Routes (Edge)              │
│  Form handling, voice processing            │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│      Service Layer (Business Logic)         │
│  AI integration, data processing            │
└──────────────┬──────────────────────────────┘
               │
    ┌──────────┴────────────────────┬────────────────┐
    │                               │                │
┌───▼────┐  ┌────────────┐  ┌──────▼──┐  ┌────────▼─────┐
│MongoDB │  │ Gemini API │  │Eleven   │  │Weather/     │
│ Atlas  │  │ (AI/Vision)│  │Labs     │  │Market APIs  │
└────────┘  └────────────┘  └─────────┘  └─────────────┘
```

---

## 🗂️ Folder Structure & Responsibility

### `/src/app` - Page Routes (Next.js App Router)
**Responsibility**: Render pages and handle routing

```
app/
├── page.jsx                  # Home page
├── layout.jsx                # Root layout (nav, footer)
├── api/                      # API routes
│   ├── voice/               # Voice processing API
│   ├── crops/               # Crop analysis API
│   ├── weather/             # Weather API
│   └── markets/             # Market data API
├── voice-assistant/         # Voice chat page
├── crop-analysis/           # Crop analysis page
├── weather/                 # Weather page
├── market-prices/           # Market prices page
├── schemes/                 # Government schemes page
└── kcc-application/         # KCC form page
```

### `/src/components` - Reusable UI
**Responsibility**: Render UI components, manage component state

```
components/
├── ui/                      # Atomic UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── Modal.tsx
├── layout/                  # Layout components
│   ├── Header.tsx           # Navigation
│   ├── Footer.tsx           # Footer
│   └── Sidebar.tsx          # Side menu
└── [features]/              # Feature-specific components
    ├── VoiceChat.tsx
    ├── CropAnalyzer.tsx
    └── WeatherWidget.tsx
```

### `/src/hooks` - Custom React Hooks
**Responsibility**: Encapsulate reusable logic

```
hooks/
├── useWeather.ts            # Fetch weather data
├── useSpeechRecognition.js  # Voice input
├── useSpeechSynthesis.js    # Voice output
├── useVoiceChat.ts          # Voice conversation
└── [domain]/
```

### `/src/lib` - Business Logic & Utilities
**Responsibility**: Core functionality, API clients, data processing

```
lib/
├── api.ts                   # HTTP client
├── mongodb.ts              # Database connection
├── geminiTranslate.ts      # AI integration
├── validators.ts           # Input validation
├── formatters.ts           # Data formatting
└── [services]/
    ├── cropAnalysis.ts
    ├── weatherService.ts
    └── marketService.ts
```

### `/src/types` - TypeScript Definitions
**Responsibility**: Type safety across codebase

```
types/
├── index.ts                # Exported types
├── api.ts                  # API types
├── models.ts               # Data models
└── [domain]/
```

### `/src/data` - Static Data
**Responsibility**: Constants, enums, static data

```
data/
├── governmentSchemes.js    # Scheme information
├── cropTypes.js            # Crop types
├── marketCommodities.js    # Commodities list
└── [reference]/
```

---

## 🔄 Data Flow

### Page Load Flow
```
1. Browser requests page
2. Next.js renders page component
3. Component mounts, calls useEffect
4. Hook fetches data from API or local storage
5. Data updates component state
6. Component re-renders with data
```

### API Request Flow
```
1. Component/Hook calls API endpoint
2. Next.js API route receives request
3. Validate input using validators.ts
4. Call service layer (lib/services/)
5. Service calls external APIs or database
6. Return response to client
7. Client updates UI
```

### Voice Interaction Flow
```
1. User clicks "Start Listening" button
2. useSpeechRecognition hook uses Web Speech API
3. Audio converted to text
4. Text sent to Gemini API via /api/voice route
5. AI generates response
6. ElevenLabs converts response to speech
7. Audio played to user
```

---

## 🔌 External Integrations

### Google Gemini API
- **Purpose**: AI processing (vision, NLP, translation)
- **Used By**: Voice assistant, crop analysis, recommendations
- **Endpoints**:
  - `generateContent` - Text processing
  - `generateContentStream` - Streaming responses
- **Implementation**: `/src/lib/geminiTranslate.ts`

### ElevenLabs API
- **Purpose**: Text-to-speech voice synthesis
- **Used By**: Voice assistant responses
- **Endpoints**:
  - `textToSpeech` - Convert text to audio
  - `getVoices` - List available voices

### OpenWeatherMap API
- **Purpose**: Weather forecasting data
- **Used By**: Weather dashboard, alerts
- **Endpoints**:
  - `weather` - Current weather
  - `forecast` - 7-day forecast

### MongoDB Atlas
- **Purpose**: Data persistence
- **Collections**:
  - `users` - User profiles
  - `applications` - KCC applications
  - `conversations` - Chat history
  - `crops` - Crop data

---

## 🏛️ State Management

### Local State (Component)
```typescript
// useState for simple component state
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### Custom Hooks (Logic Reuse)
```typescript
// useWeather encapsulates weather fetching
const { weather, loading, error } = useWeather(location);
```

### Context (Cross-Component)
```typescript
// LanguageContext for language switching
<LanguageProvider>
  <App />
</LanguageProvider>
```

### URL State (Persistence)
```typescript
// URL params for navigation and filtering
/crops?type=wheat&sort=price
```

### Server State (Database)
```typescript
// MongoDB for persistent data
users, applications, conversations
```

---

## 🔐 Security Architecture

### Input Validation Layer
```
User Input
    ↓
Client-side validation (immediate feedback)
    ↓
Server-side validation (security)
    ↓
Database (trusted source)
```

### Authentication
- JWT tokens for API authentication
- HTTP-only cookies for session
- OAuth for social login (future)

### Data Protection
- HTTPS for all communications
- Encrypted sensitive data
- MongoDB encryption at rest
- Input sanitization

---

## 📈 Scalability Patterns

### Database Optimization
- Indexing on frequently queried fields
- Connection pooling
- Query optimization

### Frontend Performance
- Code splitting with dynamic imports
- Image optimization
- Lazy loading components
- Service Worker caching

### API Optimization
- Request caching
- Pagination for large datasets
- Rate limiting

---

## 🧪 Testing Architecture

### Unit Tests
- `src/__tests__/hooks/` - Hook tests
- `src/__tests__/lib/` - Utility tests
- `src/__tests__/components/` - Component tests

### Integration Tests
- API route testing
- Component + hook integration
- Multi-component workflows

### Test Infrastructure
- Jest for test runner
- React Testing Library for component tests
- Mocking external APIs

---

## 📦 Deployment Architecture

### Development Environment
- Local MongoDB
- Next.js dev server
- Hot module reloading

### Staging Environment
- MongoDB Atlas
- Vercel preview deployment
- Full feature testing

### Production Environment
- MongoDB Atlas (production)
- Vercel production deployment
- CDN for static assets
- Error tracking (Sentry)
- Analytics

---

## 🔄 CI/CD Pipeline

```
Push to GitHub
    ↓
1. Lint code (ESLint)
    ↓
2. Type check (TypeScript)
    ↓
3. Run tests (Jest)
    ↓
4. Build project (Next.js)
    ↓
5. Deploy to Vercel
    ↓
6. Run smoke tests
    ↓
Production deployment
```

---

## 📊 Database Schema

### Users Collection
```typescript
{
  _id: ObjectId,
  email: string,
  name: string,
  phone: string,
  state: string,
  preferences: {
    language: 'en' | 'hi',
    notifications: boolean,
    theme: 'light' | 'dark'
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Applications Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  type: 'KCC' | 'PM-KISAN' | 'OTHER',
  status: 'pending' | 'approved' | 'rejected',
  data: object,
  submittedAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Future Architecture Considerations

### Microservices
- Separate AI service
- Separate voice service
- Separate analytics service

### Message Queue
- Celery for async tasks
- Job queuing for long operations

### Caching Layer
- Redis for frequent queries
- CDN for static assets

### Analytics
- Event tracking
- User behavior analysis
- Performance monitoring

---

<div align="center">

[← Back to Documentation](./README.md)

</div>
