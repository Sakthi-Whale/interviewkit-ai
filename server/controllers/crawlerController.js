/*this controller is responsible for handling the API request to test the crawler. It receives a company URL from the request body, invokes the crawlCompany service to crawl the website, and then calls the generateCompanyBrief service to generate an AI brief based on the crawled pages. The final response includes both the crawled data and the generated company brief. */

const crawlCompany = require("../services/crawler/crawlCompany");
const generateCompanyBrief = require("../services/llm/companyGenerator");

exports.testCrawler = async (req, res) => {
  try {
    const { companyUrl } = req.body;

    if (!companyUrl) {
      return res.status(400).json({
        success: false,
        message: "companyUrl is required",
      });
    }

    // Step 1: Crawl the website
    const crawled = await crawlCompany(companyUrl);

    // Step 2: Generate AI brief
    const companyBrief = await generateCompanyBrief(crawled.pages);

    res.json({
      success: true,
      crawled,
      companyBrief,
    });

  } catch (err) {
    console.error("Crawler error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};