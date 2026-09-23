/*this service is responsible for extracting requirements from a given roadmap data. It takes the skills from the roadmap data and maps them to an array of requirement objects, each containing an id, skill, and type. The type is set to "technical" for all requirements. The extracted requirements are returned as an array of objects. */

const extractRequirements = (roadmapData) => {
  const skills = roadmapData.skills || [];

  return skills.map((skill, index) => ({
    id: `r${index + 1}`,
    skill,
    type: "technical",
  }));
};

module.exports = extractRequirements;