import express from "express";
import {
  createEmployee,
  createEmployeeForUser,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getAvailableEmployees,
  getTeamWorkload,
  isEmployeeBooked,
  getAllEmployeesBookingStatus,
} from "../controllers/employeeController.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// All employee routes require authentication
router.post("/", verifyToken, createEmployee);
router.get("/", verifyToken, getAllEmployees);
router.get("/booking-status", verifyToken, getAllEmployeesBookingStatus);
router.get("/available", verifyToken, getAvailableEmployees);
router.get("/workload", verifyToken, getTeamWorkload);
router.get("/:id/booked", verifyToken, isEmployeeBooked);
router.get("/:id", verifyToken, getEmployeeById);
router.put("/:id", verifyToken, updateEmployee);
// Note: To delete an employee, delete the associated user via DELETE /api/users/:id
// This will automatically cascade delete the employee record

export default router;
