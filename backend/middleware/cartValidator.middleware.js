const { body, validationResult } = require("express-validator");
const { errorResponse } = require("../utils/responseGenerator");

const validateCartItem = [
  body("tableId")
    .isInt({ min: 1 })
    .withMessage("tableId must be a positive integer"),

  body("updatedCartData")
    .custom((value) => {
      if (typeof value !== "object" || Array.isArray(value)) {
        throw new Error("updatedcartdata must be an object");
      }
      for (const key in value) {
        const item = value[key];
        if (
          
          !item.quantity ||
          typeof item.quantity !== "number" ||
          item.quantity < 0
        ) {
          throw new Error("Each item in updatedcartdata must have valid quantity field");
        }
      }
      return true;
    })
    .withMessage("updatedcartdata must be a valid object with valid items"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation error", 400, errors.array());
    }
    next();
  },
];

module.exports = validateCartItem;
