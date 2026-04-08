'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect online/offline status
 * Listens to browser online/offline events
 */
export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial status
    setIsOffline(!navigator.onLine);
    setIsLoading(false);

    // Listen to online event
    const handleOnline = () => {
      setIsOffline(false);
    };

    // Listen to offline event
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOffline, isLoading };
}
