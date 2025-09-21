# Redis JWT Auth
A lightweight Node.js authentication utility for handling JWT access & refresh tokens with Redis (or in-memory fallback).
Includes Express middleware for protecting routes and enforcing HTTPS.

[![npm version](https://img.shields.io/npm/v/redis-jwt-auth.svg)](https://www.npmjs.com/package/redis-jwt-auth)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/AkshatKumarJain/redis-jwt-auth.svg)](https://github.com/AkshatKumarJain/redis-jwt-auth)

---

## Features
- Issue Access & Refresh Tokens
- Rotate & Revoke Refresh Tokens
- Supports Redis for production & in-memory store for development
- Secure JWT Authentication Middleware

---

## Installation
```bash
npm install redis-jwt-auth
