import { Router } from "express";
import {
  addReview,
  getRestaurantReviews,
  deleteReview,
} from "../controllers/review.controller.js";
import varifyjwt from "../middleware/varify.middleware.js";

const router = Router();

// Public review reading
router.get("/restaurant/:restaurantId", getRestaurantReviews);

// Protected review actions
router.post("/", varifyjwt, addReview);
router.delete("/:reviewId", varifyjwt, deleteReview);

export default router;
