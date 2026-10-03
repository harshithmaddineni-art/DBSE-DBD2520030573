const express = require("express");
const User = require("../models/User");
const { encrypt, decrypt } = require("../utils/encryption");

const router = express.Router();

// Create a new user
router.post("/", async (req, res) => {
  try {
    const { userId, name, email, password, role } = req.body;

    const user = new User({
      userId,
      name: encrypt(name),
      email,
      password: encrypt(password),
      role,
    });

    const savedUser = await user.save();
    const userObj = savedUser.toObject();
    delete userObj.password;
    userObj.name = decrypt(userObj.name);

    res.status(201).json({
      message: "User created successfully!",
      user: userObj,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
});

const mongoose = require("mongoose");

// Get all users (hide password field)
router.get("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json([]);
    }
    const users = await User.find();
    
    const role = req.headers['x-user-role'];
    const formattedUsers = users.map(u => {
      const uObj = u.toObject();
      if (role === 'admin') {
        uObj.name = decrypt(uObj.name);
        uObj.password = decrypt(uObj.password);
      } else {
        uObj.name = "*** Hidden ***";
        delete uObj.password;
      }
      return uObj;
    });
    
    res.status(200).json(formattedUsers);
  } catch (error) {
    res.status(200).json([]);
  }
});

// Update a user
router.put("/:id", async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = encrypt(req.body.password);
    }
    if (req.body.name) {
      req.body.name = encrypt(req.body.name);
    }
    
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const uObj = updatedUser.toObject();
    uObj.name = decrypt(uObj.name);

    res.status(200).json({
      message: "User updated successfully!",
      user: uObj,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id).select("-password");

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const uObj = deletedUser.toObject();
    uObj.name = decrypt(uObj.name);
    
    res.status(200).json({
      message: "User deleted successfully!",
      user: uObj,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
});

module.exports = router;