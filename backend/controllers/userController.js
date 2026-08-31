const User = require("../models/User");

// @desc    Get all users
// @route   GET /api/users
// @access  Public (for MVP)
const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-__v")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: users.length,
            users
        });
    } catch (error) {
        console.error("Get users error:", error);

        res.status(500).json({
            message: "Server error while retrieving users"
        });
    }
};


// @desc    Get all riders
// @route   GET /api/users/riders
// @access  Public (for MVP)
const getRiders = async (req, res) => {
    try {
        const riders = await User.find({
            role: "rider"
        })
            .select("-__v")
            .sort({ name: 1 });

        res.status(200).json({
            count: riders.length,
            users: riders
        });
    } catch (error) {
        console.error("Get riders error:", error);

        res.status(500).json({
            message: "Server error while retrieving riders"
        });
    }
};


// @desc    Get all dispatchers
// @route   GET /api/users/dispatchers
// @access  Public (for MVP)
const getDispatchers = async (req, res) => {
    try {
        const dispatchers = await User.find({
            role: "dispatcher"
        })
            .select("-__v")
            .sort({ name: 1 });

        res.status(200).json({
            count: dispatchers.length,
            users: dispatchers
        });
    } catch (error) {
        console.error("Get dispatchers error:", error);

        res.status(500).json({
            message: "Server error while retrieving dispatchers"
        });
    }
};


module.exports = {
    getUsers,
    getRiders,
    getDispatchers
};