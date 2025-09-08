import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// All employee routes require authentication
router.post("/", verifyToken, createEmployee);
router.get("/", verifyToken, getAllEmployees);
router.get("/:id", verifyToken, getEmployeeById);
router.put("/:id", verifyToken, updateEmployee);
router.delete("/:id", verifyToken, deleteEmployee); // Admin check handled in controller

export default router;
