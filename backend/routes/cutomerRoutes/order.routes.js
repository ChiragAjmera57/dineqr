const { placeOrder, getAllOrderFromSession } = require('../../controllers/customer/order.controller')
const { validateRequest, handleValidationErrors } = require('../../middleware/orderValidator.middleware')

const router = require('express').Router()

router.post('/place-order',  validateRequest, handleValidationErrors,(req, res) => {
    placeOrder(req, res)
})

router.get('/view-order',  validateRequest, handleValidationErrors, (req,res)=>{
    getAllOrderFromSession(req,res)
})
module.exports = router