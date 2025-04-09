// backend/routes/authRoute.js
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Simple login route (replace with real user database/auth logic)
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Dummy credentials (replace with actual authentication)
  if (username === "admin" && password === "password") {
    const token = jwt.sign(
      { username, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({ token });
  }
  res.status(401).json({ message: "Invalid credentials" });
});

export default router;
