/*this file defines the service for extracting text from uploaded resume files. It exports the extractResumeText function, which takes a file as input and extracts text from it based on its MIME type. Currently, it supports PDF files using the pdf-parse library, and it throws an error for unsupported file types (e.g., DOCX). The extracted text is returned as a string. */

const { PDFParse } = require("pdf-parse");

const extractResumeText = async (file) => {
  if (!file) {
    throw new Error("Resume file is missing");
  }

  if (file.mimetype === "application/pdf") {
    const parser = new PDFParse({ data: file.buffer });

    const result = await parser.getText();

    return result.text;
  }

  throw new Error("DOCX parsing will be added next");
};

module.exports = extractResumeText;