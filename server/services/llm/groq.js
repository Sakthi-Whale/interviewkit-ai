/*this file is used to initialize the Groq SDK with the API key from the environment variables. It exports the initialized Groq instance for use in other parts of the application. */

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

module.exports = groq;