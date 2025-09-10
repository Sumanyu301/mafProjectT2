import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
};
