import express from "express";
import {
  getCart,
  addCart,
  updateCart,
  removeItem,
  clearCart,
} from "../controllers/Cart.controller.js";
import varifyjwt from "../middleware/varify.middleware.js";

const router = express.Router();

// All cart routes require authentication
router.use(varifyjwt);

router.get("/", getCart);

router.post("/items", addCart);
router.post("/add", addCart);

router.patch("/items", updateCart);
router.put("/items", updateCart);
router.put("/update", updateCart);

router.delete("/items/:foodId", removeItem);
router.delete("/items", removeItem);

router.delete("/clear", clearCart);

export default router;