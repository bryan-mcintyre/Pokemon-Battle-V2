const router = require('express').Router();
const { Backpack, Item } = require('../../models');

router.get('/', async (req, res) => {
  try {
      const userId = req.session.user_id;

      const backpackItems = await Backpack.findAll({
          where: { user_id: userId },
          include: [{ model: Item }],
      });

      const items = backpackItems.map(b => {
          if (!b.item) {
              console.error(`Item not found for backpack item with ID: ${b.id}`);
              throw new Error('Associated item not found');
          }
          return {
              id: b.id,
              name: b.item.name,
              count: b.count, 
              image: b.item.image,
              effect_type: b.item.effect_type,
              effect_amount: b.item.effect_amount,
          };
      });

      res.status(200).json(items);
  } catch (err) {
      console.error('Error in backpack route:', err.message);
      res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.session.user_id;
    const { quantity } = req.body; // Get the quantity to delete

    const backpackItem = await Backpack.findOne({
      where: {
        id: itemId,
        user_id: userId,
      },
    });

    if (!backpackItem) {
      return res.status(404).json({ message: 'Item not found or not owned by user' });
    }

    if (backpackItem.count <= quantity) {
      // Delete the item if the quantity to delete is equal or greater
      await backpackItem.destroy();
    } else {
      // Otherwise, reduce the count
      backpackItem.count -= quantity;
      await backpackItem.save();
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error deleting item from backpack:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;