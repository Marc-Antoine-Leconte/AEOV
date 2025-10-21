function DrawStartGameButton() {
    currentId = getCookie("currentPlayerId");
    if (currentId == currentInstance.ownerId) {
        console.log('# Displaying start game button for instance owner');
        const startGameButton = document.getElementById("start-game-button");
        startGameButton.hidden = false;
    }
}

function onEndTurnButtonClick() {
    console.log('End Turn button clicked');

    postGameActions(currentInstance.currentPlayerTurn).then((data) => {
        console.log('# End turn actions posted:', data);
        if (data.error || data.message) {
            console.log('# Error posting end turn actions:', data.message);
        } else {
            currentInstance.currentPlayer.pendingActions = [];
            setEndTurnSocket();
            fetchAndDrawBoardScreen();
        }
    });
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

function DrawPlayerResources() {
    console.log('# Drawing player resources...');
    const playerData = currentInstance.currentPlayer;

    const playerResourcesComp = document.getElementById("game-board-player-resources");
    if (!playerData || !playerData.id) {
        console.log('# No need to draw player resources');
        playerResourcesComp.hidden = true;
        return;
    }

    playerResourcesComp.hidden = false;

    const resourceTitles = [
        "wood",
        "stone",
        "food",
        "gold",
        "diamond",
        "iron",
        "population",
        "armor",
        "weapon",
        "tool",
        "horse",
        "army",
        "treasure"
    ];

    resourceTitles.forEach(resource => {
        const resourceComp = document.getElementById(`player-resource-${resource}`);
        if (resourceComp) {
            resourceComp.innerHTML = playerData[resource];
        }
    });

    console.log('# Drawing player resources OK');
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
    const instanceTotalPlayersComp = document.getElementById("game-board-total-players");

    instanceNameComp.innerHTML = data.name;
    instanceModeComp.innerHTML = data.mode;
    instanceStatusComp.innerHTML = data.gameState;
    instanceCurrentTurnComp.innerHTML = data.rounds;
    instanceTotalPlayersComp.innerHTML = currentInstance.playerList.length + "/" + data.maxPlayers;

    const playerList = currentInstance.playerList;

    console.log('playerList => ', playerList);

    for (var i = 0; i < playerList.length; i++) {
        const element = playerList[i];
        if (element.isCurrentPlayer) {
            instanceCurrentPlayerComp.innerHTML = element.playerName;
        }
        if (element.isOwner) {
            instanceOwnerComp.innerHTML = element.playerName;
        }
    }

    console.log('# Draw of Instance Data OK');
}

function DrawActionList(actions, className, disabled = false) {
    const actionListContainer = document.getElementById(className);
    actionListContainer.innerHTML = '';

    console.log('# Drawing action list:', className);

    Object.entries(actions).forEach(([id, action]) => {
        const actionItem = document.createElement("button");
        actionItem.className = className + "-item";
        actionItem.innerHTML = action.name;

        const requirements = { ...action.requiredBuildings, ...action.requiredResources };
        actionItem.addEventListener('click', () => executeAction(action.id, requirements, action.effects, () => {
            DrawPlayerActions();
            DrawPlayerResources();
        }));
        actionItem.title = Object.entries(requirements).reduce((str, [key, val]) => {
            return str + `${key}: ${val}, `;
        }, "Requis: ");
        if (disabled) {
            actionItem.disabled = "disabled";
        }
        actionListContainer.appendChild(actionItem);
    });
}

function DrawPlayerActions() {
    console.log('# Drawing player actions...');
    const actions = currentInstance.actions;
    const currentPlayer = currentInstance.currentPlayer;

    const actionsContainerComp = document.getElementById("player-actions-container");
    if (!actions || actions.length == 0 || !currentPlayer || !currentPlayer.id) {
        console.log('# No actions to display');
        actionsContainerComp.hidden = true;
        return;
    }

    actionsContainerComp.hidden = false;

    var playerActionsList = {};
    var otherPlayerActionsList = {};
    
    actions.map((action, id) => {
        var tooMuchRequirement = false;
        const requirement = { ...action.requiredBuildings, ...action.requiredResources };
        Object.entries(requirement).forEach(([key, value]) => {
            if (value && !currentPlayer[key] || currentPlayer[key] < value) {
                tooMuchRequirement = true;
                //console.log('player need more', key, ' => ', value);
            }
        });
        
        if (tooMuchRequirement) {
            otherPlayerActionsList[id] = action;
        } else {
            playerActionsList[id] = action;
        }
    });

    DrawActionList(playerActionsList, "player-actions-list");
    DrawActionList(otherPlayerActionsList, "player-other-actions-list", true);


    console.log('# Drawing player actions OK');
}

function DrawGameBoard() {
    console.log('# Drawing game board...');
    const gameBoardComp = document.getElementById("game-board");
    if (!currentInstance.data || !currentInstance.data.id || currentInstance.data.gameState != 'inProgress') {
        console.log('# No game board to display');
        gameBoardComp.hidden = true;
        return;
    }

    gameBoardComp.hidden = false;
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

    const playerList = currentInstance.playerList;

    const ownerPlayer = playerList.find(player => player.isOwner && player.playerName == getCookie("currentPlayerName"));

    if (!ownerPlayer) {
        startGameBtn.hidden = true;
        return;
    }

    const playerListLength = playerList.length;

    startGameBtn.innerText = "Démarrer la partie " + playerListLength + "/" + currentInstance.data.maxPlayers;
    if (playerListLength < 2) {
        startGameBtn.disabled = true;
        return;
    }
    startGameBtn.disabled = false;
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

        currentInstance.playerList
        for(var i=0; i<currentInstance.playerList.length; i++) {
            var player = currentInstance.playerList[i];
            if (player.playerName == currentInstance.currentPlayer.name) {
              currentInstance.playerList[i] = {...currentInstance.playerList[i], ...data}
            }
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
    DrawPlayerResources();
    DrawPlayerList();
    DrawGameBoard();
}

DrawGameBoardScreen();