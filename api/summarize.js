const axios = require("axios");
require("dotenv").config();

async function summarizeText(text) {
  const API_TOKEN = process.env.ACCESS_TOKEN;
  const API_URL =
    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

  try {
    const response = await axios({
      url: API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        inputs: text,
        parameters: {
          max_length: 130,
          min_length: 30,
        },
      },
    });

    return response.data[0].summary_text;
  } catch (error) {
    console.error("Error in summarizeText:", error);
    throw error;
  }
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text_to_summarize } = req.body;

    if (!text_to_summarize) {
      return res.status(400).json({ error: "No text provided" });
    }

    const summary = await summarizeText(text_to_summarize);
    res.status(200).send(summary);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while summarizing the text");
  }
};
