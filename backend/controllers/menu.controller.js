const {Menu, Session, DngTable} = require("../models");
const { successResponse, errorResponse } = require("../utils/responseGenerator");

const getAllMenu = async (req, res) => {
  try {
    console.log("Reached getAllMenu function...");

    const session_id = req.session?.session_id || req.cookies.session_id ; // Safely access session_id
    console.log("Session ID:", session_id);

    if (!session_id) {
      console.error("Session not found. Please scan the QR code again.");
      return errorResponse(res, "Session not found. Please scan the QR code again.", 401);
    }

    console.log("Fetching session details...");
    const session = await Session.findOne({
      where: { session_id },
      include: [
        {
          model: DngTable,
          as: "table",
        },
      ],
    });

    if (!session || !session.table) {
      console.error("Invalid session or table not found.");
      return errorResponse(res, "Invalid session or table not found.", 404);
    }

    const admin_id = session.table.admin_id;
    console.log("Admin ID (restaurant ID):", admin_id);

    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    console.log(`Pagination details - Page: ${page}, Limit: ${limit}, Offset: ${offset}`);

    console.log("Fetching menu items...");
    const menus = await Menu.findAndCountAll({
      where: { admin_id },
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(menus.count / limit);
    console.log("Menus fetched successfully:");

    return successResponse(
      res,
      {
        menus: menus.rows,
        totalItems: menus.count,
        totalPages,
        currentPage: parseInt(page),
      },
      "Menus successfully fetched"
    );
  } catch (error) {
    console.error("Error occurred in getAllMenu:", error.message);
    console.error("Stack trace:", error.stack);
    return errorResponse(res, "Something went wrong", 500, {
      message: error.message,
      stack: error.stack,
    });
  }
};

const addMenu =  async(req,res) => {
    try {
        
        const {name,description, price, category} = req.body
        const {admin_id} = req
        if(!name || !admin_id || !description || !price || !category){
            return errorResponse(res,"All fields are required",400)
        }
        const newMenu = await Menu.create({name, admin_id, description, price, category})
        successResponse(res,newMenu,"menu created",201)
    } catch (error) {
        errorResponse(res,"something went wrong",500,{ message:error.message, stack:error.stack })
    }
  }

const updateMenu = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, category } = req.body;
      const { admin_id } = req;
  
      if (!id || !admin_id) {
        return errorResponse(res, "ID and admin_id are required", 400);
      }
  
      const menu = await Menu.findOne({ where: { id, admin_id } });
      if (!menu) {
        return errorResponse(res, "Menu not found or not authorized", 404);
      }
  
      if (name) menu.name = name;
      if (description) menu.description = description;
      if (price) menu.price = price;
      if (category) menu.category = category;
  
      await menu.save();
  
      return successResponse(res, menu, "Menu updated successfully", 200);
    } catch (error) {
      return errorResponse(res, "Something went wrong", 500, { message:error.message, stack:error.stack });
    }
  };

const deleteMenu = async (req, res) => {
    try {
        const {id} = req.params;
        const { admin_id } = req;
        if (!id || !admin_id) {
            return errorResponse(res, "ID and admin_id are required", 400);
          }
        const menu = await Menu.findOne({ where: { id, admin_id } });
        if (!menu) {
        return errorResponse(res, "Menu not found or not authorized", 404);
        }
        menu.destroy()
        successResponse(res, menu, "Menu deleted successfully", 200)

    } catch (error) {
        return errorResponse(res, "Something went wrong", 500, { message:error.message, stack:error.stack });
    }
  }

  module.exports = { getAllMenu, addMenu, updateMenu, deleteMenu}