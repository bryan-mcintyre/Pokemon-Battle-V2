const sequelize = require('../config/connection');
const seedItems = require('./item-seeds');

const seedAll = async () => {
  await sequelize.sync({ force: true });
  console.log('\n----- DATABASE SYNCED -----\n');
  
  await seedItems();
  console.log('\n----- ITEMS SEEDED -----\n');

  process.exit(0);
};

seedAll();