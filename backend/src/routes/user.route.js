import express from "express";
import { userRegister } from "../controllers/user.controller.js";

const router = new express.Router();

router.post("/register", userRegister);

export default router;
