const router = require('express').Router();
const { withAuth } = require('../utils/auth');
const { fetchPokemonByName, fetchRandomPokemon } = require('../utils/pokemonFetch')
const BattlePokemon = require('../utils/BattlePokemon');
const { User, Pokemon, PokemonStats, PokemonAbility, Ability, PokemonLevel } = require('../models');

router.get('/', withAuth, async (req, res) => {
    try {
        const randomPokemon = await fetchRandomPokemon(); 
        console.log('Random Pokemon:', randomPokemon); 

        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            raw: true
        });

        const pokemonData = await Pokemon.findAll({
            where: {
                user_id: userData.id
            },
            include: [
                { model: PokemonStats },  // Ensure this is correctly joined
                { model: Ability, through: PokemonAbility }
            ],
        });

        const convertPokemonData = pokemonData.map(pokemon => pokemon.get({ plain: true }));

        res.render('start-battle', {
            gallery: convertPokemonData,
            randomPokemon: randomPokemon, 
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/start', withAuth, async (req, res) => {
    try {
        const { pokemon_id, opponent_pokemon } = req.body;

        // Detailed logging
        console.log('Received data:', req.body);

        // Fetch the selected user Pokémon from the database
        const userPokemonData = await Pokemon.findOne({
            where: {
                id: pokemon_id,
                user_id: req.session.user_id,
            },
            include: [
                { model: PokemonStats },  // Ensure stats are included
                { model: Ability, through: PokemonAbility },
            ],
        });

        if (!userPokemonData) {
            throw new Error('User Pokémon not found.');
        }

        // Create BattlePokemon instances
        const userPokemon = new BattlePokemon(userPokemonData.get({ plain: true }));
        console.log('User Pokémon:', userPokemon);

        // Use opponent_pokemon directly as it's passed from the previous view
        const opponentPokemonData = opponent_pokemon; 
        const opponentPokemon = new BattlePokemon(opponentPokemonData);
        console.log('Opponent Pokémon:', opponentPokemon);

        // Balance opponent Pokémon stats based on user Pokémon level
        opponentPokemon.balanceStats(userPokemon.level);

        // Render the start-battle view with both Pokémon
        res.render('start-battle', {
            userPokemon: userPokemon,
            opponentPokemon: opponentPokemon,
        });
    } catch (err) {
        console.error('Error in /battle/start:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;