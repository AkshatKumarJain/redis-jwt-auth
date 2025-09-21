import { authMiddleware, issueTokens, rotateRefreshToken, revokeAll, requireHttps } from "./app.js";
import express from "express";
import config from "./app.js";

const app = express();

app.use(express.json());

// set isProd = true if HTTPs security is required 
// else it is false by default allowing developers to use http requesting
config.isProd = false;

app.get("/sensitive", requireHttps, (req, res) => {
  res.json({ message: "This is secure" });
});

app.get("/", async (_, res) => {
  const userId = "1";
    const {accessToken, refreshToken} = await issueTokens({ userId });
    console.log("accessToken ",accessToken, "\n", "refreshToken ", refreshToken);
    console.log("userId ", userId);
    res.send("tokens are issued");
})

// 2. Public route (auth optional)
// This iroute is accessible if no token is provided not even Bearer 
// but if it is wrong and provided if gives error.
app.get("/public", authMiddleware(), (req, res) => {
  res.json({
    route: "public",
    user: req.user || null,
    message: "Accessible without login",
  });
});

// private routes(auth required)
// works only if a correct token is provided
app.get("/private", authMiddleware({ required: true }), (req, res) => {
  res.json({
    route: "private",
    user: req.user,
    message: "You are authenticated",
  });
});


// route for rotating refresh token
app.post("/rotate", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // if refresh token not found
    if (!refreshToken) return res.status(400).json({ error: "No refresh token" });

    // generate new tokens
    const tokens = await rotateRefreshToken(refreshToken);
    res.json(tokens);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
});

// 5. Revoke all refresh tokens for a user
app.post("/revoke", async (req, res) => {
  const { userId } = req.body;

  // if userId is incorrect it will return bad request
  if (!userId) return res.status(400).json({ error: "No userId provided" });

  // it will revoke all tokens for this user
  const revoked = await revokeAll(userId);

  // if somethig goes wrong it will return no token found for this user
  if (!revoked) return res.status(404).json({ error: "No tokens found for this user" });
  res.json({ ok: true, message: `Revoked all tokens for user ${userId}` });
});

app.listen(8000, () => {
    console.log("The server is running at port: 8000.");
})