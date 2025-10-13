var express = require('express');
var router = express.Router();

const { validateInstance } = require('../middleware/instanceValidation');

const { getAllInstances, createInstance, getInstanceById } = require('../controllers/instanceController');
//const { getExtendedInstanceDataById } = require('../controllers/instanceDataController');
const { getPlayerById } = require('../controllers/playerController');
const { createInstancePlayer, getCountInstancePlayersByInstanceId, getInstancePlayerByPlayerAndInstance } = require('../controllers/instancePlayerController');

/* GET all instances */
router.get('/list', async function (req, res) {
    await getAllInstances(req, res);
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
        return res.status(200).send(instancePlayer);
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
   await getInstanceById(req, res);
});

module.exports = router;
