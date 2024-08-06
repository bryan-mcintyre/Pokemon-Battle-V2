const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const PokemonLevel = require('./PokemonLevel');

class Pokemon extends Model { }

Pokemon.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        picture: {
            type: DataTypes.TEXT,
        },
        alive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        favorite: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
            defaultValue: 1,
        },
        experience: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            },
            defaultValue: 0,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        pokemon_level_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'pokemon_level',
                key: 'id',
            }
        },
    },
    {
        hooks: {
            beforeSave: async (pokemon) => {

                // get max lvl from pokemonLevel model
                const maxLevel = await PokemonLevel.max('level');

                // get current level pokemon
                const currentLevel = pokemon.level;

                // check current lvl >= max level
                if (currentLevel >= maxLevel) {

                    // if yes, then pokemon.exp = max value experience
                    const levelData = await PokemonLevel.findOne({ where: { level: currentLevel } });
                    pokemon.experience = levelData.experience;
                    pokemon.pokemon_level_id = maxLevel.id;
                    return;
                }

                // get next level from pokemon lvl
                const nextLevel = await PokemonLevel.findOne({
                    where: {
                        level: currentLevel + 1,
                    },
                });

                // check we have nextLevel and experience pokemon > nextLevel experience
                if (nextLevel && pokemon.experience >= nextLevel.experience) {

                    pokemon.level = nextLevel.level;
                    pokemon.pokemon_level_id = nextLevel.id;
                    if (pokemon.level === maxLevel) {
                        pokemon.pokemon_level_id = nextLevel.id;
                        pokemon.experience = nextLevel.experience;
                    }
                }
            },
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'pokemon',
    }
);

module.exports = Pokemon;
