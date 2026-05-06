const express = require("express");
const router = express.Router();
const { addToCart, updateCartItem, removeFromCart } = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");
const {
  addToCartValidator,
  updateCartValidator,
  mongoIdParamValidator,
} = require("../middleware/validators");

// All cart routes require authentication
router.use(protect);

// POST /cart → Add product to cart
router.post("/", addToCartValidator, addToCart);

// PUT /cart/:id → Update product quantity (:id = productId)
router.put("/:id", updateCartValidator, updateCartItem);

// DELETE /cart/:id → Remove product from cart (:id = productId)
router.delete("/:id", mongoIdParamValidator, removeFromCart);

module.exports = router;