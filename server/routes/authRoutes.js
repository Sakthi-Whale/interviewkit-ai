/* Authentication routes */

const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  register,
  login,
  logout,
  getMe,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Get currently logged-in user
router.get("/me", protect, getMe);

module.exports = router;