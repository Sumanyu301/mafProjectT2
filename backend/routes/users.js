import express from "express";
import prisma from "../prismaClient.js";
// import { verifyToken } from "../middlewares/authMiddlewares.js";
import { getUserById, updateUserById, deleteUserById } from "../controllers/usersController.js";

const router = express.Router();

// Get user by ID
router.get("/:id", getUserById);

// Update user
router.put("/:id", updateUserById);

// Delete user
router.delete("/:id", deleteUserById);

export default router;
