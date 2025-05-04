class AppError extends Error {
    // Constructor for the custom error class
    constructor(message, statusCode) {
        super(message); // Calling the parent Error class with the message

        this.statusCode = statusCode; // Storing the HTTP status code (e.g., 400, 500)

        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"; // If the statusCode starts with '4' (client error), we set status as 'fail', otherwise we set status as 'error' for server issues

        this.isOperational = true; // This tells us that the error is an expected "operational" error, not a bug

        // Capturing the stack trace so we can see where the error happened
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
