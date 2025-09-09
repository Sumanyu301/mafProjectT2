import prisma from "../prismaClient.js";

// Create a task under a project (Admin only)
export async function createTask(req, res) {
  try {
    const { id } = req.params; // project id
    const {
      title,
      description,
      priority = "MEDIUM",
      estimatedHours,
      startDate,
      endDate,
      assignedTo,
    } = req.body;

    // Check if user is admin
    if (req.user.systemRole !== "ADMIN") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Validate and parse dates
    const parsedStartDate = startDate ? new Date(startDate) : null;
    const parsedEndDate = endDate ? new Date(endDate) : null;

    // Check for invalid dates
    if (startDate && isNaN(parsedStartDate.getTime())) {
      return res.status(400).json({ error: "Invalid start date format" });
    }
    if (endDate && isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({ error: "Invalid end date format" });
    }

    // If assignedTo is provided, verify the employee exists
    if (assignedTo) {
      const employee = await prisma.employee.findUnique({
        where: { id: parseInt(assignedTo) },
      });

      if (!employee) {
        return res.status(404).json({ error: "Assigned employee not found" });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        projectId: parseInt(id),
        employeeId: assignedTo ? parseInt(assignedTo) : null,
        status: "TODO",
      },
      include: {
        project: {
          select: { id: true, title: true },
        },
        assignedTo: {
          select: { id: true, name: true, contact: true },
        },
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: error.message });
  }
}

// Get all tasks for a project
export async function getProjectTasks(req, res) {
  try {
    const { id } = req.params; // project id             
    const { status, priority, assignedTo } = req.query;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    const whereClause = { projectId: parseInt(id) };

    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;
    if (assignedTo) whereClause.assignedTo = parseInt(assignedTo);

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        project: {
          select: { id: true, title: true },
        },
        assignee: {
          select: { id: true, name: true, contact: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: error.message });
  }
}

// Get a single task by ID
export async function getTaskById(req, res) {
  try {
    const { taskId } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(taskId) },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            contact: true,
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: error.message });
  }
}

// Update a task (Admin only)
export async function updateTask(req, res) {
  try {
    const { taskId } = req.params;
    const {
      title,
      description,
      priority,
      status,
      startDate,
      endDate,
      assignedTo,
    } = req.body;

    // Check if user is admin
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id: parseInt(taskId) },
    });

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Prepare update data with date validation
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;

    if (startDate !== undefined) {
      const parsedStartDate = new Date(startDate);
      if (isNaN(parsedStartDate.getTime())) {
        return res.status(400).json({ error: "Invalid start date format" });
      }
      updateData.startDate = parsedStartDate;
    }

    if (endDate !== undefined) {
      const parsedEndDate = new Date(endDate);
      if (isNaN(parsedEndDate.getTime())) {
        return res.status(400).json({ error: "Invalid end date format" });
      }
      updateData.endDate = parsedEndDate;
    }

    if (assignedTo !== undefined) {
      if (assignedTo) {
        const employee = await prisma.employee.findUnique({
          where: { id: parseInt(assignedTo) },
        });

        if (!employee) {
          return res.status(404).json({ error: "Assigned employee not found" });
        }
        updateData.assignedTo = parseInt(assignedTo);
      } else {
        updateData.assignedTo = null;
      }
    }

    // Update the task
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(taskId) },
      data: updateData,
      include: {
        project: {
          select: { id: true, title: true },
        },
        assignee: {
          select: { id: true, name: true, contact: true },
        },
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: error.message });
  }
}

// Delete a task (Admin only)
export async function deleteTask(req, res) {
  try {
    const { taskId } = req.params;

    // Check if user is admin
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id: parseInt(taskId) },
    });

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Delete the task
    await prisma.task.delete({
      where: { id: parseInt(taskId) },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: error.message });
  }
}

// Smart Task Assignment - Auto-assign to best available employee
export async function smartAssignTask(req, res) {
  try {
    const { taskId } = req.params;
    const { skillRequired, priority = "MEDIUM" } = req.body;

    // Check if user is admin
    if (req.user.systemRole !== "ADMIN") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Get the task
    const task = await prisma.task.findUnique({
      where: { id: parseInt(taskId) },
      include: { project: true },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.employeeId) {
      return res.status(400).json({ error: "Task is already assigned" });
    }

    // Find best available employees
    const availableEmployees = await prisma.employee.findMany({
      where: {
        availability: { in: ["AVAILABLE", "BUSY"] },
        ...(skillRequired && {
          skills: {
            some: {
              skill: { name: { contains: skillRequired, mode: "insensitive" } },
              proficiency: { in: ["INTERMEDIATE", "ADVANCED", "EXPERT"] },
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
      },
    });

    if (availableEmployees.length === 0) {
      return res.status(404).json({ error: "No available employees found" });
    }

    // Score employees based on availability and skills
    const scoredEmployees = availableEmployees
      .map((employee) => {
        const workloadScore =
          (employee.maxTasks - employee.assignedTasks.length) /
          employee.maxTasks;
        const availabilityScore =
          employee.availability === "AVAILABLE" ? 1 : 0.7;

        let skillScore = 0.5; // Base score
        if (skillRequired) {
          const matchingSkill = employee.skills.find((s) =>
            s.skill.name.toLowerCase().includes(skillRequired.toLowerCase())
          );
          if (matchingSkill) {
            const proficiencyScores = {
              BEGINNER: 0.6,
              INTERMEDIATE: 0.8,
              ADVANCED: 0.9,
              EXPERT: 1.0,
            };
            skillScore = proficiencyScores[matchingSkill.proficiency] || 0.5;
          }
        }

        const totalScore =
          workloadScore * 0.4 + availabilityScore * 0.3 + skillScore * 0.3;

        return {
          employee,
          score: totalScore,
          workloadScore,
          skillScore,
          availabilityScore,
        };
      })
      .sort((a, b) => b.score - a.score);

    const bestEmployee = scoredEmployees[0].employee;

    // Assign the task
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(taskId) },
      data: {
        employeeId: bestEmployee.id,
      },
      include: {
        assignedTo: { select: { id: true, name: true, contact: true } },
        project: { select: { id: true, title: true } },
      },
    });

    // Update employee workload
    if (task.estimatedHours) {
      await prisma.employee.update({
        where: { id: bestEmployee.id },
        data: {
          currentWorkload: {
            increment: task.estimatedHours,
          },
        },
      });
    }

    // Update employee availability if they're getting close to capacity
    const updatedEmployeeData = await prisma.employee.findUnique({
      where: { id: bestEmployee.id },
      include: {
        assignedTasks: {
          where: {
            status: { in: ["TODO", "IN_PROGRESS", "IN_REVIEW"] },
          },
        },
      },
    });

    const newTaskCount = updatedEmployeeData.assignedTasks.length;
    const capacityUsed = newTaskCount / bestEmployee.maxTasks;

    if (capacityUsed >= 0.8 && bestEmployee.availability !== "OVERLOADED") {
      await prisma.employee.update({
        where: { id: bestEmployee.id },
        data: { availability: "OVERLOADED" },
      });
    } else if (
      capacityUsed >= 0.6 &&
      bestEmployee.availability === "AVAILABLE"
    ) {
      await prisma.employee.update({
        where: { id: bestEmployee.id },
        data: { availability: "BUSY" },
      });
    }

    res.json({
      message: "Task assigned successfully using smart assignment",
      task: updatedTask,
      assignedTo: {
        id: bestEmployee.id,
        name: bestEmployee.name,
        previousWorkload: bestEmployee.assignedTasks.length,
        newWorkload: newTaskCount,
        capacityUsed: Math.round(capacityUsed * 100),
        assignmentScore: Math.round(scoredEmployees[0].score * 100),
      },
      alternatives: scoredEmployees.slice(1, 3).map((alt) => ({
        name: alt.employee.name,
        score: Math.round(alt.score * 100),
        currentTasks: alt.employee.assignedTasks.length,
      })),
    });
  } catch (error) {
    console.error("Error in smart task assignment:", error);
    res.status(500).json({ error: error.message });
  }
}
