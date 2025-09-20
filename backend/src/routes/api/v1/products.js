import express from "express";

import {
  createProduct,
  getProduct,
  getProducts,
} from "../../../controllers/product.js";
import { admin, auth } from "../../../middlewares/auth.js";
import validateBody from "../../../middlewares/validation.js";
import { productCreateSchema } from "../../../schemas/product.js";

const router = new express.Router();

router.get("/", getProducts); // Public route
router.get("/:slug", getProduct); // Public route
router.post("/", auth, admin, validateBody(productCreateSchema), createProduct); // Private & Admin route

export default router;
