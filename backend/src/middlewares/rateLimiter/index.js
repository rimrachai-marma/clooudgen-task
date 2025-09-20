import rateLimit from "express-rate-limit";

import { getStore } from "./stores.js";
import { limiters } from "./limiters.js";
import { rateLimitHandler } from "./handlers.js";
import { keyGenerator, skipRequests } from "./utils.js";

const createRateLimiter = (config) => {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    message: { error: config.message },
    standardHeaders: true,
    legacyHeaders: false,
    store: getStore(),
    keyGenerator,
    skip: skipRequests,
    handler: rateLimitHandler,
    ...config.options,
  });
};

export const globalLimiter = createRateLimiter(limiters.global);
export const authLimiter = createRateLimiter(limiters.auth);
export const apiLimiter = createRateLimiter(limiters.api);
export const strictLimiter = createRateLimiter(limiters.strict);
export const uploadLimiter = createRateLimiter(limiters.upload);
