const { getAllDngTable, addDngTable } = require('../controllers/dngTable.controller')

const router = require('express').Router()

// get all table for that restro
router.get('/',(req,res)=>{
    getAllDngTable(req,res)
})

// add DngTable
router.post('/',(req,res)=>{
    addDngTable(req,res)
})

module.exports = router