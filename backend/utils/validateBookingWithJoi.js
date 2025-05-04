// Declared a function to validate inputs with Joi schema in
// The function is used in different route handlers (like post and patch)
// The function is exported for use.

// Destructuring bookingSchemaJoi from schemas as we might have more than one schemas in the schema file.
const { bookingSchemaJoi } = require("../schemas/joiSchemas");
const AppError = require("./AppError");

const validateBookingWithJoi = (req, res, next) => {
    req.body.booking.user = req.user.id.toString(); // toString() ensures Joi receives a normal string (which is what Joi.objectId() expects), not a Mongoose ObjectId
    req.body.booking.campground = req.params.id;
    const { error } = bookingSchemaJoi.validate(req.body);
    if (error) {
        const msg = error.details.map((e) => e.message).join(",");
        throw new AppError(msg, 400);
    } else {
        next();
    }
};

module.exports = validateBookingWithJoi;
