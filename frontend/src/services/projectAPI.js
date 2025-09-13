import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"; 
// ✅ Base URL from .env (fallback localhost)

// All project-related API calls
export const projectAPI = {
  // Create a new project (Admin only)
  create: async (data) => {
    const res = await axios.post(`${API_URL}/api/projects`, data, {
      withCredentials: true, // ✅ send cookies
    });
    return res.data;
  },

  // Get all projects
  getAll: async (filters = {}) => {
    const res = await axios.get(`${API_URL}/api/projects`, {
      params: filters,
      withCredentials: true,
    });
    return res.data;
  },

  // Get project by ID
  getById: async (id) => {
    const res = await axios.get(`${API_URL}/api/projects/${id}`, {
      withCredentials: true,
    });
    return res.data;
  },

  // Update project (Admin only)
  update: async (id, data) => {
    const res = await axios.put(`${API_URL}/api/projects/${id}`, data, {
      withCredentials: true,
    });
    return res.data;
  },

  // Delete project (Admin only)
  delete: async (id) => {
    const res = await axios.delete(`${API_URL}/api/projects/${id}`, {
      withCredentials: true,
    });
    return res.data;
  },
};
