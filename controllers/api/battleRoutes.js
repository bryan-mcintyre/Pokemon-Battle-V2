const router = require('express').Router();
const { withAuth } = require('../../utils/auth');
const BattlePokemon = require('../../utils/BattlePokemon');
const { updatePokemonForUser } = require('../../service/pokemonService');
const { Wallet } = require('../../models');


router.post('/user/attack', withAuth, async (req, res) => {
    try {
        const battleState = req.session.battleState;


        const userBattlePokemon = new BattlePokemon(battleState.userPokemon);
        const opponentBattlePokemon = new BattlePokemon(battleState.opponentPokemon);
        if (!battleState.userTurn) {
            return res.status(400).json({
                error: 'Not your turn',
                userTurn: req.session.battleState.userTurn,
                userPokemon: userBattlePokemon,
                opponentPokemon: opponentBattlePokemon,
                attackOpponent: false
            });
        }


        userBattlePokemon.attackOpponent(opponentBattlePokemon);

        req.session.battleState.opponentPokemon = opponentBattlePokemon;
        req.session.battleState.userTurn = !req.session.battleState.userTurn;

        console.log('Updated Opponent HP:', req.session.battleState.opponentPokemon);

        // check opponent dead
        if (!opponentBattlePokemon.isAlive()) {

            // save turn for view
            const turn = req.session.battleState.userTurn;

            // find next level from levelData or return max level
            const currentLevelData = battleState.levelData.find(data => data.level === userBattlePokemon.level + 1) ||
                battleState.levelData.reduce((max, data) => data.level > max.level ? data : max, { level: -Infinity });

            console.log(currentLevelData)
            //if level less currentLevelData
            if (userBattlePokemon.level < currentLevelData.level) {
                // up exp
                userBattlePokemon.experience += 100;
            }

            // check max level
            if (userBattlePokemon.experience >= currentLevelData.experience && userBattlePokemon.level < currentLevelData.level) {
                userBattlePokemon.levelUp();
            }

            userBattlePokemon.toModelFormat();
            // save data pokemon
            updatePokemonForUser(req.session.user_id, userBattlePokemon.id, userBattlePokemon)

            const wallet = await Wallet.findOne({ where: { user_id: req.session.user_id } })
            console.log(wallet)
            await wallet.increaseValue(150);

            req.session.battleState = null;
            return res.json({
                userPokemon: userBattlePokemon,
                opponentPokemon: opponentBattlePokemon,
                attackOpponent: true,
                message: "You win!",
                userTurn: turn
            });
        }


        res.json({
            userPokemon: req.session.battleState.userPokemon,
            opponentPokemon: req.session.battleState.opponentPokemon,
            userTurn: req.session.battleState.userTurn,
            attackOpponent: true,
            message: "Waiting for opponent's move..."
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/opponent/attack', withAuth, async (req, res) => {
    try {
        const battleState = req.session.battleState;


        const userBattlePokemon = new BattlePokemon(battleState.userPokemon);
        const opponentBattlePokemon = new BattlePokemon(battleState.opponentPokemon);

        if (battleState.userTurn) {
            return res.status(400).json({
                error: 'Not your turn',
                userTurn: req.session.battleState.userTurn,
                userPokemon: userBattlePokemon,
                opponentPokemon: opponentBattlePokemon,
            });
        }

        opponentBattlePokemon.attackOpponent(userBattlePokemon);


        req.session.battleState.userPokemon = userBattlePokemon;
        req.session.battleState.userTurn = !req.session.battleState.userTurn;

        // check userPokemon dead
        if (!userBattlePokemon.isAlive()) {

            // save turn for view
            const turn = req.session.battleState.userTurn;

            // find next level from levelData or return max level
            const currentLevelData = battleState.levelData.find(data => data.level === userBattlePokemon.level + 1) ||
                battleState.levelData.reduce((max, data) => data.level > max.level ? data : max, { level: -Infinity });

            //if level less currentLevelData
            if (userBattlePokemon.level < currentLevelData.level) {
                // up exp
                userBattlePokemon.experience += 25;
            }

            // check max level
            if (userBattlePokemon.experience >= currentLevelData.experience && userBattlePokemon.level < currentLevelData.level) {
                userBattlePokemon.levelUp();
                userBattlePokemon.toModelFormat();
                updatePokemonForUser(req.session.user_id, userBattlePokemon.id, userBattlePokemon)
                userBattlePokemon.current_hp = 0;
            } else {
                userBattlePokemon.toModelFormat();
                updatePokemonForUser(req.session.user_id, userBattlePokemon.id, userBattlePokemon)
            }

            const wallet = await Wallet.findOne({ where: { user_id: req.session.user_id } })
            await wallet.increaseValue(50);

            req.session.battleState = null;
            return res.json({
                userPokemon: userBattlePokemon,
                opponentPokemon: opponentBattlePokemon,
                message: "You lost!",
                userTurn: turn
            });

        }


        res.json({
            userPokemon: req.session.battleState.userPokemon,
            opponentPokemon: req.session.battleState.opponentPokemon,
            userTurn: req.session.battleState.userTurn,
            message: "Waiting for opponent's move..."
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;