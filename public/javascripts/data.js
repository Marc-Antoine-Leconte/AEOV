const currentUrl = "localhost:3000";
const currentProtocol = "http://";
const allInstancesPath = "/instance/list";
const playerInstancesPath = "/instance/list/user";
const newInstancePath = "/instance/new";
const joinInstancePath = "/instance/join";
const instancePath = "/instance";
const playerAuthenticationPath = "/player/authenticate";
const playerCreationPath = "/player/create";
const logoutPath = "/player/logout";
const ownerStartGamePath = "/game/start";
const readyToPlayPath = "/game/readyToPlay";
const gameInfoPath = "/game/info";
const playersInfoPath = "/game/playersInfo";
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

async function fetchPlayerInstancesFromAPI() {
  const url = `${currentProtocol}${currentUrl}${playerInstancesPath}`;
  return await postDataToAPI(url, { });
}

async function createInstanceFromAPI({name, mode = "pvp", maxPlayers = 8}) {
  const url = `${currentProtocol}${currentUrl}${newInstancePath}`;
  return await postDataToAPI(url, { name, mode, maxPlayers });
}

async function joinInstanceFromAPI(instanceId) {
  const url = `${currentProtocol}${currentUrl}${joinInstancePath}`;
  return await postDataToAPI(url, { instanceId });
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

async function logoutFromAPI() {
  const url = `${currentProtocol}${currentUrl}${logoutPath}`;
  return await fetchDataFromAPI(url);
}

async function ownerStartGameFromAPI(instanceId) {
  const url = `${currentProtocol}${currentUrl}${ownerStartGamePath}`;
  return await postDataToAPI(url, { instanceId });
}

async function setPlayerReadyToPlayFromAPI(civilization, color, instanceId) {
  const url = `${currentProtocol}${currentUrl}${readyToPlayPath}`;
  return await postDataToAPI(url, { civilization, color, instanceId });
}

async function fetchGameInfoFromAPI(instanceId) {
  const url = `${currentProtocol}${currentUrl}${gameInfoPath}`;
  return await postDataToAPI(url, { instanceId });
}

async function fetchPlayersInfoFromAPI(instanceId) {
  const url = `${currentProtocol}${currentUrl}${playersInfoPath}`;
  return await postDataToAPI(url, { instanceId });
}

async function fetchAllActionsFromAPI() {
  const url = `${currentProtocol}${currentUrl}${gameActionsPath}`;
  return await fetchDataFromAPI(url);
}

async function postGameActionsToAPI(actions, instanceId) {
  const url = `${currentProtocol}${currentUrl}${gamePlayActionsPath}`;
  return await postDataToAPI(url, { actions, instanceId });
}

async function setPlayerEndTurnToAPI(instanceId) {
  const url = `${currentProtocol}${currentUrl}${endTurnPath}`;
  return await postDataToAPI(url, { instanceId });
}

async function setMarketDataToAPI(marketIsOpen, market, instanceId) {
  const url = `${currentProtocol}${currentUrl}${updateMarketPath}`;
  return await postDataToAPI(url, { marketIsOpen, market, instanceId });
}

async function buyItemOnMarketFromAPI(slotId, instancePlayerId, instanceId) {
  const url = `${currentProtocol}${currentUrl}${buyMarketItemPath}`;
  return await postDataToAPI(url, { slotId, instancePlayerId, instanceId });
}
