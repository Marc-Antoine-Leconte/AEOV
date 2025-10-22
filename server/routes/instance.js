var express = require('express');
var router = express.Router();

const { validateInstance } = require('../middleware/instanceValidation');

const { getAllAvailableInstances, createInstance, getInstanceById, getAllInstances } = require('../controllers/instanceController');
const { getPlayerById } = require('../controllers/playerController');
const { createInstancePlayer, getCountInstancePlayersByInstanceId, getInstancePlayerByPlayerAndInstance, getInstancePlayersByPlayerId } = require('../controllers/instancePlayerController');

/* GET all instances */
router.get('/list', async function (req, res) {
    await getAllAvailableInstances(req, res);
});

router.post('/list/user', async function (req, res) {
    const player = await getPlayerById(req, res, false);
    if (!player) {
        console.log('Player not found');
        return res.status(404).json({
            statusCode: 404,
            message: "Player not found"
        });
    }

    const allInstances = await getAllInstances(req, res, false);
    if (!allInstances) {
        console.log('No instances found');
        return res.status(404).json({
            statusCode: 404,
            message: "No instances found"
        });
    }

    const allInstancePlayers = await getInstancePlayersByPlayerId(req, res, false);
    if (!allInstancePlayers) {
        console.log('No instance players found');
        return res.status(404).json({
            statusCode: 404,
            message: "No instance players found"
        });
    }

    const allInstancePlayersMap = allInstancePlayers.reduce(function(map, obj) {
        map[obj.instanceId] = true;
        return map;
    }, {});

    const instancesToDisplay = allInstances.filter(instance => {
        return allInstancePlayersMap[instance.id];
    });

    res.json(instancesToDisplay);
});

/* CREATE a new instances */
router.post('/new', validateInstance, async function (req, res) {
    console.log('NEW INSTANCE req.body => ', req.body)

    createInstance(req, res);
});

/* JOIN a new instances */
router.post('/join', async function (req, res) {
    console.log('JOIN INSTANCE req => ', req.body)

    const player = await getPlayerById(req, res, false);
    if (!player) {
        console.log('Player not found');
        return res.status(404).json({
            statusCode: 404,
            message: "Player not found"
        });
    }

    const instance = await getInstanceById(req, res, false);
    if (!instance) {
        console.log('Instance not found');
        return res.status(404).json({
            statusCode: 404,
            message: "Instance not found"
        });
    }
    
    const instancePlayer = await getInstancePlayerByPlayerAndInstance(req, res, false);
    if (instancePlayer) {
        return res.status(200).send({ ...instancePlayer.dataValues, instanceName: instance.name });
    }

    if (instance.gameState != 'waiting') {
        console.log('Instance is already started');
        return res.status(404).json({
            statusCode: 404,
            message: "Instance is already started"
        });
    }

    const playersCount = await getCountInstancePlayersByInstanceId(req, res, false);
    if (playersCount >= instance.maxPlayers) {
        console.log('Instance is already full');
        return res.status(404).json({
            statusCode: 404,
            message: "Instance is already full"
        });
    }

    return createInstancePlayer(req, res);
});

/* GET instance by InstanceId */
router.get('/', async function (req, res) {
    console.log('# GET instance--- req.query => ', req.query)
   await getInstanceById(req, res, true, true);
});

module.exports = router;
