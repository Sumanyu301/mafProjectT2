import express from "express";
import cors from "cors";

import employeesRoutes from "./src/routes/employees.js";
import skillsRoutes from "./src/routes/skills.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Base route
app.get("/", (req, res) => {
  res.json({ message: "API is working with PostgreSQL + Prisma" });
});

// Mount routes
app.use("/employees", employeesRoutes);
app.use("/skills", skillsRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Health check
// app.get("/health", (req, res) => {
//   res.json({ status: "OK", timestamp: new Date().toISOString() });
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
