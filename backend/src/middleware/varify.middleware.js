import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";

const varifyjwt = asyncHandler(async (req, res, next) => {
try {
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","");

    if (!token) throw new ApiError(401, "Access token not found");

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRATE);
     const user = await User.findById(decoded?._id).select("-password -refreshToken");
     if(!user) throw new ApiError(404, "invalid token, user not found");

     req.user = user;
    next();     
}catch (error) {

    if (error.name === "TokenExpiredError") {
        throw new ApiError(401, "Access token expired");
    } else if (error.name === "JsonWebTokenError") {
        throw new ApiError(401, "Invalid access token");
    } else {
        throw new ApiError(500, "Internal server error");
    };
}

});

export default varifyjwt;