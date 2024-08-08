const router = require('express').Router();
const withAuth = require('../utils/auth');
const { User, Pokemon, PokemonStats, PokemonAbility, Ability } = require('../models');

// TODO: Add auth check and save session
router.get('/', withAuth, async (req, res) => {
    try {

        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            raw: true
        })

        const pokemonData = await Pokemon.findAll({
            where: {
                user_id: userData.id
            },
            include: [
                { model: PokemonStats },
                { model: Ability, through: PokemonAbility }
            ],
        });

        const convertPokemonData = pokemonData.map(pokemon => pokemon.get({ plain: true }))

        res.render('battle', {
            gallery: convertPokemonData,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;
