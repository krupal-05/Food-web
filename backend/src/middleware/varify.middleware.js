import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/User.model.js";

const varifyjwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "")?.trim();

    if (!token) {
      throw new ApiError(401, "Access token not found, please log in");
    }

    const secret = process.env.JWT_ACCESS_SECRET || "poiuyt123456789rewqasdfghjklmnbv_access_secret_key_12345";
    const decoded = jwt.verify(token, secret);

    const userId = decoded?._id || decoded?.userId;
    if (!userId) {
      throw new ApiError(401, "Invalid token payload");
    }

    const user = await User.findById(userId).select("-password -reFreshToken");
    if (!user) {
      throw new ApiError(404, "User not found or account deactivated");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access token expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid access token");
    } else {
      throw new ApiError(500, error.message || "Internal server error");
    }
  }
});

export const verifyJwt = varifyjwt;
export default varifyjwt;
