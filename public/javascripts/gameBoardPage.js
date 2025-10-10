
function DisplayInstanceData() {
    fetchInstanceData("1").then((data) => {
        console.log("# DisplayInstanceData - data =>", data);

        const instanceDataErrorComp = document.getElementById("game-board-instance-data-error-message");
        if (data.error || data.length == 0 || !data) {
            instanceDataErrorComp.innerHTML = "Une erreur est survenue lors de la récupération de l'instance : <b>" + data.message + "</b>";
            instanceDataErrorComp.hidden = false;
            return
        } else {
            instanceDataErrorComp.hidden = true;
        }

        DrawInstanceData();
    });
}

function onStartGameButtonClick() {
    console.log('Start Game button clicked');
    OwnerStartGameSocket();
}

function setStartGameButtonListener() {
    const startGameBtn = document.getElementById("start-game-button");
    startGameBtn.addEventListener('click', onStartGameButtonClick);
}

function onReadyButtonClick() {
    console.log('Ready button clicked');
    setPlayerReadyToPlaySocket();
}

function setReadyButtonListener() {
    const readyBtn = document.getElementById("ready-button");
    readyBtn.addEventListener('click', onReadyButtonClick);
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
    setStartGameButtonListener();
    DisplayInstanceData();
    DisplayUserInfo();
    DrawInstanceWaitingScreen();
}

InitGameBoardPage();
