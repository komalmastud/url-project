const express = require("express");
const { handleUserSignup, handleUserLogin } = require("../controllers/user"); // Correct import path

const router = express.Router();

// Correct the signup route to be "/signup" for clarity
router.post("/signup", handleUserSignup); // Signup route
router.post("/login", handleUserLogin); // Login route

module.exports = router;
