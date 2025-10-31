var express = require('express');
const { getPlayerById } = require('../controllers/playerController');
const { getInstancePlayerByPlayerAndInstance, updateInstancePlayer, getInstancePlayersByInstanceId, updateInstancePlayerByServer } = require('../controllers/instancePlayerController');
const { getInstanceById, updateInstance } = require('../controllers/instanceController');
const { getAllActions } = require('../controllers/actionController');
const { createLocation, getLocationsByInstanceId, updateLocationByInstanceAndPoint } = require('../controllers/locationController');
const { stringListToMap, mapToString } = require('../tool/helper');
const { array } = require('joi');
var router = express.Router();

/* GET render game board page. */
router.get('/', async function (req, res, next) {
  console.log('# Rendering gameBoard page');
  res.render('gameBoard', { title: 'Game Board' });
});

/* POST set Player ready to play. */
router.post('/readyToPlay', async function (req, res, next) {
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
router.post('/start', async function (req, res, next) {
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

  const totalPlayers = instancePlayers.length;
  const numberToAttribute = Array.from(Array(totalPlayers).keys()).sort(() => Math.random() - 0.5);
  var playerRotation = {};
  numberToAttribute.forEach((i) => {
    playerRotation[i + 1] = instancePlayers[i].playerId;
  });

  console.log('Player rotation for this game: ', playerRotation);

  const currentPlayerToPlay = playerRotation[1];

  console.log('Game started data', { ...instance.dataValues, gameState: 'inProgress', currentPlayerId: currentPlayerToPlay, playerRotation: JSON.stringify(playerRotation) });
  const updateStatus = updateInstance(req, res, { ...instance.dataValues, gameState: 'inProgress', currentPlayerId: currentPlayerToPlay, playerRotation: JSON.stringify(playerRotation) });

  if (!updateStatus) {
    console.log('Not possible to update instance');
    return res.status(400).json({
      statusCode: 400,
      message: "Not possible to update instance"
    });
  }

  var mapPossibleLocations = {
    pillagerVillage: { name: "Camp de bandits", buildings: "[pillagerVillage:1]" },
    goldMine: { name: "Mine d'or", buildings: "[goldMine:1]" },
    diamondMine: { name: "Mine de diamant", buildings: "[diamondMine:1]" },
    ironMine: { name: "Mine de fer", buildings: "[ironMine:1]" },
    stoneMine: { name: "Mine de pierre", buildings: "[stoneMine:1]" },
    pound: { name: "Cabane de pêcheur", buildings: "[pound:1]" },
    mercenaryVillage: { name: "Camp de mercenaires", buildings: "[mercenaryVillage:1]" },
    woodHut: { name: "Camp de bûcherons", buildings: "[woodHut:1]" },
    diamondForge: { name: "Forge de diamants", buildings: "[diamondForge:1]" },
    fair: { name: "Foire", buildings: "[fair:1]" },
    village: { name: "Village", buildings: "[village:1]" },
  };

  var mandatoryLocations = ["goldMine", "diamondMine", "ironMine", "stoneMine"];
  var uniqueLocations = ["diamondForge"];
  var otherLocations = ["pillagerVillage", "pound", "mercenaryVillage", "woodHut", "fair", "village"];

  var mapLocationTypes = [...uniqueLocations, ...mandatoryLocations]

  while (mapLocationTypes.length < 9) {
    mapLocationTypes.push(otherLocations[Math.floor(Math.random() * otherLocations.length)]);
  }

  for (let i = 0; i < mapLocationTypes.length; i++) {
    const currentLocation = mapPossibleLocations[mapLocationTypes[i]];
    const locationData = {
      name: currentLocation.name,
      type: mapLocationTypes[i],
      ownerId: null,
      pointId: i + 1,
      buildings: currentLocation.buildings,
      instanceId: instance.id,
    }
    const newLocation = createLocation({ body: locationData }, res, false);
  }

  return res.status(204).send();
});

/* POST get game info. */
router.post('/info', async function (req, res, next) {
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

    const playerData = await getPlayerById({ body: { playerId: element.playerId } }, res, false);

    playersData[id] = {
      playerName: playerData.name,
      civilization: element.civilization,
      color: element.color,
      isOwner: (element.playerId == instance.ownerId),
      isCurrentPlayer: (playerData.id == instance.currentPlayerId),
      isUser: (playerData.id == playerId),
      buildings: element.buildings,
      armyPosition: element.armyPosition,
    };
    id++;
  }

  var locationsData = await getLocationsByInstanceId(req, res, false);

  locationsData.forEach(location => {
    location.dataValues.isOwnedByUser = location.ownerId == player.id;
    if (location.ownerId) {
      const ownerPlayer = playerInstanceList.find(p => p.playerId == location.ownerId);
      location.dataValues.ownerColor = ownerPlayer.color;
    } else {
      location.dataValues.ownerColor = "white";
    }

    location.dataValues.ownerId = null;
  });

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
      players: playersData,
      locations: locationsData
    }
  });
});

/* GET all possible actions for a player. */
router.get('/actions', async function (req, res, next) {
  console.log('# Fetching actions');
  return await getAllActions(req, res);
});

/* POST player actions during a turn. */
router.post('/play', async function (req, res, next) {
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

  var allPlayerInstances = await getInstancePlayersByInstanceId(req, res, false);
  if (!allPlayerInstances) {
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

  var allLocations = await getLocationsByInstanceId(req, res, false);
  if (!allLocations) {
    console.log('Error while loading locations');
    return res.status(403).json({
      statusCode: 403,
      message: "Error while loading locations"
    });
  }

  var playerBuildingList = stringListToMap(instancePlayer.buildings);
  allLocations.forEach(location => {
    if (location.ownerId == player.id) {
      const locationBuildings = stringListToMap(location.buildings);
      Object.entries(locationBuildings).forEach(([key, value]) => {
        if (playerBuildingList[key] == null) {
          playerBuildingList[key] = value;
        } else {
          playerBuildingList[key] = parseInt(playerBuildingList[key]) + parseInt(value);
        }
      });
    }
  });

  console.log('||||| playerBuildingList => ', playerBuildingList);

  const errorMessages = [];
  const failureMessages = [];
  for (const rawAction of actions) {
    const actionId = rawAction.actionId;
    const actionParam = rawAction.actionParam;
    const actionToPlay = allActions.find(action => action.id == actionId);

    console.log('||||| Action to play => ', actionToPlay);

    if (!actionToPlay) {
      return errorMessages.push(`Action not found: ${actionId}`);
    }

    const effects = stringListToMap(actionToPlay.effects);
    const requiredBuildings = stringListToMap(actionToPlay.requiredBuildings);
    const requiredResources = stringListToMap(actionToPlay.requiredResources);

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
        if (!value || !key || ['building'].includes(key))
          return;

        instancePlayer[key] = (instancePlayer[key] || 0) - parseInt(value);
      });

      console.log('||||| instancePlayer after effects applied => ', instancePlayer);

      // Apply army movements
      if (actionId === 40) { // If the action is "Move Army"
        var locationClaimed = true;

        if (actionParam != "-1") { // If moving to an other place than home
          var locationId = '';
          var attackOnPlayerBase = false;

          if (actionParam.startsWith("#")) { // Attacking an other player base
            locationId = parseInt(actionParam.replace("#", ""));
            attackOnPlayerBase = true;
          } else {
            locationId = parseInt(actionParam);
          }

          const contestedLocation = allLocations[actionParam];
          const contestant = allPlayerInstances.find(p => {
            if (attackOnPlayerBase) {
              return p.armyPosition == -1 && p.playerId != player.id;
            }
            return p.armyPosition == locationId && p.playerId != player.id;
          });

          var fortificationForce = 0;
          var contestedLocationBuildings = null;

          if (attackOnPlayerBase) {
            contestedLocationBuildings = stringListToMap(contestant.buildings);
          } else {
            contestedLocationBuildings = stringListToMap(contestedLocation.buildings);
          }

          Object.entries(contestedLocationBuildings).forEach(([key, value]) => {
            if (key == 'pillagerVillage' && value != null) {
              fortificationForce += value * 2;
            }
            if (key == 'outpost' && value != null) {
              fortificationForce += value * 2;
            }
            if (key == 'castle' && value != null) {
              fortificationForce += value * 3;
            }
            if (key == 'wall' && value != null) {
              fortificationForce += value * 3;
            }
          });

          const localArmy = contestant?.army || 0;
          const totalDefenseForce = localArmy + fortificationForce;

          // FIGHT
          if (totalDefenseForce >= instancePlayer.army) {
            if (contestant) {
              contestant.army = instancePlayer.army >= contestant.army ? 0 : contestant.army - instancePlayer.army;
            }
            instancePlayer.army = 0;
            locationClaimed = false;
            failureMessages.push(`Defensive army (${localArmy}) and fortifications (${fortificationForce}) are too strong: ${actionToPlay.name}`);
          } else {
            instancePlayer.army = instancePlayer.army - localArmy;
            if (contestant) {
              contestant.army = 0;
            }
          }

          if (contestant) { // Update contestant army after fight
            allPlayerInstances.forEach((element, id) => {
              if (element.playerId == contestant.playerId) {
                allPlayerInstances[id].army = contestant.army;
                return;
              }
            });
          }

          if (!attackOnPlayerBase && instancePlayer.army <= 0) {
            locationClaimed = false
            failureMessages.push(`Not enough troops to claim the location: ${actionToPlay.name}`);
          }

          if (!attackOnPlayerBase && locationClaimed && contestedLocation.ownerId != player.id) {
            instancePlayer.army = instancePlayer.army - 1;
            allLocations[actionParam].ownerId = player.id;
            contestedLocationBuildings['outpost'] = 1;
            contestedLocationBuildings['pillagerVillage'] = null;
            delete contestedLocationBuildings['pillagerVillage'];
            allLocations[actionParam].buildings = mapToString(contestedLocationBuildings);
          } else if (attackOnPlayerBase && locationClaimed) {
            instancePlayer.treasure = instancePlayer.treasure + 5;
          }
        }

        if (!attackOnPlayerBase && locationClaimed) {
          instancePlayer.armyPosition = actionParam;
        }
      }
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

  instancePlayer.buildings = mapToString(playerBuildingList);
  const updatedUser = await updateInstancePlayerByServer({ body: { ...instancePlayer } }, res);

  allPlayerInstances.forEach((element, id) => {
    if (element.playerId != instancePlayer.playerId) {
      updateInstancePlayerByServer({ body: { ...element.dataValues } }, res, false);
    }
  });

  allLocations.forEach((element, id) => {
    updateLocationByInstanceAndPoint({ body: { ...element.dataValues } }, res, false);
  });

  return res.status(200).json({ updatedUser, failureMessages });
});

module.exports = router;
