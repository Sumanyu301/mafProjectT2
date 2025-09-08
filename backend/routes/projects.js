import express from "express";
import {
  createProject,
  getAllProjects,
} from "../controllers/projectController.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// POST /projects - Create new project (Admin only)
router.post("/", verifyToken, createProject);

// GET /projects - List all projects with filters
router.get("/", verifyToken, getAllProjects);

export default router;
