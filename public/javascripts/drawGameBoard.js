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
    setPlayerEndTurn().then((data) => {
        if (data.error || data.message) {
            console.error('# Error ending turn:', data.message);
        } else {
            setEndTurnSocket();
        }
    });
}

function onVisitMarketButtonClick(index = null) {
    console.log('Visit Market button clicked');
    currentInstance.screen.layout = 'market';
    currentInstance.screen.selectedCity = index;
    DrawMarketOverlay();
}

function setEndTurnButtonListener() {
    const endTurnBtn = document.getElementById("end-turn-button");
    endTurnBtn.addEventListener('click', onEndTurnButtonClick);
}

function setVisitMarketButtonListener() {
    const visitMarketBtn = document.getElementById("visit-market-action-button");
    visitMarketBtn.addEventListener('click', () => onVisitMarketButtonClick(null));
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
    setVisitMarketButtonListener();
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
        "leather",
        "armor",
        "weapon",
        "horse",
        "army",
        "siege",
        "treasure",
        "tool",
        "population",
        "armyMovementPoints"
    ];

    resourceTitles.forEach(resource => {
        var resourceComp = document.getElementById(`player-resource-${resource}`);
        if (!resourceComp) {
            var resourceCompContainer = document.createElement("div");
            resourceCompContainer.className = "game-board-player-resources-item";
            resourceCompContainer.title = resource;

            var resourceCompImageContainer = document.createElement("span");
            resourceCompImageContainer.className = `player-resource-image-container`;

            var resourceCompImage = document.createElement("img");
            resourceCompImage.id = `player-resource-${resource}-image`;
            resourceCompImage.src = `images/resources/${resource}.png`;
            resourceCompImageContainer.appendChild(resourceCompImage);

            resourceComp = document.createElement("span");
            resourceComp.id = `player-resource-${resource}`;

            resourceCompContainer.appendChild(resourceCompImageContainer);
            resourceCompContainer.appendChild(resourceComp);
            playerResourcesComp.appendChild(resourceCompContainer);
        }
        var text = playerData[resource];

        if (resource === "armyMovementPoints") {
            text += ` / ${playerData.maxArmyMovementPoints}`;
        } else if (resource === "tool") {
            text += ` / ${playerData.maxTool}`;
        } else if (resource === "population") {
            text += ` / ${playerData.maxPopulation}`;
        }
        resourceComp.innerHTML = text;
    });

    console.log('# Drawing player resources OK');
}

function DrawPlayerList() {
    console.log('# Drawing player list...');
    const playerList = currentInstance.playerList;
    const instanceStatus = currentInstance.data;

    if (!instanceStatus || !instanceStatus.id) {
        console.log('# No need to draw player list');
        return;
    }

    const listName = "game-board-player-list";
    const playerListComp = document.getElementById(listName);
    if (!playerListComp) {
        console.log('# No player list component found');
        return;
    }
    playerListComp.innerHTML = '';

    playerList.forEach(element => {
        const playerItem = document.createElement("div");
        playerItem.className = "player-item-container";

        const playerImgContainer = document.createElement("div");
        playerImgContainer.className = "player-item-image-container";
        playerImgContainer.id = `player-item-${element.playerName}`;

        const playerImg = document.createElement("img");
        playerImg.className = "player-item-image";
        playerImg.style.borderColor = element.color;
        const src = element.civilization ? "/images/" + element.civilization + "-army.jpg" : "/images/icons/no-icon-picture.png";
        playerImg.src = src;
        playerImg.title = `${element.civilization}`;
        playerImgContainer.appendChild(playerImg);
        playerItem.appendChild(playerImgContainer);

        const playerInfoContainer = document.createElement("div");
        playerInfoContainer.className = "player-item-info-container";

        const playerNameContainer = document.createElement("div");
        playerNameContainer.className = "player-item-name-container";

        const playerNameComp = document.createElement("span");
        playerNameComp.className = "player-item-name";
        playerNameComp.innerHTML = element.playerName;
        playerNameContainer.appendChild(playerNameComp);

        if (element.isOwner) {
            const administratorImg = document.createElement("img");
            administratorImg.className = "player-item-administrator-image";
            administratorImg.src = "/images/icons/crown.png";
            playerNameContainer.appendChild(administratorImg);
        }
        playerInfoContainer.appendChild(playerNameContainer);

        const playerStatusComp = document.createElement("span");

        var statusText = "";
        var statusClass = "";

        if (instanceStatus.gameState == "waiting") {
            if (element.civilization) {
                statusText = "Prêt";
                statusClass = "player-item-status-waiting";
            } else {
                statusText = "En attente";
                statusClass = "player-item-status-playing";
            }
        } else {
            if (element.endTurn) {
                statusText = "Tour fini";
                statusClass = "player-item-status-waiting";
            } else {
                statusText = "Tour en cours";
                statusClass = "player-item-status-playing";
            }
        }

        playerStatusComp.className = "player-item-status " + statusClass;
        playerStatusComp.innerHTML = statusText;
        playerInfoContainer.appendChild(playerStatusComp);

        playerItem.appendChild(playerInfoContainer);
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

    const gameBoardContainer = document.getElementById("game-board-info-container");
    gameBoardContainer.hidden = false;

    const instanceNameComp = document.getElementById("game-board-instance-name");
    const instanceModeComp = document.getElementById("game-board-instance-mode");
    const instanceVictoryConditionComp = document.getElementById("game-board-instance-victory-condition");
    const instanceOwnerComp = document.getElementById("game-board-owner");
    const instanceStatusComp = document.getElementById("game-board-status");
    const instanceCurrentTurnComp = document.getElementById("game-board-current-turn");
    const instanceCurrentPlayerComp = document.getElementById("game-board-current-player");
    const instanceTotalPlayersComp = document.getElementById("game-board-total-players");

    instanceNameComp.innerHTML = data.name;
    instanceModeComp.innerHTML = data.mode;
    var html = "";
    const instanceParameters = JSON.parse(data.parameters);
    if (instanceParameters.victoryCondition == "maxPoints") {
        html += "Le premier joueur arrivé à <b>" + instanceParameters.maxPoints + "</b> points de victoire gagne la partie.";
    } else if (instanceParameters.victoryCondition == "armyHegemony") {
        html += "Le joueur qui est le seul à posséder une armée gagne la partie";
    }
    instanceVictoryConditionComp.innerHTML = html;
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
    var actionListContainer = document.getElementById(className);
    if (!actionListContainer) {
        const actionsContainerComp = document.getElementById("overlay-actions");
        actionListContainer = document.createElement("div");
        actionListContainer.id = className;
        actionsContainerComp.appendChild(actionListContainer);
    }
    actionListContainer.innerHTML = '';

    console.log('# Drawing action list:', className);

    Object.entries(actions).forEach(([id, action]) => {
        let typeContainer = document.getElementById(`${className}-type-${action.type}`);
        if (!typeContainer) {
            typeContainer = document.createElement("div");
            typeContainer.id = `${className}-type-${action.type}`;
            const typeTitle = document.createElement("h3");
            typeTitle.innerHTML = action.type;
            typeContainer.appendChild(typeTitle);

            actionListContainer.appendChild(typeContainer);
        }

        const actionItem = document.createElement("button");
        actionItem.className = className + "-item";
        actionItem.innerHTML = action.title;

        const requirements = { ...action.requiredBuildings, ...action.requiredResources };
        actionItem.addEventListener('click', () => executeAction(action.id, requirements, action.effects, () => {
            DrawPlayerActions();
            DrawPlayerResources();
        }));
        const requirementStr = Object.entries(requirements).reduce((str, [key, val]) => {
            return str + `${key}: ${val}, `;
        }, "Requis: ");
        const effectStr = Object.entries(action.effects).reduce((str, [key, val]) => {
            return str + `${key}: ${val}, `;
        }, "Effets: ");
        actionItem.title = requirementStr + "\n" + effectStr;
        if (disabled) {
            actionItem.disabled = "disabled";
        }
        typeContainer.appendChild(actionItem);
    });
}

function DrawPlayerActions() {
    console.log('# Drawing player actions...');
    const actions = currentInstance.actions;
    var currentPlayer = currentInstance.currentPlayer;

    var noActionsToDisplay = false;
    const actionsContainerComp = document.getElementById("overlay-actions");
    if (!actions || actions == null || !actions.length || !currentPlayer || !currentPlayer.id) {
        noActionsToDisplay = true;
    }

    console.log('currentInstance.screen.layout => ', currentInstance.screen);
    if (currentInstance.screen.layout == 'city') {
        console.log('currentInstance.playerList[currentInstance.screen.selectedCity] => ', currentInstance.playerList[currentInstance.screen.selectedCity - 1]);
        if (!currentInstance.playerList[currentInstance.screen.selectedCity - 1].isUser) {
            noActionsToDisplay = true;
        }
    } else if (currentInstance.screen.layout == 'location') {
        console.log('currentInstance.locations[currentInstance.screen.selectedLocation] => ', currentInstance.locations[currentInstance.screen.selectedLocation - 1]);
        if (!currentInstance.locations[currentInstance.screen.selectedLocation - 1].isOwnedByUser) {
            noActionsToDisplay = true;
        }
    }

    if (noActionsToDisplay) {
        console.log('# No actions to display');
        actionsContainerComp.innerHTML = '';
        return;
    }


    var playerActionsList = {};
    var otherPlayerActionsList = {};

    actions.map((action, id) => {
        if (['38', '39', '40'].includes(action.id.toString())) { // ignore actions based on player decisions
            return;
        }
        var tooMuchRequirement = false;
        const requirement = { ...action.requiredBuildings, ...action.requiredResources };
        Object.entries(requirement).forEach(([key, value]) => {
            if (value && (!currentPlayer[key] || currentPlayer[key] < value)) {
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

function DrawWiki(buildings, actions) {
    const wikiContainerId = "overlay-wiki";
    var buildingListContainer = document.getElementById(wikiContainerId);
    if (!buildingListContainer) {
        const buildingsContainerComp = document.getElementById("overlay-informations");
        buildingListContainer = document.createElement("div");
        buildingListContainer.id = wikiContainerId;
        buildingsContainerComp.appendChild(buildingListContainer);
    }
    buildingListContainer.innerHTML = '';

    console.log('# Drawing building list:', wikiContainerId);

    const buildingTitle = document.createElement("h2");
    buildingTitle.innerText = "Wiki bâtiments";
    buildingListContainer.appendChild(buildingTitle);

    Object.entries(buildings).forEach(([id, building]) => {
        DrawWikiBuildingComponent({
            baseClassName: wikiContainerId + "-building",
            parentId: wikiContainerId,
            componentId: id,
            building: building
        });
    });

    const actionTitle = document.createElement("h2");
    actionTitle.innerText = "Wiki actions";
    buildingListContainer.appendChild(actionTitle);

    Object.entries(actions).forEach(([id, action]) => {
        DrawWikiActionComponent({
            baseClassName: wikiContainerId + "-action",
            parentId: wikiContainerId,
            componentId: id,
            action: action
        });
    });
}

function DrawPlayerBuildingsInformations() {
    console.log('# Drawing player buildings...');
    const buildings = currentInstance.buildings;
    const actions = currentInstance.actions;

    DrawWiki(buildings, actions);
}

function DrawGameBoard() {
    console.log('# Drawing game board...');
    const gameBoardComp = document.getElementById("game-board");
    if (!currentInstance.data || !currentInstance.data.id || currentInstance.data.gameState != 'inProgress') {
        console.log('# No game board to display');
        gameBoardComp.style.display = "none";
        return;
    }

    gameBoardComp.style.display = "flex";
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

function DrawGameParamsEditor() {
    console.log('# Drawing game parameters editor...');
    var instanceParameters = JSON.parse(currentInstance.data.parameters);

    // Game Parameters Container
    const gameParamsContainer = document.getElementById("game-board-instance-parameters-container");
    gameParamsContainer.hidden = false;
    gameParamsContainer.innerHTML = '';

    // title
    const parameterTitle = document.createElement("h2");
    parameterTitle.innerText = "Paramètres de la partie";
    gameParamsContainer.appendChild(parameterTitle);

    // Victory Condition
    const victoryConditionTitle = document.createElement("span");
    victoryConditionTitle.innerText = "Condition de victoire : ";
    gameParamsContainer.appendChild(victoryConditionTitle);

    // Victory condition select
    const victoryConditionInput = document.createElement("select");
    victoryConditionInput.value = instanceParameters.victoryCondition;

    // option 1 - max points
    const optionMaxPoints = document.createElement("option");
    optionMaxPoints.value = "maxPoints";
    optionMaxPoints.innerText = "Atteindre un nombre de points de victoire";
    if (instanceParameters.victoryCondition == "maxPoints") {
        optionMaxPoints.selected = true;
    }
    victoryConditionInput.appendChild(optionMaxPoints);

    // option 2 - armyHegemony
    const optionArmyHegemony = document.createElement("option");
    optionArmyHegemony.value = "armyHegemony";
    optionArmyHegemony.innerText = "Détruire toutes les armées adverses";
    if (instanceParameters.victoryCondition == "armyHegemony") {
        optionArmyHegemony.selected = true;
    }
    victoryConditionInput.appendChild(optionArmyHegemony);

    // On change listener
    victoryConditionInput.addEventListener('change', (event) => {
        const newValue = event.target.value;
        instanceParameters.victoryCondition = newValue;
        updateInstanceParameters(JSON.stringify(instanceParameters)).then((data) => {
            if (data.error || data.message) {
                console.log('# Error updating instance parameters:', data.message);
            } else {
                currentInstance.data.parameters = JSON.stringify(instanceParameters);
                DrawInstanceData();
                DrawGameParamsEditor();
            }
        });
    });
    gameParamsContainer.appendChild(victoryConditionInput);

    // Max Points (if victory condition is max points)
    if (instanceParameters.victoryCondition == "maxPoints") {
        // title
        const victoryConditionTitle = document.createElement("span");
        victoryConditionTitle.innerText = "nombre de points à atteindre : ";
        gameParamsContainer.appendChild(victoryConditionTitle);

        // select
        const maxPointsSelect = document.createElement("select");
        Object.entries([25, 50, 100, 200, 500, 1000]).forEach(([key, value]) => {
            const option = document.createElement("option");
            option.value = value;
            option.innerText = value;
            if (instanceParameters.maxPoints == value) {
                option.selected = true;
            }
            maxPointsSelect.appendChild(option);
        });
        maxPointsSelect.addEventListener('change', (event) => {
            const newMaxPoints = parseInt(event.target.value);
            instanceParameters.maxPoints = newMaxPoints;
            updateInstanceParameters(JSON.stringify(instanceParameters)).then((data) => {
                if (data.error || data.message) {
                    console.log('# Error updating instance parameters:', data.message);
                } else {
                    currentInstance.data.parameters = JSON.stringify(instanceParameters);
                    DrawInstanceData();
                    DrawGameParamsEditor();
                }
            });
        });
        gameParamsContainer.appendChild(maxPointsSelect);
    }

    console.log('# Drawing game parameters editor OK');
}

function setStartGameButtonListener() {
    const startGameBtn = document.getElementById("start-game-button");

    const playerList = currentInstance.playerList;

    const ownerPlayer = playerList.find(player => player.isOwner && player.isUser);

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
        for (var i = 0; i < currentInstance.playerList.length; i++) {
            var player = currentInstance.playerList[i];
            if (player.playerName == currentInstance.currentPlayer.name) {
                currentInstance.playerList[i] = { ...currentInstance.playerList[i], ...data }
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

function RefreshPinPoints() {
    console.log('# Refreshing pin points...');
    if (currentInstance.data.gameState != 'inProgress') {
        console.log('# Game is not in progress, skipping pin points refresh');
        return;
    }

    const playerList = currentInstance.playerList;
    const pinPoints = pinPointsMap;
    const gameMap = document.querySelector(".game-map");

    const locations = currentInstance.locations;
    console.log('locations => ', locations);

    Object.entries(locations).forEach(([index, location]) => {
        const point = pinPoints[index];
        const pinPointConquestActionBtn = document.getElementById(`pin-point-conquest-action-${index}`);
        const pinPointDefendActionBtn = document.getElementById(`pin-point-defend-action-${index}`);
        const pinPointLabel = document.getElementById(`pin-point-label-${index}`);
        if (pinPointLabel) {
            pinPointLabel.style.backgroundColor = location.ownerColor;
            if (['purple', 'blue', 'red'].includes(location.ownerColor)) {
                pinPointLabel.style.color = "white";
            } else {
                pinPointLabel.style.color = "black";
            }
        }

        if (pinPointConquestActionBtn && location.isOwnedByUser) {
            pinPointConquestActionBtn.style.display = "none";
            pinPointDefendActionBtn.style.display = "block";
        } else if (pinPointConquestActionBtn) {
            pinPointConquestActionBtn.style.display = "block";
            pinPointDefendActionBtn.style.display = "none";
        }
    });
    console.log('# Refreshing pin points OK');
}

function MoveArmyToPoint(pointId) {
    const action = currentInstance.actions[40 - 1]
    executeAction(action.id, { ...action.requiredBuildings, ...action.requiredResources }, action.effects, () => {
        DrawPlayerActions();
        DrawPlayerResources();
        setPlayerMoveArmySocket();
    }, pointId)
}

function DrawPinPoints() {
    console.log('# Drawing pin points...');
    if (currentInstance.data.gameState != 'inProgress') {
        console.log('# Game is not in progress, skipping pin points drawing');
        return;
    }

    const playerList = currentInstance.playerList;
    var playerPinPoints = [];
    const pinPoints = pinPointsMap;
    const gameMap = document.querySelector(".game-map");
    const existingPinPoints = document.querySelectorAll(".pin-point-button");

    if (existingPinPoints && existingPinPoints.length > 0) {
        RefreshPinPoints();
        return;
    }

    switch (playerList.length) {
        case 2:
            playerPinPoints = twoPlayersMap;
            break;
        case 3:
            playerPinPoints = threePlayersMap;
            break;
        case 4:
            playerPinPoints = fourPlayersMap;
            break;
        case 5:
            playerPinPoints = fivePlayersMap;
            break;
        case 6:
            playerPinPoints = sixPlayersMap;
            break;
        case 7:
            playerPinPoints = sevenPlayersMap;
            break;
        case 8:
            playerPinPoints = eightPlayersMap;
            break;
    }

    playerPinPoints.forEach((point, index) => {
        const player = playerList[index];
        if (!player.civilization) {
            return;
        }

        const pinPointDiv = document.createElement("div");
        pinPointDiv.className = "pin-point-button";
        pinPointDiv.style.left = point.x + "vw";
        pinPointDiv.style.top = point.y + "vw";
        pinPointDiv.id = `pin-point-player-${index}`;

        const pinPointImg = document.createElement("img");
        pinPointImg.src = "/images/" + player.civilization + "-city.png";
        pinPointImg.alt = player.civilization + " city";
        pinPointImg.className = "city-point-image";

        const pinPointLabel = document.createElement("p");
        pinPointLabel.innerText = player.playerName;
        pinPointLabel.style.backgroundColor = player.color;
        if (['purple', 'blue', 'red'].includes(player.color)) {
            pinPointLabel.style.color = "white";
        }

        const pinPointActions = document.createElement("div");
        pinPointActions.className = "pin-point-actions";
        pinPointActions.id = `player-pin-point-actions-${index}`;
        pinPointActions.style.display = "none";

        const pinPointVisitAction = document.createElement("button");
        pinPointVisitAction.className = "pin-point-visit-action";
        pinPointVisitAction.id = `player-pin-point-visit-action-${index}`;
        pinPointVisitAction.innerText = "Visiter";
        pinPointVisitAction.addEventListener('click', () => {
            {
                currentInstance.screen.layout = 'city';
                currentInstance.screen.selectedCity = index + 1;
                DrawCityOverlay();
            }
        });

        const pinPointMarketAction = document.createElement("button");
        pinPointMarketAction.className = "pin-point-market-action";
        pinPointMarketAction.id = `player-pin-point-market-action-${index}`;
        pinPointMarketAction.innerText = "Marché";
        pinPointMarketAction.addEventListener('click', () => {
            onVisitMarketButtonClick(index + 1);
        });

        const pinPointArmyAction = document.createElement("button");
        if (player.isUser) {
            pinPointArmyAction.className = "pin-point-defend-action";
            pinPointArmyAction.id = `player-pin-point-defend-action-${index}`;
            pinPointArmyAction.innerText = "Défendre";
            pinPointArmyAction.addEventListener('click', () => MoveArmyToPoint("-1"));
        } else {
            pinPointArmyAction.className = "pin-point-attack-action";
            pinPointArmyAction.id = `player-pin-point-attack-action-${index}`;
            pinPointArmyAction.innerText = "Attaquer";
            pinPointArmyAction.addEventListener('click', () => MoveArmyToPoint("#" + player.instancePlayerId.toString()));
        }

        pinPointActions.appendChild(pinPointVisitAction);
        pinPointActions.appendChild(pinPointMarketAction);
        pinPointActions.appendChild(pinPointArmyAction);

        pinPointDiv.appendChild(pinPointImg);
        pinPointDiv.appendChild(pinPointLabel);
        pinPointDiv.appendChild(pinPointActions);
        pinPointDiv.addEventListener('mouseenter', () => {
            {
                const actionsComp = document.getElementById(`player-pin-point-actions-${index}`);
                actionsComp.style.display = actionsComp.style.display === "none" ? "flex" : "none";
            }
        });
        pinPointDiv.addEventListener('mouseleave', () => {
            {
                const actionsComp = document.getElementById(`player-pin-point-actions-${index}`);
                actionsComp.style.display = actionsComp.style.display === "none" ? "flex" : "none";
            }
        });

        gameMap.appendChild(pinPointDiv);
    });

    const locations = currentInstance.locations;
    console.log('locations => ', locations);

    Object.entries(locations).forEach(([index, location]) => {
        const point = pinPoints[index];
        const pinPointDiv = document.createElement("div");
        pinPointDiv.className = "pin-point-button";
        pinPointDiv.style.left = point.x + "vw";
        pinPointDiv.style.top = point.y + "vw";
        pinPointDiv.id = `pin-point-${index}`;

        const pinPointImg = document.createElement("img");
        pinPointImg.src = "/images/pin-point-icon.png";
        pinPointImg.alt = "Pin Point";

        const pinPointLabel = document.createElement("p");
        pinPointLabel.innerText = location.name;
        pinPointLabel.id = `pin-point-label-${index}`;
        pinPointLabel.style.backgroundColor = location.ownerColor;
        if (['purple', 'blue', 'red'].includes(location.ownerColor)) {
            pinPointLabel.style.color = "white";
        } else {
            pinPointLabel.style.color = "black";
        }

        const pinPointActions = document.createElement("div");
        pinPointActions.className = "pin-point-actions";
        pinPointActions.id = `pin-point-actions-${index}`;
        pinPointActions.style.display = "none";

        const pinPointVisitAction = document.createElement("button");
        pinPointVisitAction.className = "pin-point-visit-action";
        pinPointVisitAction.id = `pin-point-visit-action-${index}`;
        pinPointVisitAction.innerText = "Visiter";
        pinPointVisitAction.addEventListener('click', () => {
            {
                currentInstance.screen.layout = 'location';
                currentInstance.screen.selectedLocation = location.pointId;
                DrawCityOverlay();
            }
        });

        const pinPointDefendAction = document.createElement("button");
        pinPointDefendAction.className = "pin-point-defend-action";
        pinPointDefendAction.id = `pin-point-defend-action-${index}`;
        pinPointDefendAction.innerText = "Défendre";
        if (!location.isOwnedByUser) {
            pinPointDefendAction.style.display = "none";
        }
        pinPointDefendAction.addEventListener('click', () => MoveArmyToPoint(index.toString()));

        const pinPointConquestAction = document.createElement("button");
        pinPointConquestAction.className = "pin-point-conquest-action";
        pinPointConquestAction.id = `pin-point-conquest-action-${index}`;
        pinPointConquestAction.innerText = "Conquérir";
        if (location.isOwnedByUser) {
            pinPointConquestAction.style.display = "none";
        }
        pinPointConquestAction.addEventListener('click', () => MoveArmyToPoint(index.toString()));

        pinPointActions.appendChild(pinPointVisitAction);
        pinPointActions.appendChild(pinPointDefendAction);
        pinPointActions.appendChild(pinPointConquestAction);

        pinPointDiv.appendChild(pinPointImg);
        pinPointDiv.appendChild(pinPointLabel);
        pinPointDiv.appendChild(pinPointActions);
        pinPointDiv.addEventListener('mouseenter', () => {
            {
                const actionsComp = document.getElementById(`pin-point-actions-${index}`);
                actionsComp.style.display = actionsComp.style.display === "none" ? "flex" : "none";
            }
        });
        pinPointDiv.addEventListener('mouseleave', () => {
            {
                const actionsComp = document.getElementById(`pin-point-actions-${index}`);
                actionsComp.style.display = actionsComp.style.display === "none" ? "flex" : "none";
            }
        });

        gameMap.appendChild(pinPointDiv);
    });

    console.log('# Drawing pin points OK');
}

function DrawCityOverlay() {
    const cityLayout = document.getElementById("city-overlay");

    if (!['city', 'location'].includes(currentInstance.screen.layout) || (!currentInstance.screen.selectedCity && !currentInstance.screen.selectedLocation)) {
        cityLayout.style.display = "none";
        console.log('# No city overlay to display')
        return;
    }

    console.log("# Drawing city overlay...");

    cityLayout.style.display = "flex";
    const closeCityOverlayBtn = document.getElementById("close-city-overlay");
    closeCityOverlayBtn.addEventListener('click', () => {
        {
            currentInstance.screen.layout = null;
            currentInstance.screen.selectedCity = null;
            currentInstance.screen.selectedLocation = null;
            DrawGameBoardScreen();
        }
    });

    var cityData = {
        name: "-",
        description: "-",
        background: "/images/city-background.png",
        userIsOwner: false,
        buildingList: null
    };

    if (currentInstance.screen.selectedCity) {
        const selectedCityIndex = currentInstance.screen.selectedCity - 1;
        const currentUser = currentInstance.playerList[selectedCityIndex];

        cityData.name = "Ville de " + currentUser.playerName;
        cityData.description = "Civilisation : " + currentUser.civilization;
        cityData.buildingList = currentUser.buildings;
        cityData.userIsOwner = currentUser.isUser;

        if (["egyptian"].includes(currentUser.civilization)) {
            cityData.background = "/images/city-background-desert.png";
        }

    } else if (currentInstance.screen.selectedLocation) {
        const selectedLocationIndex = currentInstance.screen.selectedLocation - 1;
        const currentLocation = currentInstance.locations[selectedLocationIndex];

        console.log("selectedLocationIndex", selectedLocationIndex)
        console.log('currentLocation => ', currentLocation);

        cityData.name = currentLocation.name;
        cityData.description = "Un emplacement rêvé pour faire des affaires ...";
        cityData.buildingList = currentLocation.buildings;
        cityData.userIsOwner = currentLocation.isOwnedByUser;
    }

    const cityBuildingsGrid = document.getElementById("city-buildings-grid");
    cityBuildingsGrid.innerHTML = '';

    const cityNameComp = document.getElementById("city-name");
    cityNameComp.innerText = cityData.name;

    const backgroundDiv = document.getElementById("overlay-background-image-city");
    backgroundDiv.src = cityData.background;

    const cityDescription = document.getElementById("city-description");
    cityDescription.innerText = cityData.description;

    const buildingList = cityData.buildingList.split(",").reduce((map, item) => {
        const trimmedItem = item.trim().replace("[", "").replace("]", "").replace(" ", "");
        const [key, value] = trimmedItem.split(":");
        map[key] = value;
        return map;
    }, {});

    const wallContainer = document.getElementById("building-wall-container");
    wallContainer.innerHTML = '';

    Object.entries(buildingList).forEach(([building, count]) => {
        const buildingItem = document.createElement("div");
        buildingItem.className = "building-item";
        buildingItem.id = building + "-item";

        var buildingUpgrade = ["1", "2"].includes(count) ? count : "3";
        if (["house", "wall", "castle", "prison"].includes(building)) {
            buildingUpgrade = "1";
        }

        var buildingImage;
        if (building != "wall") {
            buildingImage = document.createElement("img");
        } else {
            buildingImage = document.createElement("div");
        }
        buildingImage.className = "building-image";
        buildingImage.alt = building + " (Niveau " + count + ")";

        const imagePath = "/images/buildings/" + building.toLowerCase() + "_" + buildingUpgrade + ".png";
        if (building != "wall") {
            buildingImage.src = imagePath;
        } else {
            buildingImage.style.backgroundImage = "url('" + imagePath + "')";
            buildingImage.style.backgroundSize = "contain";
            buildingImage.style.backgroundRepeat = "repeat-x";
            buildingImage.style.width = "100%";
        }
        buildingItem.appendChild(buildingImage);

        const buildingName = document.createElement("p");
        buildingName.innerText = building + " (Niv " + count + ")";
        buildingItem.appendChild(buildingName);

        if (cityData.userIsOwner) {
            const upgradeButton = document.createElement("button");
            upgradeButton.innerText = "Améliorer";
            buildingItem.appendChild(upgradeButton);
        }

        if (building == "wall") {
            wallContainer.appendChild(buildingItem);
        } else {
            cityBuildingsGrid.appendChild(buildingItem);
        }
    });

    DrawPlayerActions();
    DrawPlayerBuildingsInformations();

    console.log("# Drawing city overlay OK");
}

function toggleMarketLock(instancePlayerId) {
    const playerIndex = currentInstance.playerList.findIndex(p => p.instancePlayerId === instancePlayerId);
    const player = currentInstance.playerList[playerIndex];
    const marketIsOpen = player.marketIsOpen;
    const newMarketStatus = !marketIsOpen;

    console.log('market to update => ', player.market);
    setMarketData(newMarketStatus, player.market);
    setPlayerUpdateMarketSocket();
    currentInstance.playerList[playerIndex].marketIsOpen = newMarketStatus;
}

function AddItemToMarket(item, price, quantity, currency, instancePlayerId) {
    if (currentInstance.currentPlayer[item] < quantity) {
        console.error('# Not enough items to add to market');
        return false;
    }

    if (price <= 0) {
        console.error('# Price must be greater than zero');
        return false;
    }

    if (quantity <= 0) {
        console.error('# Quantity must be greater than zero');
        return false;
    }

    currentInstance.currentPlayer[item] -= quantity;
    const playerIndex = currentInstance.playerList.findIndex(p => p.instancePlayerId === instancePlayerId);
    var marketItems = JSON.parse(currentInstance.playerList[playerIndex].market);
    var itemObject = { item, price, quantity, currency }
    marketItems.push(itemObject);
    currentInstance.playerList[playerIndex].market = JSON.stringify(marketItems);
    return true;
}

function buyMarketItem(slotId, instancePlayerId) {
    const player = currentInstance.playerList.find(p => p.instancePlayerId === instancePlayerId);
    const playerMarket = JSON.parse(player.market);
    const marketItem = playerMarket[slotId];

    if (currentInstance.currentPlayer[marketItem.currency] < marketItem.price) {
        console.error('# Not enough currency to buy market item');
        return false;
    }

    buyItemOnMarket(slotId, instancePlayerId).then((data) => {
        if (data.error || data.message) {
            console.error('# Error buying market item:', data.message);
            return;
        }

        currentInstance.currentPlayer[marketItem.currency] -= marketItem.price;
        currentInstance.currentPlayer[marketItem.item] += 1;
        DrawPlayerResources();
        DrawMarketOverlay();
    });
}

function DrawMarketOverlay() {
    const marketLayout = document.getElementById("market-overlay");

    if (!['market'].includes(currentInstance.screen.layout)) {
        marketLayout.style.display = "none";
        console.log('# No market overlay to display')
        return;
    }

    console.log("# Drawing market overlay...");

    marketLayout.style.display = "flex";
    const closeMarketOverlayBtn = document.getElementById("close-market-overlay");
    closeMarketOverlayBtn.addEventListener('click', () => {
        {
            currentInstance.screen.layout = null;
            currentInstance.screen.selectedCity = null;
            currentInstance.screen.selectedLocation = null;
            DrawGameBoardScreen();
        }
    });

    var currentUserIndex = null;
    if (currentInstance.screen.selectedCity == null) {
        currentUserIndex = currentInstance.playerList.findIndex(player => player.isUser);
        console.log('currentUserIndex by isUser => ', currentUserIndex);
    } else {
        currentUserIndex = currentInstance.screen.selectedCity - 1;
    }

    console.log('currentUserIndex => ', currentUserIndex);

    const marketPlayer = currentInstance.playerList[currentUserIndex];
    console.log('marketPlayer => ', marketPlayer);

    var marketPlayerList = [];
    marketPlayerList.push(marketPlayer);

    if (currentInstance.screen.selectedCity == null) {
        currentInstance.playerList.forEach((player) => {
            if (!player.isUser) {
                marketPlayerList.push(player);
            }
        });
    }

    const marketGrid = document.getElementById("market-grid");
    marketGrid.innerHTML = '';

    const cityNameComp = document.getElementById("market-title");
    cityNameComp.innerText = "Marché";

    const backgroundDiv = document.getElementById("overlay-background-image-market");
    backgroundDiv.src = "/images/city-background.png";

    const cityDescription = document.getElementById("market-description");
    cityDescription.innerText = "coley coley coley ...";

    Object.entries(marketPlayerList).forEach(([index, player]) => {
        var playerMarketDiv = document.createElement("div");
        playerMarketDiv.className = "player-market";
        playerMarketDiv.id = `player-market-${player.instancePlayerId}`;

        const buildingList = player.buildings.split(",").reduce((map, item) => {
            const trimmedItem = item.trim().replace("[", "").replace("]", "").replace(" ", "");
            const [key, value] = trimmedItem.split(":");
            map[key] = value;
            return map;
        }, {});

        var maxAvailableMarketSlots = 0;
        if (buildingList["market"]) {
            maxAvailableMarketSlots = 3 + parseInt(buildingList["market"]) - 1;
        }

        const marketItems = JSON.parse(player.market);
        console.log('marketItems => ', marketItems);

        var slotCount = 0;

        const editionMode = player.isUser && !player.marketIsOpen;

        // Draw slots with items
        for (let slotId = 0; slotId < maxAvailableMarketSlots; slotId++) {
            const slot = marketItems[slotId];
            if (!slot || slotCount >= maxAvailableMarketSlots) {
                continue;
            }
            slotCount += 1;

            const slotItem = document.createElement("div");
            slotItem.className = "slot-item" + (editionMode ? " editable-slot-item" : " non-editable-slot-item");
            slotItem.id = `slot-${slotId}`;

            if (editionMode) {
                const deleteButton = document.createElement("button");
                deleteButton.className = "delete-market-item-button";
                deleteButton.innerText = "X";
                slotItem.appendChild(deleteButton);
                deleteButton.addEventListener('click', () => {
                    const marketItems = JSON.parse(player.market);
                    const marketItem = marketItems[slotId];
                    marketItems.splice(slotId, 1);
                    player.market = JSON.stringify(marketItems);
                    currentInstance.currentPlayer[marketItem.item] += parseInt(marketItem.quantity);
                    DrawGameBoardScreen();
                });
            }

            const marketItem = document.createElement("div");
            marketItem.className = "market-item";
            marketItem.id = `market-${slotId}`;

            const marketItemImage = document.createElement("img");
            marketItemImage.src = `/images/resources/${slot.item.toLowerCase()}.png`;
            marketItemImage.alt = slot.item;
            marketItemImage.id = `market-item-image-${slotId}`;

            const marketItemQuantity = document.createElement("span");
            marketItemQuantity.innerHTML = " x " + slot.quantity;
            marketItemQuantity.alt = slot.item;
            marketItemQuantity.id = `market-item-quantity-${slotId}`;

            marketItem.appendChild(marketItemImage);
            marketItem.appendChild(marketItemQuantity);

            const marketPriceItem = document.createElement("div");
            marketPriceItem.className = "market-price-item";
            marketPriceItem.id = `market-price-${slotId}`;

            const marketPriceItemImage = document.createElement("img");
            marketPriceItemImage.src = `/images/resources/${slot.currency.toLowerCase()}.png`;
            marketPriceItemImage.alt = slot.item;

            const marketPriceItemQuantity = document.createElement("span");
            marketPriceItemQuantity.innerHTML = " x " + slot.price;
            marketPriceItemQuantity.alt = slot.item;

            marketPriceItem.appendChild(marketPriceItemImage);
            marketPriceItem.appendChild(marketPriceItemQuantity);

            slotItem.appendChild(marketItem);
            slotItem.appendChild(marketPriceItem);

            if (!editionMode && !player.isUser) {
                const buyButton = document.createElement("button");
                buyButton.innerText = "Acheter 1 élément";
                buyButton.title = `Acheter 1 ${slot.item} pour ${slot.price} ${slot.currency}`;

                if (!player.marketIsOpen) {
                    buyButton.disabled = "disable";
                    buyButton.title = `Le marché de ce joueur est fermé`;
                }
                buyButton.addEventListener('click', () => {
                    buyMarketItem(slotId, player.instancePlayerId);
                });
                slotItem.appendChild(buyButton);
            }

            playerMarketDiv.appendChild(slotItem);
        }

        // Draw empty slot
        if (slotCount < maxAvailableMarketSlots && editionMode) {
            console.log('Adding empty slot');
            const emptySlotItem = document.createElement("div");
            emptySlotItem.className = "slot-item empty-slot-item";
            emptySlotItem.id = `empty-slot`;

            // item to sell
            const itemToSellLabel = document.createElement("label");
            itemToSellLabel.htmlFor = `item-to-sell-select`;
            itemToSellLabel.innerText = "Article à vendre : ";
            emptySlotItem.appendChild(itemToSellLabel);

            const itemToSell = document.createElement("select");
            itemToSell.id = `item-to-sell-select`;
            ["wood", "stone", "food", "gold", "diamond", "iron", "armor", "weapon", "horse", "treasure", "tool", "leather"].forEach((resource) => {
                const option = document.createElement("option");
                option.value = resource;
                option.innerText = resource.charAt(0).toUpperCase() + resource.slice(1);
                itemToSell.appendChild(option);
            });
            emptySlotItem.appendChild(itemToSell);

            // quantity
            const quantityLabel = document.createElement("label");
            quantityLabel.htmlFor = `item-quantity-input`;
            quantityLabel.innerText = "Quantité : ";
            emptySlotItem.appendChild(quantityLabel);

            const itemQuantity = document.createElement("input");
            itemQuantity.type = "number";
            itemQuantity.id = `item-quantity-input`;
            itemQuantity.min = 1;
            itemQuantity.value = 1;
            emptySlotItem.appendChild(itemQuantity);

            // currency
            const currencyLabel = document.createElement("label");
            currencyLabel.htmlFor = `item-price-input`;
            currencyLabel.innerText = "Objet échangeable : ";
            emptySlotItem.appendChild(currencyLabel);

            const itemCurrency = document.createElement("select");
            itemCurrency.id = `item-price-input`;
            emptySlotItem.appendChild(itemCurrency);

            itemCurrency.id = `item-price-select`;
            ["wood", "stone", "food", "gold", "diamond", "iron", "armor", "weapon", "horse", "treasure", "tool", "leather"].forEach((resource) => {
                const option = document.createElement("option");
                option.value = resource;
                option.innerText = resource.charAt(0).toUpperCase() + resource.slice(1);
                itemCurrency.appendChild(option);
            });
            emptySlotItem.appendChild(itemCurrency);

            // price
            const priceLabel = document.createElement("label");
            priceLabel.htmlFor = `item-price-input`;
            priceLabel.innerText = "Prix : ";
            emptySlotItem.appendChild(priceLabel);

            const itemPrice = document.createElement("input");
            itemPrice.type = "number";
            itemPrice.id = `item-price-input`;
            itemPrice.min = 0;
            itemPrice.value = 0;
            emptySlotItem.appendChild(itemPrice);

            // add button
            const addButton = document.createElement("button");
            addButton.innerText = "Ajouter l'article";
            addButton.addEventListener('click', () => {
                const selectedItem = itemToSell.value;
                const price = itemPrice.value;
                const quantity = itemQuantity.value;
                const currency = itemCurrency.value;
                if (AddItemToMarket(selectedItem, price, quantity, currency, player.instancePlayerId)) {
                    DrawGameBoardScreen();
                }
            });
            emptySlotItem.appendChild(addButton);
            playerMarketDiv.appendChild(emptySlotItem);
        }

        // empty market message
        if (slotCount == 0 && !player.isUser) {
            const noItemComp = document.createElement("p");
            noItemComp.innerText = "Aucun article en vente.";
            playerMarketDiv.appendChild(noItemComp);
        }

        // no slots at all message
        if (maxAvailableMarketSlots == 0 && player.isUser) {
            const noMarketComp = document.createElement("p");
            noMarketComp.innerText = "Construisez un marché pour vendre des articles.";
            playerMarketDiv.appendChild(noMarketComp);
        }

        // market lock button
        const marketLock = document.createElement("button");
        marketLock.className = "market-lock";
        marketLock.id = `market-lock`;

        const marketLockImg = document.createElement("img");
        if (player.marketIsOpen && player.isUser) {
            marketLockImg.src = "/images/icons/edit-market.png";
            marketLockImg.title = "Fermer le marché pour modifier les articles en vente"
        } else if (editionMode) {
            marketLockImg.src = "/images/icons/valid-market.png";
            marketLockImg.title = "Ouvrir le marché pour le rendre visible aux autres joueurs"
        } else if (player.marketIsOpen && !player.isUser) {
            marketLockImg.src = "/images/icons/opened-lock.png";
            marketLockImg.title = "Le marché du joueur est accessible"
        } else if (!player.marketIsOpen && !player.isUser) {
            marketLockImg.src = "/images/icons/closed-lock.png";
            marketLockImg.title = "Le marché du joueur est fermé"
        }
        marketLock.appendChild(marketLockImg);

        if (player.isUser) {
            marketLock.addEventListener('click', () => {
                toggleMarketLock(player.instancePlayerId);
                DrawMarketOverlay();
            });
        } else {
            marketLock.disabled = "disabled";
        }
        playerMarketDiv.appendChild(marketLock);

        marketGrid.appendChild(playerMarketDiv);
    });

    DrawPlayerActions();
    DrawPlayerBuildingsInformations();

    console.log("# Drawing market overlay OK");
}

function DrawPlayerArmy() {
    console.log('# Drawing player army...');
    const playerList = currentInstance.playerList;

    if (!playerList || playerList.length == 0) {
        console.log('# No player army to display');
        return;
    }

    playerList.forEach((element, index) => {
        if (!element.civilization) {
            return;
        }

        const oldArmyImg = document.getElementById(`player-army-${element.playerName}`);
        if (oldArmyImg != null) {
            const oldArmyParent = oldArmyImg.parentElement
            const oldArmyLocation = oldArmyParent.id;
            if (oldArmyLocation == `pin-point-${element.armyPosition}` || (oldArmyLocation == `pin-point-player-${index}` && element.armyPosition == -1)) {
                console.log('# Army already in correct position => ', oldArmyLocation);
                oldArmyImg.title = `Armée du joueur ${element.playerName}, Nombre de soldat : ${element.army}, famine : ${element.food < 0 ? 'Oui' : 'Non'}, puissance réelle : ${element.food < 0 ? (element.army == 0 ? 0 : element.army / 2) : element.army}`;
                oldArmyImg.querySelector(".player-army-count").innerText = element.army;
                return;
            } else {
                oldArmyImg.remove();
            }
        }

        const userArmy = document.createElement("div");
        userArmy.className = "player-army-container";
        userArmy.id = `player-army-${element.playerName}`;
        userArmy.title = `Armée du joueur ${element.playerName}, Nombre de soldat : ${element.army}, famine : ${element.food < 0 ? 'Oui' : 'Non'}, puissance réelle : ${element.food < 0 ? (element.army == 0 ? 0 : element.army / 2) : element.army}`;

        const userArmyImg = document.createElement("img");
        userArmyImg.className = "player-army-image";
        userArmyImg.style.borderColor = element.color;
        userArmyImg.src = "/images/" + element.civilization + "-army.jpg";
        userArmyImg.alt = `${element.playerName} ${element.civilization} army`;
        userArmy.appendChild(userArmyImg);

        const userArmyCount = document.createElement("span");
        userArmyCount.className = "player-army-count";
        userArmyCount.innerText = element.army;
        userArmy.appendChild(userArmyCount);

        if (element.armyPosition == -1) {
            const playerPinPoint = document.getElementById(`pin-point-player-${index}`);
            if (playerPinPoint) {
                playerPinPoint.appendChild(userArmy);
            }
        } else {
            const locationPinPoint = document.getElementById(`pin-point-${element.armyPosition}`);
            if (locationPinPoint) {
                locationPinPoint.appendChild(userArmy);
            }
        }
    });

    console.log('# Drawing player army OK');
}

function DrawInstanceWaitingScreen() {
    const waitingScreen = document.getElementById("game-board-connection-container");

    const instanceStatus = currentInstance.data;

    if (!instanceStatus || instanceStatus?.gameState != 'waiting') {
        console.log('# No need to display waiting screen');
        waitingScreen.style.display = "none";
        return;
    }

    waitingScreen.style.display = "flex";

    DrawGameParamsEditor();

    setReadyButtonListener();
    setStartGameButtonListener();
}

function DrawWinningScreen() {
    const endingScreen = document.getElementById("game-board-end-screen");

    const instanceStatus = currentInstance.data;

    if (!instanceStatus || instanceStatus?.gameState != 'completed') {
        console.log('# No need to display ending screen');
        endingScreen.style.display = "none";
        return;
    }

    endingScreen.style.display = "flex";

    const instanceParams = JSON.parse(instanceStatus.parameters);
    console.log('instanceParams => ', instanceParams);
    const winnerList = instanceParams.winner.toString().split(",").map(id => {
        const player = currentInstance.playerList.find(p => p.instancePlayerId.toString() === id.trim());
        return player;
    });

    var playerIsWinner = false;
    if (winnerList.find(p => p.isUser)) {
        playerIsWinner = true;
    }

    const endingTitle = document.createElement("h2");
    endingTitle.innerHTML = playerIsWinner ? "Victoire !" : "Défaite !";
    endingScreen.appendChild(endingTitle);

    const endingMessage = document.createElement("p");
    var html = "La victoire a été remportée par " + (winnerList.length > 1 ? "les joueurs " : "le joueur ") + winnerList.map(p => "<b>" + p.playerName + "</b>").join(", ");
    endingMessage.innerHTML = html;
    endingScreen.appendChild(endingMessage);

    const playerListComp = document.createElement("div");
    playerListComp.className = "player-list-container";
    endingScreen.appendChild(playerListComp);

    Object.entries(currentInstance.playerList).forEach(([index, element]) => {
        const playerItem = document.createElement("div");
        playerItem.className = "player-item-container " + (winnerList.find(p => p.instancePlayerId === element.instancePlayerId) ? "player-winner-item" : "player-loser-item");

        const playerImgContainer = document.createElement("div");
        playerImgContainer.className = "player-item-image-container";
        playerImgContainer.id = `player-item-${element.playerName}`;

        const playerImg = document.createElement("img");
        playerImg.className = "player-item-image";
        playerImg.style.borderColor = element.color;
        const src = element.civilization ? "/images/" + element.civilization + "-army.jpg" : "/images/icons/no-icon-picture.png";
        playerImg.src = src;
        playerImg.title = `${element.civilization}`;
        playerImgContainer.appendChild(playerImg);
        playerItem.appendChild(playerImgContainer);

        const playerInfoContainer = document.createElement("div");
        playerInfoContainer.className = "player-item-info-container";

        const playerNameContainer = document.createElement("div");
        playerNameContainer.className = "player-item-name-container";

        const playerNameComp = document.createElement("span");
        playerNameComp.className = "player-item-name";
        playerNameComp.innerHTML = element.playerName;
        playerNameContainer.appendChild(playerNameComp);

        if (element.isOwner) {
            const administratorImg = document.createElement("img");
            administratorImg.className = "player-item-administrator-image";
            administratorImg.src = "/images/icons/crown.png";
            playerNameContainer.appendChild(administratorImg);
        }
        playerInfoContainer.appendChild(playerNameContainer);

        const playerStatusComp = document.createElement("span");

        playerStatusComp.className = "player-item-status";
        var html = "<ul>";
        html += "<li>" + element.treasure + " <img src='/images/resources/treasure.png' alt='Treasure' class='player-resource-icon'/></li>";
        html += "<li>" + element.army + " <img src='/images/resources/army.png' alt='Army' class='player-resource-icon'/></li>";
        html += "</ul>";
        playerStatusComp.innerHTML = html;
        playerInfoContainer.appendChild(playerStatusComp);

        playerItem.appendChild(playerInfoContainer);
        playerListComp.appendChild(playerItem);
    });

    const backButton = document.createElement("button");
    backButton.className = "back-to-menu-base-button";
    backButton.id = "back-to-menu-base-button";
    backButton.innerText = "Retour au menu";
    backButton.addEventListener('click', async () => {
        await disconnectSocket();
        deleteCookie("currentInstanceId");
        redirectToUrl("/home");
    });
    endingScreen.appendChild(backButton);

    console.log('# Displaying winning screen OK');
}

function DrawGameBoardScreen() {
    DrawInstanceData();
    DrawWinningScreen();
    DrawStartGameButton();
    DrawInstanceWaitingScreen();
    DrawControls();
    DrawPlayerResources();
    DrawPlayerList();
    DrawGameBoard();
    DrawPinPoints();
    DrawPlayerArmy();
    DrawCityOverlay();
    DrawMarketOverlay();
}

function DrawPlayersDataScreen() {
    DrawPlayerResources();
    DrawPlayerList();
    DrawPlayerArmy();
    DrawCityOverlay();
    DrawMarketOverlay();
}

DrawGameBoardScreen();