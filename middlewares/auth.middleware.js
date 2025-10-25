// middlewares/auth.middleware.js
import config from "../config.js";
import { verifyAccessToken } from "../token.js";

export const authMiddleware = (options = {}) => {
  const { cookieName, required = false } = options;
  return (req, res, next) => {
    try {
      let token;

      // cookie-based token
      if (cookieName && req.cookies && req.cookies[cookieName]) {
        token = req.cookies[cookieName];
      } else if (req.headers && req.headers.authorization) {
        // Authorization: "Bearer <token>"
        const parts = req.headers.authorization.split(" ");
        if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
          token = parts[1];
        } else {
          // malformed header
          if (required) return res.status(401).json({ error: "Malformed authorization header" });
          return next(); // permissive for public routes
        }
      }

      if (!token) {
        if (required) return res.status(401).json({ error: "No token provided" });
        return next();
      }

      // verify and attach
      const decoded = verifyAccessToken(token);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
  };
};

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


export const requireHttps = (req, res, next) => {
  if (config.isProd) {
    const proto = req.headers["x-forwarded-proto"] || (req.protocol);
    if (proto !== "https") {
      return res.status(403).json({ error: "HTTPS required" });
    }
  }
  next();
};
