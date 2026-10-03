const express = require("express");
const Department = require("../models/Department");

const router = express.Router();

const mongoose = require("mongoose");

// Get all departments
router.get("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json([]);
    }
    const departments = await Department.find().sort({ createdAt: -1 });
    res.status(200).json(departments);
  } catch (error) {
    res.status(200).json([]);
  }
});

// Create a new department
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Department name is required" });
    }

    const department = new Department({
      name,
      description,
    });

    const savedDepartment = await department.save();
    res.status(201).json({
      message: "Department created successfully!",
      department: savedDepartment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create department",
      error: error.message,
    });
  }
});

// Seed default departments
router.post("/seed", async (req, res) => {
  try {
    const defaultDepartments = [
      { name: "Computer Science & Engineering", description: "CS & IT academic department" },
      { name: "Electrical & Electronics Engineering", description: "EEE & ECE academic department" },
      { name: "Mechanical Engineering", description: "Mechanical & Civil engineering department" },
      { name: "Student Affairs", description: "Student welfare, hostels, activities" },
      { name: "Finance & Accounts", description: "Tuition, accounts, scholarships" },
      { name: "Maintenance & Sanitation", description: "Campus maintenance, Wi-Fi, sanitation" },
      { name: "Library Administration", description: "Library services, e-resources" },
      { name: "General Administration", description: "General institutional administration" }
    ];

    for (const dept of defaultDepartments) {
      await Department.updateOne(
        { name: dept.name },
        { $setOnInsert: dept },
        { upsert: true }
      );
    }

    const departments = await Department.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Default departments seeded successfully!",
      departments
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to seed departments",
      error: error.message,
    });
  }
});

// Delete a department by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedDepartment = await Department.findByIdAndDelete(req.params.id);
    if (!deletedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json({
      message: "Department deleted successfully!",
      department: deletedDepartment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete department",
      error: error.message,
    });
  }
});

module.exports = router;
