<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Redis JWT Auth - README</title>
<link href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css" rel="stylesheet">
<style>
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
        background-color: #f6f8fa;
        color: #24292e;
        margin: 0;
        padding: 0;
        line-height: 1.6;
    }

    .container {
        max-width: 900px;
        margin: 2rem auto;
        padding: 2rem;
        background-color: white;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    h1, h2, h3 {
        font-weight: 600;
    }

    h1 {
        font-size: 2.5rem;
        margin-bottom: 0.2rem;
    }

    h2 {
        font-size: 1.8rem;
        border-bottom: 2px solid #4CAF50;
        padding-bottom: 0.2rem;
        margin-top: 2rem;
        margin-bottom: 1rem;
        color: #4CAF50;
    }

    p {
        margin: 0.5rem 0 1rem 0;
    }

    ul {
        margin-left: 1.5rem;
        margin-bottom: 1rem;
    }

    code {
        background-color: #f6f8fa;
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-family: monospace;
    }

    pre {
        background-color: #f6f8fa;
        padding: 1rem;
        border-radius: 6px;
        overflow-x: auto;
    }

    .badge {
        display: inline-block;
        padding: 0.25em 0.5em;
        margin-right: 0.3em;
        font-size: 0.75rem;
        font-weight: 600;
        color: white;
        background-color: #4CAF50;
        border-radius: 0.25rem;
        text-decoration: none;
    }

    a {
        color: #0366d6;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    footer {
        text-align: center;
        margin-top: 3rem;
        padding: 2rem;
        color: #777;
    }
</style>
</head>
<body>
<div class="container">
    <h1>Redis JWT Auth</h1>
    <p>A Node.js package for secure JWT-based authentication with Redis support.</p>
    
    <p>
        <a class="badge" href="https://www.npmjs.com/package/redis-jwt-auth">npm</a>
        <a class="badge" href="https://github.com/AkshatKumarJain/redis-jwt-auth">GitHub</a>
        <a class="badge" href="#">MIT License</a>
    </p>

    <h2>Features</h2>
    <ul>
        <li>Issue Access & Refresh Tokens</li>
        <li>Rotate & Revoke Refresh Tokens</li>
        <li>Supports Redis for production & in-memory store for development</li>
        <li>Secure JWT Authentication Middleware</li>
    </ul>

    <h2>Installation</h2>
    <pre><code class="language-bash">npm install redis-jwt-auth</code></pre>

    <h2>Usage</h2>
    <pre><code class="language-javascript">import express from "express";
import { authMiddleware, issueTokens } from "redis-jwt-auth";

const app = express();
app.use(express.json());

app.get("/login", async (req, res) => {
    const { accessToken, refreshToken } = await issueTokens({ userId: "1" });
    res.json({ accessToken, refreshToken });
});

app.get("/protected", authMiddleware(), (req, res) => {
    res.send("This is a protected route");
});

app.listen(3000, () => console.log("Server running on port 3000"));</code></pre>

    <h2>API</h2>
    <ul>
        <li><code>issueTokens(payload)</code> - Issue new access & refresh tokens</li>
        <li><code>rotateRefreshToken(oldToken)</code> - Rotate refresh token</li>
        <li><code>revokeAll(userId)</code> - Revoke all refresh tokens for a user</li>
        <li><code>authMiddleware(options)</code> - Middleware to protect routes</li>
    </ul>

    <h2>Configuration</h2>
    <p>Edit <code>config.js</code> to set:</p>
    <ul>
        <li><code>isProd</code>: true to use Redis, false for in-memory</li>
        <li><code>accessTokenExpiry</code>: Access token lifetime</li>
        <li><code>refreshTokenExpiry</code>: Refresh token lifetime</li>
        <li><code>redisConfig</code>: Redis host, port, password</li>
    </ul>

    <h2>Contributing</h2>
    <p>Feel free to open issues or submit pull requests. Follow standard Node.js style conventions.</p>

    <h2>License</h2>
    <p>MIT © Your Name</p>
</div>
<footer>
    <p>Made by Akshat Jain</p>
</footer>

<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
<script>hljs.highlightAll();</script>
</body>
</html>
