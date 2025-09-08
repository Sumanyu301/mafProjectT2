import express from "express";
import {
  createMilestone,
  getProjectMilestones,
  updateMilestone,
  deleteMilestone,
} from "../controllers/milestoneController.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// POST /projects/:id/milestones - Create milestone for project (Admin only)
router.post("/projects/:id/milestones", verifyToken, createMilestone);

// GET /projects/:id/milestones - Get all milestones for a project
router.get("/projects/:id/milestones", verifyToken, getProjectMilestones);

// PUT /milestones/:milestoneId - Update milestone (Admin only)
router.put("/milestones/:milestoneId", verifyToken, updateMilestone);

// DELETE /milestones/:milestoneId - Delete milestone (Admin only)
router.delete("/milestones/:milestoneId", verifyToken, deleteMilestone);

export default router;
