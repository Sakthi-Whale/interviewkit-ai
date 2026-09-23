/*this service is responsible for discovering all the links present in a given HTML content. It uses the cheerio library to parse the HTML and extract the href attributes of anchor tags. It then converts relative URLs to absolute URLs based on the provided base URL and filters out any links that do not belong to the same domain as the base URL. The discovered links are returned as an array of unique absolute URLs. */

const cheerio = require("cheerio");

const discoverLinks = (html, baseUrl) => {
  const $ = cheerio.load(html);

  const links = new Set();

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");

    if (!href) return;

    try {
      const absolute = new URL(href, baseUrl).href;

      if (absolute.startsWith(baseUrl)) {
        links.add(absolute.split("#")[0]);
      }
    } catch {}
  });

  return [...links];
};

module.exports = discoverLinks;