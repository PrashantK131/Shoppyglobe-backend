const mongoose = require("mongoose");

// Product Schema represents a product available in the store.
 
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true
        },
            price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"]
        },
        description: {
            type: String,
            trim: true,
            default: ""
        },
            stock: {
            type: Number,
            required: [true, "Stock quantity is required"],
            min: [0, "Stock cannot be negative"],
            default: 0
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);