const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define User Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true, // Ensure name is required
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email must be unique
  },
  password: {
    type: String,
    required: true, // Ensure password is required
  },
});

// Create User model
const User = mongoose.model("User", userSchema);

module.exports = User;
