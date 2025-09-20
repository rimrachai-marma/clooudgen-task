import { RATE_LIMIT_WINDOWS, RATE_LIMITS } from "../../utilities/constants.js";

export const limiters = {
  global: {
    windowMs: RATE_LIMIT_WINDOWS.SHORT || 15 * 60 * 1000, // 15 minutes
    max: RATE_LIMITS.GLOBAL_MAX || 1000,
    message: "Too many requests from this IP, please try again later",
  },

  auth: {
    windowMs: RATE_LIMIT_WINDOWS.SHORT || 15 * 60 * 1000, // 15 minutes
    max: RATE_LIMITS.AUTH_MAX || 5,
    message: "Too many authentication attempts, please try again later",
    options: {
      skipSuccessfulRequests: true,
      resetOnSuccess: true,
    },
  },

  api: {
    windowMs: RATE_LIMIT_WINDOWS.SHORT || 15 * 60 * 1000, // 15 minutes
    max: RATE_LIMITS.API_MAX || 100,
    message: "API rate limit exceeded, please try again later",
  },

  strict: {
    windowMs: RATE_LIMIT_WINDOWS.MEDIUM || 60 * 60 * 1000, // 1 hour
    max: RATE_LIMITS.STRICT_MAX || 3,
    message: "Rate limit exceeded for sensitive operation",
  },

  upload: {
    windowMs: RATE_LIMIT_WINDOWS.MEDIUM || 60 * 60 * 1000, // 1 hour
    max: RATE_LIMITS.UPLOAD_MAX || 10,
    message: "Upload rate limit exceeded",
  },
};
