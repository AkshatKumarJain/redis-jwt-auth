import config from "../config.js";
import { verifyAccessToken } from "../token.js";

export const authMiddleware = (options = {}) => {
    return (req, res, next) => {
        try {
            let token;
            if(options.cookieName && req.cookies && req.cookies[options.cookieName])
            {
                token = req.cookies[options.cookieName];
            }
            else if(req.headers.authorization)
            {
                const authHeader = req.headers.authorization;
                const parts = authHeader.split(" ")[1];
                if(parts[1])
                token = parts[1];
                if(!token)
                {
                    console.log("no token");
                    return res.status(401).json({ error: "No token provided" });
                }

                const decoded = verifyAccessToken(token);
                req.user = decoded;
                // next();
            }
            next();
        } catch (error) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }
    }
}


export const requireHttps = (req, res, next) => {
  if (config.isProd) {
    // X-Forwarded-Proto for proxies
    const proto = req.headers["x-forwarded-proto"] || (req.protocol);
    if (proto !== "https") {
      return res.status(403).json({ error: "HTTPS required" });
    }
  }
  next();
}
