import express from "express";

import { auth } from "../../../middlewares/auth.js";
import validateBody from "../../../middlewares/validation.js";
import { userRegisterSchema, userLoginSchema } from "../../../schemas/user.js";
import {
  logoutAllDevices,
  userLogin,
  userLogout,
  userRegister,
  // verify,
} from "../../../controllers/auth.js";

const router = new express.Router();

router.post("/register", validateBody(userRegisterSchema), userRegister);
router.post("/login", validateBody(userLoginSchema), userLogin);

router.post("/logout", auth, userLogout); // Private route
router.post("/logout-all-devices", auth, logoutAllDevices); // Private route

export default router;
