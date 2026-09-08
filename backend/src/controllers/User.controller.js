import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return {
      accessToken,
      refreshToken
    };

  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {

  const {
    firstName,
    lastName,
    email,
    contact,
    password,
    avatar
  } = req.body;


  // Validate required fields
  if (
    !firstName?.trim() ||
    !lastName?.trim() ||
    !email?.trim() ||
    !contact ||
    !password?.trim()
  ) {
    throw new ApiError(
      400,
      "First name, last name, email, contact and password are required"
    );
  }


  // Check existing user
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(
      409,
      "User with this email already exists"
    );
  }



  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    contact,
    password,
    avatar: avatar?.trim() || "",
    role: "customer"
  });


  const registeredUser = await User.findById(user._id)
    .select("-password -refreshToken");


  if (!registeredUser) {
    throw new ApiError(
      500,
      "User registration failed"
    );
  }


  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        registeredUser,
        "User registered successfully"
      )
    );
});


const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;


  if (!email?.trim() || !password?.trim()) {
    throw new ApiError(
      400,
      "Email and password are required"
    );
  }


  const user = await User.findOne({
    email: email.trim().toLowerCase()
  });


  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }


  const isPasswordCorrect =
    await user.isPasswordCorrect(password);


  if (!isPasswordCorrect) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }


  const {
    accessToken,
    refreshToken
  } = await generateAccessAndRefreshToken(user._id);


  const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken");


  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken
        },
        "User logged in successfully"
      )
    );
});


const logoutUser = asyncHandler(async (req, res) => {

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1
      }
    }
  );


  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "User logged out successfully"
      )
    );
});


const getCurrentUser = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user._id)
    .select("-password -refreshToken");


  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }


  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        "Current user fetched successfully"
      )
    );
});


const changePassword = asyncHandler(async (req, res) => {

  const { oldPassword, newPassword } = req.body;


  if (
    !oldPassword?.trim() ||
    !newPassword?.trim()
  ) {
    throw new ApiError(
      400,
      "Old password and new password are required"
    );
  }


  const user = await User.findById(req.user._id);


  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }


  const isPasswordCorrect =
    await user.isPasswordCorrect(oldPassword);


  if (!isPasswordCorrect) {
    throw new ApiError(
      400,
      "Old password is incorrect"
    );
  }


  user.password = newPassword;

  await user.save();


  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Password changed successfully"
      )
    );
});


export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  changePassword
};