var express = require('express');
var router = express.Router();

const { validateInstance } = require('../middleware/instanceValidation');

const { getAllInstances, createInstance, getInstanceById } = require('../controllers/instanceController');
const { getExtendedInstanceDataById } = require('../controllers/instanceDataController');
const { getPlayerById } = require('../controllers/playerController');
const { createInstancePlayer } = require('../controllers/instancePlayerController');

const dummyInstances = [{"name": "First one", "id": 1}, {"name": "secondwan", "id": 2}, {"name": "thirdone", "id": 3}];

/* GET dummy instances */
router.get('/dummy', function (req, res) {
    res.json(dummyInstances);
});

/* GET all instances */
router.get('/list', async function (req, res) {
   await getAllInstances(req, res);
});

/* CREATE a new instances */
router.post('/new', validateInstance, async function (req, res) {
    console.log('NEW INSTANCE req.body => ', req.body)
    await createInstance(req, res);
});

/* JOIN a new instances */
router.post('/join', async function (req, res) {
    console.log('JOIN INSTANCE req => ', req.body)
    getInstanceById(req, res, false).then(instance => {
        if (instance) {
            getExtendedInstanceDataById({...req, body: { ...req.body, instance } }, res, false).then(instanceData => {
                if (instanceData) {
                   if (instanceData.status != 'waiting') {
                        return res.status(404).json({
                            statusCode: 404,
                            message: "Instance is already started"
                        });
                    }

                    if (instanceData.playersCount >= instanceData.maxPlayers) {
                        return res.status(404).json({
                            statusCode: 404,
                            message: "Instance is already full"
                        });
                    }

                    getPlayerById({ ...req, body: { ...req.body, instanceData }}, res, false).then(player => {
                        if (player) {

                            getInstancePlayerByPlayerAndInstance({ ...req, body: { ...req.body, player }}, res, false).then(instancePlayer => {
                                if (instancePlayer.length == 0) {
                                    createInstancePlayer({ ...req, body: { ...req.body, player }}, res);
                                } else {
                                    res.status(200).send();
                                }
                                return true;
                            });
                        } else {
                            res.status(404).json({
                                statusCode: 404,
                                message: "Player not found"
                            });
                        }
                    });

                } else {
                    res.status(404).json({
                    statusCode: 404,
                    message: "Instance Data not found"
                });
                }
                
            });
        } else {
            res.status(404).json({
                statusCode: 404,
                message: "Instance not found"
            });
        }
    });
});

module.exports = router;
