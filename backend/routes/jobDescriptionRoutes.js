import express from "express";
import {
  createJobDescription,
  getJobDescriptions,
  getJobDescriptionById,
} from "../controllers/jobDescriptionController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.post("/", createJobDescription);
router.get("/", getJobDescriptions);
router.get("/:id", getJobDescriptionById);

export default router;
