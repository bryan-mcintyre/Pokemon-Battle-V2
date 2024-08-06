const router = require('express').Router();
// Import the User model from the models folder
const { User } = require('../../models');
const { createPokemonForUser } = require('../../service/pokemonService');
const { fetchRandomPokemon } = require('../../utils/pokemonFetch');

// TODO: post for current user, if he catch or choose pokemon
router.post('/', async (req, res) => {
    try {
        const pokemon = await fetchRandomPokemon();

        const user = await User.findByPk(2);

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

module.exports = router;