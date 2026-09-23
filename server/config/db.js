/*This file is responsible for establishing a connection to the MongoDB database using Mongoose. It exports a function that connects to the database using the connection string specified in the environment variable MONGODB_URI. If the connection is successful, it logs a success message; if there is an error, it logs the error message and throws the error.*/

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB Error:", err.message);
    throw err;
  }
};

module.exports = connectDB;