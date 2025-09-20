import redis from "redis";
import { logger } from "../utilities/logger.js";

class RedisConfig {
  constructor() {
    this.clients = new Map();
    this.isConnected = false;
  }

  async initialize() {
    try {
      const baseOptions = {
        url: process.env.REDIS_URL,
        retry_delay: 100,
        max_attempts: 3,
      };

      // Main client for general operations
      this.clients.set("main", redis.createClient(baseOptions));

      // Dedicated client for caching
      this.clients.set("cache", redis.createClient(baseOptions));

      // Dedicated client for rate limiting
      this.clients.set("rateLimit", redis.createClient(baseOptions));

      // Dedicated client for sessions
      this.clients.set("session", redis.createClient(baseOptions));

      // Dedicated client for pub/sub
      this.clients.set("pubsub", redis.createClient(baseOptions));

      // Connect all clients
      const connectionPromises = Array.from(this.clients.entries()).map(
        async ([name, client]) => {
          await client.connect();
          logger.info(`Redis client '${name}' connected`);

          // Error handling for each client
          client.on("error", (err) => {
            logger.error(`Redis client '${name}' error:`, err);
          });

          client.on("reconnecting", () => {
            logger.info(`Redis client '${name}' reconnecting...`);
          });
        }
      );

      await Promise.all(connectionPromises);
      this.isConnected = true;
      logger.info("All Redis clients connected successfully");
    } catch (error) {
      logger.error("Redis initialization failed:", error);
      this.isConnected = false;
      throw error;
    }
  }

  // Get specific Redis client
  getClient(name = "main") {
    const client = this.clients.get(name);
    if (!client) {
      throw new Error(`Redis client '${name}' not found`);
    }
    return client;
  }

  // Check if Redis is available
  isAvailable() {
    return this.isConnected;
  }

  // Graceful shutdown
  async disconnect() {
    try {
      const disconnectPromises = Array.from(this.clients.entries()).map(
        async ([name, client]) => {
          await client.disconnect();
          logger.info(`Redis client '${name}' disconnected`);
        }
      );

      await Promise.all(disconnectPromises);
      this.isConnected = false;
      logger.info("All Redis clients disconnected");
    } catch (error) {
      logger.error("Error disconnecting Redis clients:", error);
    }
  }
}

export default new RedisConfig();
