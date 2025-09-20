import express from "express";

import authRoutes from "./auth.js";
import productRoutes from "./products.js";
import userRoutes from "./users.js";
import { auth } from "../../../middlewares/auth.js";
import { verify } from "../../../controllers/auth.js";
import { authLimiter } from "../../../middlewares/rateLimiter/index.js";

const router = express.Router();

router.use("/auth/verify", auth, verify);
router.use("/auth", authLimiter, authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);

export default router;
