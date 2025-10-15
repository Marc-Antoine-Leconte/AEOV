
function DrawStartGameButton() {
    currentId = getCookie("currentPlayerId");
    if (currentId == currentInstance.ownerId) {
        console.log('# Displaying start game button for instance owner');
        const startGameButton = document.getElementById("start-game-button");
        startGameButton.hidden = false;
    }
}

function onEndTurnButtonClick() {
    setEndTurnSocket();
}

function setEndTurnButtonListener() {
    const endTurnBtn = document.getElementById("end-turn-button");
    endTurnBtn.addEventListener('click', onEndTurnButtonClick);
}

function DrawControls() {
    const instanceStatus = currentInstance.data;

    const gameBoardControlsComp = document.getElementById("game-board-controls");
    if (!instanceStatus || !instanceStatus.id || instanceStatus.gameState != 'inProgress') {
        console.log('# No need to display controls');
        gameBoardControlsComp.hidden = true;
        return;
    }

    gameBoardControlsComp.hidden = false;

    setEndTurnButtonListener();
}

function DrawPlayerList() {
    console.log('# Drawing player list...');
    const playerList = currentInstance.playerList;
    const instanceStatus = currentInstance.data;

    const playerListContainerComp = document.getElementById("game-board-player-list-container");
    if (!instanceStatus || !instanceStatus.id) {
        console.log('# No need to draw player list');
        playerListContainerComp.hidden = true;
        return;
    }

    playerListContainerComp.hidden = false;

    const playerListComp = document.getElementById("game-board-player-list");
     if (!playerListComp) {
        console.log('# No player list component found');
            return;
        }
    playerListComp.innerHTML = '';

    playerList.forEach(element => {
        const playerItem = document.createElement("li");
        playerItem.className = "game-board-player-item";
        playerItem.id = `player-${element.playerName}`;
        playerItem.innerHTML = `${element.playerName} (${element.civilization}, ${element.color})`;
        playerListComp.appendChild(playerItem);
    });

    console.log('# Drawing player list OK');
}

function DrawInstanceData() {
    const data = currentInstance.data;

    if (!data) {
        console.log('# No instance data to display');
        return;
    }

    const gameBoardContainer = document.getElementById("game-board-info");
    gameBoardContainer.hidden = false;

    const instanceNameComp = document.getElementById("game-board-instance-name");
    const instanceModeComp = document.getElementById("game-board-instance-mode");
    const instanceOwnerComp = document.getElementById("game-board-owner");
    const instanceStatusComp = document.getElementById("game-board-status");
    const instanceCurrentTurnComp = document.getElementById("game-board-current-turn");
    const instanceCurrentPlayerComp = document.getElementById("game-board-current-player");

    instanceNameComp.innerHTML = data.name;
    instanceModeComp.innerHTML = data.mode;
    instanceOwnerComp.innerHTML = data.owner;
    instanceStatusComp.innerHTML = data.gameState;
    instanceCurrentTurnComp.innerHTML = data.rounds;

    const playerList = currentInstance.playerList;

    console.log('playerList => ', playerList);

    for (var i = 0; i < playerList.length; i++) {
        const element = playerList[i];
        if (element.isCurrentPlayer) {
            instanceCurrentPlayerComp.innerHTML = element.playerName;
            return;
        }
    }

    console.log('# Draw of Instance Data OK');
}

function onStartGameButtonClick() {
    console.log('Start Game button clicked');
    ownerStartGame().then((data) => {
        if (data.error || data.message) {
            console.log('# Error starting game:', data.message);
        }
        ownerStartGameSocket();
        fetchAndDrawBoardScreen();
    });
}

function setStartGameButtonListener() {
    const startGameBtn = document.getElementById("start-game-button");
    startGameBtn.addEventListener('click', onStartGameButtonClick);
}

function onReadyButtonClick() {
    console.log('Ready button clicked');

    const civilizationSelect = document.getElementById("game-board-player-civilization-select");
    const colorSelect = document.getElementById("game-board-player-color-select");

    setPlayerReadyToPlay(civilizationSelect.value, colorSelect.value).then((data) => {

        console.log('data status => ', data)
        if (data.error || data.message) {
            console.log('# Error setting player ready to play:', data.message);
        }
        setPlayerReadyToPlaySocket();
        DrawGameBoardScreen();
    });
}

function setReadyButtonListener() {
    const readyBtn = document.getElementById("ready-button");
    readyBtn.addEventListener('click', onReadyButtonClick);
}

function DrawInstanceWaitingScreen() {
    const waitingScreen = document.getElementById("game-board-connection-container");

    const instanceStatus = currentInstance.data;

    if (!instanceStatus || instanceStatus?.gameState != 'waiting') {
        console.log('# No need to display waiting screen');
        waitingScreen.hidden = true;
        return;
    }

    waitingScreen.hidden = false;

    setReadyButtonListener();
    setStartGameButtonListener();
}

function DrawGameBoardScreen() {
    DrawInstanceData();
    DrawStartGameButton();
    DrawInstanceWaitingScreen();
    DrawControls();
    DrawPlayerList();
}

DrawGameBoardScreen();