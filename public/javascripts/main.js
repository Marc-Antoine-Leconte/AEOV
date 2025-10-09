// Button click functions for AEOV application

const socket = io()

const currentInstance = {
    players: {}
};
const currentPlayer = {
    name: "boby"
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

function createInstance() {
    alert('Create Instance button clicked!');
    console.log('Creating new instance...');

    const instanceNameInput = document.getElementById("new-instance-name");
    const instanceName = instanceNameInput.value || "Une super partie !";
    console.log('# Instance Name =>', instanceName);

    createInstanceFromAPI({ name: instanceName }).then((data) => {
        console.log('# createInstanceFromAPI - data =>', data);
        if (data.error || data.message) {
            alert("Une erreur est survenue lors de la création de l'instance : " + data.message);
            return
        }

        DisplayInstanceList();
    });
}

function joinInstance() {
    console.log (this);
    const instanceName = this.value;
    const instanceId = this.id;
    const confirmed = confirm(`Do you want to join instance: ${instanceName}?`);
    
    if (confirmed) {
        console.log('Joining instance:', instanceName);
        console.log('# instance ID =>', instanceId);
        console.log(socket);
        socket.emit('playerJoinInstance', { name: currentPlayer.name, instanceId: instanceId });
        console.log('done');
    }
}

