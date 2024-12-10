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

  summarizeText(text)
    .then((response) => {
      res.send(response); // Send the summary text as a response to the client
    })

    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("An error occurred while summarizing the text");
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
