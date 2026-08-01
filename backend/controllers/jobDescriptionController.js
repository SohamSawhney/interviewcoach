import JobDescription from "../models/JobDescription.js";
import Question from "../models/Question.js";
import { generateQuestions } from "../services/aiService.js";

// POST /api/job-descriptions
export const createJobDescription = async (req, res) => {
  try {
    const { title, company, rawText } = req.body;

    const jd = await JobDescription.create({
      user: req.user._id,
      title,
      company,
      rawText,
    });

    // Generate questions right away so the user lands on a ready session
    const generated = await generateQuestions(rawText, req.user.experienceLevel);

    const questionDocs = await Question.insertMany(
      generated.map((q) => ({
        jobDescription: jd._id,
        user: req.user._id,
        text: q.text,
        category: q.category,
        difficulty: q.difficulty,
      }))
    );

    res.status(201).json({ jobDescription: jd, questions: questionDocs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/job-descriptions
export const getJobDescriptions = async (req, res) => {
  try {
    const jds = await JobDescription.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(jds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/job-descriptions/:id
export const getJobDescriptionById = async (req, res) => {
  try {
    const jd = await JobDescription.findOne({ _id: req.params.id, user: req.user._id });
    if (!jd) return res.status(404).json({ message: "Job description not found" });

    const questions = await Question.find({ jobDescription: jd._id });
    res.json({ jobDescription: jd, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
