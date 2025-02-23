const { login, signup } = require('../controllers/admin.auth.controller');

const router = require('express').Router();

router.get('/login',(req,res)=>{
    login(req,res);
})

router.post('/signup',(req,res)=>{
    signup(req,res)
})

module.exports = router;