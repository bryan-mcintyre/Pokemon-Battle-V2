const User = require('./User');
const Wallet = require('./Wallet');
const Pokemon = require('./Pokemon');
const PokemonStats = require('./PokemonStats');
const PokemonLevel = require('./PokemonLevel');
const PokemonAbility = require('./PokemonAbility');
const Ability = require('./Ability');

// Defining Relationships

// oneToOne: User - Wallet
User.hasOne(Wallet, {
    foreignKey: 'user_id',
});
Wallet.belongsTo(User, {
    foreignKey: 'user_id',
});

// oneToMany: User - Pokemon
User.hasMany(Pokemon, {
    foreignKey: 'user_id',
});
// manyToOne: Pokemon - User
Pokemon.belongsTo(User, {
    foreignKey: 'user_id',
});

// oneToOne: Pokemon - PokemonStats
Pokemon.hasOne(PokemonStats, {
    foreignKey: 'pokemon_id',
});
// oneToOne: PokemonStats - Pokemon
PokemonStats.belongsTo(Pokemon, {
    foreignKey: 'pokemon_id',
});

// manyToOne: Pokemon - PokemonLevel
Pokemon.belongsTo(PokemonLevel, {
    foreignKey: 'pokemon_level_id',
});
// oneToMany PokemonLevel - Pokemon
PokemonLevel.hasMany(Pokemon, {
    foreignKey: 'pokemon_level_id',
});

// oneToMany: Pokemon - Ability
Pokemon.belongsToMany(Ability, {
    through: PokemonAbility,
    foreignKey: 'pokemon_id',
    otherKey: 'ability_id',
});

// manyToOne Ability - Pokemon
Ability.belongsToMany(Pokemon, {
    through: PokemonAbility,
    foreignKey: 'ability_id',
    otherKey: 'pokemon_id',
});

module.exports = {
    User,
    Wallet,
    Pokemon,
    PokemonStats,
    PokemonLevel,
};
