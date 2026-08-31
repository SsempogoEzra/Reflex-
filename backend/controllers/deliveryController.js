const Delivery = require("../models/Delivery");
const User = require("../models/User");
const crypto = require("crypto");
const { getIO } = require("../socket");



// @desc    Create a new delivery
// @route   POST /api/deliveries
// @access  Public (for MVP)
const createDelivery = async (req, res) => {
    try {
        const {
            orderReference,
            customer,
            itemDescription,
            notes
        } = req.body;

        // Basic validation
        if (
            !orderReference ||
            !customer ||
            !customer.name ||
            !customer.phone ||
            !customer.address ||
            !itemDescription
        ) {
            return res.status(400).json({
                message: "Please provide all required delivery details"
            });
        }

        // Check whether the order reference already exists
        const existingDelivery = await Delivery.findOne({
            orderReference
        });

        if (existingDelivery) {
            return res.status(409).json({
                message: "A delivery with this order reference already exists"
            });
        }
       

        const delivery = await Delivery.create({
            orderReference,
            customer: {
                name: customer.name,
                phone: customer.phone,
                address: customer.address
            },
            itemDescription,
            notes: notes || "",
            status: "CREATED",

            // Generate a unique verification code
            verification: {
                verificationCode: crypto
                    .randomBytes(4)
                    .toString("hex")
                    .toUpperCase()
            }
        });

        // Notify connected clients that a delivery was created
        getIO().emit("delivery:created", delivery);

        res.status(201).json({
            message: "Delivery created successfully",
            delivery
        });
    } catch (error) {
        console.error("Create delivery error:", error);

        res.status(500).json({
            message: "Server error while creating delivery"
        });
    }
};

// @desc    Get all deliveries
// @route   GET /api/deliveries
// @access  Public (for MVP)
const getDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find()
            .populate("assignedRider", "name contact role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: deliveries.length,
            deliveries
        });
    } catch (error) {
        console.error("Get deliveries error:", error);

        res.status(500).json({
            message: "Server error while retrieving deliveries"
        });
    }
};

// @desc    Assign a delivery to a rider
// @route   PATCH /api/deliveries/:id/assign
// @access  Public (for MVP)
const assignDelivery = async (req, res) => {
    try {
        const { riderId, dispatcherId } = req.body;

        // Validate required IDs
        if (!riderId || !dispatcherId) {
            return res.status(400).json({
                message: "riderId and dispatcherId are required"
            });
        }

        // Find the delivery
        const delivery = await Delivery.findById(req.params.id);

        if (!delivery) {
            return res.status(404).json({
                message: "Delivery not found"
            });
        }

        // Delivery must still be CREATED
        if (delivery.status !== "CREATED") {
            return res.status(409).json({
                message: `Delivery cannot be assigned because its current status is ${delivery.status}`
            });
        }

        // Find the rider
        const rider = await User.findById(riderId);

        if (!rider) {
            return res.status(404).json({
                message: "Rider not found"
            });
        }

        // Confirm selected user is actually a rider
        if (rider.role !== "rider") {
            return res.status(400).json({
                message: "Selected user is not a rider"
            });
        }

        // Find the dispatcher
        const dispatcher = await User.findById(dispatcherId);

        if (!dispatcher) {
            return res.status(404).json({
                message: "Dispatcher not found"
            });
        }

        // Confirm selected user is actually a dispatcher
        if (dispatcher.role !== "dispatcher") {
            return res.status(400).json({
                message: "Selected user is not a dispatcher"
            });
        }

        // Update assignment
        delivery.assignedRider = rider._id;

        delivery.assignment = {
            rider: rider._id,
            dispatcher: dispatcher._id,
            assignedAt: new Date()
        };

        // Record status transition
        delivery.statusHistory.push({
            previousStatus: delivery.status,
            newStatus: "ASSIGNED",
            actor: dispatcher._id
        });

        // Update status
        delivery.status = "ASSIGNED";

        await delivery.save();

        getIO().emit("delivery:assigned", delivery);

        // Return updated delivery
        res.status(200).json({
            message: "Delivery assigned successfully",
            delivery
        });
    } catch (error) {
        console.error("Assign delivery error:", error);

        res.status(500).json({
            message: "Server error while assigning delivery"
        });
    }
};

// @desc    Update delivery status
// @route   PATCH /api/deliveries/:id/status
// @access  Public (for MVP)
const updateDeliveryStatus = async (req, res) => {
    try {
        const { status, riderId } = req.body;

        // Validate required fields
        if (!status || !riderId) {
            return res.status(400).json({
                message: "status and riderId are required"
            });
        }

        // Validate status value
        const allowedStatuses = [
            "PICKED_UP",
            "DELIVERED"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
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
                message: "Only a rider can update delivery status"
            });
        }

        // Confirm this rider is assigned to this delivery
        if (
            !delivery.assignedRider ||
            delivery.assignedRider.toString() !== riderId
        ) {
            return res.status(403).json({
                message: "This rider is not assigned to this delivery"
            });
        }

        // Define valid state transitions
        const validTransitions = {
            ASSIGNED: ["PICKED_UP"],
            PICKED_UP: ["DELIVERED"]
        };

        const allowedNextStatuses =
            validTransitions[delivery.status] || [];

        if (!allowedNextStatuses.includes(status)) {
            return res.status(409).json({
                message: `Invalid status transition from ${delivery.status} to ${status}`
            });
        }

        // Record status history
        delivery.statusHistory.push({
            previousStatus: delivery.status,
            newStatus: status,
            actor: rider._id
        });

        // Update current status
        delivery.status = status;

        await delivery.save();

        getIO().emit("delivery:statusUpdated", delivery);

        res.status(200).json({
            message: "Delivery status updated successfully",
            delivery
        });

    } catch (error) {
        console.error("Update delivery status error:", error);

        res.status(500).json({
            message: "Server error while updating delivery status"
        });
    }
};



module.exports = {
    createDelivery,
    getDeliveries,
    assignDelivery,
    updateDeliveryStatus
};