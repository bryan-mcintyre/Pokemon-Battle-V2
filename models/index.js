const User = require('./User');
const Wallet = require('./Wallet');
const Pokemon = require('./Pokemon');
const PokemonStats = require('./PokemonStats');
const PokemonLevel = require('./PokemonLevel');

// Defining Relationships

// oneToOne: User - Wallet
User.hasOne(Wallet, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});
Wallet.belongsTo(User, {
    foreignKey: 'user_id',
});

// oneToMany: User - Pokemon
User.hasMany(Pokemon, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});
Pokemon.belongsTo(User, {
    foreignKey: 'user_id',
});

// oneToOne: Pokemon - PokemonStats
Pokemon.hasOne(PokemonStats, {
    foreignKey: 'pokemon_id',
    onDelete: 'CASCADE',
});
PokemonStats.belongsTo(Pokemon, {
    foreignKey: 'pokemon_id',
});

// oneToOne: Pokemon - PokemonLevel
Pokemon.belongsTo(PokemonLevel, {
    foreignKey: 'pokemon_level_id',
});
PokemonLevel.hasMany(Pokemon, {
    foreignKey: 'pokemon_level_id',
});

module.exports = {
    User,
    Wallet,
    Pokemon,
    PokemonStats,
    PokemonLevel,
};
