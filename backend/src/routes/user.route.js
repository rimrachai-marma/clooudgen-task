import express from "express";
import {
  userLogin,
  userRegister,
  userLogout,
  logoutAllDevices,
  getUserProfile,
} from "../controllers/user.controller.js";
import validateBody from "../middlewares/validate.middleware.js";
import { userRegisterSchema, userLoginSchema } from "../schemas/user.schema.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = new express.Router();

router.post("/register", validateBody(userRegisterSchema), userRegister);
router.post("/login", validateBody(userLoginSchema), userLogin);

router.post("/logout", auth, userLogout); // Private route
router.post("/logout-all-devices", auth, logoutAllDevices); // Private route
router.get("/profile", auth, getUserProfile); // Private route

export default router;
