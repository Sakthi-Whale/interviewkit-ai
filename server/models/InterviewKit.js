/* InterviewKit model */

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

    // NEW: Practice Mode progress
    practiceProgress: {
      type: [
        {
          questionIndex: Number,
          confidence: {
            type: String,
            enum: ["low", "medium", "high"],
          },
          completed: {
            type: Boolean,
            default: false,
          },
          practicedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("InterviewKit", interviewKitSchema);