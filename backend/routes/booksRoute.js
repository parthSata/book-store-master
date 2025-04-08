// backend/routes/booksRoute.js
import express from "express";
import { Book } from "../models/bookModel.js";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Images only (jpeg, jpg, png)!"));
    }
  },
});

// Middleware to verify token and role
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const router = express.Router();

router.use("/uploads", express.static("uploads"));

// Create a book (Admin only)
router.post(
  "/",
  authenticateAdmin,
  upload.single("image"),
  async (req, res) => {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    try {
      const { title, author, publishYear } = req.body;
      if (!title || !author || !publishYear) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const book = new Book({
        title,
        author,
        publishYear: Number(publishYear),
        image: req.file ? `/uploads/${req.file.filename}` : null,
      });
      const createdBook = await book.save();
      console.log("Book created:", createdBook);
      res.status(201).json({ data: createdBook });
    } catch (error) {
      console.error("Error creating book:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Update a book (Admin only)
router.put(
  "/:id",
  authenticateAdmin,
  upload.single("image"),
  async (req, res) => {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    try {
      const { title, author, publishYear } = req.body;
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      book.title = title || book.title;
      book.author = author || book.author;
      book.publishYear = publishYear ? Number(publishYear) : book.publishYear;
      if (req.file) {
        book.image = `/uploads/${req.file.filename}`;
      }
      book.updatedAt = Date.now();
      const updatedBook = await book.save();
      console.log("Book updated:", updatedBook);
      res.status(200).json({ data: updatedBook });
    } catch (error) {
      console.error("Error updating book:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete a book (Admin only)
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get a book by ID (Public)
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ data: book });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get all books (Public)
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ data: books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
