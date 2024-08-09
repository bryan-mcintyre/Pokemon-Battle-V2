const router = require('express').Router();
const { Backpack, Item, Wallet } = require('../../models');
const { withAuth } = require('../../utils/auth')

router.post('/purchase', withAuth, async (req, res) => {
  try {
    const { item, quantity } = req.body;
    const user_id = req.session.user_id;

    if (!user_id) {
      return res.status(400).json({ message: 'Not logged in!' });
    }

    // Fetch the item details
    const itemData = await Item.findOne({ where: { name: item } });

    // Fetch the user's wallet
    const wallet = await Wallet.findOne({ where: { user_id: userId } });

    const totalCost = itemData.price * quantity;

    if (wallet.value < totalCost) {
      return res.status(400).json({ message: 'Not enough gold' });
    }

    // Deduct the gold from the wallet
    wallet.value -= totalCost;
    await wallet.save();

    // Add items to the backpack
    const backpackItem = await Backpack.findOne({
      where: { user_id: userId, item_id: itemData.id },
    });

    if (backpackItem) {
      backpackItem.count += quantity;
      await backpackItem.save();
    } else {
      await Backpack.create({
        user_id: userId,
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