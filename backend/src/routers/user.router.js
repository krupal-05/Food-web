import Router from "express";
import varifyjwt from "../middleware/varify.middleware.js";
import {     
  registerUser,
    login,
    logout,
    getCurrentUser,
    updateUser } from "../controllers/User.controller.js";
const router = Router();
router.route("/login").post(login);
router.route("/register").post(registerUser);
router.route("/user").get(varifyjwt, getCurrentUser);
router.route("/user").put(varifyjwt, updateUser);
router.route("/user").delete(varifyjwt, logout);
export default router;
