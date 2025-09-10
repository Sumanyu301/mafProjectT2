import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";
import { requireRole } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// POST /projects - Create new project (Admin only)
router.post("/", verifyToken, requireRole(['ADMIN']),createProject);

// GET /projects - List all projects with filters
router.get("/", verifyToken, getAllProjects);

// GET /projects/:id - Get project details with employees, tasks, milestones
router.get("/:id", verifyToken, getProjectById);

// PUT /projects/:id - Update project (Admin only)
router.put("/:id", verifyToken, requireRole(['ADMIN']), updateProject);

// DELETE /projects/:id - Delete project (Admin only)
router.delete("/:id", verifyToken, requireRole(['ADMIN']), deleteProject);

export default router;
