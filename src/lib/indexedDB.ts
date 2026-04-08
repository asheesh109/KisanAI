/**
 * IndexedDB Utility for KisanAI PWA
 * Provides functions to store and retrieve data for offline functionality
 */

interface CachedData {
  key: string;
  data: any;
  timestamp: number;
  expiresAt?: number;
}

const DB_NAME = 'kisanai_cache';
const DB_VERSION = 1;
const STORE_NAME = 'cached_data';

// TTL in milliseconds (24 hours by default)
const DEFAULT_TTL = 24 * 60 * 60 * 1000;

/**
 * Initialize IndexedDB database
 */
function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported in this browser'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error(`Failed to open IndexedDB: ${request.error}`));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('expiresAt', 'expiresAt', { unique: false });
      }
    };
  });
}

/**
 * Save data to IndexedDB with optional TTL
 * @param key Unique identifier for the data
 * @param data The data to store (can be any serializable object)
 * @param ttlMs Time to live in milliseconds (optional, defaults to 24 hours)
 */
export async function saveData(
  key: string,
  data: any,
  ttlMs: number = DEFAULT_TTL
): Promise<void> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const cachedData: CachedData = {
      key,
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttlMs,
    };

    return new Promise((resolve, reject) => {
      const request = store.put(cachedData);

      request.onerror = () => {
        reject(new Error(`Failed to save data for key "${key}"`));
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  } catch (error) {
    console.error(`Failed to save data to IndexedDB:`, error);
    throw error;
  }
}

/**
 * Retrieve data from IndexedDB
 * @param key Unique identifier for the data
 * @returns The cached data or null if not found or expired
 */
export async function getData(key: string): Promise<any | null> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(key);

      request.onerror = () => {
        reject(new Error(`Failed to retrieve data for key "${key}"`));
      };

      request.onsuccess = () => {
        const cachedData = request.result as CachedData | undefined;

        if (!cachedData) {
          resolve(null);
          return;
        }

        // Check if data has expired
        if (cachedData.expiresAt && cachedData.expiresAt < Date.now()) {
          // Data has expired, delete it and return null
          clearData(key);
          resolve(null);
          return;
        }

        resolve(cachedData.data);
      };
    });
  } catch (error) {
    console.error(`Failed to retrieve data from IndexedDB:`, error);
    return null;
  }
}

/**
 * Get cached data with metadata (timestamp, etc.)
 * @param key Unique identifier for the data
 * @returns The cached data object with metadata or null
 */
export async function getCachedDataWithMetadata(
  key: string
): Promise<CachedData | null> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(key);

      request.onerror = () => {
        reject(new Error(`Failed to retrieve metadata for key "${key}"`));
      };

      request.onsuccess = () => {
        const cachedData = request.result as CachedData | undefined;

        if (!cachedData) {
          resolve(null);
          return;
        }

        // Check if data has expired
        if (cachedData.expiresAt && cachedData.expiresAt < Date.now()) {
          clearData(key);
          resolve(null);
          return;
        }

        resolve(cachedData);
      };
    });
  } catch (error) {
    console.error(`Failed to retrieve metadata from IndexedDB:`, error);
    return null;
  }
}

/**
 * Clear specific data from IndexedDB
 * @param key Unique identifier for the data to delete
 */
export async function clearData(key: string): Promise<void> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.delete(key);

      request.onerror = () => {
        reject(new Error(`Failed to clear data for key "${key}"`));
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  } catch (error) {
    console.error(`Failed to clear data from IndexedDB:`, error);
    throw error;
  }
}

/**
 * Clear all cache from IndexedDB
 */
export async function clearAllCache(): Promise<void> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.clear();

      request.onerror = () => {
        reject(new Error('Failed to clear all cache'));
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  } catch (error) {
    console.error(`Failed to clear all cache:`, error);
    throw error;
  }
}

/**
 * Get all cached data keys
 */
export async function getAllCacheKeys(): Promise<string[]> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.getAllKeys();

      request.onerror = () => {
        reject(new Error('Failed to get cache keys'));
      };

      request.onsuccess = () => {
        resolve((request.result as IDBValidKey[]).map(String));
      };
    });
  } catch (error) {
    console.error(`Failed to get cache keys:`, error);
    return [];
  }
}

/**
 * Get cache statistics (total items, cache size estimate)
 */
export async function getCacheStats(): Promise<{
  itemCount: number;
  lastUpdated?: number;
}> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const countRequest = store.count();

      countRequest.onerror = () => {
        reject(new Error('Failed to get cache count'));
      };

      countRequest.onsuccess = () => {
        resolve({
          itemCount: countRequest.result,
          lastUpdated: Date.now(),
        });
      };
    });
  } catch (error) {
    console.error(`Failed to get cache stats:`, error);
    return { itemCount: 0 };
  }
}

/**
 * Check if IndexedDB is available
 */
export function isIndexedDBAvailable(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

/**
 * Format timestamp to human-readable "time ago" format
 */
export function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return new Date(timestamp).toLocaleDateString();
  }
}
