const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { User, Pokemon, PokemonStats } = require('../../models');
const { json } = require('sequelize');

// TODO: get battle page
router.get('/:id', async (req, res) => {
    try {

        const userData = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            raw: true
        })
        console.log(userData)

        const pokemonData = await Pokemon.findAll({
            where: {
                user_id: userData.id
            },
            include: [
                PokemonStats
            ]
        });

        const map = pokemonData.map(pokemon => pokemon.get({ plain: true }))
        console.log(pokemonData);

        res.render('battle', {
            gallery: pokemonData,
            // Pass the logged in flag to the template
            // logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;
