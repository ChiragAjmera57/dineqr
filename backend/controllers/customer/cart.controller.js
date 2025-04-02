const { errorResponse, successResponse } = require("../../utils/responseGenerator");
const {  Menu } = require("../../models");
const { redisClient } = require("../../config/redisConfig");

const updateCart = async (req, res) => {
  try {
    const { session_id } = req.cookies;
    const { menu_item_id, quantity } = req.body;

    if (!session_id) return errorResponse(res, "Session not found", 401);

    const cartKey = `cart:${session_id}`;

    if (quantity <= 0) {
      // Remove the item from the cart if quantity is 0 or less
      await redisClient.hdel(cartKey, menu_item_id);
      return successResponse(res, null, "Item removed from cart successfully", 200);
    } else {
      // Update the item quantity in the cart
      await redisClient.hset(cartKey, menu_item_id, quantity);
      return successResponse(res, null, "Cart updated successfully", 200);
    }
  } catch (error) {
    return errorResponse(res, "Error updating cart", 500, { message: error.message, stack: error.stack });
  }
};


const getCart = async (req, res) => {
  try {
    const { session_id } = req.cookies;
    if (!session_id) return errorResponse(res, "Session not found", 401);

    const cartKey = `cart:${session_id}`;
    const cartItems = await redisClient.hgetall(cartKey);

    if (!cartItems || Object.keys(cartItems).length === 0) {
      return successResponse(res, {}, "Cart is empty", 200); // Return an empty object if the cart is empty
    }

    const cartData = {};
    await Promise.all(
      Object.keys(cartItems).map(async (menuId) => {
        const menuItem = await Menu.findByPk(menuId);
        if (menuItem) {
          cartData[menuItem.id] = {
            id: menuItem.id,
            name: menuItem.name,
            description: menuItem.description,
            price: menuItem.price,
            category: menuItem.category,
            admin_id: menuItem.admin_id,
            quantity: parseInt(cartItems[menuId]), 
          };
        }
      })
    );

    return successResponse(res, cartData, "Cart items fetched successfully", 200);
  } catch (error) {
    return errorResponse(res, "Error fetching cart", 500, { message: error.message, stack: error.stack });
  }
};


module.exports = { updateCart, getCart };
