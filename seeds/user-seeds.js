const sequelize = require('../config/connection');
const { User } = require('../models');
const bcrypt = require('bcrypt');

const userData = [
    {
        name: 'Colin',
        email: 'Colin@example.com',
        password: 'Password123!',
    },
    {
        name: 'Bryan',
        email: 'Bryan@example.com',
        password: 'Password123!',
    },
    {
        name: 'Aleksandr',
        email: 'Aleksandr@example.com',
        password: 'Password123!',
    },
    {
        name: 'Leena',
        email: 'Leena@example.com',
        password: 'Password123!',
    }
];

const seedUsers = async () => {
    for (const user of userData) {
        await User.create({
            ...user,
            password: user.password,
        });
    }
};

module.exports = seedUsers;
