function DrawStartGameButton() {
    currentId = getCookie("currentPlayerId");
    if (currentId == currentInstance.ownerId) {
        console.log('# Displaying start game button for instance owner');
        const startGameButton = document.getElementById("start-game-button");
        startGameButton.hidden = false;
    }
}

function DrawPlayerControls() {
    const instanceStatus = currentInstance.instanceStatus;

    const gameBoardControlsComp = document.getElementById("game-board-controls");
    if (!instanceStatus || !instanceStatus.id || instanceStatus.gameStarted === false) {
        console.log('# No need to display controls');
        gameBoardControlsComp.hidden = true;
        return;
    }

    gameBoardControlsComp.hidden = false;
}

function DrawInstanceData() {
    const data = currentInstance.data;

    if (!data) {
        console.log('# No instance data to display');
        return;
    }

    const gameBoardContainer = document.getElementById("game-board-container");
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
    instanceCurrentPlayerComp.innerHTML = data.currentPlayer;

    console.log('# Draw of Instance Data OK');
}

function DrawInstanceWaitingScreen() {
    const waitingScreen = document.getElementById("game-board-connection-container");

    const instanceStatus = currentInstance.instanceStatus;

    if (!instanceStatus || !instanceStatus.id || instanceStatus.waitingForPlayers === false) {
        console.log('# No need to display waiting screen');
        waitingScreen.hidden = true;
        return;
    }

    waitingScreen.hidden = false;
}

function DrawGameBoardScreen() {
    DrawInstanceData();
    DrawStartGameButton();
    DrawInstanceWaitingScreen();
}

DrawGameBoardScreen();