import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const employeeAPI = {
  // ✅ Get all employees
  getAll: async () => {
    const res = await axios.get(`${API_URL}/api/employees`, {
      withCredentials: true,
    });
    return res.data;
  },

  // ✅ Get employee by ID
  getById: async (id) => {
    const res = await axios.get(`${API_URL}/api/employees/${id}`, {
      withCredentials: true,
    });
    return res.data;
  },

  // ✅ Get current user's profile
  getMyProfile: async () => {
    const res = await axios.get(`${API_URL}/api/employees/me`, {
      withCredentials: true,
    });
    return res.data;
  },

  // ✅ Update employee profile
  updateProfile: async (employeeId, data) => {
    const res = await axios.put(`${API_URL}/api/employees/${employeeId}`, data, {
      withCredentials: true,
    });
    return res.data;
  },

  // ✅ Get all skills
  getAllSkills: async () => {
    const res = await axios.get(`${API_URL}/api/skills`, {
      withCredentials: true,
    });
    return res.data;
  },

  // ✅ Assign skill to employee
  assignSkill: async (employeeId, skillData) => {
    const res = await axios.post(`${API_URL}/api/skills/assign/${employeeId}`, skillData, {
      withCredentials: true,
    });
    return res.data;
  },

  // ✅ Remove skill from employee
  removeSkill: async (employeeId, skillId) => {
    const res = await axios.delete(`${API_URL}/api/skills/remove`, {
      data: { employeeId, skillId },
      withCredentials: true,
    });
    return res.data;
  },
};
