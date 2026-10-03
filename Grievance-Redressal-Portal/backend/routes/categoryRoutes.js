const express = require("express");
const Category = require("../models/Category");

const router = express.Router();

const mongoose = require("mongoose");

// Get all categories
router.get("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json([]);
    }
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(200).json([]);
  }
});

// Create a new category
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = new Category({
      name,
      description,
    });

    const savedCategory = await category.save();
    res.status(201).json({
      message: "Category created successfully!",
      category: savedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
});

// Seed default categories
router.post("/seed", async (req, res) => {
  try {
    const defaultCategories = [
      { name: "Academic", description: "Curriculum, grades, attendance, course material" },
      { name: "Hostel & Accommodation", description: "Room allocation, sanitation, mess quality" },
      { name: "Examination & Evaluation", description: "Hall tickets, result publication" },
      { name: "Library Services", description: "Book issue, digital portal access" },
      { name: "Infrastructure & Facilities", description: "Classrooms, labs, Wi-Fi" },
      { name: "Fee & Financial Services", description: "Fee payment receipts, scholarship" },
      { name: "Canteen & Food Quality", description: "Food hygiene, pricing, canteen services" },
      { name: "General Inquiry", description: "General questions and institutional support" }
    ];

    for (const cat of defaultCategories) {
      await Category.updateOne(
        { name: cat.name },
        { $setOnInsert: cat },
        { upsert: true }
      );
    }

    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Default categories seeded successfully!",
      categories
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to seed categories",
      error: error.message,
    });
  }
});

// Delete a category by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({
      message: "Category deleted successfully!",
      category: deletedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
});

module.exports = router;
