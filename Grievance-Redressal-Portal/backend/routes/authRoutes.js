const express = require("express");
const User = require("../models/User");
const { encrypt, decrypt } = require("../utils/encryption");

const router = express.Router();

// Register new user (default role: student)
router.post("/register", async (req, res) => {
  try {
    const { userId, name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required fields",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        message: "A user with this email address already exists",
      });
    }

    const generatedUserId = userId || `STU-${Date.now().toString().slice(-4)}`;

    const newUser = new User({
      userId: generatedUserId,
      name: encrypt(name),
      email: email.toLowerCase(),
      password: encrypt(password),
      role: role || "student",
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "Registration successful!",
      user: {
        _id: savedUser._id,
        userId: savedUser.userId,
        name: decrypt(savedUser.name) || name,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to register user",
      error: error.message,
    });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password, targetRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: "User account not found. Please register or check credentials.",
      });
    }

    const decryptedPassword = decrypt(user.password);
    if (decryptedPassword !== password) {
      return res.status(401).json({
        message: "Invalid password credentials",
      });
    }

    // Role enforcement
    if (targetRole && targetRole !== user.role && user.role === "student") {
      return res.status(403).json({
        message: `Access Denied: Student accounts cannot log into the ${targetRole} portal`,
      });
    }

    res.status(200).json({
      message: "Login successful!",
      user: {
        _id: user._id,
        userId: user.userId,
        name: decrypt(user.name),
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login request failed",
      error: error.message,
    });
  }
});

module.exports = router;
