import User from "../models/user.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import ErrorResponse from "../utilities/errorResponse.js";

//@desc   register users
//@route  POST /api/users/register
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
      token: {
        token_type: "JWT",
        token: token,
      },
    },
  });
});

// @desc    Auth user & get token
// @route   POST /api/users/login
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
      token: {
        token_type: "JWT",
        token: token,
      },
    },
  });
});

// @desc    User logout
// @route   POST /api/users/logout
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
// @route   POST /api/users/logout-all-devices
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
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
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
