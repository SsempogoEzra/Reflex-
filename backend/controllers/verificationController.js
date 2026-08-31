const Delivery = require("../models/Delivery");
const User = require("../models/User");
const { getIO } = require("../socket");

// @desc    Verify delivery using verification code
// @route   POST /api/deliveries/:id/verify
// @access  Public (for MVP)
const verifyDelivery = async (req, res) => {
    try {
        const { verificationCode, riderId } = req.body;

        if (!verificationCode || !riderId) {
            return res.status(400).json({
                message: "verificationCode and riderId are required"
            });
        }

        // Find delivery
        const delivery = await Delivery.findById(req.params.id);

        if (!delivery) {
            return res.status(404).json({
                message: "Delivery not found"
            });
        }

        // Find rider
        const rider = await User.findById(riderId);

        if (!rider) {
            return res.status(404).json({
                message: "Rider not found"
            });
        }

        // Confirm user is a rider
        if (rider.role !== "rider") {
            return res.status(403).json({
                message: "Only a rider can verify a delivery"
            });
        }

        // Confirm rider is assigned to delivery
        if (
            !delivery.assignedRider ||
            delivery.assignedRider.toString() !== riderId
        ) {
            return res.status(403).json({
                message: "This rider is not assigned to this delivery"
            });
        }

        // Delivery must be picked up before verification
        if (delivery.status !== "PICKED_UP") {
            return res.status(409).json({
                message: "Delivery must be PICKED_UP before verification"
            });
        }

        // Prevent duplicate verification
        if (delivery.verification.verified) {
            return res.status(409).json({
                message: "Delivery has already been verified"
            });
        }

        // Check verification code
        if (
            !delivery.verification.verificationCode ||
            delivery.verification.verificationCode !== verificationCode
        ) {
            return res.status(400).json({
                message: "Invalid verification code"
            });
        }

        // Record verification
        delivery.verification.verified = true;
        delivery.verification.verifiedBy = rider._id;
        delivery.verification.verifiedAt = new Date();

        // Record status transition
        delivery.statusHistory.push({
            previousStatus: delivery.status,
            newStatus: "DELIVERED",
            actor: rider._id
        });

        // Update status
        delivery.status = "DELIVERED";

        await delivery.save();

        getIO().emit("delivery:delivered", delivery);

        res.status(200).json({
            message: "Delivery verified and marked as delivered",
            delivery
        });

    } catch (error) {
        console.error("Verify delivery error:", error);

        res.status(500).json({
            message: "Server error while verifying delivery"
        });
    }
};

module.exports = {
    verifyDelivery
};