const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Wallet extends Model {
    checkValue(price) {
        return price < this.value;
    }
}

Wallet.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        value: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
    },
    {
        hooks: {
            beforeSave: async (newWalletData) => {
                if (newWalletData.value < 0) {
                    throw new Error('The value cannot be less than 0')
                } else if (newWalletData.changed('value') && newWalletData._previousDataValues.value) {
                    throw new Error('There are not enough funds to purchase');
                }
                return newWalletData;
            },
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'wallet',
    }
);

module.exports = Wallet;
