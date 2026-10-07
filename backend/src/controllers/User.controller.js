import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/Apiresponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const reFreshToken = user.generateRefreshToken();

    user.reFreshToken = reFreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      accessToken,
      reFreshToken,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password, role, address } = req.body;

  if (
    !firstName?.trim() ||
    !lastName?.trim() ||
    !email?.trim() ||
    !password?.trim()
  ) {
    throw new ApiError(
      400,
      "First name, last name, email, and password are required"
    );
  }

  const existingUser = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const allowedRoles = ["customer", "restaurantOwner", "admin", "deliveryAgent"];
  const userRole = role && allowedRoles.includes(role) ? role : "customer";

  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || "",
    password,
    role: userRole,
    address: address || { street: "", city: "", pincode: "" },
  });

  const { accessToken, reFreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const createdUser = await User.findById(user._id).select(
    "-password -reFreshToken"
  );

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", reFreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        {
          user: createdUser,
          accessToken,
          reFreshToken,
        },
        "User registered successfully"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { accessToken, reFreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -reFreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", reFreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          reFreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  if (req.user?._id) {
    await User.findByIdAndUpdate(req.user._id, {
      $set: {
        reFreshToken: null,
      },
    });
  }

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -reFreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Current user fetched successfully"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, address, avatar } = req.body;

  const updateFields = {};
  if (firstName?.trim()) updateFields.firstName = firstName.trim();
  if (lastName?.trim()) updateFields.lastName = lastName.trim();
  if (phone !== undefined) updateFields.phone = phone.trim();
  if (avatar !== undefined) updateFields.avatar = avatar;
  if (address) {
    updateFields.address = {
      street: address.street || "",
      city: address.city || "",
      pincode: address.pincode || "",
    };
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).select("-password -reFreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword?.trim() || !newPassword?.trim()) {
    throw new ApiError(400, "Old password and new password are required");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized: Refresh token is missing");
  }

  const secret =
    process.env.JWT_REFRESH_SECRET ||
    "poiuytrewqas123456789dfghjklmnbv_refresh_secret_key_12345";

  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, secret);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const userId = decoded?._id || decoded?.userId;
  const user = await User.findById(userId);

  if (!user || user.reFreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is expired or has been used");
  }

  const { accessToken, reFreshToken: newRefreshToken } =
    await generateAccessAndRefreshToken(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          reFreshToken: newRefreshToken,
        },
        "Access token refreshed successfully"
      )
    );
});

// Admin endpoint to list all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -reFreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

// Aliases for compatibility
const login = loginUser;
const logout = logoutUser;
const updateUser = updateUserProfile;

export {
  registerUser,
  loginUser,
  login,
  logoutUser,
  logout,
  getCurrentUser,
  updateUserProfile,
  updateUser,
  changePassword,
  refreshAccessToken,
  getAllUsers,
};