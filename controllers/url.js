const shortid = require("shortid");
const Url = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;

  // Check if URL is provided
  if (!body.url) {
    return res.status(400).json({ error: "url is required" });
  }

  // Generate a short ID for the URL
  const shortID = shortid.generate();

  try {
    // Create a new URL entry in the database
    await Url.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [],
    });

    // Respond with the generated short URL ID
    return res.json({ id: shortID });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating short URL" });
  }
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;

  try {
    const result = await Url.findOne({ shortId });

    if (!result) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching analytics" });
  }
}

module.exports = { handleGenerateNewShortURL, handleGetAnalytics };
