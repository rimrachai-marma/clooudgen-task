import redisConfig from "../../config/redis.js";
import { logger } from "../../utilities/logger.js";

class RedisService {
  constructor() {
    this.config = redisConfig;
  }

  // Initialize Redis connections
  async initialize() {
    return await this.config.initialize();
  }

  // Get client for specific use case
  getClient(clientType) {
    if (!this.config.isAvailable()) {
      logger.warn(`Redis not available for client type: ${clientType}`);
      return null;
    }
    return this.config.getClient(clientType);
  }

  // Health check
  async healthCheck() {
    try {
      const mainClient = this.getClient("main");
      if (!mainClient) return false;

      await mainClient.ping();
      return true;
    } catch (error) {
      logger.error("Redis health check failed:", error);
      return false;
    }
  }

  // Graceful shutdown
  async shutdown() {
    return await this.config.disconnect();
  }
}

export default new RedisService();
