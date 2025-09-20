import express from "express";

import apiRoutesV1 from "./api/v1/index.js";
import { globalLimiter, apiLimiter } from "../middlewares/rateLimiter/index.js";

const router = express.Router();

router.use(globalLimiter);

router.get("/", (req, res) => {
  res.json({
    status: "✅ Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

router.use("/api/v1", apiLimiter, apiRoutesV1);

export default router;
