const { placeOrder } = require('../../controllers/customer/order.controller')

const router = require('express').Router()

router.post('/', (req, res) => {
    placeOrder(req, res)
})

module.exports = router