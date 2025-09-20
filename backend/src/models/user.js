import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import ErrorResponse from "../utilities/errorResponse.js";

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      trim: true,
      enum: ["customer", "admin", "superadmin"],
      default: "customer",
    },

    tokens: [tokenSchema],
  },

  {
    timestamps: true,
  }
);

//hash and salting password with middleware "Pre Hook"
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//comparing passwoed with static method
userSchema.statics.findByCredentials = async (email, enteredPassword) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ErrorResponse("Credentials do not match", 400);
  }

  const isMatch = await bcrypt.compare(enteredPassword, user.password);

  if (!isMatch) {
    throw new ErrorResponse("Credentials do not match", 400);
  }

  return user;
};

// generate auth token with instance method
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  this.tokens = this.tokens.concat({ token });
  await this.save();

  return token;
};

const User = mongoose.model("User", userSchema);

export default User;
