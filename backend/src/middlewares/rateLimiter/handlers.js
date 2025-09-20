import { logger } from "../../utilities/logger.js";
import ErrorResponse from "../../utilities/errorResponse.js";

export const rateLimitHandler = (req, res, next, options) => {
  const client = {
    ip: req.headers["x-forwarded-for"]?.split(",")[0] || req.ip,
    userAgent: req.headers["user-agent"],
    path: req.path,
    method: req.method,
    userId: req.user?._id || "anonymous",
  };

  logger.warn("Rate limit exceeded", { client });

  throw new ErrorResponse("Rate limit exceeded", options.statusCode || 429, {
    error: options.message.error || "Too many requests",
    retryAfter: Math.round(req.rateLimit.resetTime / 1000), // seconds
    limit: req.rateLimit.limit,
    current: req.rateLimit.used,
    remaining: req.rateLimit.remaining,
    resetTime: new Date(req.rateLimit.resetTime),
  });
};
