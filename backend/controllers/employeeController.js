import prisma from "../prisma.js";

// Create Employee
export const createEmployee = async (req, res) => {
  try {
    const { userId, name, contact } = req.body;
    const employee = await prisma.employee.create({
      data: { userId, name, contact },
    });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Employees
export const getAllEmployees = async (req, res) => {
  try {
    const { availability, manager, skill } = req.query;

    const employees = await prisma.employee.findMany({
      where: {
        ...(availability && { availability: availability === "true" }),
        ...(manager && { managerName: { contains: manager, mode: "insensitive" } }),
        ...(skill && {
          skills: { some: { skill: { name: { contains: skill, mode: "insensitive" } } } },
        }),
      },
      include: { user: true, skills: { include: { skill: true } } },
    });

    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({
      where: { id: Number(id) },
      include: { user: true, skills: { include: { skill: true } } },
    });
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, availability, managerName } = req.body;

    const employee = await prisma.employee.update({
      where: { id: Number(id) },
      data: { name, contact, availability, managerName },
    });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.employee.delete({ where: { id: Number(id) } });
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
