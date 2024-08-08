const router = require('express').Router();
const {Wallet} = require('../../models');

router.get('/', async (req,res) => {
try {
    const userId = req.session.user_id;
console.log(userId);
    const wallet = await Wallet.findByPk(1);

res.status(200).json(wallet);


}catch(err) {
    console.log(err);
    res.status(500).json({message: 'Server Error'});
}


});

module.exports = router;