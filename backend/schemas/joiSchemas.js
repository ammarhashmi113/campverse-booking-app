// schemas/joiSchemas.js

const BaseJoi = require("joi");
const JoiObjectId = require("joi-objectid")(BaseJoi);
const Joi = BaseJoi;

// Extend Joi to understand Mongoose ObjectId
Joi.objectId = JoiObjectId;

// Campground Validation
const campgroundSchemaJoi = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        image: Joi.string().uri().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().required(),
        owner: Joi.objectId().required(),
    }).required(),
});

// Review Validation
const reviewSchemaJoi = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        text: Joi.string().required(),
        author: Joi.objectId().required(),
        campground: Joi.objectId().required(),
    }).required(),
});

// Booking Validation
const bookingSchemaJoi = Joi.object({
    booking: Joi.object({
        user: Joi.objectId().required(),
        campground: Joi.objectId().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().greater(Joi.ref("startDate")).required(),
        status: Joi.string()
            .valid("pending", "accepted", "declined")
            .default("pending"),
        reason: Joi.string().min(10).when("status", {
            is: "declined",
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),
    }).required(),
});

// User Registration Validation
const userSchemaJoi = Joi.object({
    user: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }).required(),
});

//  Exporting All Schemas
module.exports = {
    Joi, // Exporting the extended Joi
    campgroundSchemaJoi,
    reviewSchemaJoi,
    bookingSchemaJoi,
    userSchemaJoi,
};
