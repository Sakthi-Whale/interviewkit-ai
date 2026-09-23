/*this file defines the authentication routes for the InterviewKit AI application. It sets up endpoints for user registration, login, and logout, and maps them to their respective controller functions. The routes are exported for use in the main application file to handle incoming authentication-related requests.*/

const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;