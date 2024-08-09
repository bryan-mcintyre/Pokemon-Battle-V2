const router = require('express').Router();
const { Backpack, Item, Wallet } = require('../../models');
const { withAuth } = require('../../utils/auth')

// Predefined item prices
const itemPrices = {
  "Potion": 25,
  "Hyper Potion": 100,
  "Revive": 125,
  "Pokeball": 25,
  "Ultra Ball": 300,
  "Master Ball": 1000
};

// Function to fetch item details from the PokeAPI
async function fetchItemFromPokeAPI(itemName) {
  const response = await fetch(`https://pokeapi.co/api/v2/item/${itemName.toLowerCase()}`);
  const data = await response.json();

  return {
      name: data.name,
      description: data.effect_entries[0].effect,
      effect_type: data.effect_entries[0].short_effect,
      effect_amount: 0, 
      price: itemPrices[itemName], 
      image: data.sprites.default,
  };
}

router.post('/purchase', withAuth, async (req, res) => {
  try {
      const { item, quantity } = req.body;
      const user_id = req.session.user_id;

      if (!user_id) {
          return res.status(400).json({ message: 'Not logged in!' });
      }

     
      let itemData = await Item.findOne({ where: { name: item } });

      if (!itemData) {
          const pokeAPIItem = await fetchItemFromPokeAPI(item); 
          pokeAPIItem.price = itemPrices[item]; 
          itemData = await Item.create(pokeAPIItem);
      }

      const itemPrice = itemPrices[item];
      const totalCost = itemPrice * quantity;

      const wallet = await Wallet.findOne({ where: { user_id } });

      if (wallet.value < totalCost) {
          return res.status(400).json({ message: 'Not enough gold' });
      }

      // Deduct the gold from the wallet
      wallet.value -= totalCost;
      await wallet.save();

      // Add items to the backpack
      const backpackItem = await Backpack.findOne({
          where: { user_id, item_id: itemData.id },
      });

      if (backpackItem) {
          backpackItem.count += quantity;
          await backpackItem.save();
      } else {
          await Backpack.create({
              user_id,
              item_id: itemData.id,
              count: quantity,
          });
      }

      res.status(200).json({ message: 'Item purchased successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;