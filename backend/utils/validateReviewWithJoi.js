// Declared a function to validate inputs with Joi schema in
// The function is used in different route handlers (like post and patch)
// The function is exported for use.

// Destructuring reviewSchemaJoi from schemas as we might have more than one schemas in the schema file.
const { reviewSchemaJoi } = require("../schemas/joiSchemas");
const AppError = require("./AppError");

const validateReviewWithJoi = (req, res, next) => {
    req.body.review.author = req.user.id.toString(); // toString() ensures Joi receives a normal string (which is what Joi.objectId() expects), not a Mongoose ObjectId
    req.body.review.campground = req.params.id;
    const { error } = reviewSchemaJoi.validate(req.body);
    if (error) {
        const msg = error.details.map((element) => element.message).join(",");
        throw new AppError(msg, 400);
    } else {
        next();
    }
};

module.exports = validateReviewWithJoi;
