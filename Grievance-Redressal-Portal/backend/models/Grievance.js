const mongoose = require("mongoose");

const grievanceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High", "Urgent"],
            default: "Medium"
        },

        status: {
            type: String,
            enum: [
                "Submitted",
                "Under Review",
                "Assigned",
                "In Progress",
                "Resolved",
                "Closed",
                "Rejected"
            ],
            default: "Submitted"
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        assignedStaff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        department: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Grievance", grievanceSchema);