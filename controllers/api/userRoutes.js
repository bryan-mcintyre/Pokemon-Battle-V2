const router = require('express').Router();
const { User, Pokemon } = require('../../models');

// Route to log in an existing user
router.post('/login', async (req, res) => {
  try {

    const userData = await User.findOne({ where: { email: req.body.email.toLowerCase() } });

    if (!userData) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    let hasPokemon = false;
    const pokemonData = await Pokemon.findOne({ where: { user_id: userData.id } }) || null;
    if (pokemonData) {
      hasPokemon = true;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.starter_selected = hasPokemon;
      req.session.user = {
        name: userData.name,
        email: userData.email
      };

      res.status(200).json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

// Route to create a new user (sign up)
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const userData = await User.create({ name, email, password });

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.starter_selected = false;
      req.session.user = {
        name: userData.name,
        email: userData.email
      };

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Route to log out the current user
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;