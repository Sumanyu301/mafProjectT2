// src/pages/EmployeeProfile.jsx

import { useEffect, useState } from "react";
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"; // for charts

function EmployeeProfile() {
  const [employee, setEmployee] = useState({
    id: 1,
    name: "Raghav Sharma",
    email: "raghav@example.com",
    role: "Employee",
    department: "Software Engineering",
    joined: "Jan 2024",
    projects: 5,
    tasksCompleted: 42,
    deadlinesMissed: 3,
    skills: ["React", "Node.js", "MongoDB"],
  });

  // Future: fetch from backend
  useEffect(() => {
    // Example API call
    // fetch(`/api/employees/${employee.id}`)
    //   .then(res => res.json())
    //   .then(data => setEmployee(data))
  }, []);

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
          <img
            src="/profile.jpg"
            alt="profile"
            className="w-24 h-24 rounded-full shadow-md object-cover"
          />
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
            <p className="text-2xl font-bold text-gray-800">
              {employee.projects}
            </p>
          </div>
          <div className="bg-white border p-4 rounded-2xl shadow-sm text-center">
            <h3 className="text-lg font-semibold text-blue-900">
              Tasks Completed
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              {employee.tasksCompleted}
            </p>
          </div>
          <div className="bg-white border p-4 rounded-2xl shadow-sm text-center">
            <h3 className="text-lg font-semibold text-blue-900">
              Deadlines Missed
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              {employee.deadlinesMissed}
            </p>
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
            <h2 className="text-lg font-semibold text-blue-900">
              Project Progress
            </h2>
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