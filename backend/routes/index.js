const router = require('express').Router();

const { authentication } = require('../middleware/authentication.middleware');
const AdminAuth = require('./Admin.auth')
const DngTable = require('./dngTable')
const MenuRoutes = require('./menu.route')

router.use('/admin',AdminAuth);
router.use('/dngTable', authentication, DngTable)
router.use('/menu',authentication,MenuRoutes)

module.exports = router;