import { Router } from "express";
import {
  addFoodItem,
  getAllFoods,
  getFoodById,
  getFoodsByRestaurant,
  updateFood,
  deleteFood,
  updateFoodImage,
} from "../controllers/food.controller.js";
import varifyjwt from "../middleware/varify.middleware.js";
import { verifyOwnerOrAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.midelware.js";

const router = Router();

// Public routes
router.get("/", getAllFoods);
router.get("/all", getAllFoods);
router.get("/:id", getFoodById);
router.get("/restaurant/:restaurantId", getFoodsByRestaurant);

// Protected routes (Restaurant Owner / Admin)
router.post(
  "/",
  varifyjwt,
  verifyOwnerOrAdmin,
  upload.single("image"),
  addFoodItem
);
router.post(
  "/add-food",
  varifyjwt,
  verifyOwnerOrAdmin,
  upload.single("image"),
  addFoodItem
); // legacy compatibility

router.put(
  "/:id",
  varifyjwt,
  verifyOwnerOrAdmin,
  upload.single("image"),
  updateFood
);

router.patch(
  "/:id/image",
  varifyjwt,
  verifyOwnerOrAdmin,
  upload.single("image"),
  updateFoodImage
);

router.delete(
  "/:id",
  varifyjwt,
  verifyOwnerOrAdmin,
  deleteFood
);

export default router;


