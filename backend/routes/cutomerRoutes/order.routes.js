const { placeOrder, getAllOrderFromSession } = require('../../controllers/customer/order.controller')
const { validateRequest, handleValidationErrors } = require('../../middleware/orderValidator.middleware')
const { validateSession } = require('../../middleware/validateSession.middleware')

const router = require('express').Router()

router.post('/place-order', validateSession, validateRequest, handleValidationErrors,(req, res) => {
    placeOrder(req, res)
})

router.get('/view-order', validateSession, (req,res)=>{
    getAllOrderFromSession(req,res)
})
module.exports = router