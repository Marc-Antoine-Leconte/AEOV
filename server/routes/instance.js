var express = require('express');
var router = express.Router();
const { getAllInstances, createInstance } = require('../controllers/instanceController');
const { validateInstance } = require('../middleware/instanceValidation');

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
    console.log('req => ', req)
    await createInstance(req, res);
});

module.exports = router;
