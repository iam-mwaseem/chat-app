import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";

export const getUserChats = catchAsync(async (req, res, next) => {
  console.log(req.user);
  const user = req.user._id;

  const filteredUser = await User.find({ _id: { $ne: user } }).select(
    "-password"
  );

  res.status(200).json({
    message: "user fetched successfully",
    filteredUser,
  });

  next();
});

const userController = {
  getUserChats,
};

export default userController;
