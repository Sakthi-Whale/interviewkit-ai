/*this service is responsible for building coverage information based on a list of resume skills and a list of requirements. It normalizes the skills and requirements, checks which requirements are covered by the resume skills, and calculates the coverage percentage. The result includes the coverage percentage, an array of covered requirements, and an array of missing requirements. */

const normalize = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]/g, "");

const buildCoverage = (resumeSkills = [], requirements = []) => {
  const resumeSet = new Set(resumeSkills.map(normalize));

  const covered = [];
  const missing = [];

  requirements.forEach((req) => {
    if (resumeSet.has(normalize(req.skill))) {
      covered.push(req);
    } else {
      missing.push(req);
    }
  });

  const coverage =
    requirements.length === 0
      ? 0
      : Math.round((covered.length / requirements.length) * 100);

  return {
    coverage,
    covered,
    missing,
  };
};

module.exports = buildCoverage;