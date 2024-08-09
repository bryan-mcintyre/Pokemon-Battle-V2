const router = require('express').Router();
const { Ability } = require('../../models');
const { withAuth, hasPokemon } = require('../../utils/auth');
const sequelize = require('../../config/connection');
const { fetchPokemonByName } = require('../../utils/pokemonFetch');
const { createPokemonForUser, createAbilityForPokemon } = require('../../service/pokemonService');


router.post('/choose-starter', withAuth, hasPokemon, async (req, res) => {
  try {

    // find pokemon by name from API poke
    const pokemonData = await fetchPokemonByName(req.body.name);

    if (!pokemonData) {
      return res.status(404).json({ message: 'Pokémon not found' });
    }

    // get all ability
    const abilityData = await Ability.findAll();
    // find random index
    const randomIndex = Math.floor(Math.random() * abilityData.length)

    // create pokemon for user
    const { pokemon } = await createPokemonForUser(req.session.user_id, pokemonData);

    // create random ability for pokemon
    await createAbilityForPokemon(pokemon.id, abilityData[randomIndex].id)

    // save starter_selected
    req.session.save(() => {
      req.session.starter_selected = true;

      res.status(200).json({ message: 'Starter Pokémon chosen successfully' });
    });

  } catch (err) {
    console.error('Error in /choose-starter route:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

module.exports = router;