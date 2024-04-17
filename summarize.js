// Axios Framework ~ Used to call API

const axios = require('axios');

// API Call ~ Returns summarized text as string literal

async function summarizeText(text) {
  // Postman
  let data = JSON.stringify({
    "inputs": text,
    "parameters": {
      "max_length": 100,
      "min_length": 30
    }
  });

  // Config Object ~ API call instructions
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer ' + process.env['ACCESS_TOKEN']
    },
    data: data
  };

    // Try...Catch ~ For error handling
    try {
      const response = await axios.request(config);
      // Return ~ Returns summary text from response
      return response.data[0].summary_text;
    }
    catch (err) {
      console.log(err);
    }
  


}

// Export ~ Lets you call the function externally

module.exports = summarizeText;