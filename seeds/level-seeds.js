const { PokemonLevel } = require('../models');

const pokemonLevelData = [
    { level: 1, experience: 0 },
    { level: 2, experience: 100 },
    { level: 3, experience: 300 },
    { level: 4, experience: 600 },
    { level: 5, experience: 1000 },
    { level: 6, experience: 1500 },
    { level: 7, experience: 2100 },
    { level: 8, experience: 2800 },
    { level: 9, experience: 3600 },
    { level: 10, experience: 4500 },
];

const seedPokemonLevels = async () => {
    try {
        await PokemonLevel.bulkCreate(pokemonLevelData);
    } catch (error) {
        console.error('Error seeding Pokemon levels:', error);
    }
};

module.exports = seedPokemonLevels;