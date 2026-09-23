/*this file is responsible for generating a roadmap for interview preparation based on a given job description, company URL, and the number of days available for preparation. It uses the Groq SDK to interact with a language model (LLaMA 3.3) to create a structured JSON response containing the roadmap details. */

const groq = require("./groq");
const { buildRoadmapPrompt } = require("./prompts");

const generateRoadmap = async ({ jd, companyUrl, days }) => {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    temperature: 0.4,
    response_format: {
      type: "json_object",
    },
    messages: [
      {
        role: "user",
        content: buildRoadmapPrompt(jd, companyUrl, days),
      },
    ],
  });

  return JSON.parse(
    completion.choices[0].message.content
  );
};

module.exports = generateRoadmap;