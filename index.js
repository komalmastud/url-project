const express = require("express");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const urlRoute = require("./routes/url");
const app = express();
const PORT = 8002;

// Connect to MongoDB
connectToMongoDB("mongodb://localhost:27017/short-url")
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Middleware
app.use(express.json());
app.use("/url", urlRoute);

// Redirect request handler
app.get("/:shortId", async (req, res) => {
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
