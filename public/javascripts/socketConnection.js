var socket = null;

const joinInstanceSocket = () => {
    socket = io();

    // REGULAR INSTANCE UPDATE
    socket.on('updateInstanceStatus', () => {
        console.log('-- Socket ping to update status');
        fetchAndDrawBoardScreen();
    });

    socket.on('armyMove', () => {
        console.log('-- Socket ping a user moved his army')
        fetchAndDrawBoardScreen();
    })

    socket.on('marketUpdate', () => {
        console.log('-- Socket ping a user updated his market')
        fetchAndDrawPlayersInfo();
    })

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

const setPlayerActionSocket = () => {
    socket.emit("playerAction", {
        instanceId: getCookie("currentInstanceId"),
    });
    fetchAndDrawBoardScreen();
}

const setEndTurnSocket = () => {
    socket.emit("endTurn", {
        instanceId: getCookie("currentInstanceId"),
    });
    fetchAndDrawBoardScreen();
}

const setPlayerUpdateMarketSocket = () => {
    socket.emit("marketUpdate", {
        instanceId: getCookie("currentInstanceId"),
    });
}

const setPlayerMoveArmySocket = () => {
    socket.emit("armyMove", {
        instanceId: getCookie("currentInstanceId"),
    });
}

