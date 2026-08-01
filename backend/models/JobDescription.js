import mongoose from "mongoose";

const jobDescriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      default: "",
    },
    rawText: {
      type: String,
      required: true,
    },
    // AI-extracted structured info, filled in after analysis
    extractedSkills: {
      type: [String],
      default: [],
    },
    seniority: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobDescription", jobDescriptionSchema);
