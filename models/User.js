const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');
const Wallet = require('./Wallet');

class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

User.init(
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
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [8],
                    msg: 'Password len min 8 characters'
                }
            },
            is: {
                args: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,}$/],
                msg: 'Password must include an uppercase letter, a lowercase letter, a number, and no spaces.',
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'created_at'  // Ensures the correct field name
        },
    },
    {
        // Hooks are used so that if a user is created or updated, the password is encrypted before being stored in the database.
        hooks: {
            beforeCreate: async (newUserData) => {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                newUserData.name = newUserData.name.toLowerCase();
                newUserData.email = newUserData.email.toLowerCase();
                return newUserData;
            },
            beforeUpdate: async (updatedUserData) => {
                newUserData.name = newUserData.name.toLowerCase();
                newUserData.email = newUserData.email.toLowerCase();
                if (updatedUserData.changed('password')) {
                    updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                }
                return updatedUserData;
            },
            afterCreate: async (newUserData) => {
                await Wallet.create({
                    value: 500,
                    user_id: newUserData.id
                })
            }
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user',
    }
);

module.exports = User;
