const router = require('express').Router();
const { validateRequest, handleValidationErrors } = require('../middleware/orderValidator.middleware');

const { authentication } = require('../middleware/authentication.middleware');

const AdminAuth = require('./Admin.auth')
const DngTable = require('./dngTable')
const MenuRoutes = require('./menu.route')
const OrderRoutes = require('./order.routes')

//customer routes
const customerMenuRoutes = require('./cutomerRoutes/menu.routes')
const customerOrderroutes = require('./cutomerRoutes/order.routes');
const { validateAndCreateSession, joinExistingTable, joinNewTable } = require('../middleware/validateSession.middleware');

router.use('/admin',AdminAuth);
router.use('/dngTable', authentication, DngTable)
router.use('/menu',authentication,MenuRoutes)
router.use('/order',authentication,OrderRoutes)

//customer routes
router.use('/ctmr/menu', validateAndCreateSession, customerMenuRoutes)
router.use('/ctmr/order', customerOrderroutes)
router.use('/ctmr/joint-existing-table',joinExistingTable)
router.use('/ctmr/create-table-and-join',joinNewTable)
module.exports = router;