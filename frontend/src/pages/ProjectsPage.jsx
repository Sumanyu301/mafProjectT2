import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOpen, ArrowRight, Clock, Users, Calendar, Target } from "lucide-react";

import { projectAPI } from "../services/projectAPI";
import { taskAPI } from "../services/taskAPI";

import ProjectSkeleton from "../components/ProjectSkeleton";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProgressForProjects = async (projects) => {
    const updated = await Promise.all(
      projects.map(async (p) => {
        try {
          const tasks = await taskAPI.getProjectTasks(p.id);
          const completed = tasks.filter(
            (t) =>
              String(t.status).toUpperCase() === "COMPLETED" ||
              String(t.status).toUpperCase() === "DONE"
          ).length;
          const percent =
            tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);
          return { ...p, progress: percent };
        } catch (err) {
          console.error(`Failed to fetch tasks for project ${p.id}`, err);
          return { ...p, progress: 0 };
        }
      })
    );
    setProjects(updated);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await projectAPI.getAll();
        await fetchProgressForProjects(data); // enrich with progress
      } catch (err) {
        console.error("❌ Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // priority chip colors
  const getPriorityColor = (priority) => {
    if (!priority) return "bg-gray-100 text-gray-800 border-gray-200";
    switch (String(priority).toUpperCase()) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // status chip colors
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

  // progress bar colors
  const getProgressColor = (progress) => {
    if (progress === 0) return "bg-white border border-gray-300"; // empty bar
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-600";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500"; // 1–24%
  };

  // status label under % text
  const getProgressLabel = (progress) => {
    if (progress === 0) return "Not Started";
    if (progress >= 80) return "On Track";
    if (progress >= 50) return "In Progress";
    if (progress >= 25) return "At Risk";
    return "Delayed";
  };

  if (loading) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, idx) => (
          <ProjectSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center mb-4">
              <FolderOpen className="h-8 w-8 text-red-600 mr-3" />
              <h1 className="text-3xl font-bold text-blue-900">Ongoing Projects</h1>
            </div>
            <p className="text-gray-700 text-lg">
              Track and manage your active projects with real-time updates and progress monitoring.
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="cursor-pointer bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-lg p-6 transition-all duration-200 hover:border-blue-300 transform hover:scale-[1.02] group"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-blue-900 group-hover:text-blue-700">
                    {project.title}
                  </h2>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status || "Planning"}
                    </span>
                    {project.priority && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
                          project.priority
                        )}`}
                      >
                        {project.priority}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4 line-clamp-3">{project.description}</p>

              {/* Meta Row */}
              <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
                <div className="flex items-center text-gray-600 space-x-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {project.startDate
                        ? new Date(project.startDate).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {project.deadline
                        ? new Date(project.deadline).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Target className="h-4 w-4 mr-1" />
                    <span>{project.createdBy || "—"}</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">{project.members?.length || 0} members</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-900">
                      {project.progress || 0}%
                    </span>
                    <span className="text-xs text-gray-500">
                      {getProgressLabel(project.progress || 0)}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                      project.progress || 0
                    )}`}
                    style={{ width: `${project.progress || 0}%` }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-xs">
                    Last updated{" "}
                    {project.updatedAt
                      ? new Date(project.updatedAt).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
                <button className="text-blue-900 hover:text-red-600 text-sm font-medium transition-colors duration-200">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Projects Found</h3>
            <p className="text-gray-500">
              Start by creating your first project to see it here.
            </p>
          </div>
        )}

        {/* Create Project Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/create-project")}
            className="bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
          >
            Create New Project
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;
