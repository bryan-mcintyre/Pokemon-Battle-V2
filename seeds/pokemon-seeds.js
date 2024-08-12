const { User, Ability } = require('../models');
const { fetchRandomPokemon, } = require('../utils/pokemonFetch');
const { createPokemonForUser, createAbilityForPokemon } = require('../service/pokemonService');

const pokemonData = [];

const seedPokemons = async () => {
    try {
        // get 10 random pokemons
        for (let i = 0; i < 10; i++) {
            const pokemon = await fetchRandomPokemon();
            pokemonData.push(pokemon)
        }

        // get all users from db
        const users = await User.findAll({ limit: 4 });
        if (users.length < 4) {
            throw new Error('Not enough users found');
        }

        const abilities = await Ability.findAll();
        if (abilities.length < 1) {
            throw new Error('Ability not found')
        }


        let index = 0
        // repeat 2 times
        while (index < 6) {
            for (let i = 0; i < users.length; i++) {

                const user = users[i];
                const randomPokemon = pokemonData[Math.floor(Math.random() * pokemonData.length)];

                // create pokemon for user
                const { pokemon, stats } = await createPokemonForUser(user.id, randomPokemon);
                console.log(`\nPokemon ${pokemon.name} created for user ${user.name}\n`);


                if (abilities.length > 0) {
                    const randomAbility = abilities[Math.floor(Math.random() * abilities.length)];
                    const result = await createAbilityForPokemon(pokemon.id, randomAbility.id);
                    console.log(`\nAbility ${result.ability.name} assigned to Pokemon ${pokemon.name}\n`);
                }
            }
            index++;
        }
    } catch (e) {
        console.error(e);
    }
};

module.exports = seedPokemons;