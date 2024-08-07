// Import just the router express
const router = require('express').Router();
// Import the index.js from 'api' folder
const apiRoutes = require('./api');
//Import home routes
const homeRoutes = require('./home-routes.js');

router.use('/', homeRoutes);
// When a request is made to the /api route, it will be directed to the index.js in the 'api' folder.
router.use('/api', apiRoutes);

module.exports = router;