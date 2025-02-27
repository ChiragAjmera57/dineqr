const { getAllOrder, updateOrder, getOrderDetails } = require('../controllers/order.controller')
const { getTableStatus, expireSession } = require('../controllers/session.tracker.controller')

const router = require('express').Router()

router.get('/view-order',(req,res)=>{
    getAllOrder(req,res)
})

router.put('/update-order/:id',(req,res)=>{
    updateOrder(req,res)
})

router.get('/order-details/:id',(res,res)=>{
    getOrderDetails(req,res)
})

router.get('/get-active-session',(req,res)=>{
    getTableStatus(req,res)
})

router.put('/deregister-session',(res,res)=>{
    expireSession(req,res)
})
module.exports = router