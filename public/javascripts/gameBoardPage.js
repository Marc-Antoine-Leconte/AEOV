
function fetchAndDrawBoardScreen() {
    const instanceId = getCookie("currentInstanceId");

    if (!instanceId) {
        console.error('No instance ID found in cookies.');
        return;
    }
    fetchGameInfo().then((response) => {
        console.log("# DisplayInstanceData - data =>", response);

        const newPlayerList = response.data.players?.map(player => {
            var newPlayerObj = { ...player };

            if (currentInstance.playerList && currentInstance.playerList.length > 0) {
                const oldPlayerObj = currentInstance.playerList.find(p => p.instancePlayerId === player.instancePlayerId);
                if (oldPlayerObj) {
                    if (oldPlayerObj.market != player.market && !player.marketIsOpen && player.isUser) {
                        newPlayerObj.market = oldPlayerObj.market;
                    }
                }
            }

            return newPlayerObj;
        });

        currentInstance.data = response.data.instance;
        currentInstance.playerList = newPlayerList;
        currentInstance.currentPlayer = response.data.currentPlayer;
        currentInstance.locations = response.data.locations;

        // Add player building to player data
        const playerBuildings = stringToMap(currentInstance.currentPlayer.buildings);
        Object.entries(playerBuildings).forEach(([key, value]) => {
            if (currentInstance.currentPlayer[key] == null) {
                currentInstance.currentPlayer[key] = value;
            } else {
                currentInstance.currentPlayer[key] = parseInt(currentInstance.currentPlayer[key]) + parseInt(value);
            }
        });

        const userLocations = currentInstance.locations.filter(location => location.isOwnedByUser);
        Object.entries(userLocations).forEach(([index, location]) => {

            const locationBuildings = stringToMap(location.buildings);
            Object.entries(locationBuildings).forEach(([key, value]) => {
                if (currentInstance.currentPlayer[key] == null) {
                    currentInstance.currentPlayer[key] = value;
                } else {
                    currentInstance.currentPlayer[key] = parseInt(currentInstance.currentPlayer[key]) + parseInt(value);
                }
            });
        });

        console.log('||> Current Instance Data:', currentInstance);
        const instanceDataErrorComp = document.getElementById("game-board-instance-data-error-message");
        if (response.error || !response.data || response.data.length == 0) {
            instanceDataErrorComp.innerHTML = "Une erreur est survenue lors de la récupération de l'instance : <b>" + data.message + "</b>";
            instanceDataErrorComp.hidden = false;
            return
        } else {
            instanceDataErrorComp.hidden = true;
        }

        DrawGameBoardScreen();
        if (currentInstance.actions && currentInstance.actions.length > 0) {
            console.log('Actions already fetched, skipping fetch');
            return;
        }

        fetchGameActions().then((response) => {

            if (!response || response.length == 0) {
                console.log('No actions fetched from server');
                return;
            }

            const playerActions = response.map(action => {
                const effects = stringToMap(action.effects);
                const requiredBuildings = stringToMap(action.requiredBuildings);
                const requiredResources = stringToMap(action.requiredResources);

                return { ...action, effects, requiredBuildings, requiredResources };
            });

            currentInstance.actions = playerActions;
            DrawPlayerActions();
        });
    });
}

function fetchAndDrawPlayersInfo() {
    const instanceId = getCookie("currentInstanceId");

    if (!instanceId) {
        console.error('No instance ID found in cookies.');
        return;
    }

    fetchPlayersInfo().then((response) => {
        console.log("# DisplayPlayersInfo - data =>", response);

        const newPlayerList = response.data?.map(player => {
            var newPlayerObj = { ...player };

            if (currentInstance.playerList && currentInstance.playerList.length > 0) {
                const oldPlayerObj = currentInstance.playerList.find(p => p.instancePlayerId === player.instancePlayerId);
                if (oldPlayerObj) {
                    if (oldPlayerObj.market != player.market && !player.marketIsOpen && player.isUser) {
                        newPlayerObj.market = oldPlayerObj.market;
                    }
                }
            }

            return newPlayerObj;
        });

        currentInstance.playerList = newPlayerList;
        DrawPlayersDataScreen();
    });
}

function InitGameBoardPage() {
    const currentId = getCookie("currentPlayerId");
    if (!currentId || currentId == "" || isNaN(currentId)) {
        console.log('Player is not connected, redirecting to menu page...');
        redirectToUrl("/");
        return;
    }
    console.log('Player is connected, staying on game page...');

    const currentInstanceId = getCookie("currentInstanceId");
    if (!currentInstanceId || currentInstanceId == "" || isNaN(currentInstanceId)) {
        console.log(currentInstanceId)
        console.log('Connected to No instance, redirecting to home page...');
        redirectToUrl("/home");
        return;
    }

    joinInstanceSocket();
    setDisconnectButtonListener();
    setLeaveInstanceButtonListener();
    setToggleInfoBarButtonListener();
    fetchAndDrawBoardScreen();
    DisplayUserInfo();
}

InitGameBoardPage();
