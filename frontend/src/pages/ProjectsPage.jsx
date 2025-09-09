import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOpen, ArrowRight, Clock, Users } from "lucide-react";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setProjects([
      { 
        id: 1, 
        name: "E-Commerce Platform", 
        description: "Building a scalable online store with modern technologies and user-friendly interface.",
        status: "In Progress",
        teamSize: 5,
        progress: 75
      },
      { 
        id: 2, 
        name: "HR Management System", 
        description: "Internal system for HR operations including employee management and payroll processing.",
        status: "Planning",
        teamSize: 3,
        progress: 25
      },
      { 
        id: 3, 
        name: "Mobile Banking App", 
        description: "Secure mobile banking application with advanced security features and intuitive design.",
        status: "In Progress",
        teamSize: 8,
        progress: 60
      },
      { 
        id: 4, 
        name: "Inventory Management", 
        description: "Real-time inventory tracking system for warehouse operations and supply chain management.",
        status: "Completed",
        teamSize: 4,
        progress: 100
      }
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Planning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-600";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FolderOpen className="h-8 w-8 text-red-600 mr-3" />
            <h1 className="text-3xl font-bold text-blue-900">Ongoing Projects</h1>
          </div>
          <p className="text-gray-700 text-lg">
            Track and manage your active projects with real-time updates and progress monitoring.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="cursor-pointer bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-lg p-6 transition-all duration-200 hover:border-blue-300 transform hover:scale-[1.02] group"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              {/* Project Header */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-blue-900 group-hover:text-blue-700">
                  {project.name}
                </h2>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
              </div>

              {/* Project Description */}
              <p className="text-gray-700 mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Status Badge */}
              <div className="flex justify-between items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">{project.teamSize} members</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-semibold text-blue-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-xs">Last updated 2h ago</span>
                </div>
                <button className="text-blue-900 hover:text-red-600 text-sm font-medium transition-colors duration-200">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State or Additional Actions */}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Projects Found</h3>
            <p className="text-gray-500">Start by creating your first project to see it here.</p>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-8 text-center">
          <button className="bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]">
            Create New Project
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;