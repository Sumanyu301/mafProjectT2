import prisma from "../prismaClient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// ------------------------------------------------------------------------------------------------------------

export async function signUp(req, res) {
  console.log("Sign up request received");
  const { username, email, password, name, contact } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and employee profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the user
      const newUser = await tx.user.create({
        data: {
          username,
          email,
          passwordHash: hashedPassword,
          systemRole: "EMPLOYEE", // default role
        },
      });

      // Automatically create employee profile
      const newEmployee = await tx.employee.create({
        data: {
          userId: newUser.id,
          name: name || username, // Use provided name or fallback to username
          contact: contact || email, // Use provided contact or fallback to email
          availability: "AVAILABLE",
          maxTasks: 5, // default capacity
          currentWorkload: 0,
        },
      });

      return { user: newUser, employee: newEmployee };
    });

    res.status(201).json({
      message: "User and employee profile created successfully",
      userId: result.user.id,
      employeeId: result.employee.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// ------------------------------------------------------------------------------------------------------------

export async function loginUser(req, res) {
  console.log("Login request received");
  // const { email, password } = req.body;
  const { identifier, password } = req.body;

  try {
    // const user = await prisma.user.findUnique({ where: { email } });
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, systemRole: user.systemRole },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // use true in production (HTTPS)
      sameSite: "None", // allow cross-site cookies (Vercel + Render setup)
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// ------------------------------------------------------------------------------------------------------------

export async function logoutUser(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ message: "Logged out successfully" });
}

// ------------------------------------------------------------------------------------------------------------

export async function verifyUser(req, res) {
  const token = req.cookies?.token;
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    res.status(200).json({
      message: "Protected data",
      id: decoded.id,
      email: decoded.email,
      // role: decoded.systemRole
    });
  });
}
