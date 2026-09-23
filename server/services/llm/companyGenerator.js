/*this service is responsible for generating a company brief using the Groq API. It takes an array of pages as input, constructs a prompt using the buildCompanyPrompt function, and sends it to the Groq API for completion. The response is expected to be in JSON format, which is then parsed and returned as the final output. */

const groq = require("./groq");
const { buildCompanyPrompt } = require("./prompts");

const generateCompanyBrief = async (pages) => {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.2,
    response_format: {
      type: "json_object",
    },
    messages: [
      {
        role: "user",
        content: buildCompanyPrompt(pages),
      },
    ],
  });

  return JSON.parse(completion.choices[0].message.content);
};

module.exports = generateCompanyBrief;