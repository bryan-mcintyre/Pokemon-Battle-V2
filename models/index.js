const User = require('./User');
const Wallet = require('./Wallet');
const Pokemon = require('./Pokemon');
const PokemonStats = require('./PokemonStats');
const PokemonLevel = require('./PokemonLevel');
const PokemonAbility = require('./PokemonAbility');
const Ability = require('./Ability');
const Store = require('./Store');
const Item = require('./Item');
const Backpack = require('./Backpack');

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

// oneToMany: User - Store
User.hasMany(Store, {
    foreignKey: 'user_id',
});
Store.belongsTo(User, {
    foreignKey: 'user_id',
});

// manyToOne: Store - Item
Store.belongsTo(Item, {
    foreignKey: 'item_id',
});
Item.hasMany(Store, {
    foreignKey: 'item_id',
});

// oneToMany: User - Backpack
User.hasMany(Backpack, {
    foreignKey: 'user_id',
});
Backpack.belongsTo(User, {
    foreignKey: 'user_id',
});

// manyToOne: Backpack - Item
Backpack.belongsTo(Item, {
    foreignKey: 'item_id',
});
Item.hasMany(Backpack, {
    foreignKey: 'item_id',
});

module.exports = {
    User,
    Wallet,
    Pokemon,
    PokemonStats,
    PokemonLevel,
    PokemonAbility,
    Ability,
    Store,
    Backpack,
    Item,
};
