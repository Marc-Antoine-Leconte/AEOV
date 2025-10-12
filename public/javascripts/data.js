const currentUrl = "localhost:3000";
const currentProtocol = "http://";
const allInstancesPath = "/instance/list";
const newInstancePath = "/instance/new";
const joinInstancePath = "/instance/join";
const instancePath = "/instance";
const playerAuthenticationPath = "/player/authenticate";
const playerCreationPath = "/player/create";

async function fetchDataFromAPI(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`FETCH FAIL : Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
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
      throw new Error(`POST FAIL : Response status: ${response.status}`);
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
