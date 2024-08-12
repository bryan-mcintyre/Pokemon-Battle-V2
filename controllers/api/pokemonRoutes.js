const router = require('express').Router();
const { User, PokemonStats, Pokemon, Backpack, Item } = require('../../models');
const { createPokemonForUser, createAbilityForPokemon, updatePokemonForUser } = require('../../service/pokemonService');
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

router.post('/update', withAuth, async (req, res) => {
    try {
        const pokemonData = req.body.pokemon
        const user = await User.findByPk(req.session.user_id);
        const { pokemon } = await updatePokemonForUser(user.id, pokemonData.id, pokemonData);


        res.status(200).json(pokemon);

    } catch (err) {
        res.status(400).json(err);
    }
});

// Fetches User's Pokemon Team
router.get('/team', withAuth, async (req, res) => {
    try {
        // Fetch the user's Pokémon from the database
        const pokemonData = await Pokemon.findAll({
            where: { user_id: req.session.user_id },
            include: [{ model: PokemonStats }],
        });

        // Serialize data for Handlebars
        const pokemons = pokemonData.map((pokemon) => pokemon.get({ plain: true }));

        // Return json with the user's Pokémon
        res.json(pokemons);

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

//Post item on pokemon stats 
router.post('/item', async (req, res) => {
    try {

        const pokemonData = await Pokemon.findOne({
            where: { user_id: req.session.user_id, id: req.body.id },
            include: [{ model: PokemonStats }],
        });
        //Calls this function from Pokemon Model
        pokemonData.useItem(req.body.effect_type, req.body.effect_amount, req.body.item_id, req.session.user_id);
        const itemData = await Backpack.findOne({ where: { user_id: req.session.user_id } });
        //Calls this function form Backpack Model
        itemData.deleteUsedItem(req.body.item_id);
        res.status(200).json(pokemonData)
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;