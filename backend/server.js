import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import employeesRoutes from "./src/routes/employees.js";
import skillsRoutes from "./src/routes/skills.js";

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

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
