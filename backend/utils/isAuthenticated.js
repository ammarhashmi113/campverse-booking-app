const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const User = require("../models/user");

const isAuthenticated = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extracting token from the Authorization header
    if (!token) {
        return next(new AppError("You must be logged in", 401)); // No token found, return error
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifying the token
        const user = await User.findById(decoded.userId); // Find the user by ID from the decoded token
        if (!user) {
            return next(new AppError("User not found", 404));
        }
        req.user = user; // Setting the user to the request object
        next(); // Move to the next middleware/route handler
    } catch (err) {
        return next(new AppError("Invalid or expired token", 401)); // Invalid token
    }
};

module.exports = isAuthenticated;
