const { addPhNumber, verifyAndUpdatePhnumber } = require('../../controllers/customer/phNumber.controller')

const router = require('express').Router()
const {validatePhone,validateUserIdAndOtp} = require('../../middleware/validatePhone.middlware')
router.post('/',validatePhone, (req, res) => {
    addPhNumber(req, res)
})

router.post('/validate-otp', validateUserIdAndOtp, (req,res)=>{
    verifyAndUpdatePhnumber(req,res)
})
module.exports = router