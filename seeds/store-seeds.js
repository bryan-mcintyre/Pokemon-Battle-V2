const { User, Store, Item } = require('../models');

const userStoreData = [];


const seedStores = async () => {
    try {
        // get all users
        const userData = await User.findAll();
        // get all items
        const itemData = await Item.findAll();

        // for every user
        for (let i = 0; i < userData.length; i++) {
            // for every item
            for (let x = 0; x < itemData.length; x++) {
                // add user + items in userStoreData
                userStoreData.push({
                    count: 3,
                    user_id: userData[i].id,
                    item_id: itemData[x].id
                })
            }
        }
        await Store.bulkCreate(userStoreData);
    } catch (error) {
        console.error('Error seeding wallets:', error);
    }
};

module.exports = seedStores;