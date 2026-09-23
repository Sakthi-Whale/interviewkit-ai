/*this module is responsible for handling the routes related to resume management. It defines two main routes: one for uploading a resume and another for retrieving the authenticated user's resume. The upload route uses middleware to protect the route and handle file uploads, while the retrieval route also uses middleware to ensure that only authenticated users can access their resume. */

const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  uploadResume,
  getMyResume,
} = require("../controllers/resumeController");

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

router.get("/me", protect, getMyResume);

module.exports = router;