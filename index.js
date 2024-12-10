require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const summarizeText = require("./summarize");

// Parses JSON bodies (as sent by API clients)
app.use(express.json());

// Serves static files from the 'public' directory
app.use(express.static("public"));

// Handle POST requests to the '/summarize' endpoint
app.post("/summarize", (req, res) => {
  const text = req.body.text_to_summarize;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  summarizeText(text)
    .then((response) => {
      res.send(response); // Send the summary text as a response to the client
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("An error occurred while summarizing the text");
    });
});

// Handle root route explicitly
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "./public" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// 404 handler - must be last
app.use((req, res) => {
  res.status(404).sendFile("index.html", { root: "./public" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
