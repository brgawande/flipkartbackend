import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendToken } from "../utils/sendToken.js";

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return next(new ErrorHandler("Please Enter All The Fields", 404));

  let user = await User.findOne({ email });

  if (user) return next(new ErrorHandler("Email Already exist", 404));

  user = await User.create({ name, email, password });

  sendToken(user, res, "Registered Successfully", 201);
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorHandler("Please Enter All The Filds", 404));

  let user = await User.findOne({ email }).select("+password");

  if (!user)
    return next(new ErrorHandler("Incorrect EmailId Or Password", 404));

  const isMatch = await user.comparePassword(password);

  if (!isMatch) return next(new ErrorHandler("Password dosent match", 404));

  sendToken(user, res, `Welcome back ${user.name}`, 200);
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
      sameSite: "none",
      secure: true,
    })
    .json({
      success: true,
      message: "LoggesdOut Successfully",
    });
});
