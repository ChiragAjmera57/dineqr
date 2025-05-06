const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/responseGenerator');

// Validation rules
const validateRequest = [
    body('tableId').isNumeric().withMessage('tableid must be a number').notEmpty().withMessage('tableId is required'),
    body("userId")
    .notEmpty()
    .withMessage("Missing 'userId' in request body.")
    .isInt()
    .withMessage("'userId' must be an integer."),
];

const validateRequestForViewOrder = [
    body('tableId').isNumeric().withMessage('tableid must be a number').notEmpty().withMessage('tableId is required'),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, "Validation error", 400,errors.array() )
    }
    next();
};

module.exports = { validateRequest, handleValidationErrors, validateRequestForViewOrder };