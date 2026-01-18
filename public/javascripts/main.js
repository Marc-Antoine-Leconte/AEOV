// Button click functions for AEOV application

function onGoBackToMenuButtonClick() {
    redirectToUrl("/");
}

function setGoBackToMenuButtonListener() {
    const backToMenuBtn = document.getElementById("back-to-menu-button");
    backToMenuBtn.addEventListener('click', onGoBackToMenuButtonClick);
}

function onDisconnectButtonClick() {
    logout().then(e => {
        if (e && !e.error && !e.message) {
            console.log('Logout successful');
            deleteCookie("currentPlayerId");
            deleteCookie("currentPlayerName");
            redirectToUrl("/");
        } else {
            console.log('Logout failed => ', e.message);
        }
    });
}

function setDisconnectButtonListener() {
    const disconnectBtn = document.getElementById("disconnect-button");
    disconnectBtn.addEventListener('click', onDisconnectButtonClick);
}

async function onLeaveInstanceButtonClick(event) {
    await disconnectSocket();
    deleteCookie("currentInstanceId");
    redirectToUrl("/home");
}

function setLeaveInstanceButtonListener() {
    const leaveInstanceBtn = document.getElementById("leave-instance-button");
    leaveInstanceBtn.addEventListener('click', onLeaveInstanceButtonClick);
}

function onToggleShowGameInfoButtonClick(event) {
    const gameBoardInfo = document.getElementById("game-board-info");
    const infoBarIsVisible = gameBoardInfo.checkVisibility();
    const toggleButtonImage = document.getElementById("toggle-show-game-info-button-img");

    if (infoBarIsVisible) {
        gameBoardInfo.style.display = "none";
        toggleButtonImage.src = "/images/icons/right-arrow.png";
    } else {
        gameBoardInfo.style.display = "flex";
        toggleButtonImage.src = "/images/icons/left-arrow.png";
    }
}

function setToggleInfoBarButtonListener() {
    const toggleButton = document.getElementById("toggle-show-game-info-button");
    toggleButton.addEventListener('click', onToggleShowGameInfoButtonClick);
}

function goToGameBoard(instanceId, instanceName) {
    console.log('Connecting to instance:', instanceName);
    console.log('Instance ID:', instanceId);

    setCookie("currentInstanceId", instanceId, 1);
    setCookie("currentInstanceName", instanceName, 1);
    redirectToUrl('/game');
}

async function createInstance(instanceName, instanceMode) {
    console.log('Creating new instance...');
    console.log('# Instance Name =>', instanceName);
    console.log('# Instance Mode =>', instanceMode);

    const currentPlayerId = getCookie("currentPlayerId");

    const createdInstance = await createInstanceFromAPI({ instanceName: instanceName, mode: instanceMode, ownerId: currentPlayerId });
    if (createdInstance.message) {
        alert("Une erreur est survenue lors de la création de l'instance : " + createdInstance.message);
    } else {
        console.log('Instance created successfully:', createdInstance);
    }

    return createdInstance
}

function joinInstance(instanceId) {
    console.log('Joining instance:', instanceId);
    playerId = getCookie("currentPlayerId");
    
    joinInstanceFromAPI(instanceId, playerId).then((data) => {
        if (data.message || data.error) {
            alert("Une erreur est survenue au moment de rejoindre l'instance : " + data.message);
            return
        } else {
            console.log('# join instance Success', data);
            goToGameBoard(instanceId, data.instanceName);
        }
    });
}

function fetchInstance(instanceId) {
    return fetchInstanceFromAPI(instanceId)
}

function authenticatePlayer(playerName, password) {
    return authenticatePlayerFromAPI(playerName, password)
}

function subscribePlayer(playerName, password) {
    return createPlayerFromAPI(playerName, password)
}

function logout() {
    return logoutFromAPI();
}

function setPlayerReadyToPlay(civilization, color) {
    instanceId = getCookie("currentInstanceId");
    return setPlayerReadyToPlayFromAPI(civilization, color, instanceId);
}

function ownerStartGame() {
    instanceId = getCookie("currentInstanceId");
    return ownerStartGameFromAPI(instanceId);
}

function fetchGameInfo() {
    instanceId = getCookie("currentInstanceId");
    return fetchGameInfoFromAPI(instanceId);
}

function fetchPlayersInfo() {
    instanceId = getCookie("currentInstanceId");
    return fetchPlayersInfoFromAPI(instanceId);
}

function fetchGameActions() {
    return fetchAllActionsFromAPI();
}

function fetchGameBuildings() {
    return fetchAllBuildingsFromAPI();
}

function postGameActions(actions) {
    instanceId = getCookie("currentInstanceId");
    return postGameActionsToAPI(actions, instanceId);
}

function setPlayerEndTurn() {
    instanceId = getCookie("currentInstanceId");
    return setPlayerEndTurnToAPI(instanceId);
}

function setMarketData(marketIsOpen, market) {
    instanceId = getCookie("currentInstanceId");
    return setMarketDataToAPI(marketIsOpen, market, instanceId);
}

function buyItemOnMarket(slotId, instancePlayerId) {
    instanceId = getCookie("currentInstanceId");
    return buyItemOnMarketFromAPI(slotId, instancePlayerId, instanceId);
}

function updateInstanceParameters(newParameters) {
    instanceId = getCookie("currentInstanceId");
    return updateInstanceParametersFromAPI(newParameters, instanceId);
}

function DisplayUserInfo() {
    const userNameComp = document.getElementById("user-name");
    const userIdComp = document.getElementById("user-id");
    const instanceIdComp = document.getElementById("instance-id");

    if (userNameComp)
        userNameComp.innerHTML = getCookie("currentPlayerName");
    if (userIdComp)
        userIdComp.innerHTML = getCookie("currentPlayerId");
    if (instanceIdComp)
        instanceIdComp.innerHTML = getCookie("currentInstanceId");
}

DisplayUserInfo();