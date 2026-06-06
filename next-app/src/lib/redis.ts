import { Redis } from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let redis: Redis;

if (process.env.NODE_ENV === 'production') {
  redis = new Redis(REDIS_URL, { maxRetriesPerRequest: null });
} else {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(global as any).redis) {
    (global as any).redis = new Redis(REDIS_URL, { maxRetriesPerRequest: null });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  redis = (global as any).redis;
}

export { redis };
