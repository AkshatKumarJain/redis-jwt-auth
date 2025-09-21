# Redis JWT Auth
A lightweight Node.js authentication utility for handling JWT access & refresh tokens with Redis (or in-memory fallback).
Includes Express middleware for protecting routes and enforcing HTTPS.

[![npm version](https://img.shields.io/npm/v/redis-jwt-auth.svg)](https://www.npmjs.com/package/redis-jwt-auth)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/AkshatKumarJain/redis-jwt-auth.svg)](https://github.com/AkshatKumarJain/redis-jwt-auth)

---

## Features
Features
- Access tokens (short-lived JWTs)
- Refresh tokens (long-lived JWTs, rotated & revocable)
- Token rotation – old refresh tokens invalidated on use
- Revocation – revoke all refresh tokens for a user
- Express middleware:
- authMiddleware → protect routes with access tokens
- requireHttps → enforce HTTPS in production
- Redis or in-memory store – auto-selects based on environment
- Secure cookies – HttpOnly + Secure for refresh tokens

---

## Installation
```bash
npm install redis-jwt-auth
```

---

## Quick start

## setup basic express setup

```js
import express from "express";
import cookieParser from "cookie-parser";
import { issueTokens, rotateRefreshToken, revokeAll } from "redis-jwt-auth";
import { authMiddleware, requireHttps } from "redis-jwt-auth";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(requireHttps); // enforce HTTPS in production(can be used in required routes only)
```

## login

```js
app.get("/", async (_, res) => {
  const userId = "1";
    const {accessToken, refreshToken} = await issueTokens({ userId });
    console.log("accessToken ",accessToken, "\n", "refreshToken ", refreshToken);
    console.log("userId ", userId);
    res.send("tokens are issued");
})
```
## for production

```js
// set
 config.isProd = true
// by default it is false
```
## Public routes

## when it should work even if no token is provided

```js
app.post("/login", async (req, res) => {
  const { userId } = req.body; // normally you'd validate from DB
  const { accessToken, refreshToken } = await issueTokens({ userId });

  // send refresh token as HttpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });

  res.json({ accessToken });
});

```

## private routes

```js
// Public route (auth optional)
app.get("/public", authMiddleware(), (req, res) => {
  res.json({ route: "public", user: req.user || null });
});

// Private route (auth required)
app.get("/private", authMiddleware({ required: true }), (req, res) => {
  res.json({ route: "private", user: req.user });
});
```

## logout

## revoke all
```js
app.post("/logout", async (req, res) => {
  const { userId } = req.body;
  await revokeAll(userId);

  res.clearCookie("refreshToken");
  res.json({ ok: true });
});
```

## configurations
```js
NODE_ENV=development | production
AUTH_MODE=dev | prod
JWT_ACCESS_SECRET=****
JWT_REFRESH_SECRET=*****
ACCESS_TOKEN_EXPIRY=****
REFRESH_TOKEN_EXPIRY=****
REDIS_URL=****
COOKIE_DOMAIN=****
```


