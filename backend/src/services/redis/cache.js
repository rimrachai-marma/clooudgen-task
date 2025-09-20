import redisService from "./index.js";
import { logger } from "../../utilities/logger.js";

class CacheService {
  constructor() {
    this.client = null;
    this.defaultTTL = 3600; // 1 hour
  }

  getClient() {
    if (!this.client) {
      this.client = redisService.getClient("cache");
    }
    return this.client;
  }

  async set(key, value, ttl = this.defaultTTL) {
    try {
      const client = this.getClient();
      if (!client) return false;

      const serializedValue = JSON.stringify(value);
      await client.setEx(key, ttl, serializedValue);
      return true;
    } catch (error) {
      logger.error("Cache set error:", error);
      return false;
    }
  }

  async get(key) {
    try {
      const client = this.getClient();
      if (!client) return null;

      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error("Cache get error:", error);
      return null;
    }
  }

  async del(key) {
    try {
      const client = this.getClient();
      if (!client) return false;

      await client.del(key);
      return true;
    } catch (error) {
      logger.error("Cache delete error:", error);
      return false;
    }
  }

  async exists(key) {
    try {
      const client = this.getClient();
      if (!client) return false;

      const result = await client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error("Cache exists error:", error);
      return false;
    }
  }

  // Cache with automatic JSON handling
  async getOrSet(key, fetchFunction, ttl = this.defaultTTL) {
    try {
      // Try to get from cache first
      const cached = await this.get(key);
      if (cached !== null) {
        return { data: cached, cached: true };
      }

      // If not in cache, fetch data
      const data = await fetchFunction();

      // Store in cache
      await this.set(key, data, ttl);

      return { data, cached: false };
    } catch (error) {
      logger.error("Cache getOrSet error:", error);
      // Return fresh data if cache fails
      return await fetchFunction();
    }
  }
}

export default new CacheService();
