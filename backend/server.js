const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

const deliveryRoutes = require("./routes/deliveryRoutes");
const userRoutes = require("./routes/userRoutes");

const { initializeSocket } = require("./socket");

dotenv.config();

const connectDB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

// Routes
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/users", userRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Reflex API is running"
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Reflex server running on port ${PORT}`);
});