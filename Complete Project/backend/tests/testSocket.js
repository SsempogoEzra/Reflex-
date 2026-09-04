const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("Socket.io test client connected");
    console.log("Socket ID:", socket.id);
    console.log("Waiting for delivery events...\n");
});

// Delivery created
socket.on("delivery:created", (delivery) => {
    console.log("=== DELIVERY CREATED EVENT ===");
    console.log("Order Reference:", delivery.orderReference);
    console.log("Customer:", delivery.customer.name);
    console.log("Status:", delivery.status);
    console.log(
        "Verification Code:",
        delivery.verification.verificationCode
    );
    console.log("==============================\n");
});

// Delivery assigned
socket.on("delivery:assigned", (delivery) => {
    console.log("=== DELIVERY ASSIGNED EVENT ===");
    console.log("Order Reference:", delivery.orderReference);
    console.log("Status:", delivery.status);
    console.log("Assigned Rider:", delivery.assignedRider);
    console.log("===============================\n");
});

// Delivery status updated (PICKED_UP, IN_TRANSIT)
socket.on("delivery:statusUpdated", (delivery) => {
    console.log("=== DELIVERY STATUS UPDATED EVENT ===");
    console.log("Order Reference:", delivery.orderReference);
    console.log("Status:", delivery.status);
    console.log("Assigned Rider:", delivery.assignedRider);
    console.log("=====================================\n");
});

// Delivery delivered
socket.on("delivery:delivered", (delivery) => {
    console.log("=== DELIVERY DELIVERED EVENT ===");
    console.log("Order Reference:", delivery.orderReference);
    console.log("Status:", delivery.status);
    console.log(
        "Verified:",
        delivery.verification.verified
    );
    console.log("===============================\n");
});

// NEW: Delivery cancelled
socket.on("delivery:cancelled", (delivery) => {
    console.log("=== DELIVERY CANCELLED EVENT ===");
    console.log("Order Reference:", delivery.orderReference);
    console.log("Status:", delivery.status);
    console.log("Reason:", delivery.cancellation?.reason || "(none given)");
    console.log("================================\n");
});

// Connection errors
socket.on("connect_error", (error) => {
    console.error("Socket.io connection error:", error.message);
});