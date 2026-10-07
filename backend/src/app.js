import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routers
import userRouter from "./routers/user.router.js";
import restaurantRouter from "./routers/restaurant.router.js";
import foodRouter from "./routers/food.router.js";
import cartRouter from "./routers/cart.router.js";
import orderRouter from "./routers/order.router.js";
import reviewRouter from "./routers/review.router.js";

const app = express();

// Global Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Static Files
app.use("/uploads", express.static("uploads"));
app.use("/public", express.static("public"));

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Food Web Backend API is Running Smoothly",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API is healthy" });
});

// Mount Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/restaurants", restaurantRouter);
app.use("/api/v1/foods", foodRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/reviews", reviewRouter);

// Legacy routes compatibility
app.use("/api/v1", userRouter);
app.use("/api/v1", restaurantRouter);
app.use("/api/v1", foodRouter);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.statuscode || 500;
  
  // Handle mongoose validation error
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered for '${field}'. Please use another value!`;
  }

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;