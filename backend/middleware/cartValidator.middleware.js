const { body, validationResult } = require("express-validator");
const { errorResponse } = require("../utils/responseGenerator");

const validateCartItem = [
  body("tableId")
    .isInt({ min: 1 })
    .withMessage("tableId must be a positive integer"),

  body("updatedCartData")
    .custom((value) => {
      if (typeof value !== "object" || Array.isArray(value)) {
        throw new Error("updatedCartData must be an object");
      }
      const keys = Object.keys(value);
      if (keys.length === 0) {
        throw new Error("updatedCartData cannot be empty");
      }
      const isValid = keys.every((key) => {
        const item = value[key];
        return typeof item.quantity === "number" && item.quantity >= 0;
      });
      if (!isValid) {
        throw new Error("Each item in updatedCartData must have a valid quantity field");
      }
      return true;
    })
    .withMessage("updatedCartData must be a valid object with valid items"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation error", 400, errors.array());
    }
    next();
  },
];

module.exports = validateCartItem;
