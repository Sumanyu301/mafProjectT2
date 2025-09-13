import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// User API calls
export const userAPI = {
  getAll: () => api.get("/users"),
  create: (userData) => api.post("/users", userData),
};

// Post API calls
export const postAPI = {
  getAll: () => api.get("/posts"),
  create: (postData) => api.post("/posts", postData),
};

// Health check
export const healthCheck = () => api.get("/health");

export default api;
