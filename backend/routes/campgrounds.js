const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Campground = require("../models/campground");
const Review = require("../models/review");
const Booking = require("../models/booking");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const isAuthenticated = require("../utils/isAuthenticated");
const validateCampgroundWithJoi = require("../utils/validateCampgroundWithJoi");
const validateReviewWithJoi = require("../utils/validateReviewWithJoi");
const validateBookingWithJoi = require("../utils/validateBookingWithJoi");

// GET all campgrounds with pagination
router.get(
    "/campgrounds",
    catchAsync(async (req, res) => {
        // Get page and limit from query parameters, with default values
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not specified

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Fetch campgrounds with pagination and sorting
        const campgrounds = await Campground.find({})
            .skip(skip) // Skip the already loaded items
            .limit(limit) // Limit the number of returned items
            .sort({ _id: -1 }) // Sort by _id descending (newest first)
            .lean();

        // Get the total count of campgrounds for pagination metadata
        const totalCampgrounds = await Campground.countDocuments();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalCampgrounds / limit);

        // Return campgrounds and pagination data
        res.json({
            campgrounds,
            total: totalCampgrounds,
            page,
            totalPages,
        });
    })
);

// GET All Campgrounds by current logged in user with Pagination
router.get(
    "/campgrounds/me",
    isAuthenticated,
    catchAsync(async (req, res, next) => {
        console.log("ME ROUTE WAS HIT");

        const loggedInUserId = req.user._id.toString();
        const { page = 1, limit = 10 } = req.query; // Use query parameters for pagination

        // Fetch paginated campgrounds
        const campgrounds = await Campground.find({ owner: loggedInUserId })
            .sort({ _id: -1 })
            .skip((page - 1) * limit) // Skip results based on the page number
            .limit(Number(limit)) // Limit the number of results per page
            .lean();

        // Count total campgrounds to calculate total pages
        const totalCampgrounds = await Campground.countDocuments({
            owner: loggedInUserId,
        });
        const totalPages = Math.ceil(totalCampgrounds / limit);

        res.json({ campgrounds, totalPages }); // Send both campgrounds and totalPages
    })
);

// GET a campground with specific id
router.get(
    "/campgrounds/:id",
    catchAsync(async (req, res, next) => {
        const { id } = req.params;

        // Checking if the ID is valid mongoose object, otherwise sending error
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("Invalid campground ID", 400)); // Sending 400 status code because of invalid request syntax
        }

        const camp = await Campground.findById(id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author",
                    select: "username email",
                },
            })
            .populate({
                path: "owner",
                select: "username email",
            }); // Get campground creator info too
        // Checking if camp found with corresponding id, otherwise sending error
        if (!camp) {
            return next(new AppError("Campground not found", 404)); // Sending 400 status code because campground againt provided id was not found
        }
        res.status(200).json(camp);
    })
);

// GET /campgrounds/:id/can-review
router.get(
    "/campgrounds/:id/can-review",
    isAuthenticated,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;

        const campground = await Campground.findById(id);
        if (!campground) {
            return next(new AppError("Campground not found", 404));
        }

        if (campground.owner.equals(req.user._id)) {
            return res.json({ canReview: false });
        }

        const acceptedBooking = await Booking.findOne({
            user: req.user._id,
            campground: id,
            status: "accepted",
        });

        const alreadyReviewed = await Review.exists({
            campground: id,
            author: req.user._id,
        });

        const canReview = !!acceptedBooking && !alreadyReviewed;
        res.json({ canReview });
    })
);

// GET /campgrounds/:id/can-book
router.get(
    "/campgrounds/:id/can-book",
    isAuthenticated,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;

        const campground = await Campground.findById(id);
        if (!campground) {
            return next(new AppError("Campground not found", 404));
        }

        // If user is not logged in, they cant book
        if (!req.user) {
            return res.json({ canBook: false });
        }

        // Campground owner cant book their own campground
        if (campground.owner.equals(req.user._id)) {
            return res.json({ canBook: false });
        }

        res.json({ canBook: true });
    })
);

// POST a new campground (we will assign the logged in user as the camp owner implicitly)
router.post(
    "/campgrounds",
    isAuthenticated, // Ensures that the user is authenticated
    validateCampgroundWithJoi, // Validating campground data with joi
    catchAsync(async (req, res, next) => {
        // Creating a new campground with the logged-in user as the owner (set in utility function: validateCampgroundWithJoi)
        const newCamp = new Campground(req.body.campground);

        // Saving the campground to the database
        await newCamp.save();

        // Responding with the new campground (which was created)
        res.status(201).json(newCamp);
    })
);

// Update a campground (only camp owner can update a campground)
router.patch(
    "/campgrounds/:id",
    isAuthenticated,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;

        // Checking if the ID is valid otherwise sending error
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("Invalid campground ID", 400));
        }

        const campFound = await Campground.findById(id);

        // Checking if a campground was found with corresponding id.
        if (!campFound) {
            return next(new AppError("Campground not found", 404));
        }

        // Checking if the logged in user is the same as the owner of the campground, otherwise throwing error
        if (req.user._id.toString() !== campFound.owner.toString()) {
            return next(
                new AppError(
                    "You are not authorized to update this campground",
                    403
                )
            );
        }

        // If the logged in user is the same as the owner of the campground, then we allow update
        const { campground } = req.body;
        const updatedCampground = await Campground.findByIdAndUpdate(
            id,
            campground,
            { new: true, runValidators: true }
        );

        // Checking if update was successfull
        if (!updatedCampground) {
            return next(new AppError("Campground not found", 404));
        }

        res.status(200).json(updatedCampground);
    })
);

// Delete a campground (only camp owner can delete a campground)
router.delete(
    "/campgrounds/:id",
    isAuthenticated,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;

        // Checking if the ID is valid otherwise sending error
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("Invalid campground ID", 400));
        }

        const campFound = await Campground.findById(id);

        // Checking if a campground was found with corresponding id.
        if (!campFound) {
            return next(new AppError("Campground not found", 404));
        }

        // Checking if the logged in user is the same as the owner of the campground, otherwise throwing error
        if (req.user._id.toString() !== campFound.owner.toString()) {
            return next(
                new AppError(
                    "You are not authorized to delete this campground",
                    403
                )
            );
        }

        // After ensuring the logged-in user is the camp owner, we delete the campground

        // Deleted reviews associated with the campground
        await Review.deleteMany({ campground: id });

        // Deleted bookings associated with the campground
        await Booking.deleteMany({ campground: id });

        // Deleted the campground itself
        await Campground.findByIdAndDelete(id);

        res.status(200).json({
            message: "Campground and associated reviews deleted successfully",
        });
    })
);

// Get all reviews for a particular campground
router.get(
    "/campgrounds/:id/reviews",
    catchAsync(async (req, res, next) => {
        // Extracting camp id
        const { id } = req.params;

        // Checking if the ID passed is a valid mongoose ID, otherwise sending error
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("Invalid campground ID", 400));
        }

        // Checking if a camp exists with corresponding id
        const campground = await Campground.findById(id).populate("reviews");
        if (!campground) {
            return next(new AppError("Campground not found", 404));
        }
        res.status(200).json(campground.reviews);
    })
);

// Add a review to a campground
router.post(
    "/campgrounds/:id/reviews",
    isAuthenticated,
    validateReviewWithJoi,
    catchAsync(async (req, res, next) => {
        // Extracting camp id
        const { id } = req.params;
        const { rating, text } = req.body.review;

        // Checking if the ID passed is a valid mongoose ID, otherwise sending error
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("Invalid campground ID", 400));
        }

        const campground = await Campground.findById(id);
        // Checking if a camp exists with corresponding id;
        if (!campground) {
            return next(new AppError("Campground not found", 404));
        }

        // Preventing the owner from reviewing their own campground
        if (campground.owner.equals(req.user._id)) {
            return next(
                new AppError("You cannot review your own campground", 400)
            );
        }

        // Only allowing the users to review whose booking request was previously accepted.
        const acceptedBooking = await Booking.findOne({
            user: req.user._id,
            campground: id,
            status: "accepted",
        });

        if (!acceptedBooking) {
            return next(
                new AppError(
                    "You can only review a campground if your booking has been accepted",
                    403
                )
            );
        }

        // Preventing multiple reviews from the same user.
        const existingReview = await Review.findOne({
            campground: id,
            author: req.user._id,
        });
        if (existingReview) {
            return next(
                new AppError("You have already reviewed this campground", 400)
            );
        }

        // Creating a new review
        const review = new Review({
            rating,
            text,
            author: req.user._id,
            campground: id,
        });

        await review.save();

        // Adding the review to the campground
        campground.reviews.push(review);
        await campground.save();

        res.status(201).json(review);
    })
);

// Delete a review from a campground (we will check if the logged in person is the review author, then we will allow, otherwise we will send an error)
router.delete(
    "/campgrounds/:id/reviews/:reviewId",
    isAuthenticated,
    catchAsync(async (req, res, next) => {
        const { id, reviewId } = req.params;
        const currentUser = req.user; // req.user shall contain the authenticated user

        // Checking if the camp ID is valid mongoose object, otherwise sending error
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("Invalid campground ID", 400));
        }

        // Checking if camp exists
        const campground = await Campground.findById(id);
        if (!campground) {
            return next(new AppError("Campground not found", 404));
        }

        // Checking if the review ID is valid mongoose object, otherwise sending error
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return next(new AppError("Invalid campground ID", 400));
        }

        const review = await Review.findById(reviewId);
        // If the review doesn't exist, we return a 404 error
        if (!review) {
            return next(new AppError("Review not found", 404));
        }

        // Checking if the logged in user is the author of the review, otherwise we send an error
        if (!review.author.equals(currentUser._id)) {
            return next(
                new AppError(
                    "You are not authorized to delete this review",
                    403
                )
            );
        }

        // If the logged in user is the same as author, then we allow review deletion.
        await Review.findByIdAndDelete(reviewId);

        // Removing the review reference from the campground
        await Campground.findByIdAndUpdate(id, {
            $pull: { reviews: reviewId },
        });

        // Send success response
        res.status(200).json({ message: "Review deleted successfully" });
    })
);

// Book a campground
router.post(
    "/campgrounds/:id/booking",
    isAuthenticated,
    validateBookingWithJoi,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const { startDate, endDate } = req.body.booking; // We expect dates as ISO strings

        // Checking if the ID is valid otherwise sending error
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("Invalid campground ID", 400));
        }

        // Checking if the campground exists
        const campground = await Campground.findById(id);
        if (!campground) {
            return next(new AppError("Campground not found", 404));
        }

        console.log("START DATE FROM REQ BODY:", startDate);
        console.log("END DATE FROM REQ BODY:", endDate);

        // Converting to date objects
        let newStartDate = new Date(startDate);
        let newEndDate = new Date(endDate);

        console.log(
            "NEW START DATE AFTER CONVERTING TO DATE OBJECT:",
            newStartDate
        );
        console.log(
            "NEW END DATE AFTER CONVERTING TO DATE OBJECT:",
            newEndDate
        );

        // Normalize both to UTC midnight
        newStartDate.setUTCHours(0, 0, 0, 0);
        newEndDate.setUTCHours(0, 0, 0, 0);

        console.log(
            "NEW START DATE AFTER NORMALIZING TO UTC MIDNIGHT:",
            newStartDate
        );
        console.log(
            "NEW END DATE AFTER NORMALIZING TO UTC MIDNIGHT:",
            newEndDate
        );

        // Checking that the start date is not in the past, otherwise sending error.
        const currentDate = new Date();
        console.log("CURRENT DATE:", currentDate);
        // Normalize current date to UTC midnight for fair comparison
        currentDate.setUTCHours(0, 0, 0, 0);

        console.log(
            "CURRENT DATE AFTER NORMALIZING TO UTC MIDNIGHT:",
            currentDate
        );

        console.log(
            "NEW START DATE < CURRENT DATE ? = ",
            newStartDate < currentDate
        );

        if (newStartDate < currentDate) {
            return next(
                new AppError("Booking cannot be made for past dates", 400)
            );
        }

        // Sending error if start date is greater than end date
        if (newStartDate >= newEndDate) {
            return next(new AppError("End date must be after start date", 400));
        }

        // Checking if the start date is more than three months from today
        const maxStartDate = new Date();
        maxStartDate.setMonth(maxStartDate.getMonth() + 3); // Adding 3 months to today's date

        if (newStartDate > maxStartDate) {
            return next(
                new AppError(
                    "Start date cannot be more than three months from now",
                    400
                )
            );
        }

        // Checking if the booking duration is longer than 3 months (90 days)
        const maxBookingDuration = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds
        const bookingDuration = newEndDate - newStartDate;

        if (bookingDuration > maxBookingDuration) {
            return next(
                new AppError("Booking duration cannot exceed 3 months", 400)
            );
        }

        // Preventing booking for one's own campground
        if (campground.owner.equals(req.user._id)) {
            return next(
                new AppError("You cannot book your own campground", 400)
            );
        }

        // Checking for overlapping bookings with an accepted or pending status
        const overlappingBooking = await Booking.findOne({
            user: req.user._id,
            campground: id,
            status: { $in: ["pending", "accepted"] },
            startDate: { $lt: newEndDate },
            endDate: { $gt: newStartDate },
        });

        if (overlappingBooking) {
            return next(
                new AppError(
                    "You already have a booking that overlaps with these dates",
                    400
                )
            );
        }

        // Creating a booking request
        const booking = new Booking({
            user: req.user._id,
            campground: id,
            startDate: newStartDate,
            endDate: newEndDate,
            status: "pending",
        });

        await booking.save();

        res.status(201).json(booking);
    })
);

// Get all the booking requests of camps owned by the logged in user
router.get(
    "/bookings",
    isAuthenticated,
    catchAsync(async (req, res, next) => {
        const bookings = await Booking.find()
            .populate([
                { path: "campground", select: "owner title" },
                { path: "user", select: "username email" },
            ])
            .sort({ createdAt: -1 }); // newest bookings first

        // Filter only bookings where campground.owner === logged in user
        const userBookings = bookings.filter(
            (booking) =>
                booking.campground &&
                booking.campground.owner.equals(req.user._id)
        );
        res.json(userBookings);
    })
);

// Get all booking requests made by the logged-in user
router.get(
    "/my-bookings",
    isAuthenticated,
    catchAsync(async (req, res, next) => {
        const bookings = await Booking.find({ user: req.user._id })
            .populate([
                { path: "campground", select: "owner title" },
                { path: "user", select: "username email" },
            ])
            .sort({ createdAt: -1 }); // newest bookings first

        res.json(bookings);
    })
);

// Accept/Decline a booking with patch
router.patch(
    "/campgrounds/:id/booking/:bookingId",
    isAuthenticated,
    catchAsync(async (req, res, next) => {
        const { id, bookingId } = req.params;
        const { status, reason } = req.body; // We expect "accepted" or "declined" in status and reason to be atleast 10 characters

        // Checking if the ID is valid otherwise sending error
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("Invalid campground ID", 400));
        }

        // Checking if the campground exists
        const campground = await Campground.findById(id);
        if (!campground) {
            return next(new AppError("Campground not found", 404));
        }

        // Checking if the booking ID is valid mongoose object, otherwise sending error
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return next(new AppError("Invalid Booking ID", 400));
        }

        // Checking if booking is found
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return next(new AppError("Booking not found", 404));
        }

        // Check if the user is the campground owner
        if (!campground.owner.equals(req.user._id)) {
            return next(
                new AppError(
                    "Only the campground owner can accept/decline bookings",
                    403
                )
            );
        }

        // Making sure that the declining reason is provided in case of booking decline.
        if (status === "declined" && !reason) {
            return next(
                new AppError("A reason is required in case of declining", 400)
            );
        }

        if (status === "declined" && reason && reason.length < 10) {
            return next(
                new AppError(
                    "Reason for declining must be atleast 10 characters long",
                    400
                )
            );
        }

        // Only "accepted" or "declined" are valid status
        if (status !== "accepted" && status !== "declined") {
            return next(
                new AppError(
                    "Invalid status. Must be 'accepted' or 'declined'",
                    400
                )
            );
        }

        // Preventing changes to bookings that have already been accepted or declined
        if (booking.status === "accepted" || booking.status === "declined") {
            return next(
                new AppError(
                    "You cannot change the status of a booking after it has been accepted or declined",
                    400
                )
            );
        }

        booking.status = status; // 'accepted' or 'declined'
        if (status === "declined") booking.reason = reason; // if status was declined, then we set reason too.
        await booking.save();
        res.status(200).json(booking);
    })
);

module.exports = router;
