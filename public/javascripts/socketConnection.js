let ablyClient = null;
let instanceChannel = null;
let channelName = null;

const joinInstanceSocket = async (instanceId) => {

    console.log("# Initialize websocket")
    ablyClient = new Ably.Realtime({
        authUrl: "/api/ably/auth",
    });

    await ablyClient.connection.once("connected");
    
    channelName = "instance:" + instanceId
    instanceChannel = ablyClient.channels.get(channelName);

    // REGULAR INSTANCE UPDATE
    instanceChannel.subscribe((message) => {
        if (message = "updateInstanceStatus") {
            console.log('-- Socket ping to update status');
            fetchAndDrawBoardScreen();
        }
        else if (message = "armyMove") {
            console.log('-- Socket ping a user moved his army')
            fetchAndDrawBoardScreen();
        }
        else if (message = "marketUpdate") {
            console.log('-- Socket ping a user updated his market')
            fetchAndDrawPlayersInfo();
        }
        else if (message = "error") {
            console.error("-- Socket error => ", message);
        } else {
            console.log("-- Socket unknown category message =>", message);
        }
    });

    instanceChannel.connection.on('failed', function () { console.log('✗ Connection failed from Ably.'); })
    instanceChannel.on('attached', (stateChange) => {
        console.log('channel ' + channel.name + ' is now attached');
        console.log('Message continuity on this channel ' + (stateChange.resumed ? 'was' : 'was not') + ' preserved');
    });

    instanceChannel.publish('updateInstanceStatus', 'Le joueur ' + getCookie("currentPlayerName") + " a rejoint la partie");
}

const setPlayerReadyToPlaySocket = () => {
    instanceChannel.publish('updateInstanceStatus', 'Le joueur ' + getCookie("currentPlayerName") + " est prêt à jouer");
}

const ownerStartGameSocket = () => {
    instanceChannel.publish('updateInstanceStatus', 'Le joueur admin ' + getCookie("currentPlayerName") + " a démarré la partie");
}

const setPlayerActionSocket = () => {
    instanceChannel.publish('updateInstanceStatus', 'Le joueur ' + getCookie("currentPlayerName") + " a effectué une action");
    //fetchAndDrawBoardScreen();
}

const setEndTurnSocket = () => {
    instanceChannel.publish('updateInstanceStatus', 'Le joueur ' + getCookie("currentPlayerName") + " a terminé son tour");
    //fetchAndDrawBoardScreen();
}

const setPlayerUpdateMarketSocket = () => {
    instanceChannel.publish('marketUpdate', 'Le joueur ' + getCookie("currentPlayerName") + " a mis à jour le marché");
}

const setPlayerMoveArmySocket = () => {
    instanceChannel.publish('armyMove', 'Le joueur ' + getCookie("currentPlayerName") + " a bougé son armée");
}

const disconnectSocket = async () => {
    ablyClient.connection.close();
    await ablyClient.connection.once("closed", function () {
        console.log("Closed the connection to Ably.")
      });
}

