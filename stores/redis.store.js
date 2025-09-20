import Redis from "ioredis";
import config from "../config.js";

// check if the system has redis setup or not
let redisStore;
try {
  const redis = new Redis({
    host: config.REDIS_URL,
    port: config.REDIS_URL,
    retryStrategy: () => null, // don’t keep retrying forever
  });

  // if redis is not available it switches to memory 
  redis.on("error", (err) => {
    console.warn("Redis not available, falling back to memory store");
    redisStore = new Map(); // fallback
  });

  redisStore = redis;
} catch (err) {
  console.warn("Redis connection failed, using memory store instead");
  redisStore = new Map();
}

// if redis is available the it is used for setup
export const setKey = async (key, value, ttlSeconds) => {
    await redisStore.set(key, value, "EX", ttlSeconds);
}

export const getKey = async (key) => {
    return redisStore.get(key);
}

export const delKey = async (key) => {
    return redisStore.del(key);
}

export const keys = async (pattern) => {
    return redisStore.keys(pattern);
}
