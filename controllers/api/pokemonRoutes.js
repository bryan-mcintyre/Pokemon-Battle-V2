const router = require('express').Router();
const { User } = require('../../models');
const { createPokemonForUser, createAbilityForPokemon } = require('../../service/pokemonService');
const { withAuth } = require('../../utils/auth');


// TODO: post for current user, if he catch or choose pokemon
router.post('/', withAuth, async (req, res) => {
    try {
        const pokemonData = req.body.pokemon
        const user = await User.findByPk(req.session.user_id);
        const { pokemon } = await createPokemonForUser(user.id, pokemonData);
        for (let i = 0; i < pokemonData.abilities.length; i++) {
            await createAbilityForPokemon(pokemon.id, pokemonData.abilities[i])
        }


        res.status(200).json(pokemon);

    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;