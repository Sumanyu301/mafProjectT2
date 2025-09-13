import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const taskAPI = {
  createTask: async (projectId, data) => {
    const res = await axios.post(`${API_URL}/api/projects/${projectId}/tasks`, data, { withCredentials: true });
    return res.data;
  },
  getProjectTasks: async (projectId, filters = {}) => {
    const res = await axios.get(`${API_URL}/api/projects/${projectId}/tasks`, { params: filters, withCredentials: true });
    return res.data;
  },
  getTaskById: async (taskId) => {
    const res = await axios.get(`${API_URL}/api/tasks/${taskId}`, { withCredentials: true });
    return res.data;
  },
  updateTask: async (taskId, data) => {
    const res = await axios.put(`${API_URL}/api/tasks/${taskId}`, data, { withCredentials: true });
    return res.data;
  },
  deleteTask: async (taskId) => {
    const res = await axios.delete(`${API_URL}/api/tasks/${taskId}`, { withCredentials: true });
    return res.data;
  },
};