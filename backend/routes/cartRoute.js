// backend/routes/cartRoute.js
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
    const { bookId } = req.body;
    const cartItem = new Cart({ userId: req.user.id, bookId });
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

export default cartRouter;