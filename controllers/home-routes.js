const router = require('express').Router();
const {Pokemon, PokemonStats, Item} = require('../models');
const dashboardRoutes = require('./api/dashboard');
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection')

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('signup');
});

router.use('/dashboard', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      include: [
        {
          model: Pokemon,
          include: [PokemonStats]
        }
      ]
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: req.session.logged_in,
      pokemons: user.pokemons
    });
  } catch (err) {
    console.error('Error in /dashboard route:', err);
    res.status(500).json(err);
  }
});

router.get('/choose-starter', withAuth, async (req, res) => {
  try {
    const starterPokemon = await Pokemon.findAll({
      order: sequelize.random(),
      limit: 3,
      include: [PokemonStats]
    });
    res.render('choose-starter', {
      starters: starterPokemon.map(pokemon => pokemon.get({ plain: true })),
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.error('Error in /choose-starter route:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/battle', (req, res) => {
  res.render('battle');
});

router.get('/backpack', (req, res) => {
  res.render('backpack');
});

router.get('/store', (req, res) => {
  res.render('store');
});

module.exports = router;
