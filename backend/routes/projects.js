import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// POST /projects - Create new project (Admin only)
router.post("/", verifyToken, createProject);

// GET /projects - List all projects with filters
router.get("/", verifyToken, getAllProjects);

// GET /projects/:id - Get project details with employees, tasks, milestones
router.get("/:id", verifyToken, getProjectById);

// PUT /projects/:id - Update project (Admin only)
router.put("/:id", verifyToken, updateProject);

// DELETE /projects/:id - Delete project (Admin only)
router.delete("/:id", verifyToken, deleteProject);

export default router;
