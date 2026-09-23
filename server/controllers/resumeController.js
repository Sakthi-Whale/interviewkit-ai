/*this module is responsible for handling the upload and retrieval of user resumes. It defines two main functions: uploadResume and getMyResume. The uploadResume function extracts text from the uploaded resume file, generates a resume profile using a language model, and updates the user's resume profile in the database. The getMyResume function retrieves the authenticated user's resume profile from the database. */

const User = require("../models/User");

const extractResumeText = require("../services/parser/extractText");
const generateResumeProfile = require("../services/llm/resumeGenerator");

exports.uploadResume = async (req, res) => {
  try {
    const text = await extractResumeText(req.file);

    const profile = await generateResumeProfile(text);

    await User.findByIdAndUpdate(req.user.id, {
      resumeProfile: profile,
    });

    res.json({
      success: true,
      profile,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getMyResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      profile: user.resumeProfile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};