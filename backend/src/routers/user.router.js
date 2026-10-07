import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserProfile,
  changePassword,
  refreshAccessToken,
  getAllUsers,
} from "../controllers/User.controller.js";
import varifyjwt from "../middleware/varify.middleware.js";
import { verifyAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

// Protected routes
router.post("/logout", varifyjwt, logoutUser);
router.get("/user", varifyjwt, getCurrentUser);
router.get("/profile", varifyjwt, getCurrentUser);
router.put("/user", varifyjwt, updateUserProfile);
router.put("/profile", varifyjwt, updateUserProfile);
router.put("/change-password", varifyjwt, changePassword);
router.delete("/user", varifyjwt, logoutUser);

// Admin routes
router.get("/users", varifyjwt, verifyAdmin, getAllUsers);

export default router;
