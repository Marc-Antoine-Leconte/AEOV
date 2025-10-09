var express = require('express');
var router = express.Router();
const { getAllInstances } = require('../controllers/instanceController');

const dummyInstances = [{"name": "First one", "id": 1}, {"name": "secondwan", "id": 2}, {"name": "thirdone", "id": 3}];

/* GET dummy instances */
router.get('/dummy', function (req, res) {
    res.json(dummyInstances);
});

/* GET all instances */
router.get('/list', async function (req, res) {
    res.json(await getAllInstances(req, res));
});

module.exports = router;
