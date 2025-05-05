const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken"); // To generate JWT tokens for authentication
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const isAuthenticated = require("../utils/isAuthenticated");

const router = express.Router();

router.get("/me", isAuthenticated, async (req, res) => {
    // req.user was set by isAuthenticated middleware
    res.json({ user: req.user });
});

// // Register a new user
// router.post(
//     "/register",
//     catchAsync(async (req, res, next) => {
//         const { username, email, password } = req.body;

//         // Check if the email already exists
//         const emailExists = await User.findOne({ email });
//         if (emailExists) {
//             return next(new AppError("Email already registered", 400));
//         }

//         // Check if the username already exists
//         const usernameExists = await User.findOne({ username });
//         if (usernameExists) {
//             return next(new AppError("Username already in use", 400));
//         }

//         // Create a new user
//         const user = new User({
//             username,
//             email,
//             password,
//         });

//         await user.save();

//         // Send success response (you can also return some user info if needed)
//         res.status(201).json({
//             status: "success",
//             message: "User registered successfully!",
//         });
//     })
// );

router.post(
    "/register",
    catchAsync(async (req, res, next) => {
        const { username, email, password } = req.body;

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return next(new AppError("Email already registered", 400));
        }

        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return next(new AppError("Username already in use", 400));
        }

        const user = new User({ username, email, password });
        await user.save();

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            status: "success",
            token, // Send the JWT token to the client
        });
    })
);

// Login user
router.post(
    "/login",
    catchAsync(async (req, res, next) => {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError("Invalid email or password", 400));
        }

        // Compare the entered password with the stored hashed password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(new AppError("Invalid email or password", 400));
        }

        // Generate JWT token for the user
        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d", // Token expiration time
            }
        );

        res.status(200).json({
            status: "success",
            token, // Send the JWT token to the client
        });
    })
);

module.exports = router;
