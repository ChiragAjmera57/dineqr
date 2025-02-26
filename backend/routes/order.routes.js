const { getAllOrder, updateOrder } = require('../controllers/order.controller')

const router = require('express').Router()

router.get('/view-order',(req,res)=>{
    getAllOrder(req,res)
})

router.put('/update-order/:id',(req,res)=>{
    updateOrder(req,res)
})
module.exports = router