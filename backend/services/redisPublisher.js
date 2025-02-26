const Redis = require("ioredis");
const redis = new Redis({ host: "localhost", port: 6379 });
require('dotenv').config()
const orderExpiry = process.env.ORDER_EXPIRES_IN

async function setOrderExpiration(orderId) {
    const key = `order:${orderId}`;
    const expirationTime = parseInt(orderExpiry) * 60; 
    await redis.set(key, "pending", "EX", expirationTime); // Store order with expiry
    console.log(`Order ${orderId} will expire in ${expirationTime} seconds.`);
}

async function removeOrderId(orderId) {
    const key = `order:${orderId}`;
    const orderExists = await redis.exists(key);

    if (orderExists) {
        await redis.del(key);
        console.log(`Order ${orderId} has been removed.`);
    } else {
        console.log(`Order ${orderId} does not exist.`);
    }
}

module.exports = { setOrderExpiration, removeOrderId };
