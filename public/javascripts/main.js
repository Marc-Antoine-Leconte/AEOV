// Button click functions for AEOV application

const socket = io()

const currentInstance = {
    players: {}
};
const currentPlayer = {
    name: "boby",
    id: 1
};

// REGULAR INSTANCE UPDATE
socket.on('updateInstanceStatus', (instanceStatus) => {
    console.log('Instance Status:', instanceStatus);

    currentInstance.gameState = instanceStatus.gameState;
    currentInstance.currentPlayer = instanceStatus.currentPlayer;

    for (const id in instanceStatus.players) {
        const backEndPlayer = instanceStatus.players[id]

        if (!currentInstance.players[id]) {
            currentInstance.players[id] = {
                name: backEndPlayer.name,
                status: backEndPlayer.status
            };
        }
    }
    console.log('Current Instance State:', currentInstance);
});

// RECEIVED WHEN THE GAME IS ON
// socket.on('startGame', (backEndPlayers) => {
//     console.log('Players in the instance:', backEndPlayers);

//     for (const id in backEndPlayers) {
//         const backEndPlayer = backEndPlayers[id]

//         if (!players[id]) {
//             players[id] = new Player({
//                 name: backEndPlayer.name,
//             })
//         }
//     }
// });

function connectToInstance(instanceId) {
    console.log('Connecting to instance:', instanceId);
    socket.emit('playerJoinInstance', { name: currentPlayer.name, instanceId: instanceId });
    
    redirectToUrl('/game');
}

function createInstance(instanceName, instanceMode) {
    console.log('Creating new instance...');
    console.log('# Instance Name =>', instanceName);
    console.log('# Instance Mode =>', instanceMode);

    createInstanceFromAPI({ name: instanceName, mode: instanceMode, ownerId: currentPlayer.id }).then((data) => {
        console.log('# createInstanceFromAPI - data =>', data);
        if (data.error) {
            alert("Une erreur est survenue lors de la création de l'instance : " + data.message);
            return
        }

        console.log('Instance created successfully:', data);
        connectToInstance(data.id);
    });
}

function joinInstance(instanceId) {
    console.log('Joining instance:', instanceId);
    console.log('# Instance ID =>', instanceId);
    
    joinInstanceFromAPI(instanceId).then((data) => {
        if (data.error) {
            alert("Une erreur est survenue au moment de rejoindre l'instance : " + data.message);
            return
        } else {
            connectToInstance(instanceId);
        }
    });
}

