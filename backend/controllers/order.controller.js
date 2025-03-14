const {Order, OrderItem, Menu, DngTable} = require("../models");
const { removeOrderId } = require("../services/redisPublisher");
const { errorResponse, successResponse } = require("../utils/responseGenerator");

const getAllOrder = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            {
              model: Menu,
              as: "menu",
            },
          ],
        },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(orders.count / limit);
    return successResponse(
      res,
      {
        orders: orders.rows || [],
        totalItems: orders.count,
        totalPages,
        currentPage: parseInt(page),
      },
      "Orders fetched successfully",
      200
    );
  } catch (error) {
    return errorResponse(res, { message: error.message, stack: error.stack });
  }
};

const updateOrder = async(req,res) => {
    try {
        const {id} = req.params
        const {status} = req.body
        if(!id || !status){
            return errorResponse(res,"Id & status require to update",400)
        }
        const statusArr = ['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'];
        if(!statusArr.includes(status)){
            return errorResponse(res,"Invalid status",400)
        }
        const updatedOrder = await Order.findByPk(id)
        if(!updatedOrder){
            return errorResponse(res,"No such order found",404)
        }
        updatedOrder.status = status
        await updatedOrder.save()
        
        await removeOrderId(updatedOrder.id)
        return successResponse(res,updatedOrder,"Order updated",200)
    } catch (error) {
        return errorResponse(res,errorData = {message:error.message,stack:error.stack})
    }
}

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      where: { id },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            {
              model: Menu,
              as: "menu",
            },
          ],
        },
        {
          model: DngTable,
          as: "table",
        },
      ],
    });

    if (!order) {
      return errorResponse(res, "Order not found", 404);
    }

    return successResponse(res, order, "Order details fetched successfully", 200);
  } catch (error) {
    return errorResponse(res, { message: error.message, stack: error.stack });
  }
};

module.exports = { getAllOrder, updateOrder, getOrderDetails}
