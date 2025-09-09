import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeAvailability,
  getAvailableEmployees,
  getTeamWorkload,
  updateEmployeeAvailability,
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
router.get("/:id/availability", verifyToken, getEmployeeAvailability);
router.get("/:id/booked", verifyToken, isEmployeeBooked);
router.get("/:id", verifyToken, getEmployeeById);
router.put("/:id", verifyToken, updateEmployee);
router.put("/:id/availability", verifyToken, updateEmployeeAvailability);
router.delete("/:id", verifyToken, deleteEmployee);

export default router;
