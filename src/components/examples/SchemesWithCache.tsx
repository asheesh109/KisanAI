/**
 * Example: Government Schemes Page with Offline Caching
 * This file demonstrates how to integrate PWA functionality into your pages
 * 
 * Use this as a reference when adding caching to other components
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import {
  saveData,
  getData,
  getCachedDataWithMetadata,
  getTimeAgo,
} from '@/lib/indexedDB';
import { useLanguage } from '@/contexts/LanguageContext';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Scheme {
  id: string;
  schemeName: string | Record<string, string>;
  schemeObjective: string | Record<string, string>;
  // ... other scheme fields
}

interface CacheMetadata {
  timestamp: number;
  expiresAt?: number;
  itemCount?: number;
}

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================

const SCHEMES_CACHE_KEY = 'schemes_data_v1';
const SCHEMES_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// ============================================================================
// CUSTOM HOOK: USE SCHEMES WITH CACHE
// ============================================================================

/**
 * Hook to fetch schemes with automatic caching and fallback
 * 
 * Features:
 * - Automatically saves to IndexedDB on success
 * - Falls back to cache on error or offline
 * - Returns cache metadata for UI display
 * - Fully typed with TypeScript
 */
export function useSchemesWithCache() {
  const { isOffline } = useOfflineStatus();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [cacheMetadata, setCacheMetadata] = useState<CacheMetadata | null>(null);

  const fetchSchemes = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      // If offline, skip API call and go straight to cache
      if (isOffline) {
        console.log('Offline mode: Loading from cache');
        const cachedData = await getData(SCHEMES_CACHE_KEY);

        if (cachedData) {
          setSchemes(cachedData);
          setFromCache(true);

          // Get metadata for displaying "last updated"
          const metadata = await getCachedDataWithMetadata(SCHEMES_CACHE_KEY);
          if (metadata) {
            setCacheMetadata({
              timestamp: metadata.timestamp,
              expiresAt: metadata.expiresAt,
              itemCount: cachedData.length,
            });
          }
        } else {
          setError('No cached data available');
        }

        setLoading(false);
        return;
      }

      // Online: Try to fetch from API
      console.log('Online mode: Fetching from API');
      // Replace with your actual API endpoint
      const response = await fetch('/api/schemes');

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data)) {
        setSchemes(data);
        setFromCache(false);
        setCacheMetadata(null);

        // Save to cache for offline use
        try {
          await saveData(SCHEMES_CACHE_KEY, data, SCHEMES_CACHE_TTL);
          console.log(`Cached ${data.length} schemes`);
        } catch (cacheError) {
          console.warn('Failed to cache schemes:', cacheError);
        }
      }
    } catch (err) {
      console.error('Error fetching schemes:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');

      // Fallback to cache on error
      console.log('Error occurred, checking cache');
      const cachedData = await getData(SCHEMES_CACHE_KEY);

      if (cachedData) {
        setSchemes(cachedData);
        setFromCache(true);

        const metadata = await getCachedDataWithMetadata(SCHEMES_CACHE_KEY);
        if (metadata) {
          setCacheMetadata({
            timestamp: metadata.timestamp,
            expiresAt: metadata.expiresAt,
            itemCount: cachedData.length,
          });
        }
      }
    } finally {
      setLoading(false);
    }
  }, [isOffline]);

  // Initial load and refresh on online/offline changes
  useEffect(() => {
    fetchSchemes();
  }, [fetchSchemes]);

  return {
    schemes,
    loading,
    error,
    fromCache,
    cacheMetadata,
    refreshSchemes: () => fetchSchemes(true),
  };
}

// ============================================================================
// COMPONENT: CACHE STATUS INDICATOR
// ============================================================================

/**
 * Display when data is from cache and how old it is
 * 
 * Shows:
 * - "Cached" indicator
 * - "Last updated X time ago"
 * - Item count
 */
interface CacheStatusIndicatorProps {
  fromCache: boolean;
  metadata?: CacheMetadata | null;
  language?: string;
}

export function CacheStatusIndicator({
  fromCache,
  metadata,
  language = 'en',
}: CacheStatusIndicatorProps) {
  if (!fromCache || !metadata) {
    return null;
  }

  const timeAgo = getTimeAgo(metadata.timestamp);

  const translations = {
    en: {
      cached: 'Cached data',
      lastUpdated: 'Last updated',
      items: 'item',
      items_plural: 'items',
    },
    hi: {
      cached: 'कैश किया गया डेटा',
      lastUpdated: 'अंतिम अपडेट',
      items: 'आइटम',
      items_plural: 'आइटम',
    },
    mr: {
      cached: 'कॅश केलेला डेटा',
      lastUpdated: 'शेवटचा अपडेट',
      items: 'आयटम',
      items_plural: 'आयटम',
    },
    gu: {
      cached: 'કેશ કરેલ ડેટા',
      lastUpdated: 'છેલ્લો અપડેટ',
      items: 'આઇટમ',
      items_plural: 'આઇટમ્સ',
    },
    ml: {
      cached: 'കാഷ് ചെയ്ത ഡാറ്റ',
      lastUpdated: 'അവസാന അപ്ഡേറ്റ്',
      items: 'ഇനം',
      items_plural: 'ഇനങ്ങൾ',
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;
  const itemsLabel =
    metadata.itemCount === 1 ? t.items : t.items_plural;

  return (
    <div className="inline-flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
      <span className="font-medium">📦 {t.cached}</span>
      <span className="text-amber-600 dark:text-amber-400">•</span>
      <span>
        {t.lastUpdated}: <strong>{timeAgo}</strong>
      </span>
      {metadata.itemCount && (
        <>
          <span className="text-amber-600 dark:text-amber-400">•</span>
          <span>
            {metadata.itemCount} {itemsLabel}
          </span>
        </>
      )}
    </div>
  );
}

// ============================================================================
// COMPONENT: SCHEMES LIST WITH OFFLINE SUPPORT
// ============================================================================

/**
 * Main component showing schemes with caching support
 * 
 * Features:
 * - Automatic caching on fetch
 * - Cache fallback on error
 * - Offline mode detection
 * - Cache status display
 * - Multilingual support
 */
export function SchemesList() {
  const { language } = useLanguage();
  const { schemes, loading, error, fromCache, cacheMetadata, refreshSchemes } =
    useSchemesWithCache();
  const { isOffline } = useOfflineStatus();

  // Loading state
  if (loading && schemes.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading schemes...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && schemes.length === 0) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-900 dark:text-red-200">
          <strong>Error:</strong> {error}
        </p>
        <button
          onClick={refreshSchemes}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Success state with schemes
  return (
    <div className="space-y-4">
      {/* Cache Status Indicator */}
      {fromCache && (
        <div className="mb-4">
          <CacheStatusIndicator
            fromCache={fromCache}
            metadata={cacheMetadata}
            language={language}
          />
        </div>
      )}

      {/* Online/Offline indicator alongside cache status */}
      {isOffline && (
        <div className="p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
          <p className="text-sm text-orange-900 dark:text-orange-200">
            🌐 You are currently offline
          </p>
        </div>
      )}

      {/* Refresh button */}
      {!isOffline && (
        <button
          onClick={refreshSchemes}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          🔄 Refresh Data
        </button>
      )}

      {/* Schemes list */}
      <div className="grid gap-4">
        {schemes.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No schemes available
          </p>
        ) : (
          schemes.map((scheme) => (
            <div
              key={scheme.id}
              className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-foreground">
                {typeof scheme.schemeName === 'string'
                  ? scheme.schemeName
                  : scheme.schemeName[language] ||
                    scheme.schemeName.en ||
                    'Untitled Scheme'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {typeof scheme.schemeObjective === 'string'
                  ? scheme.schemeObjective
                  : scheme.schemeObjective[language] ||
                    scheme.schemeObjective.en ||
                    'No description'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================================
// HOW TO USE THIS IN YOUR PAGE
// ============================================================================

/**
 * Example usage in your pages/schemes page:
 * 
 * import { SchemesList } from '@/components/examples/SchemesWithCache';
 * 
 * export default function SchemesPage() {
 *   return (
 *     <div className="container mx-auto p-4">
 *       <h1 className="text-3xl font-bold mb-6">Government Schemes</h1>
 *       <SchemesList />
 *     </div>
 *   );
 * }
 */

// ============================================================================
// KEY CONCEPTS
// ============================================================================

/**
 * 1. CACHING LOGIC:
 *    - Online: Fetch from API → Save to cache → Display
 *    - Error: Use cache as fallback → Display
 *    - Offline: Load from cache → Display
 * 
 * 2. USER EXPERIENCE:
 *    - Show loading state first time
 *    - Show cached indicator when using cache
 *    - Show last updated timestamp
 *    - Allow manual refresh when online
 * 
 * 3. ERROR HANDLING:
 *    - Graceful fallback to cache
 *    - User-friendly error messages
 *    - Retry capability
 * 
 * 4. PERFORMANCE:
 *    - 24-hour cache TTL prevents stale data
 *    - Instant display when offline
 *    - Reduced API calls
 */

export default SchemesList;
