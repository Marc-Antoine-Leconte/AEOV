var express = require('express');
const { getPlayerById } = require('../controllers/playerController');
const { getInstancePlayerByPlayerAndInstance, updateInstancePlayer, getInstancePlayersByInstanceId } = require('../controllers/instancePlayerController');
const { getInstanceById, updateInstance } = require('../controllers/instanceController');
var router = express.Router();

/* GET render game board page. */
router.get('/', async function(req, res, next) {
    console.log('# Rendering gameBoard page');
  res.render('gameBoard', { title: 'Game Board' });
});

/* POST set Player ready to play. */
router.post('/readyToPlay', async function(req, res, next) {
  const { civilization, color, instanceId, playerId } = req.body;
  console.log('# Player join game');

  const player = await getPlayerById(req, res, false);
  if (!player) {
      console.log('Player not found');
      return res.status(404).json({
          statusCode: 404,
          message: "Player not found"
      });
  }

  const playerInstance = await getInstancePlayerByPlayerAndInstance(req, res, false);
  if (!playerInstance) {
      console.log('Player not playing in this instance');
      return res.status(404).json({
          statusCode: 404,
          message: "Player not playing in this instance"
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

  if (instance.gameState != 'waiting') {
     console.log('Instance is already started');
      return res.status(404).json({
          statusCode: 404,
          message: "Instance is already started"
      });
  }

  return await updateInstancePlayer(req, res);

});

/* POST start game. */
router.post('/start', async function(req, res, next) {
  console.log('# Owner start game');

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

  if (instance.gameState != 'waiting') {
    console.log('The game is already started');
      return res.status(403).json({
          statusCode: 403,
          message: "The game is already started"
      });
  }

  if (instance.ownerId != player.id) {
      console.log('Only owner can start the game');
      return res.status(403).json({
          statusCode: 403,
          message: "Only owner can start the game"
      });
  }

  const instancePlayers = await getInstancePlayersByInstanceId(req, res, false);

  if (!instancePlayers) {
    console.log('Error while loading players');
      return res.status(403).json({
          statusCode: 403,
          message: "Error while loading players"
      });
  }
  instancePlayers.forEach(element => {
    if (element.civilization == null || element.color == null) {
        console.log('All players must be ready before starting the game');
        return res.status(400).json({
            statusCode: 400,
            message: "All players must be ready before starting the game"
        });
    }
  });

  if (instancePlayers.length < 2) {
    console.log('The game needs at least 2 players to start');
        return res.status(400).json({
            statusCode: 400,
            message: "The game needs at least 2 players to start"
        });
  }

  const randomPlayer = Math.floor(Math.random() * instancePlayers.length);
  const currentPlayerToPlay = instancePlayers[randomPlayer];

  console.log('Game started data', { ...instance.dataValues, gameState: 'inProgress', currentPlayerId: currentPlayerToPlay.playerId });
  const updateStatus = updateInstance(req, res, { ...instance.dataValues, gameState: 'inProgress', currentPlayerId: currentPlayerToPlay.playerId });

  if (!updateStatus) {
      console.log('Not possible to update instance');
      return res.status(400).json({
          statusCode: 400,
          message: "Not possible to update instance"
      });
  }

  return res.status(204).send();
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
