import express from "express";

import { auth } from "../../../middlewares/auth.js";
import { getUserProfile } from "../../../controllers/user.js";

const router = new express.Router();

router.get("/profile", auth, getUserProfile); // Private route

export default router;
