const { getAllMenu, addMenu, updateMenu, deleteMenu } = require('../controllers/menu.controller')

const router = require('express').Router()

router.get('/',(req,res)=>{
   getAllMenu(req, res)
})

router.post('/',(req,res)=>{
    addMenu(req, res)
})

router.put('/:id',(req, res)=>{
    updateMenu(req, res)
})

router.delete('/:id',(req,res)=>{
    deleteMenu(req, res)
})
module.exports = router