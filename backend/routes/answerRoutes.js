import express from "express";
import { submitAnswer, getAnswerHistory } from "../controllers/answerController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.post("/", submitAnswer);
router.get("/history", getAnswerHistory);

export default router;
