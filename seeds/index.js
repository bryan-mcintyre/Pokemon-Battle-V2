const sequelize = require('../config/connection');
const seedUsers = require('./user-seeds');
const seedPokemons = require('./pokemon-seeds');
const seedPokemonLevels = require('./level-seeds');
const seedAbilities = require('./ability-seeds');
const seedWallets = require('./wallet-seeds')
const seedItems = require('./item-seeds');

const seedAll = async () => {
  await sequelize.sync({ force: true });
  console.log('\n----- DATABASE SYNCED -----\n');

  await seedUsers();
  console.log('\n----- USERS SEEDED -----\n');

  await seedWallets();
  console.log('\n----- WALLETS SEEDED -----\n');

  await seedPokemonLevels();
  console.log('\n----- LEVELS SEEDED -----\n');

  await seedAbilities();
  console.log('\n----- ABILITIES SEEDED -----\n');

  await seedPokemons();
  console.log('\n----- POKEMONS SEEDED -----\n');

  await seedItems();
  console.log('\n----- ITEMS SEEDED -----\n');

  process.exit(0);
};

seedAll();
