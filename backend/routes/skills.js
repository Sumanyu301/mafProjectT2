import express from "express";
import {
  createSkill,
  getAllSkills,
  assignSkillToEmployee,
  removeSkillFromEmployee,
} from "../controllers/skillController.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// All skill routes require authentication
router.post("/", verifyToken, createSkill);
router.get("/", verifyToken, getAllSkills);
router.post("/assign", verifyToken, assignSkillToEmployee);
router.delete("/remove", verifyToken, removeSkillFromEmployee);

export default router;
