const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {
    // Checks the password against the encrypted password in the database.
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
                args: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\S).{8,}$/],
                msg: 'Password must include an uppercase letter, a lowercase letter, a number, and no spaces.',
            },
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
    },
    {
        // Hooks are used so that if a user is created or updated, the password is encrypted before being stored in the database.
        hooks: {
            beforeSave: async (newUserData) => {
                if (newUserData.changed('password')) {
                    newUserData.password = await bcrypt.hash(newUserData.password, 10);
                    return newUserData;
                }
            },
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user',
    }
);

module.exports = User;
