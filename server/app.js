/*this is the main entry point of the server application. It sets up the Express app, configures middleware, and defines routes for authentication and kit management.*/

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const kitRoutes = require("./routes/kitRoutes");

const resumeRoutes = require("./routes/resumeRoutes");

const crawlerRoutes = require("./routes/crawlerRoutes");

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      "http://localhost:3000",
      "http://192.168.1.35:3000",
    ];

    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());


app.use("/api/resume", resumeRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/kits", kitRoutes);

app.use("/api/crawler", crawlerRoutes);

app.get("/api/health", (req, res) => {
  res.json({ success: true });
});

module.exports = app;