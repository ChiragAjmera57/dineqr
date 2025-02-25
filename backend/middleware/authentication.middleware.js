const { errorResponse } = require("../utils/responseGenerator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const access_token_key = process.env.ACCESS_TOKEN_SECRET_KEY;
const refresh_token_key = process.env.REFRESH_TOKEN_SECRET_KEY;

const authentication = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Unauthorized", 401);
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, access_token_key, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return errorResponse(res, "Access token expired", 403); // 403 allows frontend to refresh token
        }
        return errorResponse(res, "Invalid token", 401, err);
      }

      req.admin_id = decoded.sub; 
      next();
    });
  } catch (error) {
    return errorResponse(res, "Something went wrong", 500, { message:error.message, stack:error.stack });
  }
};

module.exports = { authentication };
