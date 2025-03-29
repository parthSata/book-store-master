// backend/routes/booksRoute.js
import express from "express";
import { Book } from "../models/bookModel.js";
import multer from "multer";
import path from "path";

// Configure Multer for file uploads
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
      return cb(null, true);
    } else {
      cb(new Error("Images only (jpeg, jpg, png)!"));
    }
  },
});

const router = express.Router();

// Serve uploaded images statically
router.use("/uploads", express.static("uploads"));

// Create a book with image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, author, publishYear } = req.body;
    if (!title || !author || !publishYear) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const book = new Book({
      title,
      author,
      publishYear,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });
    const createdBook = await book.save();
    res.status(201).json({ data: createdBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a book with image
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, author, publishYear } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    book.title = title || book.title;
    book.author = author || book.author;
    book.publishYear = publishYear || book.publishYear;
    if (req.file) {
      book.image = `/uploads/${req.file.filename}`;
    }
    book.updatedAt = Date.now();
    const updatedBook = await book.save();
    res.status(200).json({ data: updatedBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ data: book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a book
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ data: books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;