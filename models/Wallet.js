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
            defaultValue: 500,
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
            beforeSave: async (wallet) => {
                // Ensure the wallet's value doesn't go negative
                if (wallet.value < 0) {
                    throw new Error('The value cannot be less than 0');
                }
                
                // Ensures that the wallet has enough funds to cover the purchase
                if (wallet.changed('value') && wallet.value < wallet._previousDataValues.value) {
                    const deduction = wallet._previousDataValues.value - wallet.value;
                    if (deduction > wallet._previousDataValues.value) {
                        throw new Error('There are not enough funds to purchase');
                    }
                }
                
                return wallet;
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
