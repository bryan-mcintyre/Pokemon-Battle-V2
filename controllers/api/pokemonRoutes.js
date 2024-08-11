const router = require('express').Router();
// Import the User model from the models folder
const { User, PokemonStats, Pokemon, Backpack, Item} = require('../../models');
const { createPokemonForUser } = require('../../service/pokemonService');
const { fetchRandomPokemon } = require('../../utils/pokemonFetch');


// TODO: post for current user, if he catch or choose pokemon
router.post('/', async (req, res) => {
    try {
        const pokemon = await fetchRandomPokemon();

        const user = await User.findByPk(1);
        const data = await createPokemonForUser(user.id, pokemon);


        res.status(200).json(data);

        //   req.session.save(() => {
        //     req.session.user_id = userData.id;
        //     req.session.logged_in = true;

        //     res.status(200).json(userData);
        //   });
    } catch (err) {
        res.status(400).json(err);
    }
});

// Fetches User's Pokemon Team
router.get('/team', async (req,res) => {
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
router.post('/item', async (req,res) => {
try {
 
    const pokemonData = await Pokemon.findOne({
        where: { user_id: req.session.user_id, id: req.body.id},
        include: [{ model: PokemonStats }],
    });

pokemonData.useItem(req.body.effect, req.body.effect_amount, req.body.item_id,req.session.user_id); //create this function in pokemon model

const itemData = await Backpack.findOne({ where: { user_id: req.session.user_id }});

itemData.deleteUsedItem(req.body.item_id);


}  catch (err) {
    console.error(err);
    res.status(500).json(err);
}
});

module.exports = router;