/*this module is responsible for handling the creation and retrieval of interview kits. It defines three main functions: createKit, getMyKits, and getKitById. The createKit function handles the creation of a new interview kit by crawling the company website, generating a company brief, creating a preparation roadmap, extracting requirements, building coverage based on the user's resume profile, and generating flashcards. The getMyKits function retrieves all interview kits created by the authenticated user. The getKitById function retrieves a specific interview kit by its ID for the authenticated user. */

const InterviewKit = require("../models/InterviewKit");
const User = require("../models/User");

const crawlCompany = require("../services/crawler/crawlCompany");

const generateCompanyBrief = require("../services/llm/companyGenerator");
const generateRoadmap = require("../services/llm/roadmapGenerator");
const generateFlashcards = require("../services/llm/flashcardGenerator");

const extractRequirements = require("../services/coverage/extractRequirements");
const buildCoverage = require("../services/coverage/buildCoverage");

// CREATE INTERVIEW KIT
exports.createKit = async (req, res) => {
  try {
    const { jobDescription, companyUrl, preparationDays } = req.body;

    // 1. Create draft
    const kit = await InterviewKit.create({
      user: req.user.id,
      jobDescription,
      companyUrl,
      preparationDays,
      status: "processing",
    });

    // 2. Get user's saved resume profile
    const user = await User.findById(req.user.id);
    const resumeProfile = user.resumeProfile;

    // 3. Crawl company website
    const crawled = await crawlCompany(companyUrl);

    // 4. Generate company brief
    const companyBrief = await generateCompanyBrief(crawled.pages);

    // 5. Generate roadmap
    const roadmapData = await generateRoadmap({
      jd: jobDescription,
      companyUrl,
      days: preparationDays,
    });

    // 6. Build deterministic coverage
    const requirements = extractRequirements(roadmapData);

    const coverageResult = buildCoverage(
      resumeProfile?.skills || [],
      requirements
    );

    // 7. Generate flashcards
    const flashcardData = await generateFlashcards({
      jobDescription,
      companyBrief,
      parsedSkills: roadmapData.skills,
    });

    // 8. Save everything
    kit.resumeProfile = resumeProfile;

    kit.companyBrief = companyBrief;

    kit.parsedSkills = roadmapData.skills;

    kit.coverage = {
      percentage: coverageResult.coverage,
      covered: coverageResult.covered.map((r) => r.skill),
      missing: coverageResult.missing.map((r) => r.skill),
    };

    kit.flashcards = flashcardData.flashcards;

    kit.roadmap = [roadmapData];

    kit.status = "completed";

    await kit.save();

    res.status(201).json({
      success: true,
      kit,
    });

  } catch (err) {
    console.error("Create Kit Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET ALL KITS
exports.getMyKits = async (req, res) => {
  try {
    const kits = await InterviewKit.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      kits,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET SINGLE KIT
exports.getKitById = async (req, res) => {
  try {
    const kit = await InterviewKit.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!kit) {
      return res.status(404).json({
        success: false,
        message: "Interview Kit not found",
      });
    }

    res.json({
      success: true,
      kit,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE KIT
exports.deleteKit = async (req, res) => {
  try {
    const kit = await InterviewKit.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!kit) {
      return res.status(404).json({
        success: false,
        message: "Interview Kit not found",
      });
    }

    res.json({
      success: true,
      message: "Interview Kit deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};