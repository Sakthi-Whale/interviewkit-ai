/*this file defines the routes for managing interview kits in the InterviewKit AI application. It sets up endpoints for creating a new interview kit and retrieving all interview kits associated with the authenticated user. The routes are protected by an authentication middleware to ensure that only logged-in users can access them. The corresponding controller functions are imported and mapped to the routes, and the router is exported for use in the main application file to handle incoming requests related to interview kits.*/

const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  createKit,
  getMyKits,
  getKitById,
  deleteKit,
} = require("../controllers/kitController");

router.post("/", protect, createKit);

router.get("/", protect, getMyKits);

router.get("/:id", protect, getKitById);

router.delete("/:id", protect, deleteKit);

module.exports = router;