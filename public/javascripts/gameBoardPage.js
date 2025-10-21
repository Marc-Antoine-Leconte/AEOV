
function fetchAndDrawBoardScreen() {
    const instanceId = getCookie("currentInstanceId");

    if (!instanceId) {
        console.error('No instance ID found in cookies.');
        return;
    }
    fetchGameInfo().then((response) => {
        console.log("# DisplayInstanceData - data =>", response);

        currentInstance.data = response.data.instance;
        currentInstance.playerList = response.data.players;
        currentInstance.currentPlayer = response.data.currentPlayer;

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
        fetchGameActions().then((response) => {

            if (!response || response.length == 0) {
                console.log('No actions fetched from server');
                return;
            }

            console.log("# DisplayGameActions - data =>", response);
            const playerActions = response.map(action => {
                const effects = action.effects.split(",").reduce((map, item) => {
                    const trimmedItem = item.trim().replace("[", "").replace("]", "").replace(" ", "");
                    const [key, value] = trimmedItem.split(":");
                    map[key] = value;
                    return map;
                }, {});

                const requiredBuildings = action.requiredBuildings.split(",").reduce((map, item) => {
                    const trimmedItem = item.trim().replace("[", "").replace("]", "").replace(" ", "");
                    const [key, value] = trimmedItem.split(":");
                    map[key] = value;
                    return map;
                }, {});

                const requiredResources = action.requiredResources.split(",").reduce((map, item) => {
                    const trimmedItem = item.trim().replace("[", "").replace("]", "").replace(" ", "");
                    const [key, value] = trimmedItem.split(":");
                    if (key && value) {
                        map[key] = value;
                    }
                    return map;
                }, {});

                return { ...action, effects, requiredBuildings, requiredResources };
            });

            currentInstance.actions = playerActions;
            DrawPlayerActions();
        });
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
    fetchAndDrawBoardScreen();
    DisplayUserInfo();
}

InitGameBoardPage();
