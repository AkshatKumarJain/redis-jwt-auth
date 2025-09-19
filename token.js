import jwt from "jsonwebtoken";
import crypto from "crypto"
import config from "./config.js";
import { parseExpiryToSeconds } from "./utils/auth.util.js";
import { setKey, getKey, delKey, keys } from "./stores/memory.store.js";
import { setKey, getKey, delKey, keys } from "./stores/redis.store.js";

const store = config.isProd ? redis : memory;

const genJti = () => {
    return crypto.randomBytes(16).toString("hex");
}

export const issueTokens = async (payload) => {
    const jti = genJti();
    const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, {
        expiresIn: config.ACCESS_TOKEN_EXPIRY,
    });

    const refreshPayload = {...payload, jti};
    const refreshToken = jwt.sign(refreshPayload, config.JWT_REFRESH_SECRET, {
        expiresIn: config.REFRESH_TOKEN_EXPIRY,
    });

    const ttl = parseExpiryToSeconds(config.REFRESH_TOKEN_EXPIRY) || 7 * 24 * 60 * 60; // for 7 days
    const key = `refresh:${payload.userId}:${jti}`;
    await store.setKey(key, "valid", ttl);

    return { accessToken, refreshToken, jti };
}

export const verifyAccessToken = (token) => {
    return jwt.verify(token, config.JWT_ACCESS_SECRET);
}

export const rotateRefreshToken = async (oldRefreshToken) => {
    let decoded;
    try {
        decoded = jwt.verify(oldRefreshToken, config.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new Error("Invalid or expired refresh token");
    }

    const { userId, jti } = decoded;
    const key = `refresh:${userId}:${jti}`;
    const exists = await store.getKey(key);

    if(!exists)
    {
        throw new Error("Refresh token invalid or already used");
    }

    await store.delKey(key);

    return issueTokens({ userId });
}

export const revokeAll = async (userId) => {
    const keys = await store.keys(`refresh:${userId}:*`);
    if(keys && keys.length)
    {
        for(const k of keys)
        {
            await store.delKey(k);
        }
    }
}