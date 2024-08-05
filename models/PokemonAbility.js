const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class PokemonAbility extends Model { }

PokemonAbility.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        pokemon_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'pokemon',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        ability_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ability',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'pokemon_ability',
    }
);

module.exports = PokemonAbility;
