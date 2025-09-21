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


