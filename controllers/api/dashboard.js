const express = require('express');
const router = express.Router();
const { withAuth } = require('../../utils/auth');
const { Pokemon, PokemonStats } = require('../../models');

router.get('/', withAuth, async (req, res) => {
  try {
      // Fetch the user's Pokémon from the database
      const pokemonData = await Pokemon.findAll({
          where: { user_id: req.session.user.id },
          include: [{ model: PokemonStats }],
      });

      // Serialize data for Handlebars
      const pokemons = pokemonData.map((pokemon) => pokemon.get({ plain: true }));

      // Render the dashboard with the user's Pokémon
      res.render('dashboard', {
          user: req.session.user,
          pokemons, 
      });
  } catch (err) {
      console.error(err);
      res.status(500).json(err);
  }
});

module.exports = router;