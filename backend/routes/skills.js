import express from "express";
import {
  createSkill,
  getAllSkills,
  assignSkillToEmployee,
  removeSkillFromEmployee,
} from "../controllers/skillController.js";

const router = express.Router();

router.post("/", createSkill);
router.get("/", getAllSkills);
router.post("/:employeeId/skills", assignSkillToEmployee);
router.delete("/:employeeId/skills/:skillId", removeSkillFromEmployee);

export default router;
