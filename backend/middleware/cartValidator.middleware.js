const { body, validationResult } = require("express-validator");
const { errorResponse } = require("../utils/responseGenerator");

const validateCartItem = [
  body("menu_item_id")
    .isInt({ min: 1 })
    .withMessage("menu_item_id must be a positive integer"),

  body("quantity")
    .isInt({ min: 0 })
    .withMessage("quantity must be 0 or greater"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res,"Validation error",400,errors.array()) 
    }
    next();
  },
];

module.exports = validateCartItem;
