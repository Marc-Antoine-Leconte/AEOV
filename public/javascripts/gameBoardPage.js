
function fetchAndDrawBoardScreen() {
    const instanceId = getCookie("currentInstanceId");

    if (!instanceId) {
        console.error('No instance ID found in cookies.');
        return;
    }
    fetchInstance(instanceId).then((data) => {
        console.log("# DisplayInstanceData - data =>", data);

        currentInstance.data = { ...currentInstance.data, ...data };

        console.log('||> Current Instance Data:', currentInstance);
        const instanceDataErrorComp = document.getElementById("game-board-instance-data-error-message");
        if (data.error || data.length == 0 || !data) {
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

    //joinInstanceSocket();
    setDisconnectButtonListener();
    setLeaveInstanceButtonListener();
    fetchAndDrawBoardScreen();
    DisplayUserInfo();
    DrawInstanceWaitingScreen();
}

InitGameBoardPage();
