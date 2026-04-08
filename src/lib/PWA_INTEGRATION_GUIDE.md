/**
 * PWA Integration Guide for KisanAI
 * This file demonstrates how to integrate offline caching into existing pages
 * 
 * Implementation Example: Government Schemes Page
 */

// ============================================================================
// STEP 1: IMPORT THE REQUIRED UTILITIES
// ============================================================================

// In your page component (e.g., src/app/schemes/page.jsx)

import { useEffect, useState } from 'react';
import {
  saveData,
  getData,
  getCachedDataWithMetadata,
  getTimeAgo,
  clearData,
} from '@/lib/indexedDB';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';

// ============================================================================
// STEP 2: CACHE KEY CONSTANTS
// ============================================================================

const CACHE_KEYS = {
  SCHEMES: 'schemes_data',
  MARKET_PRICES: 'market_prices_data',
  WEATHER: 'weather_forecast_data',
  ELIGIBILITY_FILTERS: 'user_eligibility_filters',
};

// TTL in milliseconds
const CACHE_TTL = {
  SCHEMES: 24 * 60 * 60 * 1000, // 24 hours
  MARKET_PRICES: 4 * 60 * 60 * 1000, // 4 hours
  WEATHER: 12 * 60 * 60 * 1000, // 12 hours
  ELIGIBILITY_FILTERS: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ============================================================================
// STEP 3: EXAMPLE IMPLEMENTATION IN YOUR COMPONENT
// ============================================================================

/**
 * Example: Fetching with fallback to cached data
 */
export async function fetchSchemesWithCache() {
  const { isOffline } = useOfflineStatus();

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [cacheTimestamp, setCacheTimestamp] = useState<number | null>(null);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true);

        if (isOffline) {
          // Offline: Load from cache
          const cachedData = await getData(CACHE_KEYS.SCHEMES);
          if (cachedData) {
            setSchemes(cachedData);
            setFromCache(true);

            // Get metadata for "last updated" display
            const metadata = await getCachedDataWithMetadata(CACHE_KEYS.SCHEMES);
            if (metadata) {
              setCacheTimestamp(metadata.timestamp);
            }
          }
        } else {
          // Online: Fetch from API and cache
          const response = await fetch('/api/schemes'); // Replace with your API
          const data = await response.json();

          if (data && Array.isArray(data)) {
            setSchemes(data);
            setFromCache(false);

            // Save to cache for offline use
            await saveData(
              CACHE_KEYS.SCHEMES,
              data,
              CACHE_TTL.SCHEMES
            );
            setCacheTimestamp(Date.now());
          }
        }
      } catch (error) {
        console.error('Error fetching schemes:', error);

        // Fallback to cache on error
        const cachedData = await getData(CACHE_KEYS.SCHEMES);
        if (cachedData) {
          setSchemes(cachedData);
          setFromCache(true);
          const metadata = await getCachedDataWithMetadata(CACHE_KEYS.SCHEMES);
          if (metadata) {
            setCacheTimestamp(metadata.timestamp);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [isOffline]);

  return { schemes, loading, fromCache, cacheTimestamp };
}

// ============================================================================
// STEP 4: UI COMPONENT WITH CACHE INDICATOR
// ============================================================================

/**
 * Component to display cache status
 */
export function CacheStatusIndicator({
  fromCache,
  cacheTimestamp,
  language = 'en',
}: {
  fromCache: boolean;
  cacheTimestamp?: number | null;
  language?: string;
}) {
  if (!fromCache || !cacheTimestamp) {
    return null;
  }

  const timeAgo = getTimeAgo(cacheTimestamp);

  const translations = {
    en: {
      cachedData: 'Cached data',
      lastUpdated: 'Last updated',
    },
    hi: {
      cachedData: 'कैश किया गया डेटा',
      lastUpdated: 'अंतिम अपडेट',
    },
    mr: {
      cachedData: 'कॅश केलेला डेटा',
      lastUpdated: 'शेवटचा अपडेट',
    },
    gu: {
      cachedData: 'કેશ કરેલ ડેટા',
      lastUpdated: 'છેલ્લો અપડેટ',
    },
    ml: {
      cachedData: 'കാഷ് ചെയ്ത ഡാറ്റ',
      lastUpdated: 'അവസാന അപ്ഡേറ്റ്',
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <div className="inline-flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-2 py-1 rounded">
      <span>{t.cachedData}</span>
      <span className="text-amber-600 dark:text-amber-400">
        • {t.lastUpdated} {timeAgo}
      </span>
    </div>
  );
}

// ============================================================================
// STEP 5: SAVE USER PREFERENCES (ELIGIBILITY FILTERS)
// ============================================================================

/**
 * Save user eligibility filters for offline persistence
 */
export async function saveEligibilityFilters(filters: Record<string, any>) {
  try {
    await saveData(
      CACHE_KEYS.ELIGIBILITY_FILTERS,
      filters,
      CACHE_TTL.ELIGIBILITY_FILTERS
    );
  } catch (error) {
    console.error('Error saving eligibility filters:', error);
  }
}

/**
 * Retrieve saved eligibility filters
 */
export async function loadEligibilityFilters(): Promise<Record<string, any> | null> {
  try {
    return await getData(CACHE_KEYS.ELIGIBILITY_FILTERS);
  } catch (error) {
    console.error('Error loading eligibility filters:', error);
    return null;
  }
}

// ============================================================================
// STEP 6: INTEGRATION IN YOUR PAGE COMPONENT
// ============================================================================

/**
 * Example: Updated Government Schemes Page Component
 */

/*
export default function SchemesApp() {
  const { schemes, loading, fromCache, cacheTimestamp } = fetchSchemesWithCache();
  const { isOffline } = useOfflineStatus();
  const { language } = useLanguage();

  const handleApplyFilters = async (filters) => {
    // Save filters for offline use
    await saveEligibilityFilters(filters);
    
    // Apply filters...
  };

  return (
    <div>
      {fromCache && cacheTimestamp && (
        <CacheStatusIndicator
          fromCache={fromCache}
          cacheTimestamp={cacheTimestamp}
          language={language}
        />
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {schemes.map(scheme => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </>
      )}

      <EligibilityDrawer onApply={handleApplyFilters} />
    </div>
  );
}
*/

// ============================================================================
// STEP 7: CLEAR CACHE (OPTIONAL - FOR ADMIN/SETTINGS)
// ============================================================================

/**
 * Clear specific cache entry
 */
export async function clearSchemeCache() {
  try {
    await clearData(CACHE_KEYS.SCHEMES);
  } catch (error) {
    console.error('Error clearing scheme cache:', error);
  }
}

// ============================================================================
// STEP 8: RUNTIME CACHING CONFIGURATION (Already in next.config.js)
// ============================================================================

/**
 * The following runtime caching strategies are already configured:
 *
 * 1. API Calls (NetworkFirst strategy):
 *    - Try network first
 *    - If fails or offline, use cached response
 *    - Cache duration: 24 hours
 *    - Caches: API responses only when status is 200
 *
 * 2. Static Assets (CacheFirst strategy):
 *    - Use cache if available
 *    - Update cache in background
 *    - Cache duration: 30 days
 *    - Includes: CSS, JS, images, fonts
 *
 * 3. Google Fonts (CacheFirst strategy):
 *    - Use cached fonts if available
 *    - Cache duration: 1 year
 *    - Highly optimized for performance
 *
 * 4. Translation API (CacheFirst strategy):
 *    - Cache translation results
 *    - Cache duration: 7 days
 *    - Reduces API calls for multi-language support
 */

// ============================================================================
// STEP 9: TESTING OFFLINE FUNCTIONALITY
// ============================================================================

/**
 * Testing Tips:
 *
 * 1. Chrome DevTools:
 *    - Open Chrome DevTools (F12)
 *    - Go to Application > Service Workers
 *    - Check "Offline" to simulate offline mode
 *    - Refresh page and verify cached data loads
 *
 * 2. Network Throttling:
 *    - Open DevTools > Network tab
 *    - Set connection to "Slow 3G" or "Offline"
 *    - Navigate through app
 *    - Verify app functionality
 *
 * 3. Cache Storage:
 *    - Open DevTools > Application > Cache Storage
 *    - View cached requests and responses
 *    - Manually clear cache to test
 *
 * 4. IndexedDB:
 *    - Open DevTools > Application > IndexedDB
 *    - View kisanai_cache database
 *    - See stored scheme data with timestamps
 */

// ============================================================================
// STEP 10: PRODUCTION CHECKLIST
// ============================================================================

/**
 * Before deploying to production:
 *
 * ✓ Test offline functionality in Chrome, Firefox, Safari, Edge
 * ✓ Verify service worker loads without errors
 * ✓ Check IndexedDB quota usage (limit: 50% of available storage)
 * ✓ Test on slow networks (3G, 4G)
 * ✓ Verify PWA icon appears on mobile home screen
 * ✓ Test app installation on Android and iOS
 * ✓ Verify dark mode works in offline mode
 * ✓ Test multilingual interface offline
 * ✓ Monitor service worker update process
 * ✓ Set up error tracking for cache failures
 */

export default {};
