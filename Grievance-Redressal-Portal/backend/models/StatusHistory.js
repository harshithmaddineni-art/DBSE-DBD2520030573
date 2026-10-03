const mongoose = require("mongoose");

const statusHistorySchema = new mongoose.Schema(
    {
        grievance: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Grievance",
            required: true
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
            required: true
        },

        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        remarks: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("StatusHistory", statusHistorySchema);