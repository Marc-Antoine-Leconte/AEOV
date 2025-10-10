const socket = io()

// REGULAR INSTANCE UPDATE
socket.on('updateInstanceStatus', (instanceStatus) => {
    console.log('Instance Status:', instanceStatus);

    currentInstance = { ...currentInstance, ...instanceStatus };
    console.log('Current Instance State:', currentInstance);
    DrawGameBoardScreen();
});

socket.on('updatePlayerList', (playerList) => {
    console.log('Player List:', playerList);

    currentInstance.playerList = playerList;
    console.log('Current Instance State:', currentInstance);
});

const joinInstanceSocket = () => {
    socket.emit('playerJoin', {
        playerId: getCookie("currentPlayerId"),
        playerName: getCookie("currentPlayerName"),
        instanceId: getCookie("currentInstanceId"),
    });
}

const setPlayerReadyToPlaySocket = () => {
    socket.emit("playerReadyToPlay", {
        civilization: "romans",
        color: "red",
        instanceId: getCookie("currentInstanceId"),
    });
}

const OwnerStartGameSocket = () => {
    socket.emit("ownerStartGame", {
        instanceId: getCookie("currentInstanceId"),
    });
}

const setPlayerActionSocket = (action) => {
    socket.emit("playerAction", {
        action: action,
        instanceId: getCookie("currentInstanceId"),
    });
}
