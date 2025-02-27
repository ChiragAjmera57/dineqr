const { addToCart, getCart } = require('../../controllers/customer/cart.controller')

const router = require('express').Router()

router.use('/add-to-cart',(req,res)=>{
    addToCart(req,res)
})

router.use('/get-cart',(req,res)=>{
    getCart(req,res)
})

module.exports = router