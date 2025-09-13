import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectAPI } from "../services/projectAPI";

const AdminProjects = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // if id exists → edit mode
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false); // loading prior values

  // ✅ Prefill form if editing
  useEffect(() => {
    if (isEditMode) {
      const fetchProject = async () => {
        try {
          setLoading(true);
          const project = await projectAPI.getById(id);
          setTitle(project.title);
          setDescription(project.description);
          setPriority(project.priority);
          setStartDate(project.startDate ? new Date(project.startDate).toISOString().slice(0, 10) : "");
          setDeadline(project.deadline ? new Date(project.deadline).toISOString().slice(0, 10) : "");
        } catch (err) {
          console.error("❌ Error fetching project:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    }
  }, [id, isEditMode]);

  // ✅ Submit handler
  const handleSubmit = async () => {
    if (loading) return;
    try {
      const payload = {
        title,
        description,
        priority,
        startDate: startDate ? new Date(startDate).toISOString() : null,
        deadline: deadline ? new Date(deadline).toISOString() : null,
      };

      if (isEditMode) {
        await projectAPI.update(id, payload);
        alert("Project updated successfully!");
        navigate(-1);
      } else {
        await projectAPI.create(payload);
        alert("Project created successfully!");
        navigate(-1);
      }

      navigate("/"); // redirect back to project list
    } catch (err) {
      console.error("❌ Error saving project:", err);
      alert(err.response?.data?.error || "Failed to save project");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">
          {isEditMode ? "Edit Project" : "Create Project"}
        </h1>

        {/* Project Form */}
        <div className="relative">
          <div className={`bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200 ${loading ? "opacity-60" : ""}`}>
            <h2 className="text-xl font-semibold mb-4 text-blue-900">
              Project Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Project Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-3 border-2 border-gray-200 rounded-lg"
                disabled={loading}
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="p-3 border-2 border-gray-200 rounded-lg"
                disabled={loading}
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="CRITICAL">Critical Priority</option>
              </select>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg"
                  disabled={loading}
                />
              </div>
            </div>
            <textarea
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg mt-4"
              rows="3"
              disabled={loading}
            />
          </div>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-900 border-t-transparent mx-auto mb-4" />
                <div className="text-gray-700 font-medium">Loading project…</div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-blue-800 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {isEditMode ? "Update Project" : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;