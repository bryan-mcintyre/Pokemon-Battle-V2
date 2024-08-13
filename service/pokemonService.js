const { User, Pokemon, PokemonStats, Ability, PokemonAbility, PokemonLevel } = require('../models');

async function createPokemonForUser(userId, pokemonData) {

    try {

        // find user by id
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // create first level for pokemon
        const level = await PokemonLevel.findOne({
            where: { level: pokemonData.level || 1 },
        })

        // save pokemon for user
        const pokemon = await Pokemon.create({
            ...pokemonData,
            user_id: user.id,
            pokemon_level_id: level.id,
        });

        // save stats for pokemon
        const stats = await PokemonStats.create({
            ...pokemonData,
            pokemon_id: pokemon.id,
        });

        return { pokemon, stats };
    } catch (e) {
        throw new Error(e);
    }
}

async function createAbilityForPokemon(pokemonId, abilityId) {

    try {

        const pokemon = await Pokemon.findByPk(pokemonId);
        if (!pokemon) {
            throw new Error('Pokemon not found');
        }

        const ability = await Ability.findByPk(abilityId);
        if (!ability) {
            throw new Error('Ability not found');
        }

        const abilityPokemon = await PokemonAbility.create({
            pokemon_id: pokemon.id,
            ability_id: ability.id,
        })

        return { pokemon, abilityPokemon, ability };
    } catch (e) {
        throw new Error(e);
    }
}

async function updatePokemonForUser(userId, pokemonId, pokemonData) {
    try {
        // find user by id
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // find pokemon user_id and id pokemon
        const pokemon = await Pokemon.findOne({
            where: {
                id: pokemonId,
                user_id: userId // check this pokemon for current user
            }
        });

        if (!pokemon) {
            throw new Error('Pokemon not found or does not belong to this user');
        }

        // find level from db
        const level = await PokemonLevel.findOne({
            where: { level: pokemonData.level || 1 },
        });

        if (!level) {
            throw new Error('Pokemon level not found');
        }

        // update pokemon
        Object.assign(pokemon, pokemonData, { pokemon_level_id: level.id }); //TODO: think about logic
        await pokemon.save();

        // update or create stats for pokemon
        const [stats, created] = await PokemonStats.upsert({
            ...pokemonData,
            pokemon_id: pokemon.id,
        });

        return { pokemon, stats };
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports = {
    createPokemonForUser,
    createAbilityForPokemon,
    updatePokemonForUser
};