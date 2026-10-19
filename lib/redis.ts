import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType> {
  if (redisClient?.isOpen) {
    return redisClient;
  }

  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || undefined,
    socket: {
      connectTimeout: 3000,
      reconnectStrategy: (retries) => {
        if (retries > 3) {
          return new Error('Redis connection failed');
        }
        return Math.min(retries * 200, 1000);
      },
    },
  });

  redisClient.on('error', (error) => {
    console.error('Redis client error:', error instanceof Error ? error.message : error);
  });

  await redisClient.connect();
  return redisClient;
}

export async function getCached<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  try {
    const client = await getRedisClient();
    const cached = await client.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }

    const data = await fetchFn();
    await client.setEx(key, ttl, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Redis cache error:', error instanceof Error ? error.message : error);
    return fetchFn();
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  try {
    const client = await getRedisClient();

    if (!pattern.includes('*')) {
      await client.del(pattern);
      return;
    }

    let cursor = '0';
    do {
      const result = await client.scan(cursor, { MATCH: pattern, COUNT: 100 });
      cursor = String(result.cursor);
      if (result.keys.length > 0) {
        await client.del(result.keys);
      }
    } while (cursor !== '0');
  } catch (error) {
    console.error('Redis invalidation error:', error instanceof Error ? error.message : error);
  }
}

export async function closeRedis(): Promise<void> {
  if (redisClient?.isOpen) {
    await redisClient.quit();
    redisClient = null;
  }
}

if (typeof process !== 'undefined') {
  process.once('SIGTERM', () => {
    void closeRedis();
  });
  process.once('SIGINT', () => {
    void closeRedis();
  });
}

export default getRedisClient;
