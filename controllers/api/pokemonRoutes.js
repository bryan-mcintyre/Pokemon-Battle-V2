const router = require('express').Router();
const { User, PokemonStats, Pokemon, Backpack, Item, Ability } = require('../../models');
const { createPokemonForUser, createAbilityForPokemon, updatePokemonForUser } = require('../../service/pokemonService');
const { withAuth } = require('../../utils/auth');
const { fetchPokemonByName } = require('../../utils/pokemonFetch');



// Post for current user, if he catch or choose pokemon
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

// After win battle, catchPokemon
router.post('/catch', withAuth, async (req, res) => {
    const catching = 1;
    try {
        if (catching === 1) {
            const pokemonName = req.body.pokemon
            const user = await User.findByPk(req.session.user_id);
            const pokemonData = await fetchPokemonByName(pokemonName);

            const { pokemon } = await createPokemonForUser(user.id, pokemonData);

            const abilitiesData = await Ability.findAll({ raw: true });
            if (abilitiesData) {
                const randomIndex = Math.floor(Math.random() * abilitiesData.length);
                pokemonData.abilities = [abilitiesData[randomIndex]];

                await createAbilityForPokemon(pokemon.id, pokemonData.abilities[0].id)
            }

            res.status(200).json({
                pokemon: pokemon,
                status: true,
                message: `Congratulations! You caught ${pokemon.name}`
            });
        } else {
            res.status(418).json({
                status: true,
                message: `Sorry, he disappeared faster than you could get your pokeball.`
            });
        }
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
        const itemUsed = await pokemonData.useItem(req.body.effect_type, req.body.effect_amount, req.body.item_id, req.session.user_id);
        if (itemUsed.status === true) {
            const itemData = await Backpack.findAll({ where: { user_id: req.session.user_id } });
            //Calls this function form Backpack Model
            const currentItem = itemData.find(item => item.id === req.body.item_id);
            currentItem.deleteUsedItem(req.body.item_id);
            return res.status(200).json({ status: itemUsed.status, message: 'Item Route Works', item: currentItem });
        } else {
            return res.status(200).json({ status: itemUsed.status, message: "Cannot use item on this Pokemon" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;