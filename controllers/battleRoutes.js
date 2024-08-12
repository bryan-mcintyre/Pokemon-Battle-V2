const router = require('express').Router();
const { withAuth } = require('../utils/auth');
const { fetchPokemonByName, fetchRandomPokemon, fetchBalancedPokemonByName } = require('../utils/pokemonFetch')
const { User, Pokemon, PokemonStats, PokemonAbility, Ability, PokemonLevel } = require('../models');

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


// Handle starting the battle with the selected Pokémon
router.post('/startBattle', withAuth, async (req, res) => {
    try {
        const { pokemon_id, opponent_pokemon } = req.body;

        // Fetch the selected user Pokémon from the database
        const userPokemonData = await Pokemon.findOne({
            where: { id: pokemon_id, user_id: req.session.user_id },
            include: [
                { model: PokemonStats },
                { model: Ability, through: PokemonAbility },
            ],
        });

        if (!userPokemonData) {
            throw new Error('User Pokémon not found.');
        }

        // Extract the user's Pokémon level
        const userPokemon = userPokemonData.get({ plain: true });

        // Fetch the opponent Pokémon using the name (unbalanced)
        const opponentPokemonRaw = await fetchPokemonByName(opponent_pokemon.name);

        // Balance the opponent Pokémon stats based on the user's Pokémon level
        const opponentPokemon = await fetchBalancedPokemonByName(opponent_pokemon.name, userPokemon.level);

        // Randomly assign an ability to the opponent Pokémon
        const abilitiesData = await Ability.findAll();
        const randomIndex = Math.floor(Math.random() * abilitiesData.length);
        const randomAbility = abilitiesData[randomIndex];

        // Add the random ability to the opponent Pokémon
        opponentPokemon.abilities = [randomAbility.dataValues];

        // Determine who goes first based on speed
        const userTurn = userPokemon.pokemon_stat.speed >= opponentPokemon.speed;

        // Fetch all level data (for potential future use)
        const levelData = await PokemonLevel.findAll({ raw: true });

        // Store the battle state in the session (for use during the battle)
        req.session.battleState = {
            userPokemon: userPokemon,
            opponentPokemon: opponentPokemon,
            opponentPokemonRaw: opponentPokemonRaw,  // Store raw data for future reference
            levelData: levelData,
            userTurn: userTurn
        };

        // Render the start-battle view with both Pokémon
        res.render('startBattle', {
            userPokemon: userPokemon,
            opponentPokemon: opponentPokemon,
            levelData: levelData,
            userTurn: userTurn
        });
    } catch (err) {
        console.error('Error in /battle/startBattle:', err);
        res.status(500).json(err);
    }
});

module.exports = router;