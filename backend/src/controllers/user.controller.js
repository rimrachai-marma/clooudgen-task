import User from "../models/user.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";

//@desc   register users
//@route  POST /api/users/register
//@access Public route
export const userRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

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
