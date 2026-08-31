const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
    {
        orderReference: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        customer: {
            name: {
                type: String,
                required: true,
                trim: true
            },

            phone: {
                type: String,
                required: true,
                trim: true
            },

            address: {
                type: String,
                required: true,
                trim: true
            }
        },

        itemDescription: {
            type: String,
            required: true,
            trim: true
        },

        notes: {
            type: String,
            trim: true,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "CREATED",
                "ASSIGNED",
                "PICKED_UP",
                "DELIVERED"
            ],
            default: "CREATED"
        },

        assignedRider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        assignment: {
            rider: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null
            },

            dispatcher: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null
            },

            assignedAt: {
                type: Date,
                default: null
            }
        },

        statusHistory: [
            {
                previousStatus: {
                    type: String,
                    default: null
                },

                newStatus: {
                    type: String,
                    required: true
                },

                actor: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },

                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        verification: {
            verified: {
                type: Boolean,
                default: false
            },

            verificationCode: {
                type: String,
                default: null
            },

            verifiedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null
            },

            verifiedAt: {
                type: Date,
                default: null
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Delivery", deliverySchema);