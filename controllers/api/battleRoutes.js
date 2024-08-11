const router = require('express').Router();
const { withAuth } = require('../../utils/auth');
const BattlePokemon = require('../../utils/BattlePokemon')

router.post('/user/attack', withAuth, async (req, res) => {
    try {
        const battleState = req.session.battleState;

        if (!battleState.currentTurn) {
            return res.status(400).json({ error: 'Not your turn' });
        }

        const userBattlePokemon = new BattlePokemon(battleState.userPokemon);
        const enemyBattlePokemon = new BattlePokemon(battleState.enemyPokemon);


        userBattlePokemon.attackOpponent(enemyBattlePokemon);

        req.session.battleState.enemyPokemon.current_hp = enemyBattlePokemon.current_hp;
        req.session.battleState.currentTurn = !req.session.battleState.currentTurn;

        if (!enemyBattlePokemon.isAlive()) {
            userBattlePokemon.experience += 100;
            const currentLevelData = battleState.levelData.find(data => data.level === userBattlePokemon.level);
            if (userBattlePokemon.experience > currentLevelData.experience) {
                userBattlePokemon.levelUp();
            }
            return res.json({
                userPokemon: userBattlePokemon.toModelFormat(),
                enemyPokemon: enemyBattlePokemon.toModelFormat(),
                message: "You win!"
            });
        }


        res.json({
            userPokemon: req.session.battleState.userPokemon,
            enemyPokemon: req.session.battleState.enemyPokemon,
            message: "Waiting for opponent's move..."
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/enemy/attack', withAuth, async (req, res) => {
    try {
        const battleState = req.session.battleState;

        if (battleState.currentTurn) {
            return res.status(400).json({ error: 'Not your turn' });
        }

        const userBattlePokemon = new BattlePokemon(battleState.userPokemon);
        const enemyBattlePokemon = new BattlePokemon(battleState.enemyPokemon);


        enemyBattlePokemon.attackOpponent(userBattlePokemon);

        req.session.battleState.userBattlePokemon.current_hp = userBattlePokemon.current_hp;
        req.session.battleState.currentTurn = !req.session.battleState.currentTurn;

        if (!userBattlePokemon.isAlive()) {
            userBattlePokemon.experience += 25;
            const currentLevelData = battleState.levelData.find(data => data.level === userBattlePokemon.level);
            if (userBattlePokemon.experience > currentLevelData.experience) {
                userBattlePokemon.levelUp();
            }
            return res.json({
                userPokemon: userBattlePokemon.toModelFormat(),
                enemyPokemon: enemyBattlePokemon.toModelFormat(),
                message: "You lost!"
            });
        }


        res.json({
            userPokemon: req.session.battleState.userPokemon,
            enemyPokemon: req.session.battleState.enemyPokemon,
            message: "Waiting for opponent's move..."
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;