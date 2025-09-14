import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkProjectRelationships() {
  try {
    console.log("🔍 Checking Project Relationships...\n");

    // Check projects and their relationships
    const projects = await prisma.project.findMany({
      include: {
        creator: { include: { user: true } },
        owner: { include: { user: true } },
        members: { include: { employee: { include: { user: true } } } },
        tasks: { include: { assignedTo: { include: { user: true } } } },
      },
      orderBy: { id: "asc" },
    });

    console.log("📂 Project Details:");
    projects.forEach((project) => {
      console.log(`\nProject: ${project.title} (ID: ${project.id})`);
      console.log(
        `   Created By: Employee ${project.createdBy} -> ${project.creator?.name} (User: ${project.creator?.user?.email})`
      );
      console.log(
        `   Owner: Employee ${project.ownerId} -> ${project.owner?.name} (User: ${project.owner?.user?.email})`
      );
      console.log(`   Members: ${project.members.length}`);
      project.members.forEach((member) => {
        console.log(
          `     - Employee ${member.employeeId}: ${member.employee?.name} (User: ${member.employee?.user?.email})`
        );
      });
      console.log(`   Tasks: ${project.tasks.length}`);
      project.tasks.forEach((task) => {
        const assignee = task.assignedTo
          ? `${task.assignedTo.name} (User: ${task.assignedTo.user?.email})`
          : "Unassigned";
        console.log(
          `     - ${task.title} -> Employee ${task.employeeId}: ${assignee}`
        );
      });
    });

    // Check for issues
    console.log("\n⚠️  Checking for Project Issues:");
    let issues = 0;

    projects.forEach((project) => {
      if (!project.creator) {
        console.log(
          `   ❌ Project ${project.id} has invalid creator (Employee ID ${project.createdBy})`
        );
        issues++;
      }
      if (!project.owner) {
        console.log(
          `   ❌ Project ${project.id} has invalid owner (Employee ID ${project.ownerId})`
        );
        issues++;
      }

      project.members.forEach((member) => {
        if (!member.employee) {
          console.log(
            `   ❌ Project ${project.id} has invalid member (Employee ID ${member.employeeId})`
          );
          issues++;
        }
      });

      project.tasks.forEach((task) => {
        if (task.employeeId && !task.assignedTo) {
          console.log(
            `   ❌ Task ${task.id} has invalid assignee (Employee ID ${task.employeeId})`
          );
          issues++;
        }
      });
    });

    if (issues === 0) {
      console.log("   ✅ No project relationship issues found!");
    } else {
      console.log(`   ❌ Found ${issues} project relationship issues`);
    }
  } catch (error) {
    console.error("Error checking project relationships:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProjectRelationships();
