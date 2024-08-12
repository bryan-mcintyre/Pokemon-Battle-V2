const router = require('express').Router();
const { withAuth } = require('../../utils/auth');
const BattlePokemon = require('../../utils/BattlePokemon')

router.post('/user/attack', withAuth, async (req, res) => {
    try {
        const battleState = req.session.battleState;

        console.log(0, battleState)
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

        console.log(1, opponentBattlePokemon)
        userBattlePokemon.attackOpponent(opponentBattlePokemon);
        console.log(2, opponentBattlePokemon)

        req.session.battleState.opponentPokemon.current_hp = opponentBattlePokemon.current_hp;
        req.session.battleState.userTurn = !req.session.battleState.userTurn;

        if (!opponentBattlePokemon.isAlive()) {
            userBattlePokemon.experience += 100;
            const currentLevelData = battleState.levelData.find(data => data.level === userBattlePokemon.level);
            if (userBattlePokemon.experience > currentLevelData.experience) {
                userBattlePokemon.levelUp();
            }
            return res.json({
                userPokemon: userBattlePokemon,
                opponentPokemon: opponentBattlePokemon,
                message: "You win!"
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


        req.session.battleState.userPokemon.current_hp = userBattlePokemon.current_hp;
        req.session.battleState.userTurn = !req.session.battleState.userTurn;

        if (!userBattlePokemon.isAlive()) {
            userBattlePokemon.experience += 25;
            const currentLevelData = battleState.levelData.find(data => data.level === userBattlePokemon.level);
            if (userBattlePokemon.experience > currentLevelData.experience) {
                userBattlePokemon.levelUp();
            }
            return res.json({
                userPokemon: userBattlePokemon,
                opponentPokemon: opponentBattlePokemon,
                message: "You lost!"
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