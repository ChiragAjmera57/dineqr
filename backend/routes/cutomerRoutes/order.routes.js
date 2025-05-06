const { placeOrder, getAllOrderFromSession } = require('../../controllers/customer/order.controller')
const { validateRequest, handleValidationErrors, validateRequestForViewOrder } = require('../../middleware/orderValidator.middleware')

const router = require('express').Router()

router.post('/place-order',  validateRequest, handleValidationErrors,(req, res) => {
    placeOrder(req, res)
})

router.post('/view-order',  validateRequestForViewOrder, handleValidationErrors, (req,res)=>{
    getAllOrderFromSession(req,res)
})
module.exports = router