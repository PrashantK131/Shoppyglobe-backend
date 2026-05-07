const Cart = require("../models/Cart");
const Product = require("../models/Product");

/**
 * @route   POST /cart
 * @desc    Add a product to the authenticated user's cart.If the product already exists in the cart, its quantity is incremented.Prevents adding out-of-stock products.
 * @access  Protected
 */
const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user._id;

        // Verifies if product exists and is in stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        if (product.stock < 1) {
            return res.status(400).json({ success: false, message: "Product is out of stock." });
        }
        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} unit(s) available in stock.`,
            });
        }

        // Find or create cart for this user
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Create a new cart with this product
            cart = await Cart.create({ userId, products: [{ productId, quantity }] });
        } else {
            // Check if product already exists in cart
            const existingItem = cart.products.find((item) => item.productId.toString() === productId);

            if (existingItem) {
                // Update quantity instead of adding a duplicate
                const newQty = existingItem.quantity + quantity;
                if (newQty > product.stock) {
                    return res.status(400).json({
                        success: false,
                        message: `Cannot add more. Only ${product.stock} unit(s) in stock (${existingItem.quantity} already in cart).`
                    });
                }
                existingItem.quantity = newQty;
            } else {
                // Add new product entry to cart
                cart.products.push({ productId, quantity });
            }

            await cart.save();
        }

        // Populate product details for the response
        await cart.populate("products.productId", "name price stock");

        res.status(200).json({
            success: true,
            message: "Product added to cart.",
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /cart/:id
 * @desc    Update the quantity of a specific product (by productId) in the user's cart.
 * @access  Protected
 */
const updateCartItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const productId = req.params.id; // :id refers to the productId in the cart
        const userId = req.user._id;

        // Verify stock availability
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} unit(s) available in stock.`,
            });
        }

        // Find the user's cart and the specific item
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found." });
        }

        const item = cart.products.find((item) => item.productId.toString() === productId);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart."
            });
        }

        item.quantity = quantity;
        await cart.save();
        await cart.populate("products.productId", "name price stock");

        res.status(200).json({
            success: true,
            message: "Cart item updated.",
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /cart/:id
 * @desc    Remove a specific product (by productId) from the user's cart.
 * @access  Protected
 */
const removeFromCart = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const userId = req.user._id;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found." });
        }

        const initialLength = cart.products.length;
        // Filter out the product to remove
        cart.products = cart.products.filter((item) => item.productId.toString() !== productId);

        if (cart.products.length === initialLength) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart."
            });
        }

        await cart.save();
        await cart.populate("products.productId", "name price stock");

        res.status(200).json({
            success: true,
            message: "Product removed from cart.",
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { addToCart, updateCartItem, removeFromCart };