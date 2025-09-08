import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import employeesRoutes from "./routes/employees.js";
import skillsRoutes from "./routes/skills.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import projectRoutes from "./routes/projects.js";
import taskRoutes from "./routes/tasks.js";
import milestoneRoutes from "./routes/milestones.js";
import projectEmployeeRoutes from "./routes/projectEmployees.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Base route
app.get("/", (req, res) => {
  res.json({ message: "API is working with PostgreSQL + Prisma" });
});

// Mount routes
app.use("/api/employees", employeesRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", taskRoutes);
app.use("/api", milestoneRoutes);
app.use("/api", projectEmployeeRoutes);

// Health check
// app.get("/health", (req, res) => {
//   res.json({ status: "OK", timestamp: new Date().toISOString() });
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
