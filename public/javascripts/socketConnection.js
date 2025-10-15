var socket = null;

const joinInstanceSocket = () => {
    socket = io();

    // REGULAR INSTANCE UPDATE
    socket.on('updateInstanceStatus', () => {
        console.log('-- Socket ping to update status');
        fetchAndDrawBoardScreen();
    });

    socket.on('error', (message) => {
        console.error(message);
    });

    socket.emit('playerJoin', {
        playerId: getCookie("currentPlayerId"),
        playerName: getCookie("currentPlayerName"),
        instanceId: getCookie("currentInstanceId"),
        instanceName: getCookie("currentInstanceName"),
    });
}

const setPlayerReadyToPlaySocket = () => {
    socket.emit("playerReadyToPlay", {
        instanceId: getCookie("currentInstanceId"),
    });
}

const ownerStartGameSocket = () => {
    socket.emit("ownerStartGame", {
        instanceId: getCookie("currentInstanceId"),
    });
}

const setEndTurnSocket = () => {
    socket.emit("endTurn", {
        instanceId: getCookie("currentInstanceId"),
    });
}

