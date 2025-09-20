import { ipKeyGenerator } from "express-rate-limit";

export const keyGenerator = (req) => {
  if (req.user && req.user._id) {
    return `user:${req.user._id}`;
  }

  return `ip:${ipKeyGenerator(req)}`;
};

export const skipRequests = (req) => {
  if (req.path === "/") {
    return true;
  }

  const whitelist = process.env.RATE_LIMIT_WHITELIST?.split(",") || [];
  const clientIp = ipKeyGenerator(req);

  if (whitelist.includes(clientIp)) {
    logger.info(`Rate limiting skipped for whitelisted IP: ${clientIp}`);
    return true;
  }

  return false;
};
