const express = require("express");
const { handleUserSignup, handleUserLogin } = require("../controllers/user"); // Correct import path

const router = express.Router();

// Correct function names
router.post("/", handleUserSignup);
router.post("/login", handleUserLogin);

module.exports = router;
