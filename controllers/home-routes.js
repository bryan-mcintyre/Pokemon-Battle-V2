const router = require('express').Router();
const {Pokemon, PokemonStats} = require('../models');

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
router.get('/backpack', async (req, res) => {
    res.render('backpack');
});
//Store route
router.get('/store', async (req, res) => {
    res.render('store');
});
// Login route
router.get('/login', (req, res) => {
    // If the user is already logged in, redirect to the homepage
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    // Otherwise, render the 'login' template
    res.render('login');
});











module.exports = router;
