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

// Get Employee Availability and Workload
export const getEmployeeAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
      include: {
        assignedTasks: {
          where: {
            status: { in: ["TODO", "IN_PROGRESS", "IN_REVIEW"] },
          },
          include: {
            project: {
              select: { title: true, priority: true, deadline: true },
            },
          },
        },
        user: {
          select: { username: true, email: true },
        },
      },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const activeTasks = employee.assignedTasks;
    const totalEstimatedHours = activeTasks.reduce(
      (sum, task) => sum + (task.estimatedHours || 0),
      0
    );

    const workload = {
      employeeId: employee.id,
      name: employee.name,
      availability: employee.availability,
      maxTasks: employee.maxTasks,
      currentWorkload: employee.currentWorkload,
      activeTasksCount: activeTasks.length,
      totalEstimatedHours,
      status:
        activeTasks.length === 0
          ? "AVAILABLE"
          : activeTasks.length <= employee.maxTasks * 0.6
          ? "MODERATE"
          : "BUSY",
      tasks: activeTasks.map((task) => ({
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        project: task.project.title,
        projectPriority: task.project.priority,
        deadline: task.endDate,
        estimatedHours: task.estimatedHours,
      })),
    };

    res.json(workload);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Available Employees for Task Assignment
export const getAvailableEmployees = async (req, res) => {
  try {
    const { maxTasks = 5, skillRequired, priority = "MEDIUM" } = req.query;

    const employees = await prisma.employee.findMany({
      where: {
        availability: { in: ["AVAILABLE", "BUSY"] }, // Exclude ON_LEAVE
        ...(skillRequired && {
          skills: {
            some: {
              skill: { name: { contains: skillRequired, mode: "insensitive" } },
              proficiency: { in: ["ADVANCED", "EXPERT"] },
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
        availability: employee.availability,
        maxTasks: employee.maxTasks,
        currentWorkload: employee.currentWorkload,
        activeTasksCount: employee.assignedTasks.length,
        capacityUsed: (employee.assignedTasks.length / employee.maxTasks) * 100,
        isAvailable: employee.assignedTasks.length < employee.maxTasks,
        skills: employee.skills.map((s) => ({
          name: s.skill.name,
          proficiency: s.proficiency,
          experience: s.yearsExperience,
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
        availability: employee.availability,
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
      onLeave: workloadSummary.filter((e) => e.availability === "ON_LEAVE")
        .length,
      employees: workloadSummary,
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Employee Availability Status
export const updateEmployeeAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { availability, maxTasks } = req.body;

    // Check if user owns this employee record or is admin
    const employee = await prisma.employee.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    if (employee.userId !== req.user.id && req.user.systemRole !== "ADMIN") {
      return res
        .status(403)
        .json({
          error: "Not authorized to update this employee's availability",
        });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: Number(id) },
      data: {
        ...(availability && { availability }),
        ...(maxTasks && { maxTasks: Number(maxTasks) }),
      },
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
      availability: employee.availability
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

    const employeesWithStatus = employees.map(employee => {
      const activeTasks = employee.assignedTasks.length;
      const isBooked = activeTasks > 0;
      
      return {
        employeeId: employee.id,
        name: employee.name,
        contact: employee.contact,
        isBooked: isBooked,
        status: isBooked ? "BOOKED" : "AVAILABLE",
        activeTasks: activeTasks,
        availability: employee.availability,
        user: employee.user
      };
    });

    res.json({
      employees: employeesWithStatus,
      summary: {
        total: employeesWithStatus.length,
        available: employeesWithStatus.filter(emp => !emp.isBooked).length,
        booked: employeesWithStatus.filter(emp => emp.isBooked).length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
