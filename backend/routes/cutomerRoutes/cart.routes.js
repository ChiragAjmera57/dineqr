const { addToCart, getCart } = require('../../controllers/customer/cart.controller')
const validateCartItem = require('../../middleware/cartValidator.middleware')

const router = require('express').Router()

router.post('/add-to-cart',validateCartItem, (req,res)=>{
    addToCart(req,res)
})

router.get('/get-cart',(req,res)=>{
    getCart(req,res)
})

module.exports = router