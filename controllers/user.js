// controllers/user.js
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  try {
    await User.create({ name, email, password });
    return res.render("home");
  } catch (err) {
    console.error("Error during signup:", err);
    return res.render("signup", { error: "Signup failed. Please try again." });
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    console.log("User:", user);
    if (!user) {
      return res.render("login", { error: "Invalid username or password" });
    }
    const sessionId = uuidv4();
    res.cookie("uid", sessionId);
    return res.redirect("/");
  } catch (err) {
    console.error("Error during login:", err);
    return res.render("login", { error: "Login failed. Please try again." });
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};
