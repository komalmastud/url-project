const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { connectToMongoDB } = require("./connect");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const URL = require("./models/url");
const urlRoute = require("./routes/url");
const staticRouter = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const app = express();
const PORT = 8002;

// Connect to MongoDB
connectToMongoDB("mongodb://localhost:27017/short-url")
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Home route to render the URL list (make sure this is correct in your staticRouter)
app.get("/", async (req, res) => {
  try {
    // Fetch all URLs from the database
    const urls = await URL.find({});

    // Render the home.ejs template with the 'urls' data
    res.render("home", { urls: urls });
  } catch (err) {
    console.error("Error fetching URLs:", err);
    res.status(500).send("Server error");
  }
});

// Use routes for URLs and static content
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);

app.use("/", checkAuth, staticRouter);

// Redirect request handler
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  try {
    // Update visitHistory when the URL is visited
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(), // Store current timestamp in visitHistory
          },
        },
      },
      { new: true } // Return the updated document after the update
    );

    // Check if the entry exists
    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    // Log updated visit history for debugging
    console.log("Updated Visit History:", entry.visitHistory);

    // Redirect to the original URL
    res.redirect(entry.redirectURL);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
