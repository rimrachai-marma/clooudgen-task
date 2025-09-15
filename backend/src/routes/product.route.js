import express from "express";

import {
  createProduct,
  getProducts,
} from "../controllers/product.controller.js";
import { admin, auth } from "../middlewares/auth.middleware.js";
import validateBody from "../middlewares/validate.middleware.js";
import { productCreateSchema } from "../schemas/product.schema.js";

const router = new express.Router();

router.get("/", getProducts); // Public route
router.post("/", auth, admin, validateBody(productCreateSchema), createProduct); // Private & Admin route

export default router;
