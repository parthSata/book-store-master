import express from "express";
import { Cart } from "../models/cartModel.js";
import jwt from "jsonwebtoken";

const cartRouter = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

cartRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { bookId, quantity = 1 } = req.body;
    const existingItem = await Cart.findOne({ userId: req.user.id, bookId });
    if (existingItem) {
      existingItem.quantity += quantity;
      const updatedItem = await existingItem.save();
      return res.status(200).json({ data: updatedItem });
    }
    const cartItem = new Cart({ userId: req.user.id, bookId, quantity });
    const savedItem = await cartItem.save();
    res.status(201).json({ data: savedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

cartRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.user.id }).populate("bookId");
    res.status(200).json({ data: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

cartRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem || cartItem.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    cartItem.quantity = quantity;
    const updatedItem = await cartItem.save();
    res.status(200).json({ data: updatedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

cartRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem || cartItem.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default cartRouter;