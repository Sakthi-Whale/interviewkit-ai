/*this service is responsible for generating a resume profile using the Groq API. It takes the resume text as input, constructs a prompt using the buildResumePrompt function, and sends it to the Groq API for completion. The response is expected to be in JSON format, which is then parsed and returned as the final output. */

const groq = require("./groq");
const { buildResumePrompt } = require("./prompts");

const generateResumeProfile = async (resumeText) => {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.2,
    response_format: {
      type: "json_object",
    },
    messages: [
      {
        role: "user",
        content: buildResumePrompt(resumeText),
      },
    ],
  });

  return JSON.parse(completion.choices[0].message.content);
};

module.exports = generateResumeProfile;