const router = require('express').Router();
const { User, Pokemon, PokemonStats } = require('../../models');
const withAuth = require('../../utils/auth');
const sequelize = require('../../config/connection');

router.get('/', withAuth, async (req, res) => {
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

router.post('/choose-starter', withAuth, async (req, res) => {
  try {
    const { pokemonId } = req.body;

    const pokemon = await Pokemon.findByPk(pokemonId, {
      include: [PokemonStats]
    });

    if (!pokemon) {
      return res.status(404).json({ message: 'Pokémon not found' });
    }

    await pokemon.update({ user_id: req.session.user_id });

    await User.update(
      { starter_selected: true },
      { where: { id: req.session.user_id } }
    );

    req.session.starter_selected = true;

    res.status(200).json({ message: 'Starter Pokémon chosen successfully' });
  } catch (err) {
    console.error('Error in /choose-starter route:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

module.exports = router;