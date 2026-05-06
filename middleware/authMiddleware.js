const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware: Protects routes by verifying JWT token.Extracts the token from the Authorization header (Bearer <token>),verifies it and attaches the authenticated user to req.user.
const protect = async (req, res, next) => {
    let token;

    // Check for Bearer token in Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided.",
        });
    }

    try {
        // Verify token signature and expiry
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from DB (excludes password due to select: false in schema)
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Token is valid but user no longer exists.",
            });
        }

        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};

module.exports = { protect };