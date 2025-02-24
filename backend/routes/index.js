const router = require('express').Router();

const { authentication } = require('../middleware/authentication.middleware');
const AdminAuth = require('./Admin.auth')
const DngTable = require('./dngTable')

router.use('/admin',AdminAuth);
router.use('/dngTable', authentication, DngTable)


module.exports = router;