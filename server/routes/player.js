var express = require('express');
const { validatePlayer } = require('../middleware/playerValidation');
const { getPlayerById, createPlayer, authenticatePlayer } = require('../controllers/playerController');

var router = express.Router();

/* POST new player */
router.post('/create', validatePlayer, async function (req, res) {
    console.log('NEW PLAYER req.body => ', req.body)
    await createPlayer(req, res);
});

/* POST authenticate player */
router.post('/authenticate', validatePlayer, async function (req, res) { 
    console.log('AUTHENTICATE PLAYER req.body => ', req.body)
    await authenticatePlayer(req, res);
});

module.exports = router;
