'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook to detect online/offline status
 * Listens to browser online/offline events and exposes a manual
 * retry check for when the user wants to re-verify connectivity
 * (e.g. clicking "Retry" on the OfflineBanner).
 */
export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastRetryFailed, setLastRetryFailed] = useState(false);

  // Tracks whether the component is still mounted so we don't set
  // state after unmount if a retry request resolves late.
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    // Check initial status
    setIsOffline(!navigator.onLine);
    setIsLoading(false);

    // Listen to online event
    const handleOnline = () => {
      setIsOffline(false);
      setLastRetryFailed(false);
    };

    // Listen to offline event
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      isMounted.current = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Actively re-checks connectivity instead of trusting the (sometimes
   * stale) navigator.onLine flag. Fires a small, cache-busting same-origin
   * request; if it succeeds we're back online, otherwise we stay offline
   * and let the user know the retry failed.
   */
  const retry = useCallback(async () => {
    setIsRetrying(true);
    setLastRetryFailed(false);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (isMounted.current) {
        setIsOffline(false);
        setLastRetryFailed(false);
      }
    } catch {
      if (isMounted.current) {
        setIsOffline(true);
        setLastRetryFailed(true);
      }
    } finally {
      if (isMounted.current) {
        setIsRetrying(false);
      }
    }
  }, []);

  return { isOffline, isLoading, isRetrying, lastRetryFailed, retry };
}