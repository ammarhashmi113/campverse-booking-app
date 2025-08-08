// models/campground.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const campgroundSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50,
        },
        location: {
            type: String,
            required: true,
            maxLength: 200,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
            minlength: 50,
            maxlength: 500,
        },
        image: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Campground", campgroundSchema);
