// backend/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import booksRouter from "./routes/booksRoute.js";
import userRouter from "./routes/userRoute.js"; // Assuming this handles /users/login
import orderRouter from "./routes/orderRoute.js";
import cartRouter from "./routes/cartRoute.js";
import fs from "fs";
import path from "path"; // Add path for proper directory handling
import dotenv from "dotenv";

dotenv.config(); // Load .env file

const app = express();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads"); // Use absolute path
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Created uploads directory");
}

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDir)); // Serve static files from uploads
app.use("/books", booksRouter);
app.use("/users", userRouter); // Assuming this includes /login
app.use("/orders", orderRouter);
app.use("/cart", cartRouter);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/bookStore", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});