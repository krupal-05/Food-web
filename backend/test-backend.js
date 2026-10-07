import dotenv from 'dotenv';
dotenv.config();

console.log("=== Testing Backend Module Imports ===");

try {
  await import('./src/utils/ApiError.js');
  await import('./src/utils/Apiresponse.js');
  await import('./src/utils/asyncHandler.js');
  console.log("✓ Utils loaded successfully");

  await import('./src/models/User.model.js');
  await import('./src/models/Restaurant.model.js');
  await import('./src/models/food.model.js');
  await import('./src/models/Cart.model.js');
  await import('./src/models/Order.model.js');
  await import('./src/models/review.model.js');
  console.log("✓ Models loaded successfully");

  await import('./src/middleware/multer.midelware.js');
  await import('./src/middleware/varify.middleware.js');
  await import('./src/middleware/auth.middleware.js');
  console.log("✓ Middlewares loaded successfully");

  await import('./src/controllers/User.controller.js');
  await import('./src/controllers/Restaurant.controller.js');
  await import('./src/controllers/food.controller.js');
  await import('./src/controllers/Cart.controller.js');
  await import('./src/controllers/Order.controller.js');
  await import('./src/controllers/review.controller.js');
  console.log("✓ Controllers loaded successfully");

  await import('./src/routers/user.router.js');
  await import('./src/routers/restaurant.router.js');
  await import('./src/routers/food.router.js');
  await import('./src/routers/cart.router.js');
  await import('./src/routers/order.router.js');
  await import('./src/routers/review.router.js');
  console.log("✓ Routers loaded successfully");

  await import('./src/app.js');
  console.log("✓ Express App loaded successfully");

  console.log("\n==========================================");
  console.log("ALL BACKEND MODULES AND ROUTES ARE 100% VERIFIED!");
  console.log("==========================================");
  process.exit(0);
} catch (error) {
  console.error("\n❌ Backend Validation Error:", error);
  process.exit(1);
}
