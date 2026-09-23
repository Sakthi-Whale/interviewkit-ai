/*this file defines the InterviewKit model for the InterviewKit AI application. It uses Mongoose to create a schema for interview kit documents in the MongoDB database, specifying fields for user reference, job description, company URL, preparation days, status, parsed skills, and roadmap. The schema includes validation rules for required fields and enumerated values for status. Timestamps are also included to track when each interview kit document is created and last updated. Finally, the model is exported for use in other parts of the application.*/

const mongoose = require("mongoose");

const interviewKitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    companyUrl: {
      type: String,
      required: true,
    },

    preparationDays: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
    },

    status: {
      type: String,
      default: "draft",
      enum: ["draft", "processing", "completed"],
    },

    parsedSkills: [String],

    companyBrief: {
      summary: String,
      what_they_do: String,
      hiring_process: String,
      tech_stack: [String],
      sources_used: [String],
    },

    resumeProfile: {
      skills: [String],
      projects: [String],
      experienceLevel: String,
      education: [String],
    },

    coverage: {
      percentage: {
       type: Number,
       default: 0,
       },
    covered: [String],
    missing: [String],
    },

    flashcards: {
     type: Array,
     default: [],
   },

    roadmap: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("InterviewKit", interviewKitSchema);