import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const projectEmpAPI = {
  // Assign one or more employees to a project
  assignEmployees: async (projectId, employeeIds) => {
    const res = await axios.post(
      `${API_URL}/api/projects/${projectId}/employees`,
      { employeeIds },
      { withCredentials: true }
    );
    return res.data;
  },

  // Get all employees assigned to a project
  getProjectEmployees: async (projectId) => {
    const res = await axios.get(
      `${API_URL}/api/projects/${projectId}/employees`,
      { withCredentials: true }
    );
    return res.data;
  },

  // Remove an employee from a project
  removeEmployee: async (projectId, employeeId) => {
    const res = await axios.delete(
      `${API_URL}/api/projects/${projectId}/employees/${employeeId}`,
      { withCredentials: true }
    );
    return res.data;
  },
};