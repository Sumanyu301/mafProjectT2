import prisma from "../prismaClient.js";

// Create Employee
export const createEmployee = async (req, res) => {
  try {
    const { name, contact } = req.body;
    const userId = req.user.id; // Get from authenticated user, not body

    // Check if employee profile already exists for this user
    const existingEmployee = await prisma.employee.findUnique({
      where: { userId: userId },
    });

    if (existingEmployee) {
      return res
        .status(400)
        .json({ error: "Employee profile already exists for this user" });
    }

    const employee = await prisma.employee.create({
      data: { userId, name, contact },
      include: { user: true },
    });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Employees
export const getAllEmployees = async (req, res) => {
  try {
    const { skill } = req.query;

    const employees = await prisma.employee.findMany({
      where: {
        ...(skill && {
          skills: {
            some: { skill: { name: { contains: skill, mode: "insensitive" } } },
          },
        }),
      },
      include: {
        user: {
          select: { id: true, username: true, email: true, systemRole: true }, // Don't expose password
        },
        skills: { include: { skill: true } },
      },
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
      include: {
        user: {
          select: { id: true, username: true, email: true, systemRole: true },
        },
        skills: { include: { skill: true } },
        assignedTasks: { include: { project: true } },
        projectMembers: { include: { project: true } },
      },
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
    const { name, contact } = req.body;

    // Check if user owns this employee record or is admin
    const employee = await prisma.employee.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Only allow users to update their own profile, or admins to update any profile
    if (employee.userId !== req.user.id && req.user.systemRole !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Not authorized to update this employee profile" });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: Number(id) },
      data: { name, contact },
      include: {
        user: {
          select: { id: true, username: true, email: true, systemRole: true },
        },
      },
    });
    res.json(updatedEmployee);
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
