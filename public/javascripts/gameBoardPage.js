
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
