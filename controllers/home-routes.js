const router = require('express').Router();
const {Pokemon, PokemonStats, Item} = require('../models');
const dashboardRoutes = require('./api/dashboard');
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection')

// Helper function to get a random Pokémon ID
function getRandomPokemonId() {
  return Math.floor(Math.random() * 898) + 1; // PokéAPI has 898 Pokémon as of now
}

// Helper function to capitalize the first letter of a name
function capitalizeFirstLetter(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// Helper function to fetch a Pokémon, with retry logic for 404 errors
async function fetchPokemonWithRetry() {
  let pokemon = null;
  while (!pokemon) {
    const pokemonId = getRandomPokemonId();
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    
    if (response.ok) {
      pokemon = await response.json();
    } else {
      console.warn(`Failed to fetch Pokémon with ID ${pokemonId}: ${response.statusText}`);
    }
  }
  return pokemon;
}

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
    // Fetch three valid Pokémon
    const pokemonPromises = [fetchPokemonWithRetry(), fetchPokemonWithRetry(), fetchPokemonWithRetry()];

    // Wait for all the Pokémon data to be fetched
    const pokemonData = await Promise.all(pokemonPromises);

    // Map the data to a format that your template expects
    const starterPokemon = pokemonData.map(pokemon => ({
      id: pokemon.id,
      name: capitalizeFirstLetter(pokemon.name),  // Capitalize the first letter
      picture: pokemon.sprites.front_default,     // Use the front sprite image
      pokemon_stat: {
        current_hp: pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat,
        max_hp: pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat,
        attack: pokemon.stats.find(stat => stat.stat.name === 'attack').base_stat,
        defense: pokemon.stats.find(stat => stat.stat.name === 'defense').base_stat,
        speed: pokemon.stats.find(stat => stat.stat.name === 'speed').base_stat,
      }
    }));

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