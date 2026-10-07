import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/Apiresponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import Restaurant from "../models/Restaurant.model.js";
import Food from "../models/food.model.js";
import uploadCloud from "../config/clouldinary.js";

// Helper to parse address
const parseAddress = (addressInput, body) => {
  if (typeof addressInput === "string") {
    try {
      return JSON.parse(addressInput);
    } catch {
      // not JSON string
    }
  }

  if (addressInput && typeof addressInput === "object") {
    return addressInput;
  }

  // Check top-level fallback
  if (body.street || body.city || body.pincode) {
    return {
      street: body.street || "",
      city: body.city || "",
      pincode: body.pincode || "",
    };
  }

  return null;
};

// Register a new Restaurant (Owner or Admin)
const registerRestaurant = asyncHandler(async (req, res) => {
  const { name, cuisine, phone, deliveryTime, minOrder, description } = req.body;
  const address = parseAddress(req.body.address, req.body);

  if (!name?.trim() || !cuisine?.trim() || !phone?.trim()) {
    throw new ApiError(400, "Name, cuisine, and phone are required");
  }

  if (!address || !address.street?.trim() || !address.city?.trim() || !address.pincode?.trim()) {
    throw new ApiError(400, "Street, city, and 6-digit pincode are required");
  }

  if (!/^\d{6}$/.test(String(address.pincode).trim())) {
    throw new ApiError(400, "Pincode must be exactly 6 digits");
  }

  let imageUrl = req.body.imageUrl || req.body.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800";

  if (req.file?.path) {
    const uploaded = await uploadCloud(req.file.path);
    if (uploaded?.secure_url) {
      imageUrl = uploaded.secure_url;
    }
  }

  const restaurant = await Restaurant.create({
    name: name.trim(),
    cuisine: cuisine.trim(),
    description: description?.trim() || "",
    phone: phone.trim(),
    image: imageUrl,
    imageUrl: imageUrl,
    deliveryTime: Number(deliveryTime) || 30,
    minOrder: Number(minOrder) || 100,
    address: {
      street: address.street.trim(),
      city: address.city.trim(),
      pincode: String(address.pincode).trim(),
    },
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, restaurant, "Restaurant registered successfully"));
});

// Get all restaurants (Public - with search, filter, pagination)
const getAllRestaurants = asyncHandler(async (req, res) => {
  const { search, cuisine, isOpen, sort } = req.query;

  const query = {};

  if (search?.trim()) {
    query.$or = [
      { name: { $regex: search.trim(), $options: "i" } },
      { cuisine: { $regex: search.trim(), $options: "i" } },
      { "address.city": { $regex: search.trim(), $options: "i" } },
    ];
  }

  if (cuisine?.trim() && cuisine !== "All") {
    query.cuisine = { $regex: `^${cuisine.trim()}$`, $options: "i" };
  }

  if (isOpen !== undefined) {
    query.isOpen = isOpen === "true" || isOpen === true;
  }

  let sortOption = { createdAt: -1 };
  if (sort === "rating") sortOption = { rating: -1 };
  if (sort === "deliveryTime") sortOption = { deliveryTime: 1 };
  if (sort === "minOrder") sortOption = { minOrder: 1 };

  const restaurants = await Restaurant.find(query)
    .sort(sortOption)
    .populate("owner", "firstName lastName email phone");

  return res
    .status(200)
    .json(
      new ApiResponse(200, restaurants, "Restaurants fetched successfully")
    );
});

// Get restaurant by ID (Public)
const getRestaurantById = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    throw new ApiError(400, "Invalid restaurant ID");
  }

  const restaurant = await Restaurant.findById(restaurantId).populate(
    "owner",
    "firstName lastName email phone"
  );

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  // Also fetch the food menu items for this restaurant
  const foods = await Food.find({ restaurant: restaurantId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...restaurant.toObject(),
        foods,
      },
      "Restaurant fetched successfully"
    )
  );
});

// Get restaurants owned by currently logged in owner
const getMyRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({ owner: req.user._id });
  return res
    .status(200)
    .json(
      new ApiResponse(200, restaurants, "Your restaurants fetched successfully")
    );
});

// Update restaurant (Owner or Admin)
const updateRestaurant = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    throw new ApiError(400, "Invalid restaurant ID");
  }

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  if (
    req.user.role !== "admin" &&
    restaurant.owner.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "You are not authorized to update this restaurant");
  }

  const { name, cuisine, phone, deliveryTime, minOrder, description, isOpen } = req.body;
  const address = parseAddress(req.body.address, req.body);

  if (name?.trim()) restaurant.name = name.trim();
  if (cuisine?.trim()) restaurant.cuisine = cuisine.trim();
  if (description !== undefined) restaurant.description = description.trim();
  if (phone?.trim()) restaurant.phone = phone.trim();
  if (deliveryTime !== undefined) restaurant.deliveryTime = Number(deliveryTime);
  if (minOrder !== undefined) restaurant.minOrder = Number(minOrder);
  if (isOpen !== undefined) restaurant.isOpen = Boolean(isOpen);

  if (address) {
    if (address.street?.trim()) restaurant.address.street = address.street.trim();
    if (address.city?.trim()) restaurant.address.city = address.city.trim();
    if (address.pincode && /^\d{6}$/.test(String(address.pincode).trim())) {
      restaurant.address.pincode = String(address.pincode).trim();
    }
  }

  if (req.file?.path) {
    const uploaded = await uploadCloud(req.file.path);
    if (uploaded?.secure_url) {
      restaurant.image = uploaded.secure_url;
      restaurant.imageUrl = uploaded.secure_url;
    }
  } else if (req.body.imageUrl || req.body.image) {
    restaurant.image = req.body.imageUrl || req.body.image;
    restaurant.imageUrl = req.body.imageUrl || req.body.image;
  }

  await restaurant.save();

  return res
    .status(200)
    .json(new ApiResponse(200, restaurant, "Restaurant updated successfully"));
});

// Delete restaurant (Owner or Admin)
const deleteRestaurant = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    throw new ApiError(400, "Invalid restaurant ID");
  }

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  if (
    req.user.role !== "admin" &&
    restaurant.owner.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "You are not authorized to delete this restaurant");
  }

  // Delete all foods belonging to this restaurant
  await Food.deleteMany({ restaurant: restaurantId });
  await Restaurant.findByIdAndDelete(restaurantId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Restaurant and its menu deleted successfully"));
});

export {
  registerRestaurant,
  getAllRestaurants,
  getRestaurantById,
  getMyRestaurants,
  updateRestaurant,
  deleteRestaurant,
};