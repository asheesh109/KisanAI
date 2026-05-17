# Folder Structure

Top-level layout for the repository to help contributors find code quickly.

```
KisanAI/
├─ src/
│  ├─ app/             # Next.js App Router pages and api routes
│  ├─ components/      # Reusable UI components and layout
│  ├─ hooks/           # Custom React hooks
│  ├─ lib/             # Utility libraries and service wrappers
│  ├─ contexts/        # React context providers
│  ├─ types/           # Type declarations
│  └─ __tests__/       # Unit and integration tests
├─ docs/               # Project documentation
├─ .github/            # Workflows, issue templates, config
├─ public/             # Static assets and icons
├─ package.json
└─ README.md
```

Paths of interest:
- `src/app/` — top-level pages and route handlers (App Router)
- `src/components/` — split by domain, `ui/` contains primitives
- `src/lib/` — network, AI, and DB helpers
- `docs/` — onboarding, architecture, and contribution guides
**Repository Folder Structure**

Top-level
- `src/` — application source
  - `app/` — Next.js App Router routes and pages
  - `components/` — shared UI components
  - `hooks/` — custom React hooks
  - `lib/` — utility libraries and data access helpers
  - `data/` — curated datasets (schemes, marketData)
  - `contexts/` — React context providers (language etc.)
  - `__tests__/` — unit and integration tests

Docs & automation
- `.github/` — issue templates, workflows, label config
- `docs/` — architecture and contributor guides

Guidelines
- Keep components small and presentational where possible.
- Place business logic in `lib/` or hooks, not in components.
