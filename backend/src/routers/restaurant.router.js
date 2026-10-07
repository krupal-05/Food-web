import { Router } from "express";
import {
  registerRestaurant,
  getAllRestaurants,
  getRestaurantById,
  getMyRestaurants,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/Restaurant.controller.js";
import varifyjwt from "../middleware/varify.middleware.js";
import { verifyOwnerOrAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.midelware.js";

const router = Router();

// Public routes
router.get("/", getAllRestaurants);
router.get("/all", getAllRestaurants);
router.get("/All-restaurants", getAllRestaurants);
router.post("/All-restaurants", getAllRestaurants); // legacy compatibility
router.get("/:restaurantId", getRestaurantById);
router.get("/restaurant/:restaurantId", getRestaurantById); // legacy compatibility

// Protected routes (Owner / Admin)
router.post(
  "/register",
  varifyjwt,
  verifyOwnerOrAdmin,
  upload.single("image"),
  registerRestaurant
);
router.post(
  "/register-restaurant",
  varifyjwt,
  verifyOwnerOrAdmin,
  upload.single("image"),
  registerRestaurant
); // legacy compatibility

router.get("/owner/my-restaurants", varifyjwt, verifyOwnerOrAdmin, getMyRestaurants);

router.put(
  "/:restaurantId",
  varifyjwt,
  verifyOwnerOrAdmin,
  upload.single("image"),
  updateRestaurant
);
router.put(
  "/restaurant/:restaurantId",
  varifyjwt,
  verifyOwnerOrAdmin,
  upload.single("image"),
  updateRestaurant
); // legacy compatibility

router.delete(
  "/:restaurantId",
  varifyjwt,
  verifyOwnerOrAdmin,
  deleteRestaurant
);
router.delete(
  "/restaurant/:restaurantId",
  varifyjwt,
  verifyOwnerOrAdmin,
  deleteRestaurant
); // legacy compatibility

export default router;