import { logger } from "./logger.js";
import cacheService from "../services/redis/cache.js";

export const generateSlug = (name) => {
  const baseSlug =
    name
      .toLowerCase()
      .normalize("NFD") // Normalize accents
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, "") || "n-a"; // Remove leading/trailing hyphens, fallback

  const uniqueSuffix =
    Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

  return `${baseSlug}-${uniqueSuffix}`;
};

export const generateCacheKey = (prefix, params) => {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      if (params[key] !== null && params[key] !== undefined) {
        result[key] = params[key];
      }
      return result;
    }, {});

  const paramsString = JSON.stringify(sortedParams);

  return `${prefix}:${Buffer.from(paramsString).toString("base64")}`;
};

export const clearProductCaches = async (slug = null) => {
  try {
    const client = cacheService.getClient();
    if (!client) return;

    if (slug) {
      await cacheService.del(`product:${slug}`);
    }

    const keys = await client.keys("products:*");

    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    logger.error("Error clearing product caches", error);
  }
};
