import RedisStore from "rate-limit-redis";
import redisService from "../../services/redis/index.js";
import { logger } from "../../utilities/logger.js";

export const getStore = () => {
  try {
    const rateLimitClient = redisService.getClient("rateLimit");

    if (rateLimitClient) {
      return new RedisStore({
        sendCommand: (...args) => rateLimitClient.sendCommand(args),
        prefix: "rl:",
      });
    }
  } catch (error) {
    logger.error("Rate limit Redis store error:", error);
  }

  // // Fallback to memory store (not recommended for production)
  logger.warn(
    "Using memory store for rate limiting - not suitable for production"
  );
  return undefined; // Use default memory store
};
