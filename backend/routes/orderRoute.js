// backend/routes/orderRoute.js
import express from "express";
import { Order } from "../models/orderModel.js";
import jwt from "jsonwebtoken";
const orderRouter = express.Router();

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

// Place an order
orderRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { bookId, paymentMethod } = req.body;
    const order = new Order({
      userId: req.user.id,
      bookId,
      paymentMethod: paymentMethod || "COD",
    });
    const savedOrder = await order.save();
    res.status(201).json({ data: savedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (admin only)
orderRouter.get("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const orders = await Order.find().populate("userId").populate("bookId");
    res.status(200).json({ data: orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default orderRouter;
