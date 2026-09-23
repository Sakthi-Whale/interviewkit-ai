/*this route file is responsible for defining the API endpoint for testing the crawler. It sets up a POST route that listens for requests to the /test URL and invokes the testCrawler controller function to handle the request. */

const express = require("express");
const router = express.Router();

const { testCrawler } = require("../controllers/crawlerController");

router.post("/test", testCrawler);

module.exports = router;