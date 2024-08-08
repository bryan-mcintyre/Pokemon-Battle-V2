const router = require('express').Router();
const {Pokemon, PokemonStats, Item} = require('../models');
const dashboardRoutes = require('./api/dashboard');
const withAuth = require('../utils/auth');

// Renders the login page
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/dashboard');
      return;
    }
    res.render('login');
  });
  
  // Renders the signup page
  router.get('/signup', (req, res) => {
    if (req.session.logged_in) {
      res.redirect('/dashboard');
      return;
    }
    res.render('signup');
  });

  router.use('/dashboard', dashboardRoutes);

//Get Home route
router.get('/', (req,res) =>{
    console.log("TEXT")
    res.render('home');
} );

router.get('/battle', async (req, res) => {
    // What info (model and references) do I need to get?
    // attack, hp, 
//     if(req.session.loggedIn) {
//     try {
//         const BlogPostData = await BlogPost.findAll({
//             include: [
//                 {
//                     model: User,
//                     attributes: ['username'],
//                 },
//             ],
//             where: {
//                 user_id: req.session.user_id
//             }
//         });
//         console.log(req.session.user_id)
//         const blogPosts = BlogPostData.map((blogpost) => blogpost.get({ plain: true }));
//        console.log(blogPosts);
     
//         res.render('dashboard', { 
//             blogPosts,
//             loggedIn: req.session.loggedIn
//          });

//     } catch (err) {
//         console.log(err);
//         res.status(500).json(err);
//     } 
// }else{
//     res.redirect("/login");
// }


res.render('battle');
});
//Backpack route
router.get('/backpack', withAuth, async (req, res) => {
    res.render('backpack');
});
//Store route
router.get('/store', withAuth,async (req, res) => {
   
    res.render('store');
});





module.exports = router;
