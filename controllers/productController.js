const Product = require("../models/Product");

/**
 * @route   GET /products
 * @desc    Retrieve all products
 * @access  Public
 */
const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /products/:id
 * @desc    Retrieve a single product by its ID
 * @access  Public
 */
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error); // CastError for invalid IDs handled in errorMiddleware
    }
};

module.exports = { getAllProducts, getProductById };