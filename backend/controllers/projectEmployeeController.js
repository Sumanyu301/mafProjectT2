import prisma from "../prismaClient.js";

// Assign employee(s) to project (Project owner only)
export async function assignEmployeesToProject(req, res) {
  try {
    const { id } = req.params; // project id
    const { employeeIds } = req.body; // array of employee IDs

    // Check if project exists and user is the owner
    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if user is the project owner
    if (existingProject.ownerId !== req.user.id) {
      return res.status(403).json({ error: "Only project owner can assign employees" });
    }

    // Validate input
    if (
      !employeeIds ||
      !Array.isArray(employeeIds) ||
      employeeIds.length === 0
    ) {
      return res.status(400).json({ error: "employeeIds array is required" });
    }

    // Verify all employees exist
    const employees = await prisma.employee.findMany({
      where: { id: { in: employeeIds.map((id) => parseInt(id)) } },
    });

    if (employees.length !== employeeIds.length) {
      return res.status(404).json({ error: "One or more employees not found" });
    }

    // Create project employee assignments
    const projectEmployees = await Promise.all(
      employeeIds.map((employeeId) =>
        prisma.projectEmployee.upsert({
          where: {
            projectId_employeeId: {
              projectId: parseInt(id),
              employeeId: parseInt(employeeId),
            },
          },
          create: {
            projectId: parseInt(id),
            employeeId: parseInt(employeeId),
          },
          update: {}, // If already exists, do nothing
        })
      )
    );

    // Get the updated project with members
    const updatedProject = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        members: {
          include: {
            employee: {
              select: {
                id: true,
                name: true,
                contact: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      message: "Employees assigned successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error assigning employees to project:", error);
    res.status(500).json({ error: error.message });
  }
}

// Get list of employees in a project
export async function getProjectEmployees(req, res) {
  try {
    const { id } = req.params; // project id

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectEmployees = await prisma.projectEmployee.findMany({
      where: { projectId: parseInt(id) },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            contact: true,
            maxTasks: true,
          },
        },
      },
      orderBy: {
        employee: { name: "asc" },
      },
    });

    const employees = projectEmployees.map((pe) => pe.employee);

    res.json({
      projectId: parseInt(id),
      employees: employees,
      totalEmployees: employees.length,
    });
  } catch (error) {
    console.error("Error fetching project employees:", error);
    res.status(500).json({ error: error.message });
  }
}

// Remove employee from project (Project owner only)
export async function removeEmployeeFromProject(req, res) {
  try {
    const { id, employeeId } = req.params; // project id and employee id

    // Check if project exists and user is the owner
    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if user is the project owner
    if (existingProject.ownerId !== req.user.id) {
      return res.status(403).json({ error: "Only project owner can remove employees" });
    }

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) },
    });

    if (!existingEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Check if employee is assigned to project
    const projectEmployee = await prisma.projectEmployee.findUnique({
      where: {
        projectId_employeeId: {
          projectId: parseInt(id),
          employeeId: parseInt(employeeId),
        },
      },
    });

    if (!projectEmployee) {
      return res
        .status(404)
        .json({ error: "Employee is not assigned to this project" });
    }

    // Remove employee from project
    await prisma.projectEmployee.delete({
      where: {
        projectId_employeeId: {
          projectId: parseInt(id),
          employeeId: parseInt(employeeId),
        },
      },
    });

    res.json({
      message: "Employee removed from project successfully",
      projectId: parseInt(id),
      employeeId: parseInt(employeeId),
    });
  } catch (error) {
    console.error("Error removing employee from project:", error);
    res.status(500).json({ error: error.message });
  }
}
