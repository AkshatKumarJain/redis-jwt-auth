import { authMiddleware, issueTokens } from "./app.js";
import express from "express";

const app = express();

app.get("/", async (_, res) => {
    const {accessToken, refreshToken} = await issueTokens({ userId: "1" });
    console.log("accessToken ",accessToken, "\n", "refreshToken ", refreshToken);
    console.log("hello");
    res.send("Hello");
})

app.get("/public", authMiddleware(), (_, res) => {
  res.send("This is a public route");
});

app.get('/private', authMiddleware({ required: true }), (_, res) => {
  res.send("This is a private route");
})

app.listen(8000, () => {
    console.log("The server is running at port: 8000.");
})