const router = require('express').Router();
// Import the routes. This is how we make our routes modular.
const userRoutes = require('./userRoutes');
const pokemonRoutes = require('./pokemonRoutes');
const walletRoutes = require('./walletRoutes');
const starterRotes = require('./starterRoutes');
const battleRoutes = require('./battleRoutes')

// When a request is made to the /users or /projects path, it will be directed to the index.js in the /users or /projects folder.
router.use('/users', userRoutes);
router.use('/pokemon', pokemonRoutes);
router.use('/wallet', walletRoutes);
router.use('/starter', starterRotes);
router.use('/battle', battleRoutes);


module.exports = router;
