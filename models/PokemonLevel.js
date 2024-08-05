const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class PokemonLevel extends Model {
}

PokemonLevel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            unique: true,
            validate: {
                min: 1,
                max: 10,
            },
        },
        experience: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 100,
                max: 5000
            }
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'pokemon_level',
    }
);

module.exports = PokemonLevel;
