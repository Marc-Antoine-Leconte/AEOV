const currentUrl = "localhost:3000";
const currentProtocol = "http://";
const allInstancesPath = "/instance/list";
const playerInstancesPath = "/instance/list/user";
const newInstancePath = "/instance/new";
const joinInstancePath = "/instance/join";
const instancePath = "/instance";
const playerAuthenticationPath = "/player/authenticate";
const playerCreationPath = "/player/create";
const ownerStartGamePath = "/game/start";
const readyToPlayPath = "/game/readyToPlay";
const gameInfoPath = "/game/info";
const gameActionsPath = "/game/actions";
const gamePlayActionsPath = "/game/play";
const endTurnPath = "/game/endTurn";
const updateMarketPath = "/game/marketUpdate";
const buyMarketItemPath = "/game/marketBuy";

async function fetchDataFromAPI(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(response);
    }

    const result = await response.json();
    console.log("API Response :", result);
    return result;
  } catch (error) {
    console.error(error.message);
    return error;
  }
}

async function postDataToAPI(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(response);
    }

    console.log('Response status:', response);
    if (response.statusText == "No Content") {
      return response;
    }

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
}

async function fetchAllInstancesFromAPI() {
  const url = `${currentProtocol}${currentUrl}${allInstancesPath}`;
  return await fetchDataFromAPI(url);
}

async function fetchPlayerInstancesFromAPI(playerId) {
  const url = `${currentProtocol}${currentUrl}${playerInstancesPath}`;
  return await postDataToAPI(url, { playerId });
}

async function createInstanceFromAPI({name, ownerId, mode = "pvp", maxPlayers = 8}) {
  const url = `${currentProtocol}${currentUrl}${newInstancePath}`;
  return await postDataToAPI(url, { name, mode, maxPlayers, ownerId });
}

async function joinInstanceFromAPI(instanceId, playerId) {
  const url = `${currentProtocol}${currentUrl}${joinInstancePath}`;
  return await postDataToAPI(url, { instanceId, playerId });
}

async function redirectToUrl(newPath) {
  const url = `${currentProtocol}${currentUrl}${newPath}`;
  window.location.href = url;
}

async function fetchInstanceFromAPI(instanceId) {
  const url = `${currentProtocol}${currentUrl}${instancePath}?instanceId=${instanceId}`;
  return await fetchDataFromAPI(url);
}

async function authenticatePlayerFromAPI(playerName, password) {
  const url = `${currentProtocol}${currentUrl}${playerAuthenticationPath}`;
  return await postDataToAPI(url, { name: playerName, password: password });
}

async function createPlayerFromAPI(playerName, password) {
  const url = `${currentProtocol}${currentUrl}${playerCreationPath}`;
  return await postDataToAPI(url, { name: playerName, password: password });
}

async function ownerStartGameFromAPI(instanceId, playerId) {
  const url = `${currentProtocol}${currentUrl}${ownerStartGamePath}`;
  return await postDataToAPI(url, { instanceId, playerId });
}

async function setPlayerReadyToPlayFromAPI(civilization, color, instanceId, playerId) {
  const url = `${currentProtocol}${currentUrl}${readyToPlayPath}`;
  return await postDataToAPI(url, { civilization, color, instanceId, playerId });
}

async function fetchGameInfoFromAPI(instanceId, playerId) {
  const url = `${currentProtocol}${currentUrl}${gameInfoPath}`;
  return await postDataToAPI(url, { instanceId, playerId });
}

async function fetchAllActionsFromAPI() {
  const url = `${currentProtocol}${currentUrl}${gameActionsPath}`;
  return await fetchDataFromAPI(url);
}

async function postGameActionsToAPI(actions, playerId, instanceId) {
  const url = `${currentProtocol}${currentUrl}${gamePlayActionsPath}`;
  return await postDataToAPI(url, { actions, playerId, instanceId });
}

async function setPlayerEndTurnToAPI(instanceId, playerId) {
  const url = `${currentProtocol}${currentUrl}${endTurnPath}`;
  return await postDataToAPI(url, { instanceId, playerId });
}

async function setMarketDataToAPI(marketIsOpen, market, playerId, instanceId) {
  const url = `${currentProtocol}${currentUrl}${updateMarketPath}`;
  return await postDataToAPI(url, { marketIsOpen, market, playerId, instanceId });
}

async function buyItemOnMarketFromAPI(slotId, instancePlayerId, playerId, instanceId) {
  const url = `${currentProtocol}${currentUrl}${buyMarketItemPath}`;
  return await postDataToAPI(url, { slotId, instancePlayerId, playerId, instanceId });
}
