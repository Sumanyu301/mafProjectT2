import prisma from "../prismaClient.js";

// Create a milestone for a project (Project owner only)
export async function createMilestone(req, res) {
  try {
    const { id } = req.params; // project id
    const { title, dueDate } = req.body;

    // Check if project exists and user is the owner
    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if user is the project owner
    if (existingProject.ownerId !== req.user.id) {
      return res.status(403).json({ error: "Only project owner can create milestones" });
    }

    // Validate and parse due date
    const parsedDueDate = dueDate ? new Date(dueDate) : null;

    // Check for invalid date
    if (dueDate && isNaN(parsedDueDate.getTime())) {
      return res.status(400).json({ error: "Invalid due date format" });
    }

    const milestone = await prisma.milestone.create({
      data: {
        title,
        dueDate: parsedDueDate,
        projectId: parseInt(id),
        completed: false,
      },
      include: {
        project: {
          select: { id: true, title: true },
        },
      },
    });

    res.status(201).json(milestone);
  } catch (error) {
    console.error("Error creating milestone:", error);
    res.status(500).json({ error: error.message });
  }
}

// Get all milestones for a project
export async function getProjectMilestones(req, res) {
  try {
    const { id } = req.params; // project id
    const { completed } = req.query;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    const whereClause = { projectId: parseInt(id) };

    if (completed !== undefined) {
      whereClause.completed = completed === "true";
    }

    const milestones = await prisma.milestone.findMany({
      where: whereClause,
      include: {
        project: {
          select: { id: true, title: true },
        },
      },
      orderBy: { dueDate: "asc" },
    });

    res.json(milestones);
  } catch (error) {
    console.error("Error fetching milestones:", error);
    res.status(500).json({ error: error.message });
  }
}

// Update a milestone (Project owner only)
export async function updateMilestone(req, res) {
  try {
    const { milestoneId } = req.params;
    const { title, dueDate, completed } = req.body;

    // Check if milestone exists and get the project to verify ownership
    const existingMilestone = await prisma.milestone.findUnique({
      where: { id: parseInt(milestoneId) },
      include: { project: true },
    });

    if (!existingMilestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    // Check if user is the project owner
    if (existingMilestone.project.ownerId !== req.user.id) {
      return res.status(403).json({ error: "Only project owner can update milestones" });
    }

    if (!existingMilestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    // Prepare update data with date validation
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (completed !== undefined) updateData.completed = completed;

    if (dueDate !== undefined) {
      const parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({ error: "Invalid due date format" });
      }
      updateData.dueDate = parsedDueDate;
    }

    // Update the milestone
    const updatedMilestone = await prisma.milestone.update({
      where: { id: parseInt(milestoneId) },
      data: updateData,
      include: {
        project: {
          select: { id: true, title: true },
        },
      },
    });

    res.json(updatedMilestone);
  } catch (error) {
    console.error("Error updating milestone:", error);
    res.status(500).json({ error: error.message });
  }
}

// Delete a milestone (Project owner only)
export async function deleteMilestone(req, res) {
  try {
    const { milestoneId } = req.params;

    // Check if milestone exists and get the project to verify ownership
    const existingMilestone = await prisma.milestone.findUnique({
      where: { id: parseInt(milestoneId) },
      include: { project: true },
    });

    if (!existingMilestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    // Check if user is the project owner
    if (existingMilestone.project.ownerId !== req.user.id) {
      return res.status(403).json({ error: "Only project owner can delete milestones" });
    }

    if (!existingMilestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    // Delete the milestone
    await prisma.milestone.delete({
      where: { id: parseInt(milestoneId) },
    });

    res.json({ message: "Milestone deleted successfully" });
  } catch (error) {
    console.error("Error deleting milestone:", error);
    res.status(500).json({ error: error.message });
  }
}
