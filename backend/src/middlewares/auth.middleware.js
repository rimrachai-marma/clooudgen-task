import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import asyncHandler from "./asyncHandler.middleware.js";
import ErrorResponse from "../utilities/errorResponse.js";

export const auth = async (req, res, next) => {
  let token;

  const authHeader = req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.replace("Bearer ", "");
  }

  if (!token) {
    throw new ErrorResponse("Access denied. No token provided", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    }).select("-password");

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    throw new ErrorResponse("Not authorized, token failed", 401);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const roleText = roles.length === 1 ? roles[0] : roles.join(" or ");
      throw new ErrorResponse(
        `Access denied, not authorized as ${roleText}`,
        403
      );
    }

    next();
  };
};

export const admin = authorize("admin", "superadmin");
export const superadmin = authorize("superadmin");
