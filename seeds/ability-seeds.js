const { Ability } = require('../models');

const abilityData = [
    {
        name: 'Increase Attack',
        description: 'Increases the Pokemon\'s attack by 10 units.',
        effect_type: 'attack',
        effect_amount: 10,
        rarity: 'common',
    },
    {
        name: 'Increase Attack',
        description: 'Increases the Pokemon\'s attack by 20 units.',
        effect_type: 'attack',
        effect_amount: 20,
        rarity: 'rare',
    },
    {
        name: 'Increase Attack',
        description: 'Increases the Pokemon\'s attack by 30 units.',
        effect_type: 'attack',
        effect_amount: 30,
        rarity: 'legendary',
    },
    {
        name: 'Increase Defense',
        description: 'Increases the Pokemon\'s defense by 7 units.',
        effect_type: 'defense',
        effect_amount: 7,
        rarity: 'common',
    },
    {
        name: 'Increase Defense',
        description: 'Increases the Pokemon\'s defense by 15 units.',
        effect_type: 'defense',
        effect_amount: 15,
        rarity: 'rare',
    },
    {
        name: 'Increase Defense',
        description: 'Increases the Pokemon\'s defense by 20 units.',
        effect_type: 'defense',
        effect_amount: 20,
        rarity: 'legendary',
    },
    {
        name: 'Increase HP',
        description: 'Increase the Pokemon\'s HP by 30.',
        effect_type: 'hp',
        effect_amount: 30,
        rarity: 'common',
    },
    {
        name: 'Increase HP',
        description: 'Increase the Pokemon\'s HP by 45.',
        effect_type: 'hp',
        effect_amount: 45,
        rarity: 'rare',
    },
    {
        name: 'Increase HP',
        description: 'Increase the Pokemon\'s HP by 60.',
        effect_type: 'hp',
        effect_amount: 60,
        rarity: 'legendary',
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
