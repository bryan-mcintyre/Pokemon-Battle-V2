const router = require('express').Router();
const apiRoutes = require('./api');
const battleRoutes = require('./battleRoutes')
const homeRoutes = require('./home-routes.js');
const storeRoutes = require('./api/storeRoutes.js');
const backpackRoutes = require('./api/backpackRoutes.js');
const dashboardRoutes = require('./api/dashboard.js');

router.use('/', homeRoutes);
// When a request is made to the /api route, it will be directed to the index.js in the 'api' folder.
router.use('/api', apiRoutes);
router.use('/battle', battleRoutes);
router.use('/api/store', storeRoutes);
router.use('/api/backpack', backpackRoutes);
router.use('/api/dashboard', dashboardRoutes);

module.exports = router;