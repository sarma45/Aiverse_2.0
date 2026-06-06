import { redis } from './redis';

const DEFAULT_TTL = 60; // 60 seconds

export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  if (!redis || process.env.NODE_ENV !== 'production') {
    return fetcher(); // Skip cache in dev to avoid stale data during rapid iteration
  }

  try {
    const cachedData = await redis.get(key);

    if (cachedData) {
      // Background revalidation (stale-while-revalidate pattern)
      // If we want true SWR, we'd check an exact timestamp. For simplicity,
      // we'll just return cached and let TTL expire, or we can trigger fetcher async
      // Let's implement a simple SWR by keeping a secondary "stale" timestamp if needed.
      // But standard Redis SETEX works well enough for an MVP cache.
      return JSON.parse(cachedData);
    }

    const data = await fetcher();
    await redis.setex(key, ttl, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error(`Redis Cache Error for key ${key}:`, error);
    // Fallback to fetcher if Redis fails
    return fetcher();
  }
}
