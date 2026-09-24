const fs = require("fs");
const path = require("path");

const extractRequirements = require("../services/coverage/extractRequirements");
const buildCoverage = require("../services/coverage/buildCoverage");

const jobs = require("../input/jobs.json");

const resumeSkills = [
  "Python",
  "Machine Learning",
  "MongoDB",
  "React",
  "LangChain",
  "RAG",
];

const results = jobs.map((job) => {
  const roadmapMock = {
    skills: job.jobDescription.split(",").map((s) => s.trim()),
  };

  const requirements = extractRequirements(roadmapMock);
  const coverage = buildCoverage(resumeSkills, requirements);

  return {
    company: job.company,
    coverage: coverage.coverage,
    covered: coverage.covered.map((i) => i.skill),
    missing: coverage.missing.map((i) => i.skill),
  };
});

const outputPath = path.join(__dirname, "../output/results.json");

fs.mkdirSync(path.dirname(outputPath), { recursive: true });

fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

console.log("Evaluation complete.");
console.log(`Results saved to ${outputPath}`);