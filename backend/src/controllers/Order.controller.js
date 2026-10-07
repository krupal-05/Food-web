import mongoose from "mongoose";
import Order from "../models/Order.model.js";
import Cart from "../models/Cart.model.js";
import Food from "../models/food.model.js";
import Restaurant from "../models/Restaurant.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/Apiresponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Helper to parse address
const parseOrderAddress = (address, user) => {
  if (address && typeof address === "object" && address.street && address.city && address.pincode) {
    return {
      street: address.street.trim(),
      city: address.city.trim(),
      pincode: String(address.pincode).trim(),
    };
  }

  if (typeof address === "string") {
    try {
      const parsed = JSON.parse(address);
      if (parsed.street && parsed.city && parsed.pincode) {
        return {
          street: parsed.street.trim(),
          city: parsed.city.trim(),
          pincode: String(parsed.pincode).trim(),
        };
      }
    } catch {
      // not JSON string
    }
  }

  if (user?.address?.street && user?.address?.city && user?.address?.pincode) {
    return user.address;
  }

  return null;
};

// Create a new Order
const addOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { restaurantId, items, deliveryAddress, paymentMethod, instructions } = req.body;

  let orderItems = items;
  let targetRestaurantId = restaurantId;

  // If no items passed explicitly, fetch from Cart
  if (!orderItems || !orderItems.length) {
    const cart = await Cart.findOne({ userId }).populate("items.foodId");
    if (!cart || !cart.items.length) {
      throw new ApiError(400, "Your cart is empty. Please add items to place an order");
    }

    orderItems = cart.items.map((ci) => ({
      foodId: ci.foodId._id,
      quantity: ci.quantity,
      price: ci.foodId.price,
      name: ci.foodId.name,
      restaurant: ci.foodId.restaurant,
    }));

    if (!targetRestaurantId && orderItems[0]?.restaurant) {
      targetRestaurantId = orderItems[0].restaurant;
    }
  }

  if (!orderItems || !orderItems.length) {
    throw new ApiError(400, "Order must contain at least one item");
  }

  if (!targetRestaurantId || !mongoose.Types.ObjectId.isValid(targetRestaurantId)) {
    throw new ApiError(400, "Valid restaurant ID is required");
  }

  const restaurant = await Restaurant.findById(targetRestaurantId);
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  const parsedAddress = parseOrderAddress(deliveryAddress, req.user);
  if (!parsedAddress) {
    throw new ApiError(
      400,
      "Complete delivery address (street, city, 6-digit pincode) is required"
    );
  }

  // Verify and calculate item prices securely from Database
  let calculatedTotal = 0;
  const verifiedItems = [];

  for (const item of orderItems) {
    const foodId = item.foodId?._id || item.foodId;
    const food = await Food.findById(foodId);

    if (!food) {
      throw new ApiError(404, `Food item with ID ${foodId} not found`);
    }

    const qty = Math.max(1, Number(item.quantity) || 1);
    const itemTotal = food.price * qty;
    calculatedTotal += itemTotal;

    verifiedItems.push({
      foodId: food._id,
      name: food.name,
      quantity: qty,
      price: food.price,
    });
  }

  if (calculatedTotal < restaurant.minOrder) {
    throw new ApiError(
      400,
      `Minimum order amount for ${restaurant.name} is ₹${restaurant.minOrder}`
    );
  }

  const order = await Order.create({
    userId,
    restaurantId: targetRestaurantId,
    items: verifiedItems,
    deliveryAddress: parsedAddress,
    totalAmount: Math.round(calculatedTotal * 100) / 100,
    paymentMethod: paymentMethod || "cod",
    paymentStatus: paymentMethod === "online" ? "paid" : "pending",
    status: "pending",
    instructions: instructions || "",
  });

  // Clear cart after placing order
  await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });

  const populatedOrder = await Order.findById(order._id)
    .populate("restaurantId", "name address phone imageUrl image deliveryTime")
    .populate("userId", "firstName lastName email phone");

  return res
    .status(201)
    .json(new ApiResponse(201, populatedOrder, "Order placed successfully"));
});

// Get currently logged-in user's order history
const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await Order.find({ userId })
    .populate("restaurantId", "name address phone imageUrl image deliveryTime")
    .populate("items.foodId", "name image price")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

// Get order details by ID
const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  const order = await Order.findById(orderId)
    .populate("restaurantId", "name address phone imageUrl image deliveryTime owner")
    .populate("userId", "firstName lastName email phone")
    .populate("items.foodId", "name image price");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Check authorization (customer, restaurant owner, or admin)
  const isCustomer = order.userId?._id?.toString() === req.user._id.toString();
  const isOwner = order.restaurantId?.owner?.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isCustomer && !isOwner && !isAdmin) {
    throw new ApiError(403, "You are not authorized to view this order");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

// Get orders for restaurants owned by current user (Owner dashboard)
const getRestaurantOrders = asyncHandler(async (req, res) => {
  const ownerRestaurants = await Restaurant.find({ owner: req.user._id });
  const restaurantIds = ownerRestaurants.map((r) => r._id);

  const orders = await Order.find({ restaurantId: { $in: restaurantIds } })
    .populate("restaurantId", "name address phone")
    .populate("userId", "firstName lastName email phone")
    .populate("items.foodId", "name image price")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, orders, "Restaurant orders fetched successfully")
    );
});

// Update order status (Owner, Admin, Delivery Agent)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status, paymentStatus } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  const allowedStatuses = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  if (status && !allowedStatuses.includes(status)) {
    throw new ApiError(400, `Invalid order status: ${status}`);
  }

  const order = await Order.findById(orderId).populate("restaurantId");
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Auth check
  const isOwner = order.restaurantId?.owner?.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  const isAgent = req.user.role === "deliveryAgent";

  if (!isOwner && !isAdmin && !isAgent) {
    throw new ApiError(403, "Not authorized to update order status");
  }

  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  if (status === "delivered" && order.paymentMethod === "cod") {
    order.paymentStatus = "paid";
  }

  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});

// Cancel order (Customer if still pending)
const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (
    order.userId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "You can only cancel your own orders");
  }

  if (order.status !== "pending") {
    throw new ApiError(
      400,
      `Cannot cancel order once it is ${order.status}. Contact restaurant support.`
    );
  }

  order.status = "cancelled";
  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order cancelled successfully"));
});

// Get all orders (Admin only)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("restaurantId", "name address phone")
    .populate("userId", "firstName lastName email phone")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

// Compatibility aliases
const createOrder = addOrder;

export {
  addOrder,
  createOrder,
  getUserOrders,
  getOrderById,
  getRestaurantOrders,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
};