import prisma from "../prismaClient.js";

// Create Skill
export const createSkill = async (req, res) => {
  try {
    const { name } = req.body;
    const skill = await prisma.skill.create({ data: { name } });
    res.json(skill);
  } catch (error) {
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
    const { employeeId } = req.params;
    const { skillId, proficiency, yearsExperience } = req.body;

    const assigned = await prisma.employeeSkill.create({
      data: {
        employeeId: Number(employeeId),
        skillId,
        proficiency,
        yearsExperience,
      },
    });

    res.json(assigned);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove Skill from Employee
export const removeSkillFromEmployee = async (req, res) => {
  try {
    const { employeeId, skillId } = req.params;
    await prisma.employeeSkill.delete({
      where: {
        employeeId_skillId: {
          employeeId: Number(employeeId),
          skillId: Number(skillId),
        },
      },
    });
    res.json({ message: "Skill removed from employee" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
