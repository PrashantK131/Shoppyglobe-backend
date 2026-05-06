const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { registerValidator, loginValidator } = require("../middleware/validators");

// POST /auth/register
router.post("/register", registerValidator, register);

// POST /auth/login
router.post("/login", loginValidator, login);

module.exports = router;