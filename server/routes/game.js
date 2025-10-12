var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
    console.log('# Rendering gameBoard page');
  res.render('gameBoard', { title: 'Game Board' });
});

/* GET home page. */
router.post('/readyToPlay', async function(req, res, next) {
  const { civilization, color, instanceId } = req.body;
  console.log('# Player join game');
});

/* GET home page. */
router.post('/start', async function(req, res, next) {
  console.log('# Player join game');
});

const MAX_HOMES_PER_PLAYER = 10;
const MAX_FARM_PER_PLAYER = 5;

/* GET home page. */
router.post('/play', async function(req, res, next) {
  const { action, data, playerId, instanceId } = req.body;

  const userInfo = {};
  const homeCount = 0;
  const farmCount = 0;

  if (action === "build") {
    console.log('# Player build');
  }
  console.log('# Player join game');
});

module.exports = router;
