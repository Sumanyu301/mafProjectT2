import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; 
// ✅ use VITE_API_URL in .env for flexibility

export const authAPI = {
  // Signup (register)
  signup: async (data) => {
    const res = await axios.post(`${API_URL}/api/auth/signup`, data, {
      withCredentials: true, // important for cookies
    });
    return res.data;
  },

  // Login
  login: async (data) => {
    const res = await axios.post(`${API_URL}/api/auth/login`, data, {
      withCredentials: true,
    });
    return res.data;
  },

  // Logout
  logout: async () => {
    const res = await axios.post(`${API_URL}/api/auth/logout`, {}, {
      withCredentials: true,
    });
    return res.data;
  },

  // Verify logged-in user
  verify: async () => {
    const res = await axios.get(`${API_URL}/api/auth/verify`, {
      withCredentials: true,
    });
    return res.data; // {id, email}
  },
};
