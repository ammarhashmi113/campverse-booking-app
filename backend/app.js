// app.js
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const campgroundRoutes = require("./routes/campgrounds");
const authRoutes = require("./routes/auth");
require("dotenv").config();
const AppError = require("./utils/AppError");
const cors = require("cors");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // for form data
app.use(express.json()); // for json data

const allowedOrigins = [
    "https://campverse-booking-app.vercel.app", // Vercel frontend URL
    "http://localhost:5173", // Local frontend URL
];

app.use(
    cors({
        origin: [allowedOrigins],
        credentials: true,
    })
);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

app.get("/api/health", (req, res) => {
    res.send("OK");
});

// Authentication Routes
app.use("/api/auth", authRoutes);

// Campground Routes
app.use("/api", campgroundRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    let { message = "Something went wrong", statusCode = 500 } = err;

    // If the error is an instance of AppError, use its properties for message and status code
    if (err instanceof AppError) {
        message = err.message || message; // Error message from AppError instance
        statusCode = err.statusCode || statusCode; // Status code from AppError instance
    }

    // Logging operational erros or bugs for debugging
    if (err.isOperational) {
        console.error("Operational Error: ", err);
    } else {
        console.error("Non-Operational Error (Bug): ", err);
    }

    // Sending error responses with status code to client
    res.status(statusCode).json({
        status: statusCode < 500 ? "fail" : "error",
        error: message,
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
