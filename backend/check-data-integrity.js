import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDataIntegrity() {
  try {
    console.log("🔍 Checking User-Employee Data Integrity...\n");

    // Check users and their employees
    const users = await prisma.user.findMany({
      include: { employee: true },
      orderBy: { id: "asc" },
    });

    console.log("👥 User-Employee Relationships:");
    users.forEach((user) => {
      const employeeInfo = user.employee
        ? `${user.employee.name} (Employee ID: ${user.employee.id})`
        : "No Employee Profile";
      console.log(
        `   User ID: ${user.id} | Email: ${user.email} | Employee: ${employeeInfo}`
      );
    });

    console.log("\n💼 All Employees:");
    const employees = await prisma.employee.findMany({
      include: { user: true },
      orderBy: { id: "asc" },
    });

    employees.forEach((emp) => {
      console.log(
        `   Employee ID: ${emp.id} | Name: ${emp.name} | User ID: ${
          emp.userId
        } | User Email: ${emp.user?.email || "No User"}`
      );
    });

    // Check for mismatches
    console.log("\n⚠️  Checking for Issues:");
    let issues = 0;

    users.forEach((user) => {
      if (!user.employee) {
        console.log(
          `   ❌ User ${user.id} (${user.email}) has no employee profile`
        );
        issues++;
      }
    });

    employees.forEach((emp) => {
      if (!emp.user) {
        console.log(
          `   ❌ Employee ${emp.id} (${emp.name}) has no user account`
        );
        issues++;
      } else if (emp.user.id !== emp.userId) {
        console.log(
          `   ❌ Employee ${emp.id} userId mismatch: expects ${emp.userId} but user is ${emp.user.id}`
        );
        issues++;
      }
    });

    if (issues === 0) {
      console.log("   ✅ No issues found - data integrity is good!");
    } else {
      console.log(`   ❌ Found ${issues} data integrity issues`);
    }
  } catch (error) {
    console.error("Error checking data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDataIntegrity();
