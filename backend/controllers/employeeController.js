import prisma from "../prismaClient.js";

// Create Employee
export const createEmployee = async (req, res) => {
  try {
    const { name, contact } = req.body;
    const userId = req.user.id; // Get from authenticated user, not body

    // Check if employee profile already exists for this user
    const existingEmployee = await res.json({
      employeeId: employee.id,
      name: employee.name,
      isBooked: isBooked,
      status: isBooked ? "BOOKED" : "AVAILABLE",
      activeTasks: activeTasks,
      maxTasks: employee.maxTasks,
      capacityUsed: (activeTasks / employee.maxTasks) * 100,
    });
    employee.findUnique({
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

// Create Employee Profile for Any User (removed admin requirement)
export const createEmployeeForUser = async (req, res) => {
  try {
    const { userId, name, contact } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if employee profile already exists for this user
    const existingEmployee = await prisma.employee.findUnique({
      where: { userId: parseInt(userId) },
    });

    if (existingEmployee) {
      return res
        .status(400)
        .json({ error: "Employee profile already exists for this user" });
    }

    const employee = await prisma.employee.create({
      data: {
        userId: parseInt(userId),
        name: name || user.username,
        contact: contact || user.email,
      },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    res.status(201).json(employee);
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
          select: { id: true, username: true, email: true }, // Don't expose password
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
      where: { userId: Number(id) },
      include: {
        user: {
          select: { id: true, username: true, email: true },
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

    // Only allow users to update their own profile
    if (employee.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this employee profile" });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: Number(id) },
      data: { name, contact },
      include: {
        user: {
          select: { id: true, username: true, email: true },
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

// ------------------------------------------------------------------------------------------------------------

// Get Available Employees for Task Assignment

// Get Available Employees for Task Assignment
export const getAvailableEmployees = async (req, res) => {
  try {
    const { maxTasks = 5, skillRequired, priority = "MEDIUM" } = req.query;

    const employees = await prisma.employee.findMany({
      where: {
        ...(skillRequired && {
          skills: {
            some: {
              skill: { name: { contains: skillRequired, mode: "insensitive" } },
            },
          },
        }),
      },
      include: {
        assignedTasks: {
          where: {
            status: { in: ["TODO", "IN_PROGRESS", "IN_REVIEW"] },
          },
        },
        skills: {
          include: { skill: true },
        },
        user: {
          select: { username: true, email: true },
        },
      },
    });

    const availableEmployees = employees
      .map((employee) => ({
        id: employee.id,
        name: employee.name,
        contact: employee.contact,
        maxTasks: employee.maxTasks,
        currentWorkload: employee.currentWorkload,
        activeTasksCount: employee.assignedTasks.length,
        capacityUsed: (employee.assignedTasks.length / employee.maxTasks) * 100,
        isAvailable: employee.assignedTasks.length < employee.maxTasks,
        skills: employee.skills.map((s) => ({
          name: s.skill.name,
          experience: s.yearsExperience,
        })),
        tasks: employee.assignedTasks.map((task) => ({
          id: task.id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          startDate: task.startDate,
          endDate: task.endDate,
          estimatedHours: task.estimatedHours,
        })),
      }))
      .filter((emp) => emp.isAvailable)
      .sort((a, b) => a.activeTasksCount - b.activeTasksCount); // Least busy first

    res.json({
      availableEmployees,
      totalAvailable: availableEmployees.length,
      criteria: { maxTasks, skillRequired, priority },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Team Workload Overview
export const getTeamWorkload = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        assignedTasks: {
          where: {
            status: { in: ["TODO", "IN_PROGRESS", "IN_REVIEW"] },
          },
          include: {
            project: { select: { priority: true } },
          },
        },
      },
    });

    const workloadSummary = employees.map((employee) => {
      const taskCount = employee.assignedTasks.length;
      const highPriorityTasks = employee.assignedTasks.filter(
        (task) =>
          task.project.priority === "HIGH" ||
          task.project.priority === "CRITICAL"
      ).length;

      const capacityUsed = (taskCount / employee.maxTasks) * 100;

      return {
        employeeId: employee.id,
        name: employee.name,
        taskCount,
        maxTasks: employee.maxTasks,
        capacityUsed: Math.round(capacityUsed),
        highPriorityTasks,
        status:
          capacityUsed === 0
            ? "AVAILABLE"
            : capacityUsed <= 50
            ? "LIGHT"
            : capacityUsed <= 80
            ? "MODERATE"
            : "HEAVY",
      };
    });

    const summary = {
      totalEmployees: employees.length,
      available: workloadSummary.filter((e) => e.status === "AVAILABLE").length,
      light: workloadSummary.filter((e) => e.status === "LIGHT").length,
      moderate: workloadSummary.filter((e) => e.status === "MODERATE").length,
      heavy: workloadSummary.filter((e) => e.status === "HEAVY").length,
      employees: workloadSummary,
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------------------------------------------------------------------------------------------------

// Simple function to check if employee is booked or available
export const isEmployeeBooked = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
      include: {
        assignedTasks: {
          where: {
            status: { in: ["TODO", "IN_PROGRESS", "IN_REVIEW"] },
          },
        },
      },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const activeTasks = employee.assignedTasks.length;
    const isBooked = activeTasks > 0;

    res.json({
      employeeId: employee.id,
      name: employee.name,
      isBooked: isBooked,
      status: isBooked ? "BOOKED" : "AVAILABLE",
      activeTasks: activeTasks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all employees with simple booking status
export const getAllEmployeesBookingStatus = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        assignedTasks: {
          where: {
            status: { in: ["TODO", "IN_PROGRESS", "IN_REVIEW"] },
          },
        },
        user: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    const employeesWithStatus = employees.map((employee) => {
      const activeTasks = employee.assignedTasks.length;
      const isBooked = activeTasks > 0;

      return {
        employeeId: employee.id,
        name: employee.name,
        contact: employee.contact,
        isBooked: isBooked,
        status: isBooked ? "BOOKED" : "AVAILABLE",
        activeTasks: activeTasks,
        maxTasks: employee.maxTasks,
        capacityUsed: (activeTasks / employee.maxTasks) * 100,
        user: employee.user,
      };
    });

    res.json({
      employees: employeesWithStatus,
      summary: {
        total: employeesWithStatus.length,
        available: employeesWithStatus.filter((emp) => !emp.isBooked).length,
        booked: employeesWithStatus.filter((emp) => emp.isBooked).length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
