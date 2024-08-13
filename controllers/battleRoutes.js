const router = require('express').Router();
const { withAuth } = require('../utils/auth');
const { fetchRandomPokemon, fetchBalancedPokemonByName } = require('../utils/pokemonFetch')
const { User, Pokemon, PokemonStats, PokemonAbility, Ability, PokemonLevel } = require('../models');
const BattlePokemon = require('../utils/BattlePokemon');


// Fetch and display a random Pokémon when the battle starts
router.get('/', withAuth, async (req, res) => {
    try {
        const randomPokemon = await fetchRandomPokemon();

        // Fetch user Pokémon
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            raw: true
        });

        const pokemonData = await Pokemon.findAll({
            where: { user_id: userData.id },
            include: [
                { model: PokemonStats },
                { model: Ability, through: PokemonAbility }
            ],
        });

        const convertPokemonData = pokemonData.map(pokemon => pokemon.get({ plain: true }));

        res.render('battle', {
            randomPokemon: randomPokemon,
            gallery: convertPokemonData
        });
    } catch (err) {
        console.error('Error fetching random Pokémon:', err);
        res.status(500).json(err);
    }
});

router.get('/startBattle', withAuth, (req, res) => {
    if (req.session.battleState) {
        const { userPokemon, opponentPokemon, levelData } = req.session.battleState;
        res.render('startBattle', {
            userPokemon,
            opponentPokemon,
            levelData
        });
    } else {
        res.redirect('/battle');
    }
});

router.post('/startBattle', withAuth, async (req, res) => {
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
        const opponentPokemon = await fetchBalancedPokemonByName(req.body.opponent_pokemon.name, userPokemon.level);

        // get all data from ability
        const abilitiesData = await Ability.findAll();
        //for take random ability
        const randomIndex = Math.floor(Math.random() * abilitiesData.length);
        // create random ability for enemy
        const randomAbility = abilitiesData[randomIndex];
        // add opponentPokemon random ability
        opponentPokemon.abilities = [randomAbility.dataValues];

        const userTurn = userPokemon.speed >= opponentPokemon.speed;

        //get lvlData
        const levelData = await PokemonLevel.findAll({ raw: true });
        req.session.battleState = {
            userPokemon: userPokemon,
            opponentPokemon: opponentPokemon,
            levelData: levelData,
            userTurn: userTurn
        };
        res.render('startBattle', {
            userPokemon: userPokemon,
            opponentPokemon: opponentPokemon,
            levelData: levelData
        });
    } catch (err) {
        res.status(400).json(err);
    }

});

module.exports = router;