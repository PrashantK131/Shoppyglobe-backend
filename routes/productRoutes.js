const express = require("express");
const router = express.Router();
const { getAllProducts, getProductById } = require("../controllers/productController");
const { mongoIdParamValidator } = require("../middleware/validators");

// GET /products
router.get("/", getAllProducts);

// GET /products/:id
router.get("/:id", mongoIdParamValidator, getProductById);

module.exports = router;