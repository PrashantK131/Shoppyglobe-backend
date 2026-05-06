// Centralized Error Handling Middleware Catches all errors passed via next(err) and returns a consistent JSON response.

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Mongoose: Invalid ObjectId (e.g., malformed product ID)
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ID format: ${err.value}`;
    }

    // Mongoose: Duplicate key (e.g., email already registered)
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    }

    // Mongoose: Validation error (required fields, min/max, etc.)
    if (err.name === "ValidationError") {
        statusCode = 422;
        message = Object.values(err.errors)
        .map((e) => e.message)
        .join(", ");
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token.";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token has expired.";
    }

    res.status(statusCode).json({
        success: false,
        message,
        // Only expose the stack trace in development mode
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

module.exports = errorHandler;
