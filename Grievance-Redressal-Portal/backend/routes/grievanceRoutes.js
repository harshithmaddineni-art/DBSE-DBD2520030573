const express = require("express");
const Grievance = require("../models/Grievance");
const { decrypt } = require("../utils/encryption");

const router = express.Router();

// Create a new grievance
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      student,
      assignedStaff,
      department,
    } = req.body;

    const grievance = new Grievance({
      title,
      description,
      category,
      priority,
      student,
      assignedStaff,
      department,
    });

    const savedGrievance = await grievance.save();

    res.status(201).json({
      message: "Grievance created successfully!",
      grievance: savedGrievance,
    });
  } catch (error) {
    console.error("Grievance Creation Error:", error);
    res.status(500).json({
      message: "Failed to create grievance",
      error: error.message,
    });
  }
});

const mongoose = require("mongoose");

// Get all grievances
router.get("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json([]);
    }
    const grievances = await Grievance.find()
      .populate("student", "userId name email role")
      .populate("assignedStaff", "userId name email role")
      .sort({ createdAt: -1 });

    const role = req.headers["x-user-role"];
    const userId = req.headers["x-user-id"];
    
    const formatted = grievances.map(g => {
      const gObj = g.toObject();
      if (gObj.student) {
        if (role === "admin" || String(gObj.student._id) === userId) {
          gObj.student.name = decrypt(gObj.student.name);
        } else {
          gObj.student.name = "*** Hidden ***";
        }
      }
      if (gObj.assignedStaff) {
        gObj.assignedStaff.name = decrypt(gObj.assignedStaff.name);
      }
      return gObj;
    });

    res.status(200).json(formatted);
  } catch (error) {
    res.status(200).json([]);
  }
});

// Get one grievance by MongoDB ID
router.get("/:id", async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id)
      .populate("student", "userId name email role")
      .populate("assignedStaff", "userId name email role");

    if (!grievance) {
      return res.status(404).json({
        message: "Grievance not found",
      });
    }

    const gObj = grievance.toObject();
    const role = req.headers["x-user-role"];
    const userId = req.headers["x-user-id"];

    if (gObj.student) {
      if (role === "admin" || String(gObj.student._id) === userId) {
        gObj.student.name = decrypt(gObj.student.name);
      } else {
        gObj.student.name = "*** Hidden ***";
      }
    }
    if (gObj.assignedStaff) {
      gObj.assignedStaff.name = decrypt(gObj.assignedStaff.name);
    }

    res.status(200).json(gObj);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch grievance",
      error: error.message,
    });
  }
});

// Update a grievance
router.put("/:id", async (req, res) => {
  try {
    const updatedGrievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: 'after',
        runValidators: true,
      }
    )
      .populate("student", "userId name email role")
      .populate("assignedStaff", "userId name email role");

    if (!updatedGrievance) {
      return res.status(404).json({
        message: "Grievance not found",
      });
    }

    const gObj = updatedGrievance.toObject();
    const role = req.headers["x-user-role"];
    const userId = req.headers["x-user-id"];

    if (gObj.student) {
      if (role === "admin" || String(gObj.student._id) === userId) {
        gObj.student.name = decrypt(gObj.student.name);
      } else {
        gObj.student.name = "*** Hidden ***";
      }
    }
    if (gObj.assignedStaff) {
      gObj.assignedStaff.name = decrypt(gObj.assignedStaff.name);
    }

    res.status(200).json({
      message: "Grievance updated successfully!",
      grievance: gObj,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update grievance",
      error: error.message,
    });
  }
});

// Delete a grievance
router.delete("/:id", async (req, res) => {
  try {
    const deletedGrievance = await Grievance.findByIdAndDelete(req.params.id);

    if (!deletedGrievance) {
      return res.status(404).json({
        message: "Grievance not found",
      });
    }

    res.status(200).json({
      message: "Grievance deleted successfully!",
      grievance: deletedGrievance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete grievance",
      error: error.message,
    });
  }
});

module.exports = router;