import express from "express";
import User from "../models/User.js"; // Assuming User model exists
import bcrypt from "bcrypt"; // Ensure bcrypt is imported

const router = express.Router();
export const signup = async (req, res) => {
  const { fullName, email, password, role, firebaseUID } = req.body; // Include firebaseUID

  // Validate input
  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
      firebaseUID,
    }); // Include firebaseUID
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserRole = async (req, res) => {
  const { firebaseUID } = req.params;
  try {
    const query = { firebaseUID: firebaseUID };
    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ role: user.role });
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default router;
