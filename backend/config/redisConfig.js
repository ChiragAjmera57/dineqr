const Redis = require("ioredis");
require('dotenv').config();

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null, // Optional if Redis is password-protected
});

redis.on("connect", () => {
  console.log("Connected to Redis successfully.");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

module.exports = redis;