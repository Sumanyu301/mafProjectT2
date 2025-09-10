export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!roles.includes(req.user.systemRole)) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    next();
  };
};
