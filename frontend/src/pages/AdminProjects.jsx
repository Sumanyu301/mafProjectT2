import React, { useState, useEffect } from "react";

const mockEmployees = [
  {
    id: 1,
    name: "Alice Johnson",
    skills: ["React", "Node.js"],
    available: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    skills: ["Java", "Spring Boot"],
    available: false,
  },
  {
    id: 3,
    name: "Charlie Brown",
    skills: ["Python", "Django", "SQL"],
    available: true,
  },
];

const AdminProjects = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [search, setSearch] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [filteredEmployees, setFilteredEmployees] = useState(mockEmployees);

  useEffect(() => {
    setFilteredEmployees(
      mockEmployees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(search.toLowerCase()) ||
          emp.skills.some((skill) =>
            skill.toLowerCase().includes(search.toLowerCase())
          )
      )
    );
  }, [search]);

  const toggleEmployeeSelection = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  const handleCreateProject = () => {
    console.log("Project Created:", {
      title,
      description,
      priority,
      startDate,
      deadline,
      employees: selectedEmployees,
    });
    alert("Project Created! (check console for details)");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">Admin - Create Project</h1>

        {/* Project Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Project Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="p-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            >
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="CRITICAL">Critical Priority</option>
            </select>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>
          </div>
          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg mt-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            rows="3"
          />
        </div>

        {/* Employee Selection */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Assign Employees</h2>
          <input
            type="text"
            placeholder="Search by name or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg mb-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                className={`p-4 border-2 rounded-lg flex justify-between items-center cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedEmployees.includes(emp.id)
                    ? "bg-blue-50 border-blue-900 shadow-md"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => toggleEmployeeSelection(emp.id)}
              >
                <div>
                  <h3 className="font-semibold text-blue-900">{emp.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Skills: {emp.skills.join(", ")}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      emp.available ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {emp.available ? "✓ Available" : "✗ Busy"}
                  </p>
                </div>
                {selectedEmployees.includes(emp.id) && (
                  <div className="bg-blue-900 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <span className="text-sm font-bold">✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedEmployees.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-900 font-medium">
                {selectedEmployees.length} employee(s) selected
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateProject}
            className="bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;