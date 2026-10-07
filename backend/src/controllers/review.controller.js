import mongoose from "mongoose";
import Review from "../models/review.model.js";
import Restaurant from "../models/Restaurant.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/Apiresponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Add a review for a restaurant
const addReview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { restaurantId, rating, comment } = req.body;

  if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) {
    throw new ApiError(400, "Valid restaurant ID is required");
  }

  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  const review = await Review.create({
    user: userId,
    restaurant: restaurantId,
    rating: numRating,
    comment: comment?.trim() || "",
  });

  // Recalculate average rating for restaurant
  const allReviews = await Review.find({ restaurant: restaurantId });
  const totalReviews = allReviews.length;
  const avgRating =
    totalReviews > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 5;

  restaurant.rating = Math.round(avgRating * 10) / 10;
  restaurant.totalReviews = totalReviews;
  await restaurant.save();

  const populatedReview = await Review.findById(review._id).populate(
    "user",
    "firstName lastName avatar"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, populatedReview, "Review added successfully"));
});

// Get reviews for a restaurant
const getRestaurantReviews = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    throw new ApiError(400, "Invalid restaurant ID");
  }

  const reviews = await Review.find({ restaurant: restaurantId })
    .populate("user", "firstName lastName avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

// Delete review
const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new ApiError(400, "Invalid review ID");
  }

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "You can only delete your own reviews");
  }

  const restaurantId = review.restaurant;
  await Review.findByIdAndDelete(reviewId);

  // Recalculate rating
  const allReviews = await Review.find({ restaurant: restaurantId });
  const totalReviews = allReviews.length;
  const avgRating =
    totalReviews > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 4.5;

  await Restaurant.findByIdAndUpdate(restaurantId, {
    rating: Math.round(avgRating * 10) / 10,
    totalReviews,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Review deleted successfully"));
});

export { addReview, getRestaurantReviews, deleteReview };
