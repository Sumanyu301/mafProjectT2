import express from "express";

const router = express.Router();

import {signUp, loginUser, logoutUser, verifyUser} from "../controllers/authController.js";

// ===== Signup (Register) =====
router.post("/signup", signUp);

// ===== Login =====
router.post("/login", loginUser);

// ===== Logout =====
router.post("/logout", logoutUser);

// ===== Verify (Protected route) =====
router.get("/verify", verifyUser);

export default router;
