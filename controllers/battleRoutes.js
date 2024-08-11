const router = require('express').Router();
const { withAuth } = require('../utils/auth');
const { fetchPokemonByName, fetchBalancedPokemonByName } = require('../utils/pokemonFetch')
const { User, Pokemon, PokemonStats, PokemonAbility, Ability, PokemonLevel } = require('../models');

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

router.post('/', withAuth, async (req, res) => {
    try {
        const userPokemonData = await Pokemon.findOne({
            where: {
                id: req.body.pokemon_id,
                user_id: req.session.user_id
            },
            include: [
                { model: PokemonStats },
                { model: Ability, through: PokemonAbility }
            ],
        });
        //get Battledata
        const userPokemon = await userPokemonData.getBattleData();

        // fetch pokemon enemy
        const enemyPokemon = await fetchBalancedPokemonByName(req.body.opponent_pokemon, userPokemon.level);

        // get all data from ability
        const abilitiesData = await Ability.findAll();

        //for take random ability
        const randomIndex = Math.floor(Math.random() * abilitiesData.length);

        // create random ability for enemy
        const randomAbility = abilitiesData[randomIndex];

        // add enemyPokemon random ability
        enemyPokemon.abilities = [randomAbility.dataValues];

        const userTurn = userPokemon.speed >= enemyPokemon.speed;

        //get lvlData
        const levelData = await PokemonLevel.findAll({ raw: true });

        req.session.battleState = {
            userPokemon: userPokemon,
            enemyPokemon: enemyPokemon,
            levelData: levelData,
            userTurn: userTurn
        };

        res.render('start-battle', {
            userPokemon: userPokemon,
            enemyPokemon: enemyPokemon,
            levelData: levelData
        });
    } catch (err) {
        res.status(400).json(err);
    }
})

module.exports = router;