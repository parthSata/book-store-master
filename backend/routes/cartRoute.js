// backend/routes/cartRoute.js
import express from "express";
import {Cart} from "../models/cartModel.js";
import jwt from "jsonwebtoken";

const cartRouter = express.Router();

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Add to cart
cartRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const cartItem = new Cart({
      userId: req.user.id,
      bookId,
      quantity: quantity || 1,
    });
    const savedCartItem = await cartItem.save();
    res.status(201).json({ data: savedCartItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get cart items
cartRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id }).populate(
      "bookId"
    );
    res.status(200).json({ data: cartItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default cartRouter;
