import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import { scoreAnswer } from "../services/aiService.js";

// POST /api/answers
// body: { questionId, answerText }
export const submitAnswer = async (req, res) => {
  try {
    const { questionId, answerText } = req.body;

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const feedback = await scoreAnswer(question.text, answerText);

    const answer = await Answer.create({
      question: questionId,
      user: req.user._id,
      answerText,
      score: feedback.score,
      strengths: feedback.strengths,
      improvements: feedback.improvements,
      feedbackSummary: feedback.feedbackSummary,
    });

    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/answers/history
// Returns all past answers for the logged-in user, most recent first
export const getAnswerHistory = async (req, res) => {
  try {
    const answers = await Answer.find({ user: req.user._id })
      .populate("question", "text category difficulty")
      .sort({ createdAt: -1 });
    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
