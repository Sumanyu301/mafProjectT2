import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    console.log("🔍 Testing database connection...");
    console.log("📡 Connecting to database...");

    // Test 1: Basic connection
    await prisma.$connect();
    console.log("✅ Database connected successfully!");

    // Test 2: Check if we can query the database
    console.log("📊 Checking database tables...");

    const userCount = await prisma.user.count();
    console.log(`   👥 Users: ${userCount}`);

    const employeeCount = await prisma.employee.count();
    console.log(`   💼 Employees: ${employeeCount}`);

    const projectCount = await prisma.project.count();
    console.log(`   📂 Projects: ${projectCount}`);

    const skillCount = await prisma.skill.count();
    console.log(`   🛠️  Skills: ${skillCount}`);

    const taskCount = await prisma.task.count();
    console.log(`   ✅ Tasks: ${taskCount}`);

    const milestoneCount = await prisma.milestone.count();
    console.log(`   🎯 Milestones: ${milestoneCount}`);

    // Test 3: Test a simple query with relations
    console.log("🔗 Testing relations...");
    const sampleProject = await prisma.project.findFirst({
      include: {
        creator: true,
        owner: true,
        tasks: true,
        milestones: true,
        members: true,
      },
    });

    if (sampleProject) {
      console.log(`   📋 Sample project: "${sampleProject.title}"`);
      console.log(`   📅 Created: ${sampleProject.createdAt}`);
      console.log(`   📝 Tasks: ${sampleProject.tasks.length}`);
      console.log(`   🎯 Milestones: ${sampleProject.milestones.length}`);
      console.log(`   👥 Members: ${sampleProject.members.length}`);
    } else {
      console.log("   ℹ️  No projects found in database");
    }

    // Test 4: Check database version/info
    console.log("🔧 Checking database info...");
    const dbInfo = await prisma.$queryRaw`SELECT version();`;
    console.log(
      `   📍 Database: ${dbInfo[0].version.split(" ")[0]} ${
        dbInfo[0].version.split(" ")[1]
      }`
    );

    // Test 5: Check migrations status
    console.log("📋 Checking migrations...");
    const migrations = await prisma.$queryRaw`
      SELECT migration_name, finished_at, rolled_back_at 
      FROM "_prisma_migrations" 
      ORDER BY finished_at DESC 
      LIMIT 5
    `;

    if (migrations.length > 0) {
      console.log(`   ✅ ${migrations.length} migrations found:`);
      migrations.forEach((migration, index) => {
        const status = migration.rolled_back_at
          ? "❌ Rolled back"
          : "✅ Applied";
        console.log(
          `     ${index + 1}. ${migration.migration_name} - ${status}`
        );
      });
    } else {
      console.log("   ⚠️  No migrations found");
    }

    console.log("\n🎉 Database connection test completed successfully!");
    console.log("✨ Your new database provider is working correctly!");
  } catch (error) {
    console.error("\n❌ Database connection test failed!");
    console.error("Error details:", error.message);

    // Provide specific error guidance
    if (error.code === "P1001") {
      console.log("\n💡 Troubleshooting suggestions:");
      console.log("   - Check if the database server is running");
      console.log("   - Verify network connectivity");
      console.log("   - Check firewall settings");
    } else if (error.code === "P1000") {
      console.log("\n💡 Troubleshooting suggestions:");
      console.log("   - Verify DATABASE_URL in .env file");
      console.log("   - Check username/password credentials");
      console.log("   - Ensure database name exists");
    } else if (error.code === "P1003") {
      console.log("\n💡 Troubleshooting suggestions:");
      console.log("   - Database may not exist");
      console.log("   - Check database host and port");
      console.log("   - Verify SSL settings");
    } else if (error.code === "P1017") {
      console.log("\n💡 Troubleshooting suggestions:");
      console.log("   - Database server has closed the connection");
      console.log("   - Check connection limits");
      console.log("   - Verify SSL/TLS settings");
    } else {
      console.log("\n💡 Troubleshooting suggestions:");
      console.log("   - Double-check your .env file");
      console.log("   - Ensure Prisma schema is up to date");
      console.log("   - Try running: npx prisma generate");
    }
  } finally {
    await prisma.$disconnect();
    console.log("\n🔌 Database connection closed");
  }
}

// Run the test
testDatabaseConnection();
