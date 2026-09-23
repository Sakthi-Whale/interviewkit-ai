/*This file defines a middleware function for protecting routes in the InterviewKit AI application. It checks for the presence of a JWT token in the request cookies, verifies the token using a secret key, and attaches the decoded user information to the request object. If the token is missing or invalid, it responds with an unauthorized error message. The middleware is exported for use in route definitions to secure access to protected endpoints.*/

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = protect;