import { Router } from "express";
import {
  addOrder,
  createOrder,
  getUserOrders,
  getOrderById,
  getRestaurantOrders,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
} from "../controllers/Order.controller.js";
import varifyjwt from "../middleware/varify.middleware.js";
import { verifyAdmin, verifyOwnerOrAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// All order routes require authentication
router.use(varifyjwt);

// Customer endpoints
router.post("/", addOrder);
router.post("/create", createOrder);
router.get("/my-orders", getUserOrders);
router.get("/user", getUserOrders);
router.get("/:orderId", getOrderById);
router.put("/:orderId/cancel", cancelOrder);
router.patch("/:orderId/cancel", cancelOrder);

// Restaurant Owner endpoints
router.get("/owner/restaurant-orders", verifyOwnerOrAdmin, getRestaurantOrders);
router.put("/:orderId/status", updateOrderStatus);
router.patch("/:orderId/status", updateOrderStatus);

// Admin endpoints
router.get("/admin/all", verifyAdmin, getAllOrders);

export default router;
