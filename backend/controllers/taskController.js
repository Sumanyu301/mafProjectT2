import prisma from "../prismaClient.js";

// Create a task under a project (Authenticated users)
export async function createTask(req, res) {
  try {
    const { id } = req.params; // project id
    // accept both assignedTo and employeeId from client for compatibility
    const {
      title,
      description,
      priority = "MEDIUM",
      estimatedHours,
      startDate,
      endDate,
      assignedTo: bodyAssignedTo,
      employeeId: bodyEmployeeId,
    } = req.body;

    const assignedTo = bodyAssignedTo ?? bodyEmployeeId ?? null;

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

    if (startDate && isNaN(parsedStartDate.getTime())) {
      return res.status(400).json({ error: "Invalid start date format" });
    }
    if (endDate && isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({ error: "Invalid end date format" });
    }

    // If assignedTo is provided, verify the employee exists
    const employeeIdNum = assignedTo ? parseInt(assignedTo) : null;
    if (employeeIdNum) {
      const employee = await prisma.employee.findUnique({
        where: { id: employeeIdNum },
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
        employeeId: employeeIdNum,
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

    // Ensure the assigned employee is also added to project members
    if (employeeIdNum) {
      try {
        await prisma.projectEmployee.upsert({
          where: {
            projectId_employeeId: {
              projectId: parseInt(id),
              employeeId: employeeIdNum,
            },
          },
          create: {
            projectId: parseInt(id),
            employeeId: employeeIdNum,
          },
          update: {}, // do nothing if exists
        });
      } catch (err) {
        console.warn("Failed to upsert projectEmployee after task create:", err);
        // do not fail task creation for this; just log
      }
    }

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
    if (assignedTo) whereClause.employeeId = parseInt(assignedTo);

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        project: {
          select: { id: true, title: true },
        },
        assignedTo: {
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
        assignedTo: {
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

// Update a task (Authenticated users)
export async function updateTask(req, res) {
  try {
    const { taskId } = req.params;
    // accept both assignedTo and employeeId from client for compatibility
    const {
      title,
      description,
      priority,
      status,
      startDate,
      endDate,
      assignedTo: bodyAssignedTo,
      employeeId: bodyEmployeeId,
    } = req.body;

    const assignedTo = bodyAssignedTo ?? bodyEmployeeId ?? undefined;

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

    let newEmployeeNum = undefined;
    if (assignedTo !== undefined) {
      if (assignedTo) {
        newEmployeeNum = parseInt(assignedTo);
        const employee = await prisma.employee.findUnique({
          where: { id: newEmployeeNum },
        });

        if (!employee) {
          return res.status(404).json({ error: "Assigned employee not found" });
        }
        updateData.employeeId = newEmployeeNum;
      } else {
        // explicit unassign
        updateData.employeeId = null;
        newEmployeeNum = null;
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
        assignedTo: {
          select: { id: true, name: true, contact: true },
        },
      },
    });

    // If employee was assigned (or reassigned), ensure projectEmployee row exists
    if (assignedTo !== undefined && newEmployeeNum) {
      try {
        const projectIdNum = updatedTask.projectId ?? existingTask.projectId;
        await prisma.projectEmployee.upsert({
          where: {
            projectId_employeeId: {
              projectId: projectIdNum,
              employeeId: newEmployeeNum,
            },
          },
          create: {
            projectId: projectIdNum,
            employeeId: newEmployeeNum,
          },
          update: {}, // noop if already exists
        });
      } catch (err) {
        console.warn("Failed to upsert projectEmployee after task update:", err);
      }
    }

    // If reassigned (oldEmployee exists and differs from new), optionally remove old mapping
    try {
      const projectIdNum = updatedTask.projectId ?? existingTask.projectId;
      const oldEmployee = existingTask.employeeId;
      // if oldEmployee exists and differs from newEmployeeNum (including unassign newEmployeeNum === null)
      if (oldEmployee && oldEmployee !== newEmployeeNum) {
        // count remaining tasks of oldEmployee in this project
        const remaining = await prisma.task.count({
          where: { projectId: projectIdNum, employeeId: oldEmployee },
        });
        if (remaining === 0) {
          // safe to remove membership row
          await prisma.projectEmployee.deleteMany({
            where: { projectId: projectIdNum, employeeId: oldEmployee },
          });
        }
      }
    } catch (err) {
      // log but don't fail
      console.warn("Failed to clean up old projectEmployee mapping:", err);
    }

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

    // Check if task exists and get the project to verify ownership
    const existingTask = await prisma.task.findUnique({
      where: { id: parseInt(taskId) },
      include: { project: true },
    });

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if user is the project owner
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { employee: true },
    });

    if (existingTask.project.ownerId !== user.employee.id) {
      return res.status(403).json({ error: "Only project owner can delete tasks" });
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
