/*this file defines the middleware for handling file uploads in the application. It uses the multer library to configure storage, file filtering, and size limits for uploaded files. The middleware allows only PDF and DOCX files to be uploaded, with a maximum file size of 5 MB. The uploaded files are stored in memory for further processing. */

const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".pdf", ".docx"];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOCX files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

module.exports = upload;