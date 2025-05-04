// models/review.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
    {
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        text: {
            type: String,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        campground: {
            type: Schema.Types.ObjectId,
            ref: "Campground",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
