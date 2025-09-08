import prisma from "../prismaClient.js";

// Create a new project (Admin only)
export async function createProject(req, res) {
  try {
    const { title, description, priority, startDate, deadline } = req.body;

    // Check if user is admin
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Get employee profile for the admin user
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
    const parsedStartDate = startDate ? new Date(startDate) : null;
    const parsedDeadline = deadline ? new Date(deadline) : null;

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
        createdBy: user.employee.id,
        status: "PLANNING",
      },
      include: {
        creator: {
          select: { id: true, name: true, contact: true },
        },
      },
    });

    res.status(201).json(project);
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
        creator: {
          select: { id: true, name: true, contact: true, designation: true },
        },
        members: {
          include: {
            employee: {
              select: {
                id: true,
                name: true,
                contact: true,
                designation: true,
              },
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
            assignee: {
              select: { id: true, name: true },
            },
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
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: error.message });
  }
}

// Update a project (Admin only)
export async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const { title, description, priority, status, startDate, deadline } =
      req.body;

    // Check if user is admin
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
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

    if (deadline !== undefined) {
      const parsedDeadline = new Date(deadline);
      if (isNaN(parsedDeadline.getTime())) {
        return res.status(400).json({ error: "Invalid deadline format" });
      }
      updateData.deadline = parsedDeadline;
    }

    // Update the project
    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        creator: {
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

    res.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: error.message });
  }
}

// ------------------------------------------------------------------------------------------------------------

// Delete a project (Admin only)
export async function deleteProject(req, res) {
  try {
    const { id } = req.params;

    // Check if user is admin
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
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
