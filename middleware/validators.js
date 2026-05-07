const { body, param, validationResult } = require("express-validator");

// Reusable middleware to check validation results. Returns 422 with all error messages if validation fails.
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Validation failed",
            errors: errors.array().map((e) => ({ field: e.path, message: e.msg }))
        });
    }
    next();
};

// Auth Validators 

const registerValidator = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    validate,
];

const loginValidator = [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
    validate,
];

// Cart Validators 

const addToCartValidator = [
    body("productId").isMongoId().withMessage("Valid productId is required"),
    body("quantity")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Quantity must be a positive integer"),
    validate,
];

const updateCartValidator = [
    param("id").isMongoId().withMessage("Valid cart item productId is required"),
    body("quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be a positive integer"),
    validate,
];

const mongoIdParamValidator = [
    param("id").isMongoId().withMessage("Invalid ID format"),
    validate,
];

module.exports = {
    registerValidator,
    loginValidator,
    addToCartValidator,
    updateCartValidator,
    mongoIdParamValidator
};