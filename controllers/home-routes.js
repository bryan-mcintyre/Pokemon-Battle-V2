const router = require('express').Router();

router.get('/', (req,res) =>{
    console.log("TEXT")
    res.render('home');
} );

module.exports = router;