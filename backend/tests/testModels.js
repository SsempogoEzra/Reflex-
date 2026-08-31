require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const Delivery = require("../models/Delivery");

const testModels = async () => {
    try {
        await connectDB();

        console.log("Testing User model...");

        const rider = await User.create({
            name: "Test Rider",
            contact: "0712345678",
            role: "rider"
        });


        console.log("User created successfully:");
        console.log(rider);

        console.log("Testing Delivery model...");

        const dispatcher = await User.create({
            name: "Test Dispatcher",
            contact: "0700000000",
            role: "dispatcher"
        });

        console.log("Dispatcher created successfully:");
        console.log(dispatcher);

        const delivery = await Delivery.create({
            orderReference: "TEST-001",

            customer: {
                name: "Test Customer",
                phone: "0723456789",
                address: "Nairobi"
            },

            itemDescription: "Test package",

            status: "CREATED",

            statusHistory: [
                {
                    previousStatus: null,
                    newStatus: "CREATED",
                    actor: rider._id
                }
            ]
        });

        console.log("Delivery created successfully:");
        console.log(delivery);

        console.log("Model tests completed successfully.");

        await mongoose.connection.close();

        process.exit(0);
    } catch (error) {
        console.error("Model test failed:");
        console.error(error);

        await mongoose.connection.close();

        process.exit(1);
    }
};

testModels();