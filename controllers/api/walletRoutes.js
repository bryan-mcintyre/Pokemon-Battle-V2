const router = require('express').Router();
const {Wallet, User} = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', withAuth, async (req,res) => {
try {
    const user_id = req.session.user_id;
console.log(req.session.id)
    const wallet = await Wallet.findOne( {
        where: {user_id: user_id}}
    );

res.status(200).json(wallet);

}catch(err) {
    console.log(err);
    res.status(500).json({message: 'Server Error'});
}

});

module.exports = router;