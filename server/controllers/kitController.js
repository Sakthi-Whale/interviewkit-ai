const InterviewKit = require("../models/InterviewKit");
const User = require("../models/User");

const crawlCompany = require("../services/crawler/crawlCompany");

const generateCompanyBrief = require("../services/llm/companyGenerator");
const generateRoadmap = require("../services/llm/roadmapGenerator");
const generateFlashcards = require("../services/llm/flashcardGenerator");

const extractRequirements = require("../services/coverage/extractRequirements");
const buildCoverage = require("../services/coverage/buildCoverage");

// ================= CREATE KIT =================
exports.createKit = async (req, res) => {
  try {
    const { jobDescription, companyUrl, preparationDays } = req.body;

    const kit = await InterviewKit.create({
      user: req.user.id,
      jobDescription,
      companyUrl,
      preparationDays,
      status: "processing",
    });

    const user = await User.findById(req.user.id);
    const resumeProfile = user.resumeProfile;

    const crawled = await crawlCompany(companyUrl);

    const companyBrief = await generateCompanyBrief(crawled.pages);

    const roadmapData = await generateRoadmap({
      jd: jobDescription,
      companyUrl,
      days: preparationDays,
    });

    const requirements = extractRequirements(roadmapData);

    const coverageResult = buildCoverage(
      resumeProfile?.skills || [],
      requirements
    );

    const flashcardData = await generateFlashcards({
      jobDescription,
      companyBrief,
      parsedSkills: roadmapData.skills,
    });

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

// ================= GET ALL KITS =================
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

// ================= GET SINGLE KIT =================
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

// ================= DELETE KIT =================
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

// ================= PRACTICE MODE =================
exports.updatePracticeProgress = async (req, res) => {
  try {
    const { questionIndex, confidence } = req.body;

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

    const existingIndex = kit.practiceProgress.findIndex(
      (item) => item.questionIndex === questionIndex
    );

    const progress = {
      questionIndex,
      confidence,
      completed: true,
      practicedAt: new Date(),
    };

    if (existingIndex >= 0) {
      kit.practiceProgress[existingIndex] = progress;
    } else {
      kit.practiceProgress.push(progress);
    }

    await kit.save();

    res.json({
      success: true,
      practiceProgress: kit.practiceProgress,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= UPDATE FLASHCARDS =================
exports.updateFlashcards = async (req, res) => {
  try {
    const { flashcards } = req.body;

    const kit = await InterviewKit.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      { flashcards },
      { new: true }
    );

    if (!kit) {
      return res.status(404).json({
        success: false,
        message: "Interview Kit not found",
      });
    }

    res.json({
      success: true,
      flashcards: kit.flashcards,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= REGENERATE SECTION =================
exports.regenerateSection = async (req, res) => {
  try {
    const { section } = req.body;

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

    if (section === "companyBrief") {
      const crawled = await crawlCompany(kit.companyUrl);
      kit.companyBrief = await generateCompanyBrief(crawled.pages);
    }

    if (section === "roadmap") {
      const roadmap = await generateRoadmap({
        jd: kit.jobDescription,
        companyUrl: kit.companyUrl,
        days: kit.preparationDays,
      });

      kit.roadmap = [roadmap];
      kit.parsedSkills = roadmap.skills;
    }

    if (section === "flashcards") {
      const flashcards = await generateFlashcards({
        jobDescription: kit.jobDescription,
        companyBrief: kit.companyBrief,
        parsedSkills: kit.parsedSkills,
      });

      kit.flashcards = flashcards.flashcards;
    }

    await kit.save();

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