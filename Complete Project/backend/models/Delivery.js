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

        // NEW: matches frontend's "amount" field (e.g. "KSh 4,500")
        amount: {
            type: Number,
            default: 0,
            min: 0
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
                "IN_TRANSIT",   // NEW
                "DELIVERED",
                "CANCELLED"     // NEW
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

        // NEW: reason recorded when a delivery is cancelled
        cancellation: {
            reason: {
                type: String,
                default: null
            },
            cancelledBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null
            },
            cancelledAt: {
                type: Date,
                default: null
            }
        },

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