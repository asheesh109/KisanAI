# KisanAI PWA - Developer Quick Reference

## 🚀 5-Minute Integration

### Import Required Utilities

```typescript
import { saveData, getData, getTimeAgo } from '@/lib/indexedDB';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
```

### Define Cache Configuration

```typescript
const CACHE_KEY = 'your_feature_key'; // Unique identifier
const CACHE_TTL = 24 * 60 * 60 * 1000; // Time-to-live (24 hours)
```

### Typical Data Fetch Pattern

```typescript
async function fetchData() {
  const { isOffline } = useOfflineStatus();
  
  try {
    // If offline, skip to cache
    if (isOffline) {
      const cached = await getData(CACHE_KEY);
      return cached;
    }

    // Online: fetch from API
    const response = await fetch('/api/endpoint');
    const data = await response.json();

    // Save for offline use
    await saveData(CACHE_KEY, data, CACHE_TTL);
    
    return data;
  } catch (error) {
    // Error: fallback to cache
    return await getData(CACHE_KEY);
  }
}
```

---

## 🗂️ Cache Keys Convention

```typescript
// Define constants for reusability
const CACHE_KEYS = {
  SCHEMES: 'schemes_data',
  PRICES: 'market_prices_data',
  WEATHER: 'weather_forecast',
  FILTERS: 'user_filters',
};

const CACHE_TTL = {
  SCHEMES: 24 * 60 * 60 * 1000,    // 24 hours
  PRICES: 4 * 60 * 60 * 1000,      // 4 hours
  WEATHER: 12 * 60 * 60 * 1000,    // 12 hours
  FILTERS: 7 * 24 * 60 * 60 * 1000, // 7 days
};
```

---

## 📚 API Reference

### `saveData(key, data, ttlMs)`
Save data to IndexedDB with optional expiry

```typescript
await saveData('schemes', schemesArray, 24 * 60 * 60 * 1000);
```

### `getData(key)`
Retrieve data from IndexedDB (null if expired)

```typescript
const data = await getData('schemes');
```

### `getCachedDataWithMetadata(key)`
Get data + timestamp info

```typescript
const {data, timestamp, expiresAt} = await getCachedDataWithMetadata('key');
```

### `getTimeAgo(timestamp)`
Format timestamp as "time ago"

```typescript
const ago = getTimeAgo(timestamp);
// Returns: "2h ago", "just now", "1d ago", etc.
```

### `clearData(key)`
Delete specific cache entry

```typescript
await clearData('schemes');
```

### `clearAllCache()`
Delete entire cache

```typescript
await clearAllCache();
```

### `getCacheStats()`
Get cache statistics

```typescript
const {itemCount} = await getCacheStats();
```

### `useOfflineStatus()`
Hook to detect online/offline status

```typescript
const {isOffline, isLoading} = useOfflineStatus();
```

---

## 💾 Common Patterns

### Pattern 1: Simple Fetch & Cache

```typescript
const [data, setData] = useState(null);

useEffect(() => {
  async function load() {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      
      setData(result);
      await saveData('my_key', result, 24 * 60 * 60 * 1000);
    } catch (error) {
      const cached = await getData('my_key');
      setData(cached);
    }
  }
  
  load();
}, []);
```

### Pattern 2: Offline First

```typescript
const [data, setData] = useState(null);
const {isOffline} = useOfflineStatus();

useEffect(() => {
  async function load() {
    if (isOffline) {
      // Load from cache when offline
      const cached = await getData('my_key');
      setData(cached);
    } else {
      // Fetch fresh when online
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
      await saveData('my_key', result, CACHE_TTL);
    }
  }
  
  load();
}, [isOffline]);
```

### Pattern 3: With Cache Display

```typescript
const [data, setData] = useState(null);
const [fromCache, setFromCache] = useState(false);
const [cacheTime, setCacheTime] = useState(null);

useEffect(() => {
  async function load() {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      
      setData(result);
      setFromCache(false);
      await saveData('my_key', result, CACHE_TTL);
    } catch (error) {
      const metadata = await getCachedDataWithMetadata('my_key');
      if (metadata) {
        setData(metadata.data);
        setFromCache(true);
        setCacheTime(metadata.timestamp);
      }
    }
  }
  
  load();
}, []);

return (
  <div>
    {fromCache && (
      <p className="text-gray-500">
        📦 Cached {getTimeAgo(cacheTime)}
      </p>
    )}
    {/* Display data */}
  </div>
);
```

---

## 🎨 UI Components

### OfflineBanner

```tsx
import OfflineBanner from '@/components/OfflineBanner';

<OfflineBanner 
  position="top"           // 'top' or 'bottom'
  show={true}              // Show/hide
  message="Custom message" // Optional custom text
/>
```

### Cache Status Indicator

```tsx
{fromCache && cacheTime && (
  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
    📦 Cached {getTimeAgo(cacheTime)}
  </div>
)}
```

---

## 🧪 Testing Checklist

### For Each Feature Added

- [ ] Test online → Shows fresh data
- [ ] Test offline → Shows cached data
- [ ] Test offline banner appears/disappears
- [ ] Test cache indicator displays correctly
- [ ] Test refresh button works online
- [ ] Test error fallback to cache
- [ ] Test cache expiry (if TTL short)
- [ ] Test on 3G throttled network

### DevTools Testing

```
1. Open DevTools (F12)
2. Application → Service Workers
3. Check "Offline" checkbox
4. Refresh page
5. Should load cached data
6. Verify no errors in Console
```

---

## 🐛 Common Issues & Fixes

### Issue: Data not caching

**Cause:** Not calling `saveData()`  
**Fix:** Add save after API success

```typescript
const result = await response.json();
await saveData('key', result, TTL); // ← Add this
```

### Issue: Getting old data

**Cause:** TTL too long or cache not clearing  
**Fix:** Clear cache or reduce TTL

```typescript
// Reduce TTL
const CACHE_TTL = 4 * 60 * 60 * 1000; // 4 hours instead of 24

// Or clear manually
await clearData('key');
```

### Issue: Offline banner not showing

**Cause:** OfflineBanner not in layout  
**Fix:** Add to root layout

```typescript
// src/app/layout.jsx
import OfflineBanner from '@/components/OfflineBanner';

<OfflineBanner />
```

### Issue: Service worker not registering

**Cause:** Not HTTPS or manifest missing  
**Fix:** 
- Use HTTPS in production (HTTP OK for localhost)
- Verify `public/manifest.json` exists
- Hard refresh: `Ctrl+Shift+R`

---

## 📊 TTL Recommendations

| Type | TTL | Reason |
|------|-----|--------|
| Schemes | 24h | Rarely change |
| Prices | 4-6h | Updated daily |
| Weather | 12h | Updated 2x daily |
| News | 2h | Changes frequently |
| User settings | 7d | Rarely change |
| Temporary data | 1h | Frequent updates |

---

## 🌐 Multi-Language Support

### Using Translations

```typescript
const {language} = useLanguage();

const offline = language === 'hi' ? 'आप ऑफलाइन हैं' : 'You are offline';
```

### Offline Messages Already Translated

| Key | English | हिंदी |
|-----|---------|-------|
| `offline` | You are offline | आप ऑफलाइन हैं |
| `offline.message` | Showing saved data... | संग्रहीत डेटा दिखाया... |
| `offline.lastUpdated` | Last updated | अंतिम अपडेट |
| `offline.cachedData` | This is cached data | यह कैश किया गया डेटा है |

Use in components:

```typescript
import { useLanguage } from '@/contexts/LanguageContext';

const {language} = useLanguage();
const msgKey = 'offline.message';
const message = t(msgKey); // From i18n
```

---

## 📈 Performance Tips

### 1. Optimize Cache Size

```typescript
// Bad: Storing entire response
await saveData('key', entireResponse); // 1MB+

// Good: Store only needed fields
const minimal = {
  id: response.id,
  name: response.name,
  price: response.price,
};
await saveData('key', minimal); // 50KB
```

### 2. Set Appropriate TTL

```typescript
// Bad: Cache forever
const TTL = 365 * 24 * 60 * 60 * 1000; // Stale data!

// Good: Balance freshness and performance
const TTL = 24 * 60 * 60 * 1000; // 24 hours is reasonable
```

### 3. Clear Old Cache

```typescript
// On app startup, clean expired entries
useEffect(() => {
  async function cleanup() {
    const keys = await getAllCacheKeys();
    keys.forEach(async (key) => {
      const data = await getData(key); // Returns null if expired
      if (!data) await clearData(key); // Clear if expired
    });
  }
  
  cleanup();
}, []);
```

---

## 🔐 Security Best Practices

### ✅ Safe to Cache

```typescript
// These are safe
await saveData('schemes', schemes);      // Public data
await saveData('prices', prices);        // Public data
await saveData('weather', forecast);     // Public data
```

### ❌ Never Cache

```typescript
// NEVER cache these
await saveData('token', authToken);      // ❌ Security risk
await saveData('password', pwd);         // ❌ Security risk
await saveData('userEmail', email);      // ❌ Privacy risk
```

---

## 📱 Mobile PWA Installation

### Android Chrome

```
1. Open app in Chrome
2. Menu → "Add to home screen"
3. Or wait for install prompt
4. App opens fullscreen
```

### iOS Safari

```
1. Open app in Safari
2. Share (bottom left)
3. "Add to Home Screen"
4. Tap added app
5. Opens in Safari (PWA limitations)
```

---

## 🚀 Deployment Checklist

Before going live:

- [ ] Build: `npm run build`
- [ ] Test: `npm start` + DevTools offline
- [ ] Verify manifest.json is valid
- [ ] Check HTTPS is enabled
- [ ] Test on slow 3G network
- [ ] Test all browsers (Chrome, FF, Safari, Edge)
- [ ] Test dark mode offline
- [ ] Test all 5 languages
- [ ] Monitor service worker in production
- [ ] Set up error tracking

---

## 📞 Quick Help

### Find Answers In:

- **How to integrate?** → `PWA_INTEGRATION_GUIDE.md`
- **How to test?** → `PWA_SETUP_GUIDE.md` → Testing section
- **What APIs available?** → This document (above)
- **Working example?** → `src/components/examples/SchemesWithCache.tsx`
- **Setup issues?** → `PWA_CHECKLIST.md` → Debugging section

---

**Print this page for quick reference while coding!**

**Last Updated:** April 7, 2026
