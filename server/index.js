/*this file is the entry point of the server application. It initializes the server, connects to the database, and starts listening for incoming requests.*/

require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Server startup failed:", err.message);
    process.exit(1);
  }
};

startServer();