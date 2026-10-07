import mongoose from "mongoose";
import Food from "../models/food.model.js";
import Restaurant from "../models/Restaurant.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/Apiresponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadCloud from "../config/clouldinary.js";

// Add new food item (Restaurant Owner or Admin)
const addFoodItem = asyncHandler(async (req, res) => {
  const { name, description, price, category, foodType, restaurantId, isAvailable } =
    req.body;

  const targetRestaurantId = restaurantId || req.body.restaurant;

  if (!name?.trim() || !category?.trim() || !targetRestaurantId) {
    throw new ApiError(
      400,
      "Name, category, and restaurantId are required"
    );
  }

  const numPrice = Number(price);
  if (isNaN(numPrice) || numPrice < 0) {
    throw new ApiError(400, "Price must be a valid positive number");
  }

  if (!mongoose.Types.ObjectId.isValid(targetRestaurantId)) {
    throw new ApiError(400, "Invalid restaurant ID");
  }

  const restaurant = await Restaurant.findById(targetRestaurantId);
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  // Verify ownership
  if (
    req.user.role !== "admin" &&
    restaurant.owner.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not authorized to add food items to this restaurant"
    );
  }

  let imageUrl = req.body.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800";

  if (req.file?.path) {
    const uploaded = await uploadCloud(req.file.path);
    if (uploaded?.secure_url) {
      imageUrl = uploaded.secure_url;
    }
  }

  const food = await Food.create({
    name: name.trim(),
    description: description?.trim() || "",
    price: numPrice,
    image: imageUrl,
    category: category.trim(),
    foodType: foodType || "veg",
    isAvailable: isAvailable !== undefined ? isAvailable : true,
    restaurant: targetRestaurantId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, food, "Food item created successfully"));
});

// Get all foods (Public - with search, category, foodType filters)
const getAllFoods = asyncHandler(async (req, res) => {
  const { search, category, foodType, minPrice, maxPrice, restaurantId } = req.query;

  const query = {};

  if (search?.trim()) {
    query.$or = [
      { name: { $regex: search.trim(), $options: "i" } },
      { description: { $regex: search.trim(), $options: "i" } },
      { category: { $regex: search.trim(), $options: "i" } },
    ];
  }

  if (category?.trim() && category !== "All") {
    query.category = { $regex: `^${category.trim()}$`, $options: "i" };
  }

  if (foodType?.trim() && foodType !== "all") {
    query.foodType = foodType.trim();
  }

  if (restaurantId && mongoose.Types.ObjectId.isValid(restaurantId)) {
    query.restaurant = restaurantId;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
  }

  const foods = await Food.find(query)
    .populate("restaurant", "name address phone rating deliveryTime")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, foods, "Food items fetched successfully"));
});

// Get food by ID (Public)
const getFoodById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid food ID");
  }

  const food = await Food.findById(id).populate(
    "restaurant",
    "name address phone rating deliveryTime isOpen"
  );

  if (!food) {
    throw new ApiError(404, "Food item not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, food, "Food item fetched successfully"));
});

// Get foods by restaurant ID (Public)
const getFoodsByRestaurant = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    throw new ApiError(400, "Invalid restaurant ID");
  }

  const foodItems = await Food.find({ restaurant: restaurantId });

  return res
    .status(200)
    .json(new ApiResponse(200, foodItems, "Food items fetched successfully"));
});

// Update food item (Owner or Admin)
const updateFood = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid food ID");
  }

  const foodItem = await Food.findById(id).populate("restaurant");
  if (!foodItem) {
    throw new ApiError(404, "Food item not found");
  }

  if (
    req.user.role !== "admin" &&
    foodItem.restaurant?.owner?.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not authorized to update this food item"
    );
  }

  const { name, description, price, category, foodType, isAvailable, image } = req.body;

  if (name?.trim()) foodItem.name = name.trim();
  if (description !== undefined) foodItem.description = description.trim();
  if (price !== undefined) foodItem.price = Number(price);
  if (category?.trim()) foodItem.category = category.trim();
  if (foodType) foodItem.foodType = foodType;
  if (isAvailable !== undefined) foodItem.isAvailable = Boolean(isAvailable);

  if (req.file?.path) {
    const uploaded = await uploadCloud(req.file.path);
    if (uploaded?.secure_url) {
      foodItem.image = uploaded.secure_url;
    }
  } else if (image) {
    foodItem.image = image;
  }

  await foodItem.save();

  return res
    .status(200)
    .json(new ApiResponse(200, foodItem, "Food item updated successfully"));
});

// Delete food item (Owner or Admin)
const deleteFood = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid food ID");
  }

  const foodItem = await Food.findById(id).populate("restaurant");
  if (!foodItem) {
    throw new ApiError(404, "Food item not found");
  }

  if (
    req.user.role !== "admin" &&
    foodItem.restaurant?.owner?.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not authorized to delete this food item"
    );
  }

  await Food.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Food item deleted successfully"));
});

// Update food image
const updateFoodImage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid food ID");
  }

  const foodItem = await Food.findById(id).populate("restaurant");
  if (!foodItem) {
    throw new ApiError(404, "Food item not found");
  }

  if (
    req.user.role !== "admin" &&
    foodItem.restaurant?.owner?.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not authorized to update this food image"
    );
  }

  if (!req.file?.path) {
    throw new ApiError(400, "Image file is required");
  }

  const uploaded = await uploadCloud(req.file.path);
  if (!uploaded?.secure_url) {
    throw new ApiError(500, "Failed to upload food image");
  }

  foodItem.image = uploaded.secure_url;
  await foodItem.save();

  return res
    .status(200)
    .json(new ApiResponse(200, foodItem, "Food item image updated successfully"));
});

// Compatibility aliases
const createFood = addFoodItem;
const getFood = getAllFoods;

export {
  addFoodItem,
  createFood,
  getAllFoods,
  getFood,
  getFoodById,
  getFoodsByRestaurant,
  updateFood,
  deleteFood,
  updateFoodImage,
};