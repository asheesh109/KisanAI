'use client'
import ErrorBoundaryFallback from '@/components/ErrorBoundaryFallback'

export default function GlobalRouteErrorBoundary({ error, reset }) {
  return <ErrorBoundaryFallback error={error} reset={reset} />
}
