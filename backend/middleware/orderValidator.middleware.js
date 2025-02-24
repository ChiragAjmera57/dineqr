const { body, validationResult } = require('express-validator');

// Validation rules
const validateRequest = [
    body('data').isArray().withMessage('data must be an array'),
    body('data.*.menuId').isInt().withMessage('menuId must be an integer'),
    body('data.*.quantity').isInt({ min: 1 }).withMessage('quantity must be a positive integer'),

    body('tableId').isString().withMessage('tableid must be a string').notEmpty().withMessage('tableId is required')
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { validateRequest, handleValidationErrors };