import prisma from "../prismaClient.js";

// Create a new project (anyone can create and become owner)
export async function createProject(req, res) {
  try {
    const {
      title,
      description,
      priority,
      startDate,
      deadline,
      employees = [],
    } = req.body;

    // Get employee profile for the user
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { employee: true },
    });

    if (!user?.employee) {
      return res
        .status(400)
        .json({ error: "User must have employee profile to create projects" });
    }

    // Validate and parse dates
    const parsedStartDate = startDate ? new Date(startDate) : new Date(); // Default to now
    const parsedDeadline = deadline
      ? new Date(deadline)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default to 30 days from now

    // Check for invalid dates
    if (startDate && isNaN(parsedStartDate.getTime())) {
      return res.status(400).json({ error: "Invalid start date format" });
    }
    if (deadline && isNaN(parsedDeadline.getTime())) {
      return res.status(400).json({ error: "Invalid deadline format" });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        priority,
        startDate: parsedStartDate,
        deadline: parsedDeadline,
        creator: {
          connect: { id: user.employee.id },
        },
        owner: {
          connect: { id: user.employee.id },
        },
        status: "PLANNING",
        members: {
          create: employees.map((empId) => ({
            employeeId: empId,
          })),
        },
      },
    });

    // Fetch the created project with relations
    const projectWithRelations = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        creator: {
          select: { id: true, name: true, contact: true },
        },
        owner: {
          select: { id: true, name: true, contact: true },
        },
        members: {
          include: {
            employee: {
              select: { id: true, name: true, contact: true },
            },
          },
        },
      },
    });

    res.status(201).json(projectWithRelations);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: error.message });
  }
}

// ------------------------------------------------------------------------------------------------------------

// List all projects with optional filters
export async function getAllProjects(req, res) {
  try {
    const { status, priority, createdBy } = req.query;
    const whereClause = {};

    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;
    if (createdBy) whereClause.createdBy = parseInt(createdBy);

    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        creator: {
          select: { id: true, name: true, contact: true },
        },
        owner: {
          select: { id: true, name: true, contact: true },
        },
        members: {
          include: {
            employee: {
              select: { id: true, name: true, contact: true },
            },
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            startDate: true,
            endDate: true,
          },
        },
        milestones: {
          select: {
            id: true,
            title: true,
            dueDate: true,
            completed: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: error.message });
  }
}

// ------------------------------------------------------------------------------------------------------------

// Get a single project by ID with details
export async function getProjectById(req, res) {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        creator: { select: { id: true, name: true, contact: true } },
        owner: { select: { id: true, name: true, contact: true } },
        members: {
          include: {
            employee: {
              select: { id: true, name: true, contact: true },
            },
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            startDate: true,
            endDate: true,
            assignedTo: { select: { id: true, name: true } },
          },
        },
        milestones: {
          select: { id: true, title: true, dueDate: true, completed: true },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // 🔥 Flatten members (replace { employee: {...} } with just {...})
    const formattedProject = {
      ...project,
      members: project.members.map((m) => m.employee),
    };

    res.json(formattedProject);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: error.message });
  }
}

// Update a project (project owner only)
export async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      priority,
      status,
      startDate,
      deadline,
      employees,
    } = req.body; // employees = array of employee IDs

    // Get the user's employee profile
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { employee: true },
    });

    if (!user?.employee) {
      return res.status(400).json({ error: "User must have employee profile" });
    }

    // Check if project exists and user is the owner
    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: { members: true },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if user is the project owner
    if (existingProject.ownerId !== user.employee.id) {
      return res
        .status(403)
        .json({ error: "Only project owner can update the project" });
    }

    // Prepare update data
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

    if (deadline !== undefined) {
      const parsedDeadline = new Date(deadline);
      if (isNaN(parsedDeadline.getTime())) {
        return res.status(400).json({ error: "Invalid deadline format" });
      }
      updateData.deadline = parsedDeadline;
    }

    // ✅ Update project fields first
    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        creator: {
          select: { id: true, name: true, contact: true },
        },
        owner: {
          select: { id: true, name: true, contact: true },
        },
        members: {
          include: {
            employee: {
              select: { id: true, name: true, contact: true },
            },
          },
        },
      },
    });

    // ✅ Update members separately if provided
    if (employees !== undefined && Array.isArray(employees)) {
      // Delete all existing members
      await prisma.projectEmployee.deleteMany({
        where: { projectId: parseInt(id) },
      });

      // Add new members
      const memberData = employees.map((empId) => ({
        projectId: parseInt(id),
        employeeId: parseInt(empId),
      }));

      await prisma.projectEmployee.createMany({
        data: memberData,
        skipDuplicates: true,
      });
    }

    // Fetch updated project with members again
    const projectWithMembers = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        creator: {
          select: { id: true, name: true, contact: true },
        },
        owner: {
          select: { id: true, name: true, contact: true },
        },
        members: {
          include: {
            employee: {
              select: { id: true, name: true, contact: true },
            },
          },
        },
      },
    });

    res.json(projectWithMembers);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: error.message });
  }
}

// ------------------------------------------------------------------------------------------------------------

// Delete a project (project owner only)
export async function deleteProject(req, res) {
  try {
    const { id } = req.params;

    // Get the user's employee profile
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { employee: true },
    });

    if (!user?.employee) {
      return res.status(400).json({ error: "User must have employee profile" });
    }

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if user is the project owner
    if (existingProject.ownerId !== user.employee.id) {
      return res
        .status(403)
        .json({ error: "Only project owner can delete the project" });
    }

    // Delete the project
    await prisma.project.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: error.message });
  }
}
