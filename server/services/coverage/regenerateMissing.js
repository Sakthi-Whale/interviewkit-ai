/*this service is responsible for regenerating missing requirements. It takes an array of missing requirements as input and maps each item to a new object containing the requirementId, skill, and status set to "pending". The resulting array of regenerated requirements is returned. */

const regenerateMissing = (missing = []) => {
  return missing.map((item) => ({
    requirementId: item.id,
    skill: item.skill,
    status: "pending",
  }));
};

module.exports = regenerateMissing;