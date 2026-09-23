
/*this module is responsible for generating flashcards based on a given interview kit. It uses the Groq API to interact with a language model (OpenAI's GPT-OSS-120B) to create flashcards in JSON format. The generateFlashcards function takes an interview kit as input, constructs a prompt using the buildFlashcardPrompt function, and sends it to the language model. The response is then parsed and returned as an array of flashcards. */

const groq = require("./groq");
const { buildFlashcardPrompt } = require("./prompts");

const generateFlashcards = async (kit) => {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: buildFlashcardPrompt(kit),
      },
    ],
  });

  return JSON.parse(completion.choices[0].message.content);
};

module.exports = generateFlashcards;