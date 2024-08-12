const router = require('express').Router();
const { withAuth } = require('../../utils/auth');
const BattlePokemon = require('../../utils/BattlePokemon')


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
            });
        }


        userBattlePokemon.attackOpponent(opponentBattlePokemon);


        req.session.battleState.opponentPokemon = opponentBattlePokemon;
        req.session.battleState.userTurn = !req.session.battleState.userTurn;

        console.log(req.session.battleState.opponentPokemon.current_hp)
        if (!opponentBattlePokemon.isAlive()) {
            req.session.battleState.opponentPokemon.alive = false;
            userBattlePokemon.experience += 100;
            const currentLevelData = battleState.levelData.find(data => data.level === userBattlePokemon.level);
            if (userBattlePokemon.experience > currentLevelData.experience) {
                userBattlePokemon.levelUp();
            }
            return res.json({
                userPokemon: userBattlePokemon,
                opponentPokemon: opponentBattlePokemon,
                message: "You win!",
                userTurn: req.session.battleState.userTurn
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

        console.log(req.session.battleState.userPokemon.current_hp)
        if (!userBattlePokemon.isAlive()) {

            req.session.battleState.userPokemon.alive = false;

            userBattlePokemon.experience += 25;
            const currentLevelData = battleState.levelData.find(data => data.level === userBattlePokemon.level + 1);
            if (currentLevelData) {
                if (userBattlePokemon.experience > currentLevelData.experience) {
                    req.session.battleState.userPokemon.current_hp = 0;
                    userBattlePokemon.levelUp();
                }
            }
            return res.json({
                userPokemon: userBattlePokemon,
                opponentPokemon: opponentBattlePokemon,
                message: "You lost!",
                userTurn: req.session.battleState.currentTurn
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