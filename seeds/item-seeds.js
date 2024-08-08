const { Item } = require('../models');

const itemData = [
  {
    name: 'Potion',
    description: 'Heals half HP',
    effect_type: 'heal',
    effect_amount: 50,
    price: 50,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png'
  },
  {
    name: 'Hyper Potion',
    description: 'Heals full HP',
    effect_type: 'heal',
    effect_amount: 100,
    price: 200,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hyper-potion.png'
  },
  {
    name: 'Revive',
    description: 'Heals dead pokemon back to half HP',
    effect_type: 'revive',
    effect_amount: 50,
    price: 150,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png'
  },
  {
    name: 'Pokeball',
    description: '25% chance to catch',
    effect_type: 'catch',
    effect_amount: 25,
    price: 100,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
  },
  {
    name: 'Ultra Ball',
    description: '65% chance to catch',
    effect_type: 'catch',
    effect_amount: 65,
    price: 300,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png'
  },
  {
    name: 'Master Ball',
    description: '100% chance to catch',
    effect_type: 'catch',
    effect_amount: 100,
    price: 500,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png'
  },
];

const seedItems = () => Item.bulkCreate(itemData);

module.exports = seedItems;