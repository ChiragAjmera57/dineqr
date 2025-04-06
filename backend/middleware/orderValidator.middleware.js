const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/responseGenerator');

// Validation rules
const validateRequest = [
    body('tableId').isNumeric().withMessage('tableid must be a number').notEmpty().withMessage('tableId is required')
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, "invalid payload", 400,errors.array() )
    }
    next();
};

module.exports = { validateRequest, handleValidationErrors };