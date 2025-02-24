const {DngTable} = require("../models");
const { successResponse, errorResponse } = require("../utils/responseGenerator");
const jwt = require('jsonwebtoken')
require("dotenv").config()
const access_token_key = process.env.ACCESS_TOKEN_SECRET_KEY;
const refresh_token_key = process.env.REFRESH_TOKEN_SECRET_KEY;

const getAllDngTable = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
  
      const tables = await DngTable.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
  
      const totalPages = Math.ceil(tables.count / limit);
      console.log("tables",tables)
      return successResponse(res, {
        tables: tables.rows,
        totalItems: tables.count,
        totalPages,
        currentPage: parseInt(page),
      }, "Tables successfully fetched");
    } catch (error) {
      return errorResponse(res, "Something went wrong", 500, error);
    }
  };

const addDngTable =  async(req,res) => {
    try {
        
        const {name} = req.body
        const {admin_id} = req
        if(!name || !admin_id){
            return errorResponse(res,"either not authenticated or name or org not provided",400)
        }
        const newDngTable = await DngTable.create({name,admin_id})
        successResponse(res,newDngTable,"table created",201)
    } catch (error) {
        errorResponse(res,"something went wrong",500,error)
    }
  }


  module.exports = { getAllDngTable, addDngTable}