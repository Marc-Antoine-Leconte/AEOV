// const socket = io()

// // REGULAR INSTANCE UPDATE
// socket.on('updateInstanceStatus', (instanceStatus) => {
//     console.log('Instance Status:', instanceStatus);

//     currentInstance.instanceStatus = { ...currentInstance.instanceStatus, ...instanceStatus };
//     console.log('||> Current Instance:', currentInstance);
//     DrawGameBoardScreen();
// });

// socket.on('updatePlayerList', (playerList) => {
//     console.log('Player List:', playerList);

//     currentInstance.playerList = playerList;
//     console.log('Current Instance State:', currentInstance);
// });

// const joinInstanceSocket = () => {
//     socket.emit('playerJoin', {
//         playerId: getCookie("currentPlayerId"),
//         playerName: getCookie("currentPlayerName"),
//         instanceId: getCookie("currentInstanceId"),
//         instanceName: getCookie("currentInstanceName"),
//     });
// }

// const setPlayerReadyToPlaySocket = () => {
//     socket.emit("playerReadyToPlay", {
//         civilization: "romans",
//         color: "red",
//         instanceId: getCookie("currentInstanceId"),
//     });
// }

// const OwnerStartGameSocket = () => {
//     socket.emit("ownerStartGame", {
//         instanceId: getCookie("currentInstanceId"),
//     });
// }

// const setPlayerActionSocket = (action) => {
//     socket.emit("playerAction", {
//         action: action,
//         instanceId: getCookie("currentInstanceId"),
//     });
// }
