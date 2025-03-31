const { getAllMenu } = require('../../controllers/menu.controller')

const router = require('express').Router()

router.post('/',(req,res)=>{
   getAllMenu(req, res)
})

module.exports = router