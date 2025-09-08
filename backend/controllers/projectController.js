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

    const project = await prisma.project.create({
      data: {
        title,
        description,
        priority,
        startDate: new Date(startDate),
        deadline: new Date(deadline),
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
