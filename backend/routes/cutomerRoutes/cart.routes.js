const { updateCart, getCart } = require('../../controllers/customer/cart.controller')
const validateCartItem = require('../../middleware/cartValidator.middleware')

const router = require('express').Router()

router.post('/update-to-cart',validateCartItem, (req,res)=>{
    updateCart(req,res)
})

router.post('/get-cart',(req,res)=>{
    getCart(req,res)
})

module.exports = router