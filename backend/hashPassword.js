// backend/hashPassword.js
import bcrypt from 'bcryptjs';
const password = 'admin123';
const saltRounds = 10; // Matches your userRoute.js

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Hashed password for "admin123":', hash);
  }
});