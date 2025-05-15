// lib/cache.ts

interface CacheItem {
    data: any;
    expiry: number;
  }
  
  class SimpleCache {
    private cache: Record<string, CacheItem> = {};
    private defaultTTL: number;
  
    constructor(defaultTTLSeconds: number = 300) {
      this.defaultTTL = defaultTTLSeconds * 1000; // ms
    }
  
    get(key: string): any {
      const item = this.cache[key];
      if (!item || item.expiry < Date.now()) {
        delete this.cache[key];
        return null;
      }
      return item.data;
    }
  
    set(key: string, data: any, ttlSeconds?: number): void {
      const ttl = (ttlSeconds || this.defaultTTL) * 1000;
      this.cache[key] = {
        data,
        expiry: Date.now() + ttl,
      };
    }
  
    delete(key: string): void {
      delete this.cache[key];
    }
  
    clearAll(): void {
      this.cache = {};
    }
  }
  
  export const userCache = new SimpleCache(300);
  