const {Menu} = require("../models");
const { successResponse, errorResponse } = require("../utils/responseGenerator");

const getAllMenu = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
  
      const menus = await Menu.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
  
      const totalPages = Math.ceil(menus.count / limit);
      return successResponse(res, {
        menus: menus.rows,
        totalItems: menus.count,
        totalPages,
        currentPage: parseInt(page),
      }, "menus successfully fetched");
    } catch (error) {
      return errorResponse(res, "Something went wrong", 500, { message:error.message, stack:error.stack });
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