// src/pages/EmployeeProfile.jsx
import { useEffect, useState } from "react";
import { authAPI } from "../services/authAPI";
import { employeeAPI } from "../services/employeeAPI";

function EmployeeProfile() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Step 1: Verify logged-in user and get their ID
        const user = await authAPI.verify(); // returns {id, email, role}
        if (!user?.id) throw new Error("User not logged in");

        // Step 2: Fetch employee details by ID
        const data = await employeeAPI.getById(user.id);
        console.log("ID", user.id);

        // Step 3: Map backend data to frontend structure
        const mappedEmployee = {
          id: data.id,
          name: data.user.username || data.name,
          email: data.user.email,
          role: data.user.systemRole || user.role,
          department: data.department || "N/A",
          joined: data.joinedAt
            ? new Date(data.joinedAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            : "N/A",
          projects: data.projectMembers?.length || 0,
          tasksCompleted:
            data.assignedTasks?.filter((t) => t.status === "COMPLETED")?.length || 0,
          deadlinesMissed:
            data.assignedTasks?.filter((t) => t.status === "MISSED")?.length || 0,
          skills: data.skills?.map((s) => s.skill.name) || [],
        };

        setEmployee(mappedEmployee);
      } catch (err) {
        console.error("Error fetching employee profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading employee data...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">Employee not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-50 rounded-full opacity-60"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-red-50 rounded-full opacity-60"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-blue-100 rounded-full opacity-40"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center space-x-6">
          {/* Profile Avatar */}
          <div className="w-24 h-24 bg-blue-900 text-white rounded-full shadow-md flex items-center justify-center font-bold text-2xl">
            {employee.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-blue-900">{employee.name}</h1>
            <p className="text-gray-600">{employee.email}</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                employee.role === "Admin"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {employee.role}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white border p-4 rounded-2xl shadow-sm text-center">
            <h3 className="text-lg font-semibold text-blue-900">Projects</h3>
            <p className="text-2xl font-bold text-gray-800">{employee.projects}</p>
          </div>
          <div className="bg-white border p-4 rounded-2xl shadow-sm text-center">
            <h3 className="text-lg font-semibold text-blue-900">Tasks Completed</h3>
            <p className="text-2xl font-bold text-gray-800">{employee.tasksCompleted}</p>
          </div>
          <div className="bg-white border p-4 rounded-2xl shadow-sm text-center">
            <h3 className="text-lg font-semibold text-blue-900">Deadlines Missed</h3>
            <p className="text-2xl font-bold text-gray-800">{employee.deadlinesMissed}</p>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white border rounded-2xl p-6 mt-8 shadow-sm">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">About</h2>
          <p className="text-gray-700">
            <strong>Department:</strong> {employee.department}
          </p>
          <p className="text-gray-700">
            <strong>Joined:</strong> {employee.joined}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {employee.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Charts Section (placeholder) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-blue-900">Performance</h2>
            <p className="text-gray-500 text-sm mt-2">
              (Line chart of tasks vs deadlines goes here)
            </p>
          </div>
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-blue-900">Project Progress</h2>
            <p className="text-gray-500 text-sm mt-2">
              (Progress bars per project go here)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;
