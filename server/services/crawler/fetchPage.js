/*this service is responsible for fetching the HTML content of a given URL. It uses the axios library to make HTTP GET requests and returns the HTML content as a string. If the request fails or times out, it returns null. */

const axios = require("axios");

const fetchPage = async (url) => {
  try {
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent": "InterviewKitAI/1.0",
      },
    });

    return data;
  } catch (err) {
    return null;
  }
};

module.exports = fetchPage;