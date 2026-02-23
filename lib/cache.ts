/**
 * Simple in-memory cache for API responses
 * This helps reduce database queries and improve performance
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class Cache {
  private cache: Map<string, CacheItem<any>>;
  private defaultTTL: number;

  constructor(defaultTTL: number = 60000) {
    // Default TTL: 60 seconds
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + (ttl || this.defaultTTL),
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if cache has expired
    if (Date.now() > item.timestamp) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.timestamp) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instance
export const apiCache = new Cache();

// Run cleanup every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => apiCache.cleanup(), 5 * 60 * 1000);
}
