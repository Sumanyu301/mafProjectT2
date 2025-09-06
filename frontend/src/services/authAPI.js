import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Create axios instance with common config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          throw new Error(data.message || "Invalid request. Please check your input.");
        case 401:
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          throw new Error("Session expired. Please login again.");
        case 403:
          throw new Error("Access denied. You do not have permission to perform this action.");
        case 404:
          throw new Error("Service not found. Please try again later.");
        case 422:
          throw new Error(data.message || "Validation error. Please check your input.");
        case 429:
          throw new Error("Too many requests. Please wait a moment and try again.");
        case 500:
          throw new Error("Server error. Please try again later.");
        default:
          throw new Error(data.message || "Something went wrong. Please try again.");
      }
    } else if (error.request) {
      throw new Error("Network error. Please check your connection and try again.");
    } else {
      throw new Error(error.message || "An unexpected error occurred. Please try again.");
    }
  }
);

export const authAPI = {
  // Signup function with validation
  signup: async (data) => {
    if (!data.username || data.username.trim().length < 3) {
      throw new Error("Username must be at least 3 characters long.");
    }

    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      throw new Error("Please enter a valid email address.");
    }

    if (!data.password || data.password.trim().length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    const response = await apiClient.post("/auth/register", {
      username: data.username.trim(),
      email: data.email.toLowerCase().trim(),
      password: data.password.trim(),
    });

    return response.data;
  },

  // Login function with validation
  login: async (data) => {
    if (!data.identifier) {
      throw new Error("Please enter your email or username.");
    }

    if (!data.password) {
      throw new Error("Please enter your password.");
    }

    let identifier = data.identifier.trim();
    // Only lowercase if input looks like an email
    if (identifier.includes("@")) {
      identifier = identifier.toLowerCase();
    }

    const response = await apiClient.post("/auth/login", {
      identifier,
      password: data.password,
    });

    return response.data;
  },

  // Logout function
  logout: async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.warn("Logout request failed:", error.message);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  // Refresh token function
  refreshToken: async () => {
    try {
      const response = await apiClient.post("/auth/refresh");
      const { token } = response.data;
      localStorage.setItem("token", token);
      return response.data;
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw error;
    }
  },

  // Get current user profile
  getProfile: async () => {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (data) => {
    const response = await apiClient.put("/auth/profile", data);
    return response.data;
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      throw new Error("Please enter a valid email address.");
    }

    const response = await apiClient.post("/auth/forgot-password", {
      email: email.toLowerCase().trim(),
    });

    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    if (!password || password.trim().length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    const response = await apiClient.post("/auth/reset-password", {
      token,
      password: password.trim(),
    });

    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },

  // Get stored user data
  getStoredUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      return null;
    }
  },

  // Get stored token
  getStoredToken: () => {
    return localStorage.getItem("token");
  },
};
