import mongoose from "mongoose";
import Cart from "../models/Cart.model.js";
import Food from "../models/food.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/Apiresponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Helper to format cart and calculate total
const formatCartResponse = (cart) => {
  if (!cart || !cart.items) {
    return { items: [], totalAmount: 0, totalCount: 0 };
  }

  let totalAmount = 0;
  let totalCount = 0;

  const items = cart.items.map((item) => {
    const food = item.foodId;
    const price = food?.price || 0;
    const qty = item.quantity || 1;
    totalAmount += price * qty;
    totalCount += qty;

    return {
      _id: item._id,
      food: food || null,
      foodId: food?._id || item.foodId,
      quantity: qty,
      itemTotal: price * qty,
    };
  });

  return {
    _id: cart._id,
    userId: cart.userId,
    items,
    totalAmount: Math.round(totalAmount * 100) / 100,
    totalCount,
  };
};

// Get current user's cart
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  let cart = await Cart.findOne({ userId }).populate({
    path: "items.foodId",
    populate: { path: "restaurant", select: "name address deliveryTime" },
  });

  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, formatCartResponse(cart), "Cart fetched successfully")
    );
});

// Add item to cart
const addCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { foodId, quantity } = req.body;

  if (!foodId || !mongoose.Types.ObjectId.isValid(foodId)) {
    throw new ApiError(400, "A valid Food ID is required");
  }

  const food = await Food.findById(foodId);
  if (!food) {
    throw new ApiError(404, "Food item not found");
  }

  if (!food.isAvailable) {
    throw new ApiError(400, "This food item is currently unavailable");
  }

  const addQty = Math.max(1, Number(quantity) || 1);

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.foodId.toString() === foodId.toString()
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += addQty;
  } else {
    cart.items.push({ foodId, quantity: addQty });
  }

  await cart.save();

  // Return populated cart
  const populatedCart = await Cart.findById(cart._id).populate({
    path: "items.foodId",
    populate: { path: "restaurant", select: "name address deliveryTime" },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        formatCartResponse(populatedCart),
        "Item added to cart successfully"
      )
    );
});

// Update item quantity in cart
const updateCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { foodId, quantity } = req.body;

  if (!foodId || !mongoose.Types.ObjectId.isValid(foodId)) {
    throw new ApiError(400, "A valid Food ID is required");
  }

  const targetQty = Number(quantity);
  if (isNaN(targetQty)) {
    throw new ApiError(400, "Quantity must be a valid number");
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  if (targetQty <= 0) {
    // Remove if quantity is 0 or negative
    cart.items = cart.items.filter(
      (item) => item.foodId.toString() !== foodId.toString()
    );
  } else {
    const existingItem = cart.items.find(
      (item) => item.foodId.toString() === foodId.toString()
    );

    if (!existingItem) {
      throw new ApiError(404, "Food item is not in your cart");
    }

    existingItem.quantity = targetQty;
  }

  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate({
    path: "items.foodId",
    populate: { path: "restaurant", select: "name address deliveryTime" },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        formatCartResponse(populatedCart),
        "Cart updated successfully"
      )
    );
});

// Remove single item from cart
const removeItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const foodId = req.params.foodId || req.body.foodId;

  if (!foodId) {
    throw new ApiError(400, "Food ID is required");
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.foodId.toString() !== foodId.toString()
  );

  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate({
    path: "items.foodId",
    populate: { path: "restaurant", select: "name address deliveryTime" },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        formatCartResponse(populatedCart),
        "Item removed from cart successfully"
      )
    );
});

// Clear entire cart
const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { items: [], totalAmount: 0, totalCount: 0 },
        "Cart cleared successfully"
      )
    );
});

export { getCart, addCart, updateCart, removeItem, clearCart };