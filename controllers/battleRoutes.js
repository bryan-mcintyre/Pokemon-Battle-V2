const router = require('express').Router();
const { withAuth } = require('../utils/auth');
const { User, Pokemon, PokemonStats, PokemonAbility, Ability } = require('../models');
const BattlePokemon = require('../utils/BattlePokemon');

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

        const pokData = await Pokemon.findByPk(3);
        const pokBattle = await pokData.getBattleData();
        console.log(pokBattle)

        const currentPokemon = new BattlePokemon(pokBattle);

        console.log("<-------- BEFORE BALANCE -------->")
        console.log(currentPokemon)
        currentPokemon.balanceStats(5)
        console.log("<---------- AFTER BALANCE ---------->")
        console.log(currentPokemon);


        const convertPokemonData = pokemonData.map(pokemon => pokemon.get({ plain: true }))
        res.render('battle', {
            gallery: convertPokemonData,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;
