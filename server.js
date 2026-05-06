require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const errorHandler = require("./middleware/errorMiddleware");

// Connect to MongoDB 
connectDB();

// Initialize Express App 
const app = express();

// Middleware 
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" })); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(morgan("dev")); // HTTP request logger

// Routes 
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);

// Health Check 
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🛍 ShoppyGlobe API is running!",
        version: "1.0.0",
    });
});

// 404 Handler 
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found." });
});

// Centralized Error Handler  
app.use(errorHandler);

// Start Server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT} [${process.env.NODE_ENV || "development"}]`);
});

module.exports = app;