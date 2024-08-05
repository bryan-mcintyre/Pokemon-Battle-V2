const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Item extends Model {
    checkValue(price) {
        return price < this.value;
    }
}

Item.init(
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
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'item',
    }
);

module.exports = Item;
