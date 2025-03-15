const router = require('express').Router();
const { validateRequest, handleValidationErrors } = require('../middleware/orderValidator.middleware');
const { authentication } = require('../middleware/authentication.middleware');

const AdminAuth = require('./Admin.auth');
const DngTable = require('./dngTable');
const MenuRoutes = require('./menu.route');
const OrderRoutes = require('./order.routes');

// customer routes
const customerMenuRoutes = require('./cutomerRoutes/menu.routes');
const customerOrderroutes = require('./cutomerRoutes/order.routes');
const customerCartRoutes = require('./cutomerRoutes/cart.routes');
const customerJoiningRoute = require('./cutomerRoutes/joinTable.route');
const { validateAndCreateSession} = require('../middleware/validateSession.middleware');

router.use('/admin', AdminAuth);
router.use('/dngTable', authentication, DngTable);
router.use('/menu', authentication, MenuRoutes);
router.use('/order', authentication, OrderRoutes);

// customer routes
router.use('/ctmr/joining', customerJoiningRoute); 
router.use('/ctmr/menu', validateAndCreateSession, customerMenuRoutes);
router.use('/ctmr/cart', validateAndCreateSession, customerCartRoutes);
router.use('/ctmr/order',validateAndCreateSession, customerOrderroutes);

module.exports = router;