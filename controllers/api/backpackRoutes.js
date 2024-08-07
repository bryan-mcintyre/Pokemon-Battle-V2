const router = require('express').Router();
const { Backpack, Item } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const userId = req.session.user_id;

    const backpackItems = await Backpack.findAll({
      where: { user_id: userId },
      include: [Item],
    });

    const items = backpackItems.map(b => ({
      name: b.Item.name,
      count: b.count,
      image: b.Item.image, // Assuming your Item model has an image field
    }));

    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;