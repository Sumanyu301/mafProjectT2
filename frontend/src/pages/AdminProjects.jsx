import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectAPI } from "../services/projectAPI";

import toast from "react-hot-toast";
import {
  SuccessToast,
  ErrorToast,
  ConfirmToast,
} from "../components/CustomToasts";
import LoadingOverlay from "../components/LoadingOverlay";

const AdminProjects = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // if id exists → edit mode
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [dateError, setDateError] = useState("");

  const [loading, setLoading] = useState(false); // loading prior values

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate dates whenever they change
  useEffect(() => {
    if (startDate && deadline) {
      const start = new Date(startDate);
      const end = new Date(deadline);

      if (start >= end) {
        setDateError("Start date must be before the deadline");
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }
  }, [startDate, deadline]);

  useEffect(() => {
    if (isEditMode) {
      const fetchProject = async () => {
        try {
          setLoading(true);
          const project = await projectAPI.getById(id);
          setTitle(project.title);
          setDescription(project.description);
          setPriority(project.priority);
          setStartDate(
            project.startDate
              ? new Date(project.startDate).toISOString().slice(0, 10)
              : ""
          );
          setDeadline(
            project.deadline
              ? new Date(project.deadline).toISOString().slice(0, 10)
              : ""
          );
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

    // Validation: Check if start date is before deadline
    if (startDate && deadline) {
      const start = new Date(startDate);
      const end = new Date(deadline);

      if (start >= end) {
        toast.custom(
          <ErrorToast
            title="Invalid Dates"
            message="Start date must be before the deadline."
          />,
          { position: "top-center", duration: 3500 }
        );
        return;
      }
    }

    // Validation: Check required fields
    if (!title.trim()) {
      toast.custom(
        (t) => (
          <ErrorToast
            title="Missing Title"
            message="Project title is required."
            onClose={() => toast.dismiss(t.id)}
          />
        ),
        { position: "top-center", duration: 3500 }
      );
      return;
    }

    if (!description.trim()) {
      toast.custom(
        (t) => (
          <ErrorToast
            title="Missing Description"
            message="Project description is required."
            onClose={() => toast.dismiss(t.id)}
          />
        ),
        { position: "top-center", duration: 3500 }
      );
      return;
    }

    setIsSubmitting(true);

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

        toast.custom(
          (t) => (
            <SuccessToast
              title="Project Updated!"
              message="Your project has been updated successfully."
              onClose={() => toast.dismiss(t.id)}
            />
          ),
          { position: "top-center", duration: 3000 }
        );
        navigate(-1); // go back to previous page
      } else {
        await projectAPI.create(payload);
        toast.custom(
          (t) => (
            <SuccessToast
              title="Project Created!"
              message="Your project has been added successfully."
              onClose={() => toast.dismiss(t.id)}
            />
          ),
          { position: "top-center", duration: 3000 }
        );
        navigate(-1); // go back to previous page
      }

      navigate("/dashboard"); // redirect back to project list
    } catch (err) {
      console.error("❌ Error saving project:", err);
      toast.custom(
        (t) => (
          <ErrorToast
            title="Save Failed"
            message="Something went wrong while saving."
            onClose={() => toast.dismiss(t.id)}
          />
        ),
        { position: "top-center", duration: 3500 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-8 max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-900">
          {isEditMode ? "Edit Project" : "Create Project"}
        </h1>

        {/* Project Form */}
        <div className="relative">
          <div
            className={`bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200 ${
              loading ? "opacity-60" : ""
            }`}
          >
            <h2 className="text-xl font-semibold mb-4 text-blue-900">
              Project Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Project Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg"
                disabled={loading}
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg"
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
                  className={`w-full p-3 border-2 rounded-lg ${
                    dateError ? "border-red-300 focus:border-red-500" : "border-gray-200"
                  }`}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className={`w-full p-3 border-2 rounded-lg ${
                    dateError ? "border-red-300 focus:border-red-500" : "border-gray-200"
                  }`}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Date Error Message */}
            {dateError && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{dateError}</p>
              </div>
            )}

            <textarea
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg mt-4 resize-none"
              rows="3"
              disabled={loading}
            />
          </div>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-900 border-t-transparent mx-auto mb-4" />
                <div className="text-gray-700 font-medium">Loading project details…</div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            className={`w-full sm:w-auto px-6 py-3 rounded-lg ${
              isSubmitting
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full sm:w-auto px-8 py-3 rounded-lg flex items-center justify-center ${
              isSubmitting
                ? "bg-blue-400 text-white cursor-not-allowed"
                : "bg-blue-900 text-white hover:bg-blue-800"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : isEditMode ? (
              "Update Project"
            ) : (
              "Create Project"
            )}
          </button>
        </div>
      </div>
    </div>

  );
};

export default AdminProjects;
