// backend/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import booksRouter from "./routes/booksRoute.js";
import userRouter from "./routes/userRoute.js";
import orderRouter from "./routes/orderRoute.js";
import cartRouter from "./routes/cartRoute.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/books", booksRouter);
app.use("/users", userRouter);
app.use("/orders", orderRouter);
app.use("/cart", cartRouter);

mongoose.connect("mongodb://localhost:27017/bookStore", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
