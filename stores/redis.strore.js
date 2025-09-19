import Redis from "ioredis";
import config from "../config.js";

const redis = new Redis(config.REDIS_URL);

export const setKey = async (key, value, ttlSeconds) => {
    await redis.set(key, value, "EX", ttlSeconds);
}

export const getKey = async (key) => {
    return redis.get(key);
}

export const delKey = async (key) => {
    return redis.del(key);
}

export const keys = async (pattern) => {
    return redis.keys(pattern);
}
