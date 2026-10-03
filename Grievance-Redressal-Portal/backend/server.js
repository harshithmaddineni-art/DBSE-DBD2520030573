const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const grievanceRoutes = require("./routes/grievanceRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/grievances", grievanceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Grievance Redressal Portal Backend is running!",
    status: "Active",
    endpoints: [
      "/api/auth/register",
      "/api/auth/login",
      "/api/users",
      "/api/grievances",
      "/api/categories",
      "/api/departments",
    ],
  });
});

const seedData = require("./seeder");

mongoose.set("bufferCommands", false);

// MongoDB connection setup with auto-reconnection & error handling
mongoose.connection.on("error", (err) => {
  console.error("MongoDB Atlas connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB Atlas connection disconnected.");
});

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    tls: true,
  })
  .then(async () => {
    console.log("MongoDB Atlas connected successfully!");
    console.log("Database name:", mongoose.connection.name);
    try {
      await seedData();
    } catch (sErr) {
      console.warn("Seeding notice:", sErr.message);
    }
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});