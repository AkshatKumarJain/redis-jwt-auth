import { authMiddleware, issueTokens } from "./app.js";
import express from "express";

const app = express();

app.get("/", async (_, res) => {
    const {accessToken, refreshToken, jti} = await issueTokens({ userId: "1" });
    console.log("accessToken ", accessToken,"refreshToken ", refreshToken, "jti ", jti);
    console.log("hello");
    res.send("Hello");
})

app.get("/public", authMiddleware(), (req, res) => {
  res.send("This is a public route");
});

app.listen(8000, () => {
    console.log("The server is running at port: 8000.");
})