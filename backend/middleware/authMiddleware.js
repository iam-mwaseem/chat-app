import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

const protect = catchAsync(async (req, res, next) => {
  let token;
  //1.Check if the token is provided in the header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("You're not loggedIn , please login again", 401);
  } else {
    console.log("You are logged in");
  }

  //2. Verification
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //3.Check if user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    throw new Error("The user belonging to this token does no longer exist.");
  }

  req.user = currentUser;
  next();
});

export default protect;
