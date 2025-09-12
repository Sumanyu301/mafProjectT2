import prisma from "../prismaClient.js";

// Create Skill
export const createSkill = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if skill already exists
    const existingSkill = await prisma.skill.findUnique({
      where: { name },
    });

    if (existingSkill) {
      return res.status(409).json({
        error: "Skill already exists",
        skill: existingSkill,
      });
    }

    const skill = await prisma.skill.create({ data: { name } });
    res.status(201).json(skill);
  } catch (error) {
    // Handle Prisma unique constraint error specifically
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "Skill with this name already exists" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Get All Skills
export const getAllSkills = async (req, res) => {
  try {
    const skills = await prisma.skill.findMany();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Assign Skill to Employee
export const assignSkillToEmployee = async (req, res) => {
  try {
    // Get employeeId from either URL params or request body
    const employeeIdFromParams = req.params.employeeId;
    const {
      employeeId: employeeIdFromBody,
      skillId,
      yearsOfExperience,
    } = req.body;

    const employeeId = employeeIdFromParams || employeeIdFromBody;

    console.log("Debug - URL Params:", req.params);
    console.log("Debug - Request Body:", req.body);
    console.log("Debug - Employee ID from params:", employeeIdFromParams);
    console.log("Debug - Employee ID from body:", employeeIdFromBody);
    console.log("Debug - Final Employee ID:", employeeId);
    console.log("Debug - Employee ID as Number:", Number(employeeId));

    if (!employeeId) {
      return res.status(400).json({ error: "Employee ID is required" });
    }

    const employeeIdNumber = Number(employeeId);
    if (isNaN(employeeIdNumber)) {
      return res
        .status(400)
        .json({ error: "Employee ID must be a valid number" });
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeIdNumber },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Check if skill exists
    const skillIdNumber = Number(skillId);
    if (isNaN(skillIdNumber)) {
      return res.status(400).json({ error: "Skill ID must be a valid number" });
    }

    const skill = await prisma.skill.findUnique({
      where: { id: skillIdNumber },
    });

    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    // Check if skill is already assigned to employee
    const existing = await prisma.employeeSkill.findUnique({
      where: {
        employeeId_skillId: {
          employeeId: employeeIdNumber,
          skillId: skillIdNumber,
        },
      },
    });

    if (existing) {
      return res.status(409).json({
        error: "Skill already assigned to this employee",
      });
    }

    const assigned = await prisma.employeeSkill.create({
      data: {
        employeeId: employeeIdNumber,
        skillId: skillIdNumber,
        yearsExperience: Number(yearsOfExperience),
      },
      include: {
        skill: true,
        employee: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({
      message: "Skill assigned successfully",
      assignment: assigned,
    });
  } catch (error) {
    console.error("Error assigning skill:", error);
    res.status(500).json({ error: error.message });
  }
};

// Remove Skill from Employee
export const removeSkillFromEmployee = async (req, res) => {
  try {
    // Get data from request body instead of URL params
    const { employeeId, skillId } = req.body;

    console.log("Debug - Remove skill request body:", req.body);
    console.log("Debug - Employee ID:", employeeId);
    console.log("Debug - Skill ID:", skillId);

    if (!employeeId || !skillId) {
      return res
        .status(400)
        .json({ error: "Employee ID and Skill ID are required" });
    }

    const employeeIdNumber = Number(employeeId);
    const skillIdNumber = Number(skillId);

    if (isNaN(employeeIdNumber) || isNaN(skillIdNumber)) {
      return res
        .status(400)
        .json({ error: "Employee ID and Skill ID must be valid numbers" });
    }

    // Check if the skill assignment exists
    const existing = await prisma.employeeSkill.findUnique({
      where: {
        employeeId_skillId: {
          employeeId: employeeIdNumber,
          skillId: skillIdNumber,
        },
      },
    });

    if (!existing) {
      return res.status(404).json({ error: "Skill assignment not found" });
    }

    // Remove the skill assignment
    await prisma.employeeSkill.delete({
      where: {
        employeeId_skillId: {
          employeeId: employeeIdNumber,
          skillId: skillIdNumber,
        },
      },
    });

    res.json({
      message: "Skill removed from employee successfully",
      removed: {
        employeeId: employeeIdNumber,
        skillId: skillIdNumber,
      },
    });
  } catch (error) {
    console.error("Error removing skill:", error);
    res.status(500).json({ error: error.message });
  }
};
