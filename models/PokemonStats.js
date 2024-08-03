const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class PokemonStats extends Model { }

PokemonStats.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        attack: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        current_hp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        max_hp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        defense: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        speed: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        stat_point_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        pokemon_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'pokemon',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
    },
    {
        hooks: {
            afterSave: async (pokemonStats) => {
                if (pokemonStats.current_hp <= 0) {
                    pokemonStats.current_hp = 0;
                    await Pokemon.update(
                        { alive: false },
                        { where: { id: pokemonStats.pokemon_id } }
                    );
                }
            },
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'pokemon_stats',
    }
);

module.exports = PokemonStats;
