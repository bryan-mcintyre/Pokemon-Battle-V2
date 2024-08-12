const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Ability extends Model { }

Ability.init(
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
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        effect_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        effect_amount: {
            type: DataTypes.INTEGER,
        },
         rarity: {
           type: DataTypes.ENUM('common', 'rare', 'legendary'),
           allowNull: false,
            validate: {
              isIn: [['common', 'rare', 'legendary']]
           }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'ability',
    }
);

module.exports = Ability;
