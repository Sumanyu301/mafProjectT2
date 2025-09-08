import express from "express";
import {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// POST /projects/:id/tasks - Create task under project (Admin only)
router.post("/projects/:id/tasks", verifyToken, createTask);

// GET /projects/:id/tasks - Get all tasks for a project
router.get("/projects/:id/tasks", verifyToken, getProjectTasks);

// GET /tasks/:taskId - Get single task by ID
router.get("/tasks/:taskId", verifyToken, getTaskById);

// PUT /tasks/:taskId - Update task (Admin only)
router.put("/tasks/:taskId", verifyToken, updateTask);

// DELETE /tasks/:taskId - Delete task (Admin only)
router.delete("/tasks/:taskId", verifyToken, deleteTask);

export default router;
