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
    // Add your create instance logic here
    console.log('Creating new instance...');
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

let btn = document.querySelectorAll('.select-instance-button');
for (i = 0; i < btn.length; i++) {
    btn[i].addEventListener('click', joinInstance);
}

function searchInstance() {
    const instanceCode = document.getElementById('instanceCode').value;
    
    if (!instanceCode.trim()) {
        alert('Please enter an instance code');
        return;
    }
    
    alert(`Searching for instance: ${instanceCode}`);
    console.log('Searching for instance:', instanceCode);
    
    // Add your search logic here
    // Example: Make an AJAX request to search for the instance
    // fetch(`/search-instance/${instanceCode}`)
    //     .then(response => response.json())
    //     .then(data => console.log(data));
}

