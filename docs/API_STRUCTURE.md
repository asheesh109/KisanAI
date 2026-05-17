# API Structure

This document maps API endpoints, server-side helpers, and data flow.

## Colocated API routes

- Next.js App Router allows placing route handlers inside `src/app/api/*`.
- Example endpoints:
  - `src/app/api/auth/*` — authentication helpers
  - `src/app/api/schemes/*` — scheme listing and filter endpoints
  - `src/app/api/market-prices/*` — market data proxy

## Server-side helpers

- Business logic and adapters are located in `src/lib/` to keep route handlers thin.
- Example: `src/lib/mongodb.ts`, `src/lib/indexedDB.ts`, `src/lib/utils.ts`.

## Client-to-server flow

1. UI components call client-side utilities in `src/lib/client*` or directly `fetch()` app routes.
2. App routes validate and sanitize inputs, then call `src/lib/*` services.
3. Services interact with external APIs or databases and return typed results.

## Authentication & Secrets

- Store provider keys and DB URIs in environment variables and avoid committing secrets.
- Use server-only runtime for secrets (Next.js server components or route handlers).
