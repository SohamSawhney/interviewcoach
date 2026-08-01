import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answerText: {
      type: String,
      required: true,
    },
    // AI feedback fields, populated after scoring
    score: {
      type: Number, // 0-100
      default: null,
    },
    strengths: {
      type: [String],
      default: [],
    },
    improvements: {
      type: [String],
      default: [],
    },
    feedbackSummary: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Answer", answerSchema);
