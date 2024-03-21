import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.cookie("token", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  });
  return res.status(statusCode).json({
    status: "success",
    token,
  });
};
//Signup
export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  createSendToken(newUser, 201, res);
  // return res.status(201).json({
  //   message: "User created successfully",
  //   user: newUser,
  // });
});

//Signin
export const signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1.Check if email and password is provided
  if (!email || !password) {
    return next(new AppError("Please provide an email and password", 400));
  }
  //2.Check if the user exists and password is correct

  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );

  if (!user || !(await user.isCorrectPassword(password, user.password))) {
    return next(new AppError("email or password is not correct"), 400);
  }

  createSendToken(user, 200, res);

  next();
});

//Logout
export const signout = catchAsync(async (req, res, next) => {
  res.cookie("token", "none", {});
  res.status(200).json({
    message: "User logged out successfully",
  });
});
const authController = {
  signup,
  signin,
  signout,
};

export default authController;
