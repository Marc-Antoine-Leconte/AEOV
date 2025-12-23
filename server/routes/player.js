var express = require('express');
const { validatePlayer } = require('../middleware/playerValidation');
const { getPlayersByName, createPlayer, authenticatePlayer, updatePlayerTokenByServer } = require('../controllers/playerController');
const { getPrivatePlayerData } = require('../tool/dataFormatHelper');

var router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');

/* POST new player */
router.post('/create', validatePlayer, async function (req, res) {
    console.log('NEW PLAYER req.body => ', req.body)

    // Verify if player already exists
    const existingPlayer = await getPlayersByName({ body: { name: req.body.name } }, res, false);
    if (existingPlayer) {
        return res.status(409).json({ error: 'Player already exists' });
    }

    // Player creation
    const createdPlayer = await createPlayer(req, res, false);

    // Token generation

    // const accessToken = jwt.sign(
    //     { name: req.body.name },
    //     process.env.ACCESS_TOKEN_SECRET,
    //     { algorithm: process.env.JWT_ALGORITHM, expiresIn: '1h' }
    // );

    const refreshToken = jwt.sign(
        { name: req.body.name, playerId: createdPlayer.id },
        process.env.REFRESH_TOKEN_SECRET,
        { algorithm: process.env.JWT_ALGORITHM, expiresIn: '1d' }
    );
    //req.accessToken = accessToken;
    req.refreshToken = refreshToken;

    // Token storage
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 24 * 60 * 60 * 1000 });
    updatePlayerTokenByServer({ body: { refreshToken: req.refreshToken, id: createdPlayer.id } }, res, false);

    res.status(201).json(getPrivatePlayerData(createdPlayer, null));
});

/* POST authenticate player */
router.post('/authenticate', validatePlayer, async function (req, res) {
    console.log('AUTHENTICATE PLAYER req.body => ', req.body)

    // Authentication
    const authenticatedUser = await authenticatePlayer(req, res, false);

    if (!authenticatedUser) {
        res.status(404).json({
            statusCode: 404,
            message: "Player not found"
        });
    }

    // Token generation
    const refreshToken = jwt.sign(
        { name: req.body.name, playerId: authenticatedUser.id },
        process.env.REFRESH_TOKEN_SECRET,
        { algorithm: process.env.JWT_ALGORITHM, expiresIn: '1d' }
    );

    // Token storage
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 24 * 60 * 60 * 1000 });
    await updatePlayerTokenByServer({ body: { refreshToken: req.refreshToken, id: authenticatedUser.id } }, res, false);

    res.status(200).json(getPrivatePlayerData(authenticatedUser, null));
});

router.get('/logout', async function (req, res) {
    console.log('LOGOUT PLAYER')

    // Clear cookies
    res.clearCookie('refreshToken');
    res.status(200).json({});
});

module.exports = router;
