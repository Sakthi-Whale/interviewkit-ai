const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createKit,
  getMyKits,
  getKitById,
  deleteKit,
  updatePracticeProgress,
  updateFlashcards,
  regenerateSection,
} = require("../controllers/kitController");

router.post("/", protect, createKit);
router.get("/", protect, getMyKits);
router.get("/:id", protect, getKitById);
router.delete("/:id", protect, deleteKit);

router.patch("/:id/practice", protect, updatePracticeProgress);
router.patch("/:id/flashcards", protect, updateFlashcards);
router.patch("/:id/regenerate", protect, regenerateSection);

module.exports = router;