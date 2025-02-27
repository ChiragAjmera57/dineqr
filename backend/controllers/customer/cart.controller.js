const { redis } = require("../../services/redisPublisher");
const { errorResponse, successResponse } = require("../../utils/responseGenerator");

const addToCart = async (req, res) => {
  try {
    const { session_id } = req.cookies;
    const { menu_item_id, quantity } = req.body;

    if (!session_id) return errorResponse(res,"Session not found",401)

    const cartKey = `cart:${session_id}`;

    // Check if item exists in cart
    const existingQuantity = await redis.hget(cartKey, menu_item_id);

    if (existingQuantity) {
      await redis.hset(cartKey, menu_item_id, parseInt(existingQuantity) + quantity);
    } else {
      await redis.hset(cartKey, menu_item_id, quantity);
    }
    return successResponse(res,null,"Item added to cart successfully",201)
  } catch (error) {
    return errorResponse(res, "Error adding to cart", 500,{message:error.message,stack:error.stack})
  }
};

const getCart = async (req, res) => {
  try {
    const { session_id } = req.cookies;
    if (!session_id) return errorResponse(res,"Session not found",401)

    const cartKey = `cart:${session_id}`;
    const cartItems = await redis.hgetall(cartKey);
    return successResponse(res, cartItems, "cartItems fetched",200)
  } catch (error) {
    return errorResponse(res, "Error fetching cart", 500,{message:error.message,stack:error.stack})
  }
};


module.exports = { addToCart, getCart };
