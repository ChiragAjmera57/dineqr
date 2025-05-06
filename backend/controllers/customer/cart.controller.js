const { errorResponse, successResponse } = require("../../utils/responseGenerator");
const {  Menu } = require("../../models");
const { redisClient } = require("../../config/redisConfig");

const updateCart = async (req, res) => {
  try {
    const { session_id } = req?.cookies || req?.session;
    const { updatedCartData } = req.body;

    if (!session_id) return errorResponse(res, "Session not found", 401);
    console.log("updatedCartData====backend", updatedCartData);
    const cartKey = `cart:${session_id}`;

    for (const menuId in updatedCartData) {
      const { quantity } = updatedCartData[menuId];
      console.log("menuId", menuId);
      console.log("quantity", quantity);
      if (quantity <= 0) {
        // Remove the item from the cart if quantity is 0 or less
        await redisClient.hdel(cartKey, menuId);
      } else {
        // Update the item quantity in the cart
        await redisClient.hset(cartKey, menuId, quantity);
      }
    }

    return successResponse(res, null, "Cart updated successfully", 200);
  } catch (error) {
    return errorResponse(res, "Error updating cart", 500, { message: error.message, stack: error.stack });
  }
};


const getCart = async (req, res) => {
  try {
    const sessionId = req.cookies.session_id || req.session_id;
    // console.log("request object at getCArt",req)
    if (!sessionId) return errorResponse(res, "Session not found", 401);

    const cartKey = `cart:${sessionId}`;
    const cartItems = await redisClient.hgetall(cartKey);

    if (!cartItems || Object.keys(cartItems).length === 0) {
      return successResponse(res, {}, "Cart is empty", 200); 
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
