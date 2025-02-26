const { Order, Menu, OrderItem, sequelize } = require("../../models");
const { setOrderExpiration } = require("../../services/redisPublisher");
const { successResponse, errorResponse } = require("../../utils/responseGenerator");

const placeOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { tableId, data } = req.body;

    const sessionId = req.cookies.session_id;  
    console.log('Session ID:', sessionId);

    if (!sessionId) {
        return errorResponse(res, "Session expired, scan QR again.", 401)
    }
    const newOrder = await Order.create({
      status: "pending",
      table_id: tableId,
      amount: 0,
      session_id: sessionId
    }, { transaction });

    let totalAmount = 0;
    const orderItems = [];

    for (let i of data) {
      const { menuId, quantity } = i;

      if (!menuId || !quantity || quantity <= 0) {
        await transaction.rollback();
        return errorResponse(res, "Invalid menu item data", 400);
      }

      const menu = await Menu.findByPk(menuId);
      if (!menu) {
        await transaction.rollback();
        return errorResponse(res, `Menu item with ID ${menuId} not found`, 404);
      }

      const priceOfItem = menu.price;
      totalAmount += (quantity * priceOfItem);

      orderItems.push({
        menu_id: menuId,
        order_id: newOrder.id,
        quantity,
        price: quantity * priceOfItem
      });
    }

    await OrderItem.bulkCreate(orderItems, { transaction });

    newOrder.amount = totalAmount;
    await newOrder.save({ transaction });

    await transaction.commit();
    await setOrderExpiration(newOrder.id)
    return successResponse(res, { orderId: newOrder.id }, "Order placed", 201);
  } catch (error) {
    await transaction.rollback();
    return errorResponse(res, "Something went wrong", 500, { message: error.message, stack: error.stack });
  }
};

const getAllOrderFromSession = async (req, res) => {
  try {
    const sessionId = req.cookies.session_id;
    console.log('Session ID:', sessionId);
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    if (!sessionId) {
      return errorResponse(res, "Session expired, scan QR again.", 401);
    }

    const orders = await Order.findAndCountAll({
      where: { session_id: sessionId },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Menu,
              as: 'menu'
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    console.log(orders)
    const totalPages = Math.ceil(orders.count/limit)
    return successResponse(res, {
      orders: orders.rows || [],
      totalItems: orders.count,
      totalPages,
      currentPage: parseInt(page),}, "Orders fetched successfully", 200);
  } catch (error) {
    return errorResponse(res, "Something went wrong", 500, { message: error.message, stack: error.stack });
  }
};

module.exports = { placeOrder, getAllOrderFromSession };