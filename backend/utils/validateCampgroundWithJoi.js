// Declared a function to validate inputs with Joi schema in
// The function is used in different route handlers (like post and patch)
// The function is exported for use.

// Destructuring CampgrounsSchemaJoi from schemas as we might have more than one schemas in the schema file.
const { campgroundSchemaJoi } = require("../schemas/joiSchemas");
const AppError = require("./AppError");

const validateCampgroundWithJoi = (req, res, next) => {
    req.body.campground.owner = req.user.id.toString(); // toString() ensures Joi receives a normal string (which is what Joi.objectId() expects), not a Mongoose ObjectId
    const { error } = campgroundSchemaJoi.validate(req.body);
    if (error) {
        const msg = error.details.map((element) => element.message).join(",");
        throw new AppError(msg, 400);
    } else {
        next();
    }
};

module.exports = validateCampgroundWithJoi;
