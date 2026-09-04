const express = require("express");

const {
    createDelivery,
    getDeliveries,
    assignDelivery,
    updateDeliveryStatus,
    cancelDelivery
} = require("../controllers/deliveryController");

const { verifyDelivery } = require("../controllers/verificationController");

const router = express.Router();

// Create a new delivery
router.post("/", createDelivery);

// Getting all the deliveries
router.get("/", getDeliveries);

// Assigning delivery to the rider
router.patch("/:id/assign", assignDelivery);

// Updating the delivery status (PICKED_UP, IN_TRANSIT)
router.patch("/:id/status", updateDeliveryStatus);

// Cancelling a delivery (any state except DELIVERED/CANCELLED)
router.patch("/:id/cancel", cancelDelivery);

// The rider scans the code to verify the order was dispatched
router.post("/:id/verify", verifyDelivery);

module.exports = router;