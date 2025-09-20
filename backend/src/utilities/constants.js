export const RATE_LIMITS = {
  GLOBAL_MAX: parseInt(process.env.RATE_LIMIT_GLOBAL_MAX) || 1000,
  AUTH_MAX: parseInt(process.env.RATE_LIMIT_AUTH_MAX) || 5,
  API_MAX: parseInt(process.env.RATE_LIMIT_API_MAX) || 100,
  STRICT_MAX: parseInt(process.env.RATE_LIMIT_STRICT_MAX) || 3,
  UPLOAD_MAX: parseInt(process.env.RATE_LIMIT_UPLOAD_MAX) || 10,
};

export const RATE_LIMIT_WINDOWS = {
  SHORT: 15 * 60 * 1000, // 15 minutes
  MEDIUM: 60 * 60 * 1000, // 1 hour
  LONG: 24 * 60 * 60 * 1000, // 24 hours
};

export const CACHE_TTL = {
  PRODUCT_LIST: 300, // 5 minutes for product lists
  SINGLE_PRODUCT: 1800, // 30 minutes for single product
  FEATURED_PRODUCTS: 600, // 10 minutes for featured products
};
