const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
    {
        grievance: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Grievance",
            required: true
        },

        responder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Response", responseSchema);