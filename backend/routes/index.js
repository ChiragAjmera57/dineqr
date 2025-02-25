const router = require('express').Router();
const { validateRequest, handleValidationErrors } = require('../middleware/orderValidator.middleware');

const { authentication } = require('../middleware/authentication.middleware');

const AdminAuth = require('./Admin.auth')
const DngTable = require('./dngTable')
const MenuRoutes = require('./menu.route')

//customer routes
const customerMenuRoutes = require('./cutomerRoutes/menu.routes')
const customerOrderroutes = require('./cutomerRoutes/order.routes');
const { validateSession, validateAndCreateSession } = require('../middleware/validateSession.middleware');

router.use('/admin',AdminAuth);
router.use('/dngTable', authentication, DngTable)
router.use('/menu',authentication,MenuRoutes)

//customer routes
router.use('/ctmr/menu', validateAndCreateSession, customerMenuRoutes)
router.use('/ctmr/place-order', validateSession, validateRequest, handleValidationErrors, customerOrderroutes)
module.exports = router;