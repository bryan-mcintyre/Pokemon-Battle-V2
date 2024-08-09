const router = require('express').Router();
const { Pokemon, PokemonStats, Item, User } = require('../models');
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');
const { fetchRandomPokemon } = require('../utils/pokemonFetch');

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
    const starterPokemon = [];

    for (let i = 0; i < 3; i++) {
      const pokemon = await fetchRandomPokemon();
      starterPokemon.push(pokemon);
    }

    res.render('choose-starter', {
      starters: starterPokemon,
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

router.get('/backpack', (req, res) => {
  res.render('backpack');
});

router.get('/store', (req, res) => {
  res.render('store');
});

module.exports = router;
