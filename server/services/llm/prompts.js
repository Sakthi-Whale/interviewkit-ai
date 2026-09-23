/*this file contains functions that build prompts for the LLM (Language Model) to generate interview preparation plans based on job descriptions, company URLs, and preparation days. The prompts are structured to return valid JSON with specific fields for skills, experience level, company research, and a roadmap of daily tasks. */

exports.buildRoadmapPrompt = (jd, companyUrl, days) => `
You are an expert AI interview coach.

Create an interview preparation plan.

Return ONLY valid JSON.

{
  "skills": [],
  "experienceLevel": "",
  "companyResearch": "",
  "roadmap": [
    {
      "day": 1,
      "title": "",
      "topics": [],
      "practiceTask": ""
    }
  ]
}

Job Description:
${jd}

Company Website:
${companyUrl}

Preparation Days:
${days}
`;


exports.buildCompanyPrompt = (pages) => `
You are an expert company research assistant.

Generate ONLY valid JSON.

{
  "summary": "",
  "what_they_do": "",
  "hiring_process": "",
  "tech_stack": [],
  "sources_used": []
}

Rules:
- Use ONLY the crawled pages provided.
- Do not invent information.
- If hiring information is missing, return "Not publicly available".
- Keep summary under 80 words.
- tech_stack must be an array of strings.
- sources_used must contain only URLs from the input.

Crawled Pages:
${JSON.stringify(pages)}
`;


exports.buildResumePrompt = (resumeText) => `
You are an expert resume parser.

Return ONLY valid JSON.

{
  "skills": [],
  "projects": [],
  "experienceLevel": "",
  "education": []
}

Extraction rules:
- experienceLevel must be inferred from the resume title and work experience.
- Return one of: "Fresher", "Junior", "Mid", "Senior", "Lead".
- If the resume shows 0–2 years of professional experience, return "Junior".
- Extract only explicit skills and project names.
- Do not invent information.

Resume:
${resumeText}
`;

exports.buildFlashcardPrompt = (kit) => `
You are an AI interview coach.

Create concise interview flashcards.

Return ONLY valid JSON.

{
  "flashcards":[
    {
      "question":"",
      "answer":"",
      "category":""
    }
  ]
}

Generate 10 flashcards.

Job Description:
${kit.jobDescription}

Company Summary:
${kit.companyBrief.summary}

Skills:
${kit.parsedSkills.join(", ")}
`;