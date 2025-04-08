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
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Match secret with userRoute.js
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to verify admin role
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Place an order (User)
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
    console.error("Error placing order:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (Admin only)
orderRouter.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ status: "pending" })
      .populate("userId", "username")
      .populate("bookId", "title");
    res.status(200).json({ data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get confirmed orders (Admin only)
orderRouter.get("/confirmed", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ status: "confirmed" })
      .populate("userId", "username")
      .populate("bookId", "title");
    res.status(200).json({ data: orders });
  } catch (error) {
    console.error("Error fetching confirmed orders:", error);
    res.status(500).json({ message: error.message });
  }
});

// Confirm an order (Admin only)
orderRouter.put("/:id/confirm", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = "confirmed";
    const updatedOrder = await order.save();
    res.status(200).json({ data: updatedOrder });
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete an order (Admin only)
orderRouter.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: error.message });
  }
});

export default orderRouter;