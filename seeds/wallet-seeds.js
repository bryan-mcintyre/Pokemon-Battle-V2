const { Wallet } = require('../models');

const walletData = [
    {
        value: 500,
        user_id: 1,
    },
    {
        value: 500,
        user_id: 2,
    },
    {
        value: 500,
        user_id: 3,
    },
    {
        value: 500,
        user_id: 4,
    },
];

const seedWallets = async () => {
    try {
        await Wallet.bulkCreate(walletData);
    } catch (error) {
        console.error('Error seeding wallets:', error);
    }
};

module.exports = seedWallets;
