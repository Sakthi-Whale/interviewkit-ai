/*this service is responsible for crawling a company's website. It fetches the homepage of the company, discovers all the links present on the homepage, ranks the links based on their relevance to certain keywords, and then fetches the HTML content of the top-ranked links. The text content of each page is extracted and returned along with the URL. The final result is an object containing the homepage URL and an array of pages with their URLs and text content. */

const cheerio = require("cheerio");

const fetchPage = require("./fetchPage");
const discoverLinks = require("./discoverLinks");
const rankLinks = require("./rankLinks");

const crawlCompany = async (companyUrl) => {
  const homepage = await fetchPage(companyUrl);

  if (!homepage) {
    throw new Error("Company site unreachable");
  }

  const discovered = discoverLinks(homepage, companyUrl);

  const ranked = rankLinks(discovered);

  const pages = [];

  for (const link of ranked) {
    const html = await fetchPage(link.url);

    if (!html) continue;

    const $ = cheerio.load(html);

    const text = $("body").text().replace(/\s+/g, " ").trim();

    pages.push({
      url: link.url,
      text: text.substring(0, 4000),
    });
  }

  return {
    homepage: companyUrl,
    pages,
  };
};

module.exports = crawlCompany;