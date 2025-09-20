import User from "../models/user.js";
import ErrorResponse from "../utilities/errorResponse.js";
import asyncHandler from "../middlewares/asyncHandler.js";

//@desc   register users
//@route  POST /api/auth/register
//@access Public route
export const userRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.validatedData;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ErrorResponse("User already exists", 409);
  }

  const newUser = await User.create({ name, email, password });

  const token = await newUser.generateAuthToken();

  res.status(201).send({
    status: "success",
    message: "User registered successfully",
    data: {
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      access_token: {
        token_type: "Bearer",
        token: token,
      },
    },
  });
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedData;

  const user = await User.findByCredentials(email, password);

  const token = await user.generateAuthToken();

  res.status(200).send({
    status: "success",
    message: "User logged in successfully",
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      access_token: {
        token_type: "Bearer",
        token: token,
      },
    },
  });
});

// @desc    User logout
// @route   POST /api/auth/logout
// @access  Private
export const userLogout = asyncHandler(async (req, res) => {
  req.user.tokens = req.user.tokens.filter((tokenObj) => {
    return tokenObj.token !== req.token;
  });
  await req.user.save();

  res.status(202).send({
    status: "success",
    message: "User logged out successfully",
  });
});

// @desc    User logout all divice
// @route   POST /api/auth/logout-all-devices
// @access  Private
export const logoutAllDevices = asyncHandler(async (req, res) => {
  req.user.tokens = [];
  await req.user.save();

  res.status(202).send({
    status: "success",
    message: "Successfully logged out from all devices",
  });
});

// @desc    Get user profile
// @route   GET /api/auth/verify
// @access  Private
export const verify = asyncHandler(async (req, res) => {
  res.status(200).send({
    status: "success",
    data: {
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    },
  });
});
