var express = require('express');
const { getPlayerById } = require('../controllers/playerController');
const { getInstancePlayerByPlayerAndInstance, updateInstancePlayer, getInstancePlayersByInstanceId, updateInstancePlayerByServer, updateInstancePlayerTurnStatus, updateInstancePlayerMarket } = require('../controllers/instancePlayerController');
const { getInstanceById, updateInstance } = require('../controllers/instanceController');
const { getAllActions } = require('../controllers/actionController');
const { getAllBuildings } = require('../controllers/buildingController');
const { createLocation, getLocationsByInstanceId, updateLocationByInstanceAndPoint } = require('../controllers/locationController');
const { stringListToMap, mapToString } = require('../tool/helper');
const { getPublicInstancePlayerData, getPublicInstancePlayerDataList, getPublicInstancePlayerScoreData } = require('../tool/dataFormatHelper');

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

  var mandatoryLocations = ["goldMine", "diamondMine", "ironMine"];
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
  console.log('# Get Game INFO');

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

    if (instance.gameState == 'completed') {
      playersData[id] = getPublicInstancePlayerScoreData({ ...playerData.dataValues, ...element.dataValues }, instance, player);
    } else {
      playersData[id] = getPublicInstancePlayerData({ ...playerData.dataValues, ...element.dataValues }, instance, player);
    }
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

/* POST get players info for the current game */
router.post('/playersInfo', async function (req, res, next) {
  const { playerId, instanceId } = req.body;
  console.log('# Get Game INFO');

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

  for (const element of playerInstanceList) {
    if (element.playerId == player.id) {
      userFound = true;
    }

    const playerData = await getPlayerById({ body: { playerId: element.playerId } }, res, false);

    if (instance.gameState == 'completed') {
      playersData[id] = getPublicInstancePlayerScoreData({ ...playerData.dataValues, ...element.dataValues }, instance, player);
    } else {
      playersData[id] = getPublicInstancePlayerData({ ...playerData.dataValues, ...element.dataValues }, instance, player);
    }
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
    data: playersData
  });
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

  const allBuildings = await getAllBuildings(req, res, false);
  if (!allBuildings) {
    console.log('Error while loading buildings');
    return res.status(403).json({
      statusCode: 403,
      message: "Error while loading buildings"
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
  var virtualBuildingList = { ...playerBuildingList };
  allLocations.forEach(location => {
    if (location.ownerId == player.id) {
      const locationBuildings = stringListToMap(location.buildings);
      Object.entries(locationBuildings).forEach(([key, value]) => {
        if (virtualBuildingList[key] == null) {
          virtualBuildingList[key] = value;
        } else {
          virtualBuildingList[key] = parseInt(virtualBuildingList[key]) + parseInt(value);
        }
      });
    }
  });

  Object.entries(virtualBuildingList).forEach(([key, value]) => {
    const buildingInfo = allBuildings.find(b => b.name == key);
    virtualBuildingList[key] = { ...buildingInfo, level: value };
  });


  console.log('||||| playerBuildingList => ', playerBuildingList);
  console.log('||||| virtualBuildingList => ', virtualBuildingList);

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

    // Check requirements
    let tooMuchRequirement = false;
    Object.entries(requirement).forEach(([key, value]) => {
      if (!value || !key || tooMuchRequirement)
        return;

      console.log('||||| Checking requirement ', key, ' => ', value);
      console.log('||||| virtualBuildingList[key] => ', virtualBuildingList[key]);

      // do not allow to have 0 population
      if (key == "population") {
        if (instancePlayer.population <= value) {
          tooMuchRequirement = true;
          return;
        }
      }

      // do not allow to have 0 maxPopulation
      if (key == "maxPopulation") {
        if (instancePlayer.maxPopulation <= value) {
          tooMuchRequirement = true;
          return;
        }
      }

      if (virtualBuildingList[key] != null
        && virtualBuildingList[key].level != null
        && virtualBuildingList[key].level >= value) {
        return;
      }

      if (instancePlayer[key] != null && instancePlayer[key] >= value) {
        return;
      }

      tooMuchRequirement = true;
      return;
    });

    if (tooMuchRequirement) {
      errorMessages.push(`Not enough resources or buildings for action: ${actionToPlay.name}`);
    } else {
      console.log('||||| requirements OK');

      // Apply effects
      Object.entries(effects).forEach(([key, value]) => {
        if (!value || !key)
          return;
        const trimmedValue = value.trim();
        const trimmedKey = key.trim();

        console.log('||||| Applying effect ', trimmedKey, ' => ', trimmedValue);
        if (trimmedKey == "building") {
          if (!playerBuildingList[trimmedValue]) {
            console.log('||||| Adding building ', trimmedValue);
            playerBuildingList[trimmedValue] = 1;
          } else {
            console.log('||||| upgrading building ', trimmedValue);
            console.log('||||| with value ', parseInt(playerBuildingList[trimmedValue]) + 1);
            playerBuildingList[trimmedValue] = parseInt(playerBuildingList[trimmedValue]) + 1;
          }
        } else {
          instancePlayer[trimmedKey] = (instancePlayer[trimmedKey] || 0) + parseInt(trimmedValue);
        }
      });

      // Apply requirements
      Object.entries(requirement).forEach(([key, value]) => {
        if (!value || !key || ['building'].includes(key))
          return;

        const trimmedValue = value.trim();
        const trimmedKey = key.trim();

        instancePlayer[trimmedKey] = (instancePlayer[trimmedKey] || 0) - parseInt(trimmedValue);
      });

      console.log('||||| instancePlayer after effects applied => ', instancePlayer);

      // Apply army movements
      if (actionId === 40) { // If the action is "Move Army"
        var locationClaimed = true;

        if (actionParam != "-1") { // If moving to an other place than home
          var locationId = '';
          var attackOnPlayerBase = false;

          if (actionParam.startsWith("#")) { // Attacking an other player base
            locationId = parseInt(actionParam.replace("#", "")); // in this case location iD is playerInstance ID
            attackOnPlayerBase = true;
          } else {
            locationId = parseInt(actionParam);
          }

          const contestant = allPlayerInstances.find(p => {
            if (attackOnPlayerBase) {
              return p.id == locationId; // in this case location iD is playerInstance ID
            }
            return p.armyPosition == locationId && p.playerId != player.id;
          });

          const contestedLocation = allLocations[actionParam];
          var fortificationForce = 0;
          var contestedLocationBuildings = null;

          if (attackOnPlayerBase) {
            contestedLocationBuildings = stringListToMap(contestant.buildings);
          } else {
            contestedLocationBuildings = stringListToMap(contestedLocation.buildings);
          }

          Object.entries(contestedLocationBuildings).forEach(([key, value]) => {
            const trimmedKey = key.trim();
            const trimmedValue = value;

            if (trimmedKey == 'pillagerVillage' && trimmedValue != null) {
              fortificationForce += trimmedValue * 2;
            }
            if (trimmedKey == 'outpost' && trimmedValue != null) {
              fortificationForce += trimmedValue * 2;
            }
            if (trimmedKey == 'castle' && trimmedValue != null) {
              fortificationForce += trimmedValue * 3;
            }
            if (trimmedKey == 'wall' && trimmedValue != null) {
              fortificationForce += trimmedValue * 3;
            }
          });

          var localArmy = contestant?.army || 0;
          if (attackOnPlayerBase && contestant.armyPosition != -1) {
            localArmy = 0;
          }

          if (localArmy != 0 && contestant.food < 0) {
            localArmy = localArmy / 2;
          }

          if (instancePlayer.siege > 0) {
            fortificationForce = 0;
            instancePlayer.siege -= 1;
          }

          const totalDefenseForce = localArmy + fortificationForce;

          // FIGHT
          if (totalDefenseForce >= instancePlayer.army) {
            if (contestant) {
              if (!attackOnPlayerBase || contestant.armyPosition == -1) {
                contestant.army = instancePlayer.army >= contestant.army ? 0 : contestant.army - instancePlayer.army;
              }
            }
            instancePlayer.army = 0;
            locationClaimed = false;
            failureMessages.push(`Defensive army (${localArmy}) and fortifications (${fortificationForce}) are too strong: ${actionToPlay.name}`);
          } else {
            instancePlayer.army = instancePlayer.army - localArmy;
            if (contestant) {
              if (!attackOnPlayerBase || contestant.armyPosition == -1) {
                contestant.army = 0;
                contestant.armyPosition = -1;
              }
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
    } else {
      allPlayerInstances[id].army = updatedUser.army;
      allPlayerInstances[id].food = updatedUser.food;
    }
  });

  allLocations.forEach((element, id) => {
    updateLocationByInstanceAndPoint({ body: { ...element.dataValues } }, res, false);
  });

  return res.status(200).json({ updatedUser, failureMessages });
});

/* POST set Player ready to play. */
router.post('/endTurn', async function (req, res, next) {
  const { instanceId, playerId } = req.body;
  console.log('# End of turn');

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

  const allBuildings = await getAllBuildings(req, res, false);
  if (!allBuildings) {
    console.log('Error while loading buildings');
    return res.status(403).json({
      statusCode: 403,
      message: "Error while loading buildings"
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

  await updateInstancePlayerTurnStatus({ ...req, body: { ...req.body, endTurn: true } }, res, false);

  var allPlayerInstances = await getInstancePlayersByInstanceId(req, res, false);

  var somePlayerArePlaying = false;
  allPlayerInstances.forEach(element => {
    if (element.endTurn == false) {
      somePlayerArePlaying = true;
    }
  });

  if (somePlayerArePlaying) {
    console.log('Some player did not finished their turns yet');
    return res.status(200).json({ ok: true });
  }

  // All players have ended their turn, reset for next turn

  // Check for game end
  var gameParameters = JSON.parse(instance.parameters);
  console.log('Game parameters: ', gameParameters);
  var winners = [];
  if (gameParameters.victoryCondition == 'maxPoints') {
    winners = allPlayerInstances.filter(element => element.treasure >= gameParameters.maxPoints);
  } else if (gameParameters.victoryCondition == 'armyHegemony') {
    const standingPlayers = allPlayerInstances.filter(element => element.army > 0 );
    if (standingPlayers.length == 1) {
      winners = standingPlayers;
    }
  }

  if (winners.length > 0) {
    var newInstance = { ...(instance.dataValues ? instance.dataValues : instance) };
    if (winners.length > 1) {
      console.log('Game ended with a tie between players: ', winners.map(w => w.playerId));
      gameParameters.winner = winners.map(w => w.id).join(',');
    } else {
      console.log('Game ended, winner is player: ', winners[0].playerId);
      gameParameters.winner = winners[0].id;
    }
    newInstance.gameState = 'completed';
    newInstance.parameters = JSON.stringify(gameParameters);
    await updateInstance(req, res, newInstance);
    return res.status(200).json({ ok: true });
  }

  // Update players
  allPlayerInstances.forEach(async (element) => {
    const elementData = element.dataValues ? element.dataValues : element;

    var playerBuildingList = stringListToMap(elementData.buildings);
    var virtualBuildingList = { ...playerBuildingList };
    allLocations.forEach(location => {
      if (location.ownerId == elementData.playerId) {
        const locationBuildings = stringListToMap(location.buildings);
        Object.entries(locationBuildings).forEach(([key, value]) => {
          if (virtualBuildingList[key] == null) {
            virtualBuildingList[key] = value;
          } else {
            virtualBuildingList[key] = parseInt(virtualBuildingList[key]) + parseInt(value);
          }
        });
      } else {
        console.log('|-|-||--|-| Location not owned by player ', elementData.playerId, ' => ', location.ownerId, ' != ', element.id);
      }
    });

    console.log('||||| virtualBuildingList => ', virtualBuildingList);

    Object.entries({ ...virtualBuildingList }).forEach(([key, value]) => {
      const buildingInfo = allBuildings.find(b => b.name.toLowerCase() == key.toLowerCase());
      virtualBuildingList[key] = { ...buildingInfo, level: value };
    });

    console.log('||||| playerBuildingList => ', playerBuildingList);
    console.log('||||| virtualBuildingList => ', virtualBuildingList);

    element.endTurn = false;

    // reset base resources
    element.population = element.maxPopulation;
    element.tool = element.maxTool;
    element.armyMovementPoints = element.maxArmyMovementPoints;

    Object.entries(virtualBuildingList).forEach(([key, buildingData]) => {
      const building = buildingData.dataValues ? buildingData.dataValues : buildingData;
      if (building.effects == null || building.effects.length <= 0) {
        return;
      }

      const effects = stringListToMap(building.effects);
      Object.entries(effects).forEach(([effectKey, value]) => {
        if (!value || !effectKey)
          return;
        const trimmedValue = value.trim();
        const trimmedKey = effectKey.trim();

        console.log('||||| Applying end of turn effect ', trimmedKey, ' => ', trimmedValue);

        var selectedResource = trimmedKey;
        var effectApplied = 5;

        if (trimmedKey == "random") {
          const resourceKeys = ['wood', 'stone', 'iron', 'food', 'tool', 'treasure', 'horse', 'armor', 'weapon', 'siege', 'gold', 'diamond'];
          selectedResource = resourceKeys[Math.floor(Math.random() * resourceKeys.length)];
        }

        // A possible effect is to increase a resource according to the max population/tool/armyMovementPoints
        const effectValueList = ['maxPopulation', 'maxTool', 'maxArmyMovementPoints'];
        if (effectValueList.includes(trimmedValue)) {
          effectApplied = element[trimmedValue] || 1;
        } else if (!isNaN(parseInt(trimmedValue))) {
          effectApplied = parseInt(trimmedValue);
        }

        element[selectedResource] = (element[selectedResource] || 0) + effectApplied;
        console.log('||||| Player has gained ', effectApplied, ' ', selectedResource);
      });

    });

    // if batiment include camp => army +=1
    // if batiment include pound => food += maxPopulation
    // if batiment include fair => random + 5
    // if batiment include village => population +=1
    // if batiment include woodhut => wood += maxPopulation

    //consume food
    element.food = element.food - element.maxPopulation - element.army - element.horse;

    if (element.food < 0) {
      element.food = -1;
    }

    await updateInstancePlayerByServer({ ...req, body: element.dataValues }, res, false);
  });

  return res.status(200).json({ ok: true });
});

/* GET all possible actions for a player. */
router.post('/marketUpdate', async function (req, res, next) {
  const { instanceId, playerId } = req.body;
  console.log('# Update market for player');

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

  const currentMarketItems = JSON.parse(playerInstance.market || "[]");
  const newMarketItems = JSON.parse(req.body.market || "[]");

  const maxSize = 3;

  if (newMarketItems.length > maxSize) {
    console.log('New market items exceed maximum size');
    return res.status(400).json({
      statusCode: 400,
      message: "New market items exceed maximum size"
    });
  }

  return await updateInstancePlayerMarket(req, res, false);
});

router.post('/marketBuy', async function (req, res, next) {
  const { slotId, instancePlayerId, playerId, instanceId } = req.body;
  console.log('# Buy item from market');

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

  var instancePlayerList = await getInstancePlayersByInstanceId(req, res, false);

  const sellingPlayerInstance = instancePlayerList.find(ip => ip.dataValues.id == instancePlayerId)?.dataValues;
  if (!sellingPlayerInstance) {
    console.log('Selling player not found in this instance');
    return res.status(404).json({
      statusCode: 404,
      message: "Selling player not found in this instance"
    });
  }

  if (playerInstance.id == sellingPlayerInstance.id) {
    console.log('Player cannot buy his own item');
    return res.status(403).json({
      statusCode: 403,
      message: "Player cannot buy his own item"
    });
  }

  var marketItems = JSON.parse(sellingPlayerInstance.market);
  console.log('Market items of the seller => ', marketItems);
  console.log('slotId to buy => ', slotId);
  const itemToBuy = marketItems.find((item, index) => index == slotId);
  console.log('Item to buy => ', itemToBuy);
  if (!itemToBuy) {
    console.log('Item not found in market');
    return res.status(404).json({
      statusCode: 404,
      message: "Item not found in market"
    });
  }

  if (!itemToBuy.currency || !itemToBuy.price || !itemToBuy.item || !itemToBuy.quantity) {
    console.log('Invalid item data');
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid item data"
    });
  }

  if (playerInstance[itemToBuy.currency] < itemToBuy.price) {
    console.log('Not enough resources to buy this item');
    return res.status(403).json({
      statusCode: 403,
      message: "Not enough resources to buy this item"
    });
  }

  if (sellingPlayerInstance[itemToBuy.item] < itemToBuy.quantity) {
    console.log('Not enough items to sell');
    return res.status(403).json({
      statusCode: 403,
      message: "Not enough items to sell"
    });
  }

  // Proceed with the transaction
  playerInstance[itemToBuy.currency] -= parseInt(itemToBuy.price);
  playerInstance[itemToBuy.item] = (parseInt(playerInstance[itemToBuy.item]) || 0) + 1;

  sellingPlayerInstance[itemToBuy.currency] = (parseInt(sellingPlayerInstance[itemToBuy.currency]) || 0) + parseInt(itemToBuy.price);
  marketItems.forEach((item, index) => {
    if (index == slotId) {
      item.quantity -= 1;
    }
  });
  sellingPlayerInstance.market = JSON.stringify(marketItems.filter(item => item.quantity > 0));

  await updateInstancePlayerByServer({ body: { ...sellingPlayerInstance } }, res);
  await updateInstancePlayerByServer({ body: { ...playerInstance } }, res);

  return res.status(200).json({
    statusCode: 200,
    data: { playerInstance }
  });
});

module.exports = router;
