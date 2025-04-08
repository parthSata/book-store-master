// backend/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import booksRouter from "./routes/booksRoute.js";
import userRouter from "./routes/userRoute.js";
import orderRouter from "./routes/orderRoute.js";
import cartRouter from "./routes/cartRouter.js";
import fs from "fs";
import dotenv from "dotenv"; // Add this

dotenv.config(); // Load .env file

const app = express();

const uploadDir = "/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Created uploads directory");
}

app.use(cors());
app.use(express.json());
app.use("/books", booksRouter);
app.use("/users", userRouter);
app.use("/orders", orderRouter);
app.use("/cart", cartRouter);

mongoose
  .connect("mongodb://localhost:27017/bookStore", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
