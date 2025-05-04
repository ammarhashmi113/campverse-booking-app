// Declared a function to validate inputs with Joi schema in
// The function is used in different route handlers (like post and patch)
// The function is exported for use.

// Destructuring userSchemaJoi from schemas as we might have more than one schemas in the schema file.
const { userSchemaJoi } = require("../schemas/joiSchemas");
const AppError = require("./AppError");

const validateUserWithJoi = (req, res, next) => {
    const { error } = userSchemaJoi.validate(req.body);
    if (error) {
        const msg = error.details.map((e) => e.message).join(",");
        throw new AppError(msg, 400);
    } else {
        next();
    }
};

module.exports = validateUserWithJoi;
