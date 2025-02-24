const { getAllMenu } = require('../../controllers/menu.controller')

const router = require('express').Router()

router.get('/',(req,res)=>{
   getAllMenu(req, res)
})

module.exports = router