const withAuth = (req, res, next) => {
  if (!req.session.logged_in) {
    res.redirect('/login');
  } else if (!req.session.starter_selected && req.path !== '/choose-starter') {
    res.redirect('/choose-starter');
  } else {
    next();
  }
};

const hasPokemon = (req, res, next) => {
  if (req.session.starter_selected) {
    return res.redirect('/dashboard');
  } else {
    next();
  }
}

module.exports = { withAuth, hasPokemon };