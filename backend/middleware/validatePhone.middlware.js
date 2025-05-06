const { body, validationResult } = require("express-validator");

const validatePhone = [
  body("userId")
    .notEmpty()
    .withMessage("Missing 'userId' in request body.")
    .isInt()
    .withMessage("'userId' must be an integer."),
  body("phNumber")
    .notEmpty()
    .withMessage("Missing 'phNumber' in request body.")
    .matches(/^\+?[1-9]\d{7,14}$/)
    .withMessage("Invalid phone number format."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

const validateUserIdAndOtp = [
  body("userId")
    .notEmpty()
    .withMessage("Missing 'userId' in request body.")
    .isInt()
    .withMessage("'userId' must be an integer."),
  body("phNumber")
    .notEmpty()
    .withMessage("Missing 'phNumber' in request body.")
    .matches(/^\+?[1-9]\d{7,14}$/)
    .withMessage("Invalid phone number format."),
  body('otp')
    .notEmpty()
    .withMessage("Missing otp!")
    .trim()
    .isLength({ min: 3, max: 3 }).withMessage('OTP must be exactly 3 digits')
    .isNumeric().withMessage('OTP must contain only numbers'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

module.exports = {validatePhone,validateUserIdAndOtp};