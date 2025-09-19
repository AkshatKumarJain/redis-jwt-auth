const isProd = (process.env.AUTH_MODE || process.env.NODE_ENV) === "production";

export default {
    isProd,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "dev_access_secret",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "dev_refresh_secret",
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    REDIS_URL: process.env.REDIS_URL || "redis://127.0.0.1:6379",
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || undefined
};
