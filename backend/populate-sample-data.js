import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createSampleData() {
  try {
    console.log("🚀 Starting to create sample data...");

    // Check if data already exists
    const existingUserCount = await prisma.user.count();
    if (existingUserCount > 0) {
      console.log(
        "⚠️  Data already exists in database. Clearing existing data..."
      );

      // Delete in correct order to avoid foreign key constraints
      await prisma.employeeSkill.deleteMany();
      await prisma.projectEmployee.deleteMany();
      await prisma.milestone.deleteMany();
      await prisma.task.deleteMany();
      await prisma.project.deleteMany();
      await prisma.employee.deleteMany();
      await prisma.user.deleteMany();

      console.log("   ✅ Cleared existing data");
    }

    // Step 1: Create sample users
    console.log("👥 Creating sample users...");
    const users = [];

    const userData = [
      {
        username: "john_doe",
        email: "john@example.com",
        password: "password123",
      },
      {
        username: "jane_smith",
        email: "jane@example.com",
        password: "password123",
      },
      {
        username: "mike_wilson",
        email: "mike@example.com",
        password: "password123",
      },
      {
        username: "sarah_davis",
        email: "sarah@example.com",
        password: "password123",
      },
      {
        username: "alex_brown",
        email: "alex@example.com",
        password: "password123",
      },
    ];

    for (const user of userData) {
      // Hash the password properly
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const createdUser = await prisma.user.create({
        data: {
          username: user.username,
          email: user.email,
          passwordHash: hashedPassword,
        },
      });
      users.push(createdUser);
    }
    console.log(`   ✅ Created ${users.length} users`);

    // Step 2: Create employee profiles
    console.log("💼 Creating employee profiles...");
    const employees = [];

    const employeeData = [
      { name: "John Doe", contact: "+1-555-0101" },
      { name: "Jane Smith", contact: "+1-555-0102" },
      { name: "Mike Wilson", contact: "+1-555-0103" },
      { name: "Sarah Davis", contact: "+1-555-0104" },
      { name: "Alex Brown", contact: "+1-555-0105" },
    ];

    for (let i = 0; i < users.length; i++) {
      const employee = await prisma.employee.create({
        data: {
          ...employeeData[i],
          userId: users[i].id,
        },
      });
      employees.push(employee);
    }
    console.log(`   ✅ Created ${employees.length} employee profiles`);

    // Step 3: Get existing skills
    console.log("🛠️  Getting existing skills...");
    const skills = await prisma.skill.findMany();
    console.log(`   ✅ Found ${skills.length} skills`);

    // Step 4: Assign skills to employees
    console.log("🎯 Assigning skills to employees...");
    const skillAssignments = [
      {
        employeeIndex: 0,
        skillNames: ["JavaScript", "React", "Node.js"],
        experience: [3, 2, 4],
      },
      {
        employeeIndex: 1,
        skillNames: ["Python", "Django", "PostgreSQL"],
        experience: [5, 3, 4],
      },
      {
        employeeIndex: 2,
        skillNames: ["Java", "Spring Boot", "Docker"],
        experience: [4, 2, 3],
      },
      {
        employeeIndex: 3,
        skillNames: ["TypeScript", "Angular", "MongoDB"],
        experience: [2, 3, 2],
      },
      {
        employeeIndex: 4,
        skillNames: ["PHP", "Laravel", "MySQL"],
        experience: [6, 4, 5],
      },
    ];

    for (const assignment of skillAssignments) {
      const employee = employees[assignment.employeeIndex];
      for (let i = 0; i < assignment.skillNames.length; i++) {
        const skillName = assignment.skillNames[i];
        const skill = skills.find((s) => s.name === skillName);
        if (skill) {
          await prisma.employeeSkill.create({
            data: {
              employeeId: employee.id,
              skillId: skill.id,
              yearsExperience: assignment.experience[i],
            },
          });
        }
      }
    }
    console.log(`   ✅ Assigned skills to employees`);

    // Step 5: Create sample projects
    console.log("📂 Creating sample projects...");
    const projectsData = [
      {
        title: "E-commerce Platform",
        description:
          "A modern e-commerce platform with React frontend and Node.js backend. Features include user authentication, product catalog, shopping cart, and payment integration.",
        priority: "HIGH",
        status: "IN_PROGRESS",
        startDate: new Date("2024-09-01"),
        deadline: new Date("2024-12-31"),
        creatorIndex: 0,
        ownerIndex: 0,
      },
      {
        title: "Mobile Banking App",
        description:
          "Secure mobile banking application with biometric authentication, real-time transactions, and comprehensive account management features.",
        priority: "CRITICAL",
        status: "IN_PROGRESS",
        startDate: new Date("2024-08-15"),
        deadline: new Date("2024-11-30"),
        creatorIndex: 1,
        ownerIndex: 1,
      },
      {
        title: "Inventory Management System",
        description:
          "Enterprise inventory management system with real-time tracking, automated reordering, and comprehensive reporting dashboard.",
        priority: "MEDIUM",
        status: "PLANNING",
        startDate: new Date("2024-10-01"),
        deadline: new Date("2025-03-31"),
        creatorIndex: 2,
        ownerIndex: 2,
      },
      {
        title: "Data Analytics Dashboard",
        description:
          "Interactive dashboard for business intelligence with data visualization, real-time metrics, and customizable reports for stakeholders.",
        priority: "HIGH",
        status: "IN_PROGRESS",
        startDate: new Date("2024-07-20"),
        deadline: new Date("2024-12-15"),
        creatorIndex: 3,
        ownerIndex: 3,
      },
      {
        title: "Content Management Portal",
        description:
          "User-friendly content management system with drag-and-drop interface, version control, and multi-user collaboration features.",
        priority: "LOW",
        status: "COMPLETED",
        startDate: new Date("2024-05-01"),
        deadline: new Date("2024-08-31"),
        creatorIndex: 4,
        ownerIndex: 4,
      },
      {
        title: "AI Chatbot Integration",
        description:
          "Intelligent chatbot with natural language processing, automated customer support, and seamless integration with existing systems.",
        priority: "MEDIUM",
        status: "PLANNING",
        startDate: new Date("2024-11-01"),
        deadline: new Date("2025-02-28"),
        creatorIndex: 0,
        ownerIndex: 1,
      },
    ];

    const projects = [];
    for (const projectData of projectsData) {
      const project = await prisma.project.create({
        data: {
          title: projectData.title,
          description: projectData.description,
          priority: projectData.priority,
          status: projectData.status,
          startDate: projectData.startDate,
          deadline: projectData.deadline,
          createdBy: employees[projectData.creatorIndex].id,
          ownerId: employees[projectData.ownerIndex].id,
        },
      });
      projects.push(project);
    }
    console.log(`   ✅ Created ${projects.length} projects`);

    // Step 6: Add project members
    console.log("👥 Adding project members...");
    const memberAssignments = [
      { projectIndex: 0, memberIndices: [0, 1, 2] },
      { projectIndex: 1, memberIndices: [1, 3, 4] },
      { projectIndex: 2, memberIndices: [2, 0, 3] },
      { projectIndex: 3, memberIndices: [3, 1, 4] },
      { projectIndex: 4, memberIndices: [4, 0, 2] },
      { projectIndex: 5, memberIndices: [1, 2, 3] },
    ];

    for (const assignment of memberAssignments) {
      const project = projects[assignment.projectIndex];
      for (const memberIndex of assignment.memberIndices) {
        await prisma.projectEmployee.create({
          data: {
            projectId: project.id,
            employeeId: employees[memberIndex].id,
            joinedAt: new Date(),
          },
        });
      }
    }
    console.log(`   ✅ Added members to projects`);

    // Step 7: Create sample tasks
    console.log("✅ Creating sample tasks...");
    const tasksData = [
      // E-commerce Platform tasks
      {
        title: "Setup user authentication",
        description: "Implement JWT-based authentication system",
        status: "COMPLETED",
        projectIndex: 0,
        assigneeIndex: 0,
      },
      {
        title: "Design product catalog",
        description: "Create responsive product listing and detail pages",
        status: "IN_PROGRESS",
        projectIndex: 0,
        assigneeIndex: 1,
      },
      {
        title: "Implement shopping cart",
        description: "Build cart functionality with local storage",
        status: "TODO",
        projectIndex: 0,
        assigneeIndex: 2,
      },

      // Mobile Banking App tasks
      {
        title: "Security audit",
        description: "Comprehensive security review and penetration testing",
        status: "COMPLETED",
        projectIndex: 1,
        assigneeIndex: 1,
      },
      {
        title: "Biometric integration",
        description: "Implement fingerprint and face recognition",
        status: "IN_PROGRESS",
        projectIndex: 1,
        assigneeIndex: 3,
      },
      {
        title: "Transaction history",
        description: "Build transaction listing and filtering",
        status: "TODO",
        projectIndex: 1,
        assigneeIndex: 4,
      },

      // Inventory Management tasks
      {
        title: "Database design",
        description: "Design normalized database schema for inventory",
        status: "COMPLETED",
        projectIndex: 2,
        assigneeIndex: 2,
      },
      {
        title: "API development",
        description: "Create RESTful APIs for inventory operations",
        status: "TODO",
        projectIndex: 2,
        assigneeIndex: 0,
      },

      // Data Analytics Dashboard tasks
      {
        title: "Chart library integration",
        description: "Integrate Chart.js for data visualization",
        status: "COMPLETED",
        projectIndex: 3,
        assigneeIndex: 3,
      },
      {
        title: "Real-time data feed",
        description: "Implement WebSocket for live data updates",
        status: "IN_PROGRESS",
        projectIndex: 3,
        assigneeIndex: 1,
      },
    ];

    for (const taskData of tasksData) {
      await prisma.task.create({
        data: {
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          projectId: projects[taskData.projectIndex].id,
          employeeId: employees[taskData.assigneeIndex].id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        },
      });
    }
    console.log(`   ✅ Created ${tasksData.length} tasks`);

    // Step 8: Create sample milestones
    console.log("🎯 Creating sample milestones...");
    const milestonesData = [
      {
        title: "MVP Release",
        projectIndex: 0,
        dueDate: new Date("2024-11-15"),
        completed: false,
      },
      {
        title: "Beta Testing Complete",
        projectIndex: 0,
        dueDate: new Date("2024-12-01"),
        completed: false,
      },
      {
        title: "Security Certification",
        projectIndex: 1,
        dueDate: new Date("2024-10-30"),
        completed: true,
      },
      {
        title: "User Acceptance Testing",
        projectIndex: 1,
        dueDate: new Date("2024-11-15"),
        completed: false,
      },
      {
        title: "System Architecture Review",
        projectIndex: 2,
        dueDate: new Date("2024-10-15"),
        completed: false,
      },
      {
        title: "Dashboard Prototype",
        projectIndex: 3,
        dueDate: new Date("2024-10-01"),
        completed: true,
      },
      {
        title: "Production Deployment",
        projectIndex: 4,
        dueDate: new Date("2024-08-15"),
        completed: true,
      },
    ];

    for (const milestoneData of milestonesData) {
      await prisma.milestone.create({
        data: {
          title: milestoneData.title,
          dueDate: milestoneData.dueDate,
          completed: milestoneData.completed,
          projectId: projects[milestoneData.projectIndex].id,
        },
      });
    }
    console.log(`   ✅ Created ${milestonesData.length} milestones`);

    // Final verification
    console.log("\n📊 Final Database Summary:");
    const userCount = await prisma.user.count();
    const employeeCount = await prisma.employee.count();
    const projectCount = await prisma.project.count();
    const taskCount = await prisma.task.count();
    const milestoneCount = await prisma.milestone.count();
    const skillCount = await prisma.skill.count();
    const employeeSkillCount = await prisma.employeeSkill.count();
    const projectEmployeeCount = await prisma.projectEmployee.count();

    console.log(`   👥 Users: ${userCount}`);
    console.log(`   💼 Employees: ${employeeCount}`);
    console.log(`   📂 Projects: ${projectCount}`);
    console.log(`   ✅ Tasks: ${taskCount}`);
    console.log(`   🎯 Milestones: ${milestoneCount}`);
    console.log(`   🛠️  Skills: ${skillCount}`);
    console.log(`   🔗 Employee-Skill Relations: ${employeeSkillCount}`);
    console.log(`   👥 Project Members: ${projectEmployeeCount}`);

    console.log("\n🎉 Sample data creation completed successfully!");
    console.log("✨ Your website now has realistic data to display!");
    console.log("\n📝 Test Login Credentials:");
    console.log("   Email: john@example.com | Password: password123");
    console.log("   Email: jane@example.com | Password: password123");
    console.log("   Email: mike@example.com | Password: password123");
    console.log(
      "   Note: These are plain text passwords for testing. In production, use proper hashing!"
    );
  } catch (error) {
    console.error("❌ Error creating sample data:", error);
    console.error(error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleData();
