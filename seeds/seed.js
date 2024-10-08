const sequelize = require('../config/connection');
const seedUsers = require('./user-seeds');
const seedPokemons = require('./pokemon-seeds');
const seedPokemonLevels = require('./level-seeds');
const seedAbilities = require('./ability-seeds');
const seedItems = require('./item-seeds');
const seedStores = require('./store-seeds');

const seedAll = async () => {
  await sequelize.sync({ force: true });
  console.log('\n----- DATABASE SYNCED -----\n');

  await seedUsers();
  console.log('\n----- USERS SEEDED -----\n');

  await seedPokemonLevels();
  console.log('\n----- LEVELS SEEDED -----\n');

  await seedAbilities();
  console.log('\n----- ABILITIES SEEDED -----\n');

  await seedPokemons();
  console.log('\n----- POKEMONS SEEDED -----\n');

  await seedItems();
  console.log('\n----- ITEMS SEEDED -----\n');

  await seedStores();
  console.log('\n----- STORES SEEDED -----\n');

  process.exit(0);
};

seedAll();
