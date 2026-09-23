/*this service is responsible for ranking a list of URLs based on their relevance to certain keywords. It assigns a score to each URL based on the presence of specific keywords in the URL string. The URLs are then sorted in descending order of their scores, and the top 5 URLs are returned. */

const keywords = [
  "career",
  "careers",
  "jobs",
  "hiring",
  "about",
  "engineering",
  "team",
  "handbook",
  "culture",
  "blog",
];

const rankLinks = (links) => {
  return links
    .map((url) => {
      const lower = url.toLowerCase();

      let score = 0;

      keywords.forEach((k) => {
        if (lower.includes(k)) score += 1;
      });

      return { url, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};

module.exports = rankLinks;