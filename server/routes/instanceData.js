var express = require('express');
var router = express.Router();

const { getInstanceDataById } = require('../controllers/instanceDataController');

/* GET instanceData by InstanceId */
router.get('/', async function (req, res) {
    console.log('# GET instanceData--- req.query => ', req.query)
   await getInstanceDataById(req, res);
});

module.exports = router;