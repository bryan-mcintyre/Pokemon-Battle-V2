const express = require('express');
const router = express.Router();
const withAuth = require('../../utils/auth'); 

router.get('/', withAuth, (req, res) => {
  res.render('dashboard', {
    user: req.session.user 
  });
});

module.exports = router;