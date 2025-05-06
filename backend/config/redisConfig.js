const Redis = require("ioredis");
require('dotenv').config();

// Redis client for normal commands
const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null, // Optional if Redis is password-protected
});

// Redis client for subscriptions (separate instance)
const redisSubscriber = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null,
});

// Event listeners
redisClient.on("connect", () => console.log("Connected to Redis (commands)."));
redisSubscriber.on("connect", () => console.log("Connected to Redis (subscriber)."));

redisClient.on("error", (err) => console.error("Redis command error:", err));
redisSubscriber.on("error", (err) => console.error("Redis subscriber error:", err));

module.exports = { redisClient, redisSubscriber };
