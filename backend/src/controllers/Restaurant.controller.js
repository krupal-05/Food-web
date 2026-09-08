import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import Restaurant from "../models/Restaurant.model.js";


const registerRestaurant = asyncHandler(async (req, res) => {

  const { name, cuisine, phone, address } = req.body;

  if (
    !name?.trim() ||
    !cuisine?.trim() ||
    !phone
  ) {
    throw new ApiError(
      400,
      "Name, cuisine and phone are required"
    );
  }

  if (
    !address ||
    !address.street?.trim() ||
    !address.city?.trim() ||
    !address.pincode?.trim()
  ) {
    throw new ApiError(
      400,
      "Street, city and pincode are required"
    );
  }

  if (!/^\d{6}$/.test(address.pincode.trim())) {
    throw new ApiError(
      400,
      "Pincode must be exactly 6 digits"
    );
  }

  const restaurant = await Restaurant.create({
    name: name.trim(),
    cuisine: cuisine.trim(),
    phone,
    address: {
      street: address.street.trim(),
      city: address.city.trim(),
      pincode: address.pincode.trim()
    },
    owner: req.user._id
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        restaurant,
        "Restaurant registered successfully"
      )
    );
});


const getAllRestaurants = asyncHandler(async (req, res) => {

  const restaurants = await Restaurant.find()
    .populate("owner", "name email");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        restaurants,
        "All restaurants fetched successfully"
      )
    );
});


const getRestaurantById = asyncHandler(async (req, res) => {

  const { restaurantId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    throw new ApiError(
      400,
      "Invalid restaurant ID"
    );
  }

  const restaurant = await Restaurant.findById(restaurantId)
    .populate("owner", "name email");

  if (!restaurant) {
    throw new ApiError(
      404,
      "Restaurant not found"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        restaurant,
        "Restaurant fetched successfully"
      )
    );
});


const updateRestaurant = asyncHandler(async (req, res) => {

  const { restaurantId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    throw new ApiError(
      400,
      "Invalid restaurant ID"
    );
  }

  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    throw new ApiError(
      404,
      "Restaurant not found"
    );
  }

  if (
    req.user.role !== "admin" &&
    restaurant.owner.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not authorized to update this restaurant"
    );
  }

  const { name, cuisine, phone, address } = req.body;

  if (
    name === undefined &&
    cuisine === undefined &&
    phone === undefined &&
    address === undefined
  ) {
    throw new ApiError(
      400,
      "At least one field is required"
    );
  }

  if (name !== undefined) {

    if (!name?.trim()) {
      throw new ApiError(
        400,
        "Restaurant name cannot be empty"
      );
    }

    restaurant.name = name.trim();
  }

  if (cuisine !== undefined) {

    if (!cuisine?.trim()) {
      throw new ApiError(
        400,
        "Cuisine cannot be empty"
      );
    }

    restaurant.cuisine = cuisine.trim();
  }

  if (phone !== undefined) {
    restaurant.phone = phone;
  }

  if (address !== undefined) {

    if (typeof address !== "object" || address === null) {
      throw new ApiError(
        400,
        "Invalid address"
      );
    }

    if (address.street !== undefined) {

      if (!address.street?.trim()) {
        throw new ApiError(
          400,
          "Street cannot be empty"
        );
      }

      restaurant.address.street =
        address.street.trim();
    }

    if (address.city !== undefined) {

      if (!address.city?.trim()) {
        throw new ApiError(
          400,
          "City cannot be empty"
        );
      }

      restaurant.address.city =
        address.city.trim();
    }

    if (address.pincode !== undefined) {

      if (
        !address.pincode?.trim() ||
        !/^\d{6}$/.test(address.pincode.trim())
      ) {
        throw new ApiError(
          400,
          "Pincode must be exactly 6 digits"
        );
      }

      restaurant.address.pincode =
        address.pincode.trim();
    }
  }

  await restaurant.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        restaurant,
        "Restaurant updated successfully"
      )
    );
});


const deleteRestaurant = asyncHandler(async (req, res) => {

  const { restaurantId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    throw new ApiError(
      400,
      "Invalid restaurant ID"
    );
  }

  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    throw new ApiError(
      404,
      "Restaurant not found"
    );
  }

  if (
    req.user.role !== "admin" &&
    restaurant.owner.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not authorized to delete this restaurant"
    );
  }

  await Restaurant.findByIdAndDelete(restaurantId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Restaurant deleted successfully"
      )
    );
});


export {
  registerRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
};