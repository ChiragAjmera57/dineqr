const router = require('express').Router();

const AdminAuth = require('./Admin.auth')

router.use('/admin',AdminAuth);

module.exports = router;