import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  Pencil,
  Users,
  Calendar,
  Clock,
  ArrowLeft,
  Trash2,
  Target,
} from "lucide-react";
import { authAPI } from "../services/authAPI";
import { projectAPI } from "../services/projectAPI";
import { taskAPI } from "../services/taskAPI";
import { employeeAPI } from "../services/employeeAPI";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import toast from "react-hot-toast";
import {
  SuccessToast,
  ErrorToast,
  ConfirmToast,
} from "../components/CustomToasts";
import ProjectDetailsSkeleton from "../components/ProjectDetailsSkeleton";

function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kanban-related
  const [tasks, setTasks] = useState([]);
  const [taskLoading, setTaskLoading] = useState(false);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editTask, setEditTask] = useState(null); // object or null

  const [allEmployees, setAllEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  const [userId, setUserId] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveTaskLoading, setSaveTaskLoading] = useState(false);
  const [isDeletingTask, setIsDeletingTask] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authAPI.verify();
        setUserId(data.id);

        // Get employee data for the current user
        const employeeData = await employeeAPI.getMyProfile();
        setEmployeeId(employeeData.id);
      } catch (err) {
        console.error("Failed to verify user or get employee data:", err);
      }
    };
    fetchUser();
  }, []);

  // Load project
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

  const isCreator = Boolean(
    project && project.creator && project.creator.id === employeeId
  );

  const isOwner = Boolean(
    project && project.owner && project.owner.id === employeeId
  );

  const isProjectManager = isCreator || isOwner;

  // Load tasks for project
  useEffect(() => {
    if (!project?.id) return;
    const fetchTasks = async () => {
      setTaskLoading(true);
      try {
        const data = await taskAPI.getProjectTasks(project.id);
        // normalize employeeId -> assigneeId for UI (keep UI using assigneeId)
        const normalized = data.map((t) => ({
          ...t,
          // backend uses employeeId field; map it into UI's assigneeId
          assigneeId:
            t.employeeId === null || t.employeeId === undefined
              ? ""
              : Number(t.employeeId),
        }));
        setTasks(normalized);
      } catch (err) {
        console.error("Failed to load tasks", err);
        setTasks([]);
      } finally {
        setTaskLoading(false);
      }
    };
    fetchTasks();
  }, [project?.id]);

  // derive progress from tasks only (do not overwrite project)
  const derivedProgress = useMemo(() => {
    const total = tasks.length;
    if (total === 0) return 0;
    const completed = tasks.filter(
      (t) =>
        String(t.status).toUpperCase() === "COMPLETED" ||
        String(t.status).toUpperCase() === "DONE"
    ).length;
    return Math.round((completed / total) * 100);
  }, [tasks]);

  // Fetch all employees when modal opens (owner only)
  useEffect(() => {
    if (showTaskModal && isProjectManager) {
      employeeAPI
        .getAll()
        .then((res) => {
          setAllEmployees(res || []);
        })
        .catch(() => setAllEmployees([]));
    }
  }, [showTaskModal, isProjectManager]);

  const statusColumns = [
    { id: "TODO", label: "To Do" },
    { id: "IN_PROGRESS", label: "In Progress" },
    { id: "IN_REVIEW", label: "In Review" },
    { id: "COMPLETED", label: "Completed" },
    { id: "BLOCKED", label: "Blocked" },
  ];

  const tasksByStatus = {};
  statusColumns.forEach((col) => {
    tasksByStatus[col.id] = tasks.filter(
      (t) => String(t.status) === String(col.id)
    );
  });

  // Helpers for colors
  const getStatusColor = (status) => {
    switch (String(status).toUpperCase()) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "TODO":
      case "PLANNING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
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

  const getProgressColor = (progress) => {
    if (progress === 0) return "bg-white border border-gray-300"; // empty bar
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-600";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500"; // 1–24%
  };

  // open modal to add task (blank template)
  const handleAddTaskClick = () => {
    setEditTask({
      title: "",
      priority: "MEDIUM",
      status: "TODO",
      assigneeId: "", // empty string denotes unassigned in UI
    });
    setShowTaskModal(true);
  };

  // open modal to edit existing task (values retained)
  const handleEditTask = (task) => {
    setEditTask({
      ...task,
      // make sure we read backend's employeeId if present
      assigneeId:
        task.assigneeId !== undefined
          ? task.assigneeId
          : task.employeeId === null || task.employeeId === undefined
          ? ""
          : Number(task.employeeId),
    });
    setShowTaskModal(true);
  };

  // assign/unassign in modal (local to editTask)
  const handleAssignMember = (empId) => {
    // empId may be number or "", keep normalized
    setEditTask((prev) => ({
      ...prev,
      assigneeId: empId === "" ? "" : Number(empId),
    }));
  };

  // Delete task (owner only)
  const handleDeleteTask = async (taskId) => {
    if (!taskId) return;
    if (!window.confirm("Delete this task?")) return;
    try {
      setIsDeletingTask(true);
      await taskAPI.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => Number(t.id) !== Number(taskId)));
      // if modal open for same task, close it
      if (editTask && Number(editTask.id) === Number(taskId)) {
        setShowTaskModal(false);
        setEditTask(null);
      }
    } catch (err) {
      console.error("Failed to delete task", err);
      alert("Failed to delete task");
    } finally {
      setIsDeletingTask(false);
    }
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    setSaveTaskLoading(true);
    if (!editTask || !editTask.title) return;

    const payload = {
      title: editTask.title,
      priority: editTask.priority,
      status: editTask.status,
      // map UI assigneeId to backend field employeeId
      employeeId:
        editTask.assigneeId === "" ? null : Number(editTask.assigneeId),
    };

    try {
      if (editTask.id) {
        const updated = await taskAPI.updateTask(editTask.id, payload);
        const normalized = {
          ...updated,
          assigneeId:
            updated.employeeId == null ? "" : Number(updated.employeeId),
        };
        setTasks((prev) =>
          prev.map((t) =>
            Number(t.id) === Number(normalized.id) ? normalized : t
          )
        );

        // ensure assigned employee appears in project members immediately
        if (normalized.assigneeId) {
          const empId = Number(normalized.assigneeId);
          const alreadyMember = project?.members?.some(
            (m) => Number(m.id) === empId
          );
          if (!alreadyMember) {
            // try to find in allEmployees, otherwise fetch by id
            let assignedEmp = allEmployees.find((e) => Number(e.id) === empId);
            if (!assignedEmp) {
              try {
                assignedEmp = await employeeAPI.getById(empId);
              } catch (err) {
                assignedEmp = null;
              }
            }
            if (assignedEmp) {
              setProject((prev) => ({
                ...prev,
                members: [...(prev?.members || []), assignedEmp],
              }));
            }
          }
        }
      } else {
        const created = await taskAPI.createTask(project.id, payload);
        const normalized = {
          ...created,
          assigneeId:
            created.employeeId == null ? "" : Number(created.employeeId),
        };
        setTasks((prev) => [...prev, normalized]);

        // ensure assigned employee appears in project members immediately
        if (normalized.assigneeId) {
          const empId = Number(normalized.assigneeId);
          const alreadyMember = project?.members?.some(
            (m) => Number(m.id) === empId
          );
          if (!alreadyMember) {
            let assignedEmp = allEmployees.find((e) => Number(e.id) === empId);
            if (!assignedEmp) {
              try {
                assignedEmp = await employeeAPI.getById(empId);
              } catch (err) {
                assignedEmp = null;
              }
            }
            if (assignedEmp) {
              setProject((prev) => ({
                ...prev,
                members: [...(prev?.members || []), assignedEmp],
              }));
            }
          }
        }
      }
      setShowTaskModal(false);
      setEditTask(null);
    } catch (err) {
      console.error("Failed to save task", err);
      alert("Failed to save task");
    } finally {
      setSaveTaskLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = draggableId;
    const originalTask = tasks.find((t) => String(t.id) === String(taskId));
    if (!originalTask) return;

    const isAssignee = String(originalTask.assigneeId) === String(employeeId);
    // allow if assignee OR project creator/owner
    if (!isAssignee && !isProjectManager) {
      toast.error("Only the assignee or project manager can move this task");
      return;
    }

    const newStatus = destination.droppableId;

    // optimistic update: set new status locally
    setTasks((prev) =>
      prev.map((t) =>
        String(t.id) === String(taskId) ? { ...t, status: newStatus } : t
      )
    );

    try {
      // keep API call consistent with other places
      await taskAPI.updateTask(taskId, { status: newStatus });
      // toast.custom(<SuccessToast title="Task moved" message="Task status updated" />, { position: "top-center", duration: 2000 });
    } catch (err) {
      console.error("Failed to update task status", err);
      // revert optimistic change
      setTasks((prev) =>
        prev.map((t) => (String(t.id) === String(taskId) ? originalTask : t))
      );
      toast.custom(
        <ErrorToast
          title="Move Failed"
          message="Failed to update task status"
        />,
        { position: "top-center", duration: 3000 }
      );
    }
  };

  // Render assignee as clickable name (hover underline) that navigates to profile
  const renderAssignee = (task) => {
    const assigneeId = task?.assigneeId;
    if (assigneeId === "" || assigneeId == null)
      return <span className="italic">Unassigned</span>;
    const member = project?.members?.find(
      (m) => Number(m.id) === Number(assigneeId)
    );
    if (!member) return <span>Unassigned</span>;
    const profileId = member.user?.id ?? member.id;
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/profile/${profileId}`);
        }}
        className="text-blue-700 hover:underline focus:outline-none"
      >
        {member.name}
      </button>
    );
  };

  const handleDeleteProject = async () => {
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
              navigate("/dashboard"); // go back to projects list
            } catch (err) {
              console.error("❌ Error deleting project:", err);
              toast.custom(
                <ErrorToast
                  title="Delete Failed"
                  message={
                    err.response?.data?.error || "Failed to delete project"
                  }
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

  const createdByName =
    project?.creator?.name ??
    project?.creator?.user?.username ??
    project?.createdBy ??
    "—";

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
      <div className="p-4 sm:p-8 max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-900 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            {project.title}
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-3 my-6">
            {/* <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                project.status
              )}`}
            >
              {project.status}
            </span> */}
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(
                project.priority
              )}`}
            >
              {project.priority} Priority
            </span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Project Progress
              </span>
              <span className="text-sm font-semibold text-blue-900">
                {derivedProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(
                  derivedProgress
                )}`}
                style={{ width: `${derivedProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <InfoCard
            icon={Calendar}
            label="Start Date"
            value={new Date(project.startDate).toLocaleDateString()}
            color="text-blue-900"
          />
          <InfoCard
            icon={Clock}
            label="Deadline"
            value={new Date(project.deadline).toLocaleDateString()}
            color="text-red-600"
          />
          <InfoCard
            icon={Target}
            label="Created By"
            value={createdByName}
            color="text-blue-900"
          />
          <InfoCard
            icon={Users}
            label="Team Size"
            value={`${project.members?.length ?? 0} Members`}
            color="text-blue-900"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          {/* top summary + CTA */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-700">
              <span className="font-semibold">{tasks.length}</span> tasks ·{" "}
              <span className="font-semibold">
                {
                  tasks.filter(
                    (t) => String(t.status).toUpperCase() === "COMPLETED"
                  ).length
                }
              </span>{" "}
              completed
            </div>
            {isProjectManager && (
              <button
                onClick={handleAddTaskClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm"
              >
                + Add Task
              </button>
            )}
          </div>

          {taskLoading ? (
            <ProjectDetailsSkeleton tasksOnly />
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {statusColumns.map((col) => (
                  <Droppable droppableId={col.id} key={col.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="bg-white rounded-lg border border-gray-200 min-h-[300px] p-3 flex flex-col"
                      >
                        <div className="font-bold mb-2 text-blue-900 flex items-center justify-between">
                          <span>{col.label}</span>
                          <span className="text-xs text-gray-500">
                            {tasksByStatus[col.id].length}
                          </span>
                        </div>

                        {tasksByStatus[col.id].length === 0 ? (
                          <div className="flex-1 flex items-center justify-center text-sm text-gray-500 italic">
                            No tasks
                          </div>
                        ) : (
                          tasksByStatus[col.id].map((task, idx) => {
                            const isAssignee =
                              String(task.assigneeId) === String(employeeId);
                            const isDraggable =
                              isAssignee || Boolean(isProjectManager);
                            return (
                              <Draggable
                                key={task.id}
                                draggableId={String(task.id)}
                                index={idx}
                                isDragDisabled={!isDraggable}
                              >
                                {(prov) => (
                                  <div
                                    ref={prov.innerRef}
                                    {...prov.draggableProps}
                                    {...(isDraggable
                                      ? prov.dragHandleProps
                                      : {})}
                                    className={`mb-3 border rounded p-3 shadow-sm transition ${
                                      isDraggable
                                        ? "bg-blue-50 cursor-grab hover:bg-blue-100"
                                        : "bg-gray-50 cursor-not-allowed opacity-90"
                                    }`}
                                    onClick={() =>
                                      isProjectManager && handleEditTask(task)
                                    }
                                  >
                                    <div className="font-medium">
                                      {task.title}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {task.priority} · {renderAssignee(task)}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })
                        )}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          )}
        </div>

        {/* Add / Edit Task Modal */}
        {showTaskModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">
                {editTask?.id ? "Edit Task" : "Add Task"}
              </h3>

              <form onSubmit={handleSaveTask} className="flex flex-col h-full">
                {/* Task Title */}
                <input
                  type="text"
                  className="w-full border rounded p-2 mb-3"
                  placeholder="Task Title"
                  value={editTask?.title || ""}
                  onChange={(e) =>
                    setEditTask((t) => ({ ...t, title: e.target.value }))
                  }
                  required
                />

                {/* Priority */}
                <select
                  className="w-full border rounded p-2 mb-3"
                  value={editTask?.priority || "MEDIUM"}
                  onChange={(e) =>
                    setEditTask((t) => ({ ...t, priority: e.target.value }))
                  }
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>

                {/* Assign To */}
                <div className="mb-4">
                  <div className="font-semibold mb-2">Assign to:</div>

                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search members..."
                    className="w-full border rounded p-2 mb-3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  {/* Members list */}
                  <div className="max-h-32 overflow-y-auto flex flex-col gap-2">
                    {allEmployees
                      .filter((emp) =>
                        emp.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                      .map((emp) => {
                        const isSelected =
                          Number(editTask?.assigneeId) === Number(emp.id);
                        return (
                          <button
                            type="button"
                            key={emp.id}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
                              isSelected
                                ? "bg-blue-600 text-white border-blue-700"
                                : "bg-gray-100 text-blue-900 border-gray-300 hover:bg-gray-200"
                            }`}
                            onClick={() => handleAssignMember(emp.id)}
                          >
                            <span>{emp.name}</span>
                            {isSelected && (
                              <span className="text-xs font-medium">
                                Selected
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Action buttons at bottom right */}
                <div className="flex justify-end gap-2 mt-auto">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-gray-200"
                    onClick={() => {
                      setShowTaskModal(false);
                      setEditTask(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg ${
                      saveTaskLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={saveTaskLoading}
                  >
                    <Pencil size={16} />
                    {saveTaskLoading ? "Saving..." : "Save Task"}
                  </button>

                  {/* Delete button (owner only, visible when editing) */}
                  {isProjectManager && editTask?.id && (
                    <button
                      type="button"
                      className={`flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg ${
                        isDeletingTask ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => handleDeleteTask(editTask.id)}
                      disabled={isDeletingTask}
                    >
                      <Trash2 size={16} />
                      {isDeletingTask ? "Deleting..." : "Delete Task"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Admin actions */}
        {isCreator && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Admin Actions
            </h3>
            <div className="flex flex-wrap gap-4">
              <button
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg"
                onClick={() => navigate(`/edit-project/${project.id}`)}
              >
                <Pencil size={16} />
                Edit Project
              </button>
              <button
                onClick={handleDeleteProject}
                className={`flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg ${
                  isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isDeleting}
              >
                <Trash2 size={16} />
                {isDeleting ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-2">
        <Icon className={`h-5 w-5 ${color} mr-2`} />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <p className="text-blue-900 font-semibold">{value}</p>
    </div>
  );
}

export default ProjectDetailsPage;
