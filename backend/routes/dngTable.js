const { getAllDngTable, addDngTable, deleteTable } = require('../controllers/dngTable.controller')

const router = require('express').Router()

// get all table for that restro
router.get('/',(req,res)=>{
    getAllDngTable(req,res)
})

// add DngTable
router.post('/',(req,res)=>{
    addDngTable(req,res)
})

router.delete('/:id',(req,res)=>{
    deleteTable(req,res)
})
module.exports = router