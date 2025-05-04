// models/booking.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        campground: {
            type: Schema.Types.ObjectId,
            ref: "Campground",
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "declined"],
            default: "pending",
        },
        reason: {
            type: String,
            required: function () {
                return this.status === "declined"; // Reason is required only if status is 'declined'
            },
            minlength: [10, "Reason must be at least 10 characters long"],
        },
    },
    { timestamps: true } // for createdAt and updatedAt
);

module.exports = mongoose.model("Booking", bookingSchema);
