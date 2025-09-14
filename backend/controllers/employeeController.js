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

// Get Employee by ID (accepts "me", userId or employee id) and return same shape as getMyProfile
export const getEmployeeById = async (req, res) => {
  try {
    const rawId = req.params.id;

    // build a single `where` condition that handles:
    // - "me" -> lookup by current user's userId
    // - numeric id -> lookup by employee.id OR employee.userId
    // - otherwise -> reject as invalid
    let where;
    if (rawId === "me") {
      where = { userId: req.user.id };
    } else {
      const parsed = Number(rawId);
      if (Number.isNaN(parsed)) {
        return res.status(400).json({ error: "Invalid id" });
      }
      where = {
        OR: [{ id: parsed }, { userId: parsed }],
      };
    }

    // common include definition to avoid duplication
    const commonInclude = {
      user: { select: { id: true, username: true, email: true } },
      skills: { include: { skill: { select: { id: true, name: true } } } },
      assignedTasks: {
        include: { project: { select: { id: true, title: true, status: true } } },
        where: { status: { not: "COMPLETED" } },
      },
      projectMembers: {
        select: {
          joinedAt: true,
          project: {
            select: {
              id: true,
              title: true,
              description: true,
              status: true,
              deadline: true,
              ownerId: true,
            },
          },
        },
      },
      createdProjects: {
        select: { id: true, title: true, description: true, status: true, deadline: true },
      },
      ownedProjects: {
        select: { id: true, title: true, description: true, status: true, deadline: true },
      },
    };

    // single query using the composed where + include
    const employee = await prisma.employee.findFirst({
      where,
      include: commonInclude,
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // statistics (unchanged)
    const totalTasks = await prisma.task.count({ where: { employeeId: employee.id } });
    const completedTasks = await prisma.task.count({
      where: { employeeId: employee.id, status: "COMPLETED" },
    });

    const ownedProjectsCount = (employee.ownedProjects || []).length;
    const memberProjectsCount = (employee.projectMembers || []).length;

    const profileData = {
      ...employee,
      statistics: {
        totalTasks,
        completedTasks,
        ownedProjects: ownedProjectsCount,
        memberProjects: memberProjectsCount,
        totalProjects: ownedProjectsCount + memberProjectsCount,
      },
    };

    res.json(profileData);
  } catch (error) {
    console.error("getEmployeeById error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update Employee Profile (Enhanced)
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, addSkills, removeSkills } = req.body;

    // Check if user owns this employee record
    const employee = await prisma.employee.findUnique({
      where: { id: Number(id) },
      include: { user: true, skills: { include: { skill: true } } },
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

    // Update basic employee info
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (contact !== undefined) updateData.contact = contact;

    const updatedEmployee = await prisma.employee.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
        skills: { include: { skill: true } },
      },
    });

    // Handle skills removal
    if (
      removeSkills &&
      Array.isArray(removeSkills) &&
      removeSkills.length > 0
    ) {
      await prisma.employeeSkill.deleteMany({
        where: {
          employeeId: Number(id),
          skillId: { in: removeSkills.map((id) => Number(id)) },
        },
      });
    }

    // Handle skills addition
    if (addSkills && Array.isArray(addSkills) && addSkills.length > 0) {
      for (const skillUpdate of addSkills) {
        const { skillId, yearsOfExperience } = skillUpdate;

        // Verify skill exists
        const skillExists = await prisma.skill.findUnique({
          where: { id: Number(skillId) },
        });

        if (skillExists) {
          // Check if skill already exists for this employee
          const existingSkill = await prisma.employeeSkill.findUnique({
            where: {
              employeeId_skillId: {
                employeeId: Number(id),
                skillId: Number(skillId),
              },
            },
          });

          if (!existingSkill) {
            await prisma.employeeSkill.create({
              data: {
                employeeId: Number(id),
                skillId: Number(skillId),
                yearsExperience: Number(yearsOfExperience) || 1,
              },
            });
          }
        }
      }
    }

    // Fetch updated employee with new skills
    const finalEmployee = await prisma.employee.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
        skills: { include: { skill: true } },
      },
    });

    res.json(finalEmployee);
  } catch (error) {
    console.error("Update employee error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get Current User's Employee Profile
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const employee = await prisma.employee.findUnique({
      where: { userId: userId },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
        skills: {
          include: {
            skill: {
              select: { id: true, name: true },
            },
          },
        },
        assignedTasks: {
          include: {
            project: {
              select: { id: true, title: true, status: true },
            },
          },
          where: {
            status: { not: "COMPLETED" },
          },
        },
        projectMembers: {
          select: {
            joinedAt: true,
            project: {
              select: {
                id: true,
                title: true,
                description: true,
                status: true,
                deadline: true,
                ownerId: true,
              },
            },
          },
        },
        createdProjects: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            deadline: true,
          },
        },
        ownedProjects: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            deadline: true,
          },
        },
      },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee profile not found" });
    }

    // Calculate statistics
    const totalTasks = await prisma.task.count({
      where: { employeeId: employee.id },
    });

    const completedTasks = await prisma.task.count({
      where: {
        employeeId: employee.id,
        status: "COMPLETED",
      },
    });

    const ownedProjectsCount = employee.ownedProjects.length;
    const memberProjectsCount = employee.projectMembers.length;

    // Format response
    const profileData = {
      ...employee,
      statistics: {
        totalTasks,
        completedTasks,
        ownedProjects: ownedProjectsCount,
        memberProjects: memberProjectsCount,
        totalProjects: ownedProjectsCount + memberProjectsCount,
      },
    };

    res.json(profileData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
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
