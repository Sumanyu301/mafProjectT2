import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token; // Extract token from cookies
  console.log("Token: ", token);

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = decoded; // Attach decoded payload (id, email)
    next();
  });
};
