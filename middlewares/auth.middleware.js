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

export const requireHttps = (req, res, next) => {
  if (config.isProd) {
    const proto = req.headers["x-forwarded-proto"] || (req.protocol);
    if (proto !== "https") {
      return res.status(403).json({ error: "HTTPS required" });
    }
  }
  next();
};
