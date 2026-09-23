/*this file defines the User model for the InterviewKit AI application. It uses Mongoose to create a schema for user documents in the MongoDB database, specifying fields for name, email, and password, along with their validation rules. The schema also includes timestamps to track when each user document is created and last updated. Finally, the model is exported for use in other parts of the application.*/

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    resumeProfile: {
      skills: {
      type: [String],
      default: [],
    },
     projects: {
      type: [String],
      default: [],
    },
     experienceLevel: {
      type: String,
      default: "",
    },
    education: {
      type: [String],
      default: [],
    },
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);