// stores/redis.store.js
import Redis from "ioredis";
import config from "../config.js";
import * as memoryStore from "./memory.store.js"; // use your existing memory store that supports TTL

let client = null;
if (config.isProd) {
  try {
    client = new Redis(config.REDIS_URL); // pass URL directly
    client.on("error", (err) => {
      console.warn("Redis error:", err);
      // keep client as null to fall back to memory store
      client = null;
    });
  } catch (err) {
    console.warn("Redis init failed, falling back to memory store", err);
    client = null;
  }
}

export const setKey = async (key, value, ttlSeconds) => {
  if (client) {
    // store JSON to be safe
    return client.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } else {
    return memoryStore.setKey(key, value, ttlSeconds);
  }
};

export const getKey = async (key) => {
  if (client) {
    const v = await client.get(key);
    if (v === null) return null;
    try { return JSON.parse(v); } catch { return v; }
  } else {
    return memoryStore.getKey(key);
  }
};

export const delKey = async (key) => {
  if (client) return client.del(key);
  return memoryStore.delKey(key);
};

export const keys = async (pattern) => {
  if (client) return client.keys(pattern);
  return memoryStore.keys(pattern);
};
