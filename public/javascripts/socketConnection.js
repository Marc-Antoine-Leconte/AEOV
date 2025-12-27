var socket = null;
const socketIsOn = !process.env.NODE_ENV === 'production';

const joinInstanceSocket = () => {
    if (!socketIsOn) {
        return;
    }

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
    if (!socketIsOn) {
        return;
    }
    socket.emit("playerReadyToPlay", {
        instanceId: getCookie("currentInstanceId"),
    });
}

const ownerStartGameSocket = () => {
    if (!socketIsOn) {
        return;
    }
    socket.emit("ownerStartGame", {
        instanceId: getCookie("currentInstanceId"),
    });
}

const setPlayerActionSocket = () => {
    if (!socketIsOn) {
        return;
    }
    socket.emit("playerAction", {
        instanceId: getCookie("currentInstanceId"),
    });
    fetchAndDrawBoardScreen();
}

const setEndTurnSocket = () => {
    if (!socketIsOn) {
        return;
    }
    socket.emit("endTurn", {
        instanceId: getCookie("currentInstanceId"),
    });
    fetchAndDrawBoardScreen();
}

const setPlayerUpdateMarketSocket = () => {
    if (!socketIsOn) {
        return;
    }
    socket.emit("marketUpdate", {
        instanceId: getCookie("currentInstanceId"),
    });
}

const setPlayerMoveArmySocket = () => {
    if (!socketIsOn) {
        return;
    }
    socket.emit("armyMove", {
        instanceId: getCookie("currentInstanceId"),
    });
}

