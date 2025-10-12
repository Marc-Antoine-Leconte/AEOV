// Button click functions for AEOV application

function onGoBackToMenuButtonClick() {
    redirectToUrl("/");
}

function setGoBackToMenuButtonListener() {
    const backToMenuBtn = document.getElementById("back-to-menu-button");
    backToMenuBtn.addEventListener('click', onGoBackToMenuButtonClick);
}

function onDisconnectButtonClick() {
    deleteCookie("currentPlayerId");
    deleteCookie("currentPlayerName");
    redirectToUrl("/");
}

function setDisconnectButtonListener() {
    const disconnectBtn = document.getElementById("disconnect-button");
    disconnectBtn.addEventListener('click', onDisconnectButtonClick);
}

function onLeaveInstanceButtonClick(event) {
    deleteCookie("currentInstanceId");
    redirectToUrl("/home");
}

function setLeaveInstanceButtonListener() {
    const leaveInstanceBtn = document.getElementById("leave-instance-button");
    leaveInstanceBtn.addEventListener('click', onLeaveInstanceButtonClick);
}

function goToGameBoard(instanceId, instanceName) {
    console.log('Connecting to instance:', instanceName);
    
    setCookie("currentInstanceId", instanceId, 1);
    setCookie("currentInstanceName", instanceName, 1);
    redirectToUrl('/game');
}

function createInstance(instanceName, instanceMode) {
    console.log('Creating new instance...');
    console.log('# Instance Name =>', instanceName);
    console.log('# Instance Mode =>', instanceMode);

    const currentPlayerId = getCookie("currentPlayerId");

    createInstanceFromAPI({ name: instanceName, mode: instanceMode, ownerId: currentPlayerId }).then((data) => {
        console.log('# createInstanceFromAPI - data =>', data);
        if (data.error) {
            alert("Une erreur est survenue lors de la création de l'instance : " + data.message);
            return
        }

        console.log('Instance created successfully:', data);
        goToGameBoard(data.id, data.name);
    });
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
            goToGameBoard(data.id, data.name);
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