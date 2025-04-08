// backend/models/cartModel.js
import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Cart = mongoose.model("Cart", cartSchema);
