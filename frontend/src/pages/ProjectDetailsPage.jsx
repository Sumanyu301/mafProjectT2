import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Pencil, 
  Users, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Trash2, 
  Target,
  CheckCircle,
  AlertCircle
} from "lucide-react";
// import { authAPI } from "../services/authAPI";
import { projectAPI } from "../services/projectAPI";
import toast from "react-hot-toast";
import { SuccessToast, ErrorToast, ConfirmToast } from "../components/CustomToasts";
import ProjectDetailsSkeleton from "../components/ProjectDetailsSkeleton";

function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  // const [userRole, setUserRole] = useState(""); 
  const [loading, setLoading] = useState(true);

  // ✅ Get logged-in user role
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const data = await authAPI.verify();
  //       setUserRole(data.role); // "ADMIN" or "EMPLOYEE"
  //     } catch (err) {
  //       console.error("Failed to verify user:", err);
  //     }
  //   };
  //   fetchUser();
  // }, []);

  // ✅ Load project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectAPI.getById(id);
        setProject(data);
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800 border-green-200";
      case "In Progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Planning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-600";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
  toast.custom(
    (t) => (
      <ConfirmToast
        title="Delete Project?"
        message="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={async () => {
          toast.dismiss(t.id); // close confirm toast
          try {
            setIsDeleting(true);
            await projectAPI.delete(id); // call API
            toast.custom(
              <SuccessToast
                title="Project Deleted!"
                message="The project was removed successfully."
              />,
              { position: "top-center", duration: 3000 }
            );
            navigate("/"); // go back to projects list
          } catch (err) {
            console.error("❌ Error deleting project:", err);
            toast.custom(
              <ErrorToast
                title="Delete Failed"
                message={err.response?.data?.error || "Failed to delete project"}
              />,
              { position: "top-center", duration: 3500 }
            );
          } finally {
            setIsDeleting(false);
          }
        }}
        onCancel={() => toast.dismiss(t.id)}
      />
    ),
    { position: "top-center", duration: 5000 }
  );
};

  if (loading) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <ProjectDetailsSkeleton />
    </div>
  );
}

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        Project not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-900 hover:text-blue-700 mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Projects
        </button>

        {/* Project Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">{project.title}</h1>
          <p className="text-gray-700 text-lg leading-relaxed">{project.description}</p>

          {/* Status + Priority */}
          <div className="flex flex-wrap gap-3 my-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(project.priority)}`}>
              {project.priority} Priority
            </span>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Project Progress</span>
              <span className="text-sm font-semibold text-blue-900">{project.progress ?? 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Project Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-blue-900 mr-2" />
              <span className="text-sm font-medium text-gray-700">Start Date</span>
            </div>
            <p className="text-blue-900 font-semibold">{new Date(project.startDate).toLocaleDateString()}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Deadline</span>
            </div>
            <p className="text-blue-900 font-semibold">{new Date(project.deadline).toLocaleDateString()}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <Target className="h-5 w-5 text-blue-900 mr-2" />
              <span className="text-sm font-medium text-gray-700">Created By</span>
            </div>
            <p className="text-blue-900 font-semibold">{project.createdBy}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-blue-900 mr-2" />
              <span className="text-sm font-medium text-gray-700">Team Size</span>
            </div>
            <p className="text-blue-900 font-semibold">{project.members?.length ?? 0} Members</p>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-blue-900">Team Members</h2>
          </div>

          {project.members?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.members?.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-semibold text-sm mr-3">
                      {emp.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <span className="font-medium text-blue-900">{emp.name}</span>
                      <p className="text-sm text-gray-600">{emp.task}</p>
                    </div>
                  </div>
                  {/* {emp.status === "Completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )} */}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 italic">No team members assigned yet.</p>
          )}
        </div>

        {/* Admin Actions */}
        {/* {userRole === "ADMIN" && ( */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Admin Actions</h3>
            <div className="flex flex-wrap gap-4">

              <button 
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg transition-all duration-200 font-medium"
                onClick={() => navigate(`/edit-project/${project.id}`)}
              >
                <Pencil size={16} />
                Edit Project
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Trash2 size={16} />
                {isDeleting ? "Deleting..." : "Delete Project"}
              </button>

            </div>
          </div>
        {/* )} */}
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
