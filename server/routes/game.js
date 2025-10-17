var express = require('express');
const { getPlayerById } = require('../controllers/playerController');
const { getInstancePlayerByPlayerAndInstance, updateInstancePlayer, getInstancePlayersByInstanceId, updateInstancePlayerByServer } = require('../controllers/instancePlayerController');
const { getInstanceById, updateInstance } = require('../controllers/instanceController');
const { getAllActions } = require('../controllers/actionController');
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

router.post('/info', async function(req, res, next) {
  const { playerId, instanceId } = req.body;

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

  const playerInstanceList = await getInstancePlayersByInstanceId(req, res, false);

  var userFound = false;
  var playersData = []
  var id = 0;
  var currentPlayerData = {};

  for (const element of playerInstanceList) {
    if (element.playerId == player.id) {
        userFound = true;
        currentPlayerData = element;
    } 

    const playerData = await getPlayerById({ body: { playerId: element.playerId }}, res, false);

    playersData[id] = {
      playerName: playerData.name,
      civilization: element.civilization,
      color: element.color,
      isOwner: (element.playerId == instance.ownerId),
      isCurrentPlayer: (playerData.id == instance.currentPlayerId)
    };
    id++;
  }

  if (!userFound) {
    console.log('Player is not in this game');
      return res.status(404).json({
          statusCode: 404,
          message: "Player is not in this game"
      });
  }

  return res.status(200).json({
      statusCode: 200,
      message: "Success",
      data: {
          currentPlayer: { ...player.dataValues, ...currentPlayerData.dataValues, password: null },
          instance: { ...instance.dataValues, ownerId: null, currentPlayerId: null },
          players: playersData
      }
  });
});

router.get('/actions', async function(req, res, next) {
  console.log('# Fetching actions');
  return await getAllActions(req, res);
});

const MAX_HOMES_PER_PLAYER = 10;
const MAX_FARM_PER_PLAYER = 5;

/* GET home page. */
router.post('/play', async function(req, res, next) {
  console.log('# Player action');
  const { actions, playerId, instanceId } = req.body;

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

  var instancePlayer = await getInstancePlayerByPlayerAndInstance(req, res, false);
  if (!instancePlayer) {
    console.log('Error while loading players');
      return res.status(403).json({
          statusCode: 403,
          message: "Error while loading players"
      });
  }

  const allActions = await getAllActions(req, res, false);
  if (!allActions) {
    console.log('Error while loading actions');
      return res.status(403).json({
          statusCode: 403,
          message: "Error while loading actions"
      });
  }

  const playerBuildingList = instancePlayer.buildings.replace('[', '').replace(']', '').split(',').reduce((map, item) => {
        const trimmedItem = item.trim();
        const [key, value] = trimmedItem.split(":");
        map[key] = value;
        return map;
    }, {});

  console.log('||||| playerBuildingList => ', playerBuildingList);

  const errorMessages = [];
  for (const actionId of actions) {
    const actionToPlay = allActions.find(action => action.id == actionId);

    console.log('||||| Action to play => ', actionToPlay);

    if (!actionToPlay) {
      return errorMessages.push(`Action not found: ${actionId}`);
    }

    const effects = actionToPlay.effects.replace('[', '').replace(']', '').replace(" ", "").split(",").reduce((map, item) => {
        const trimmedItem = item.trim();
        const [key, value] = trimmedItem.split(":");
        map[key] = value;
        return map;
    }, {});

    const requiredBuildings = actionToPlay.requiredBuildings.replace('[', '').replace(']', '').split(",").reduce((map, item) => {
        const trimmedItem = item.trim();
        const [key, value] = trimmedItem.split(":");
        map[key] = value;
        return map;
    }, {});

    const requiredResources = actionToPlay.requiredResources.replace('[', '').replace(']', '').split(",").reduce((map, item) => {
        const trimmedItem = item.trim();
        const [key, value] = trimmedItem.split(":");
        map[key] = value;
        return map;
    }, {});


    const requirement = { ...requiredBuildings, ...requiredResources };
    console.log('||||| Requirement => ', requirement);
    console.log('||||| Effects => ', effects);


    let tooMuchRequirement = false;
    Object.entries(requirement).forEach(([key, value]) => {
      if (!value || !key || tooMuchRequirement)
        return;

      if (playerBuildingList[key] != null && playerBuildingList[key] >= value) {
        return;
      }

      if (instancePlayer[key] != null && instancePlayer[key] >= value) {
        return;
      }

      tooMuchRequirement = true;
      return;
    });
    
    if (tooMuchRequirement) {
      errorMessages.push(`Not enough requirements for action: ${actionToPlay.name}`);
    } else {
      console.log('||||| requirements OK');

      // Apply effects
      Object.entries(effects).forEach(([key, value]) => {
        if (!value || !key)
          return;

        if (key == "building") {
          if (playerBuildingList[value] == null) {
            playerBuildingList[value] = 1;
          } else {
            playerBuildingList[value] = parseInt(playerBuildingList[value]) + 1;
          }
        } else {
          instancePlayer[key] = (instancePlayer[key] || 0) + parseInt(value);
        }
      });

      // Apply requirements
      Object.entries(requirement).forEach(([key, value]) => {
        if (!value || !key || ['building', 'population', 'tool'].includes(key))
          return;

        instancePlayer[key] = (instancePlayer[key] || 0) - parseInt(value);
      });

      console.log('||||| instancePlayer after effects applied => ', instancePlayer);

    }
  } 

  console.log('Errors found: ', errorMessages);

  if (errorMessages.length > 0) {
    return res.status(400).json({
        statusCode: 400,
        message: "Errors found",
        errors: errorMessages
    });
  }

   buildingString = JSON.stringify(playerBuildingList);
   instancePlayer.buildings = buildingString.replace("{", "[").replace("}", "]").replace(/["']/g, "");
   const updatedUser = await updateInstancePlayerByServer({ body: { ...instancePlayer } }, res);

  return res.status(200).json(updatedUser);
});

module.exports = router;
