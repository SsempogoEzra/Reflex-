const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        contact: {
            type: String,
            required: true,
            trim: true
        },

        role: {
            type: String,
            enum: ["retailer", "dispatcher", "rider"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);