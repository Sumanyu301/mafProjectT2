import express from "express";
import prisma from "../prismaClient.js";
// import { verifyToken } from "./auth.js";

const router = express.Router();

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { employee: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
router.put("/:id", async (req, res) => {
  const { email, systemRole } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { email, systemRole },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
