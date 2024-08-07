const { Ability } = require('../models');

const abilityData = [
    {
        name: 'Increase Attack',
        description: 'Increases the Pokemon\'s attack by 10 units.',
        effect_type: 'attack',
        effect_amount: 10,
    },
    {
        name: 'Increase Defense',
        description: 'Increases the Pokemon\'s defense by 10 units.',
        effect_type: 'defense',
        effect_amount: 10,
    },
    {
        name: 'Heal',
        description: 'Restores 50 health points to the Pokémon.',
        effect_type: 'heal',
        effect_amount: 50,
    },
];

const seedAbilities = async () => {
    try {
        await Ability.bulkCreate(abilityData);
    } catch (error) {
        console.error('Error seeding abilities:', error);
    }
};

module.exports = seedAbilities;
