// auth/middlewares/authorizeRole.js

export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // req.user should already be set by verifyToken middleware
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized - No user found" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied: Insufficient role" });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Server error in role authorization", error });
    }
  };
};
