// Simple in-memory cache for API requests
const cache = new Map();

// Default TTL is 30 minutes (1800000 ms)
export const cachedFetch = async (url, options = {}, ttl = 1800000) => {
  const cacheKey = typeof url === 'string' ? url : url.toString();
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    const now = Date.now();
    if (now - cachedData.timestamp < ttl) {
      console.log(`[Cache Hit] ${cacheKey}`);
      // Return a mocked Response object that can be .json() parsed multiple times if needed, 
      // but usually just once. We will clone the data to prevent mutation.
      const dataClone = JSON.parse(JSON.stringify(cachedData.data));
      return {
        ok: true,
        status: 200,
        json: async () => dataClone,
        text: async () => JSON.stringify(dataClone)
      };
    } else {
      // Expired
      cache.delete(cacheKey);
    }
  }

  // Cache miss
  console.log(`[Cache Miss] Fetching ${cacheKey}`);
  const response = await fetch(url, options);
  
  if (response.ok) {
    const responseClone = response.clone();
    try {
      const data = await responseClone.json();
      cache.set(cacheKey, {
        timestamp: Date.now(),
        data: data
      });
    } catch (e) {
      console.error('Failed to parse and cache response', e);
    }
  }

  return response;
};
