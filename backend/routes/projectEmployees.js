import express from "express";
import {
  assignEmployeesToProject,
  getProjectEmployees,
  removeEmployeeFromProject,
} from "../controllers/projectEmployeeController.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// POST /projects/:id/employees - Assign employee(s) to project (Admin only)
router.post("/projects/:id/employees", verifyToken, assignEmployeesToProject);

// GET /projects/:id/employees - Get list of employees in a project
router.get("/projects/:id/employees", verifyToken, getProjectEmployees);

// DELETE /projects/:id/employees/:employeeId - Remove employee from project (Admin only)
router.delete(
  "/projects/:id/employees/:employeeId",
  verifyToken,
  removeEmployeeFromProject
);

export default router;
