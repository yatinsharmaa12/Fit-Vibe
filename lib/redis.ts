import { createClient, RedisClientType } from 'redis';

// Singleton pattern for Redis client
let redisClient: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType> {
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || undefined,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error('Redis: Too many reconnection attempts');
          return new Error('Redis connection failed');
        }
        return retries * 1000; // Exponential backoff
      },
    },
  });

  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis Connected');
  });

  redisClient.on('disconnect', () => {
    console.warn('⚠️ Redis Disconnected');
  });

  await redisClient.connect();
  return redisClient;
}

// ==================== CACHING ====================

/**
 * Get cached data or fetch and cache if not found
 * @param key - Cache key
 * @param fetchFn - Function to fetch data if cache miss
 * @param ttl - Time to live in seconds (default: 300 = 5 minutes)
 */
export async function getCached<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  try {
    const client = await getRedisClient();
    
    // Try to get from cache
    const cached = await client.get(key);
    if (cached) {
      console.log(`✅ Cache HIT: ${key}`);
      return JSON.parse(cached) as T;
    }

    console.log(`❌ Cache MISS: ${key}`);
    
    // Fetch data
    const data = await fetchFn();
    
    // Store in cache
    await client.setEx(key, ttl, JSON.stringify(data));
    
    return data;
  } catch (error) {
    console.error('Redis cache error:', error);
    // Fallback to fetching without cache
    return fetchFn();
  }
}

/**
 * Invalidate cache by key or pattern
 */
export async function invalidateCache(pattern: string): Promise<void> {
  try {
    const client = await getRedisClient();
    
    if (pattern.includes('*')) {
      // Pattern matching - delete multiple keys
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
        console.log(`🗑️ Invalidated ${keys.length} cache keys matching: ${pattern}`);
      }
    } else {
      // Single key
      await client.del(pattern);
      console.log(`🗑️ Invalidated cache: ${pattern}`);
    }
  } catch (error) {
    console.error('Redis invalidation error:', error);
  }
}

// ==================== RATE LIMITING ====================

/**
 * Check if request should be rate limited
 * @param identifier - User ID or IP address
 * @param limit - Maximum requests per window
 * @param windowSeconds - Time window in seconds (default: 60 = 1 minute)
 * @returns true if within limit, false if rate limited
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowSeconds: number = 60
): Promise<boolean> {
  try {
    const client = await getRedisClient();
    const key = `rate:${identifier}:${Math.floor(Date.now() / (windowSeconds * 1000))}`;
    
    const current = await client.incr(key);
    
    if (current === 1) {
      // First request in window, set expiration
      await client.expire(key, windowSeconds);
    }
    
    return current <= limit;
  } catch (error) {
    console.error('Rate limit error:', error);
    // Fail open - allow request if Redis is down
    return true;
  }
}

/**
 * Get current rate limit count
 */
export async function getRateLimitCount(
  identifier: string,
  windowSeconds: number = 60
): Promise<number> {
  try {
    const client = await getRedisClient();
    const key = `rate:${identifier}:${Math.floor(Date.now() / (windowSeconds * 1000))}`;
    const count = await client.get(key);
    return count ? parseInt(count) : 0;
  } catch (error) {
    console.error('Get rate limit error:', error);
    return 0;
  }
}

// ==================== SESSION STORAGE ====================

/**
 * Store session data
 */
export async function setSession(
  sessionId: string,
  data: any,
  ttl: number = 86400 // 24 hours
): Promise<void> {
  try {
    const client = await getRedisClient();
    await client.setEx(`session:${sessionId}`, ttl, JSON.stringify(data));
  } catch (error) {
    console.error('Set session error:', error);
  }
}

/**
 * Get session data
 */
export async function getSession(sessionId: string): Promise<any | null> {
  try {
    const client = await getRedisClient();
    const data = await client.get(`session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

/**
 * Delete session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  try {
    const client = await getRedisClient();
    await client.del(`session:${sessionId}`);
  } catch (error) {
    console.error('Delete session error:', error);
  }
}

// ==================== USER PRESENCE ====================

/**
 * Set user as online
 */
export async function setUserOnline(
  userId: string,
  ttl: number = 300 // 5 minutes
): Promise<void> {
  try {
    const client = await getRedisClient();
    await client.setEx(`presence:${userId}`, ttl, Date.now().toString());
  } catch (error) {
    console.error('Set user online error:', error);
  }
}

/**
 * Check if user is online
 */
export async function isUserOnline(userId: string): Promise<boolean> {
  try {
    const client = await getRedisClient();
    const exists = await client.exists(`presence:${userId}`);
    return exists === 1;
  } catch (error) {
    console.error('Check user online error:', error);
    return false;
  }
}

/**
 * Get all online users
 */
export async function getOnlineUsers(): Promise<string[]> {
  try {
    const client = await getRedisClient();
    const keys = await client.keys('presence:*');
    return keys.map(key => key.replace('presence:', ''));
  } catch (error) {
    console.error('Get online users error:', error);
    return [];
  }
}

// ==================== LEADERBOARD ====================

/**
 * Add user to leaderboard (sorted set)
 */
export async function updateLeaderboard(
  userId: string,
  score: number
): Promise<void> {
  try {
    const client = await getRedisClient();
    await client.zAdd('leaderboard', { score, value: userId });
  } catch (error) {
    console.error('Update leaderboard error:', error);
  }
}

/**
 * Get top users from leaderboard
 */
export async function getTopUsers(limit: number = 100): Promise<Array<{ userId: string; score: number }>> {
  try {
    const client = await getRedisClient();
    const results = await client.zRangeWithScores('leaderboard', 0, limit - 1, { REV: true });
    return results.map(r => ({ userId: r.value, score: r.score }));
  } catch (error) {
    console.error('Get top users error:', error);
    return [];
  }
}

/**
 * Get user rank
 */
export async function getUserRank(userId: string): Promise<number | null> {
  try {
    const client = await getRedisClient();
    const rank = await client.zRevRank('leaderboard', userId);
    return rank !== null ? rank + 1 : null; // Convert to 1-based ranking
  } catch (error) {
    console.error('Get user rank error:', error);
    return null;
  }
}

// ==================== UTILITIES ====================

/**
 * Close Redis connection (for graceful shutdown)
 */
export async function closeRedis(): Promise<void> {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    redisClient = null;
    console.log('Redis connection closed');
  }
}

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGTERM', closeRedis);
  process.on('SIGINT', closeRedis);
}

export default getRedisClient;
