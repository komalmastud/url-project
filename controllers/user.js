const User = require("../models/user");

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;

  try {
    // Create a new user in the database
    await User.create({
      name,
      email,
      password,
    });

    // Redirect to the home page after successful signup
    return res.render("home");
  } catch (err) {
    console.error("Error during signup:", err);
    return res.render("signup", { error: "Signup failed. Please try again." });
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  try {
    // Find a user by email and password
    const user = await User.findOne({
      email,
      password,
    });

    // Check if the user was found
    if (!user) {
      return res.render("login", {
        error: "Invalid username or password", // Corrected error message formatting
      });
    }

    // Redirect to the home page after successful login
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
