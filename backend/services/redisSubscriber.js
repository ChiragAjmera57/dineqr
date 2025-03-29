const {Order}  = require('../models') 
const redis  = require('../config/redisConfig');
const redisSubscriber = redis

// Enable Redis Keyspace Notifications
redisSubscriber.config("SET", "notify-keyspace-events", "Ex");

async function handleExpiredOrder(orderId) {
    try {
        const order = await Order.findOne({ where: { id: orderId, status: "pending" } });
        if (order) {
            await order.update({ status: "cancelled" }); // Mark as cancelled
            console.log(`Order ${orderId} cancelled due to expiration.`);
        }
    } catch (error) {
        console.error(`Error handling expired order ${orderId}:`, error);
    }
}

// Subscribe to redisSubscriber Key Expiration Events
redisSubscriber.psubscribe("__keyevent@0__:expired", (err, count) => {
    if (err) console.error("Failed to subscribe:", err);
    else console.log(`Subscribed to ${count} Redis event(s).`);
});

// Listen for expiration events
redisSubscriber.on("pmessage", (pattern, channel, message) => {
    console.log(`Expired key detected: ${message}`);
    if (message.startsWith("order:")) {
        const orderId = message.split(":")[1]; // Extract order ID
        handleExpiredOrder(orderId);
    }
});

module.exports = redisSubscriber;
