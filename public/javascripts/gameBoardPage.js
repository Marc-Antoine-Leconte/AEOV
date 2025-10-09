function DisplayInstanceData() {
    fetchInstanceData("1").then((data) => {
        console.log("# DisplayInstanceData - data =>", data);

        const instanceDataErrorComp = document.getElementById("game-board-instance-data-error-message");
        if (data.error || data.message || data.length == 0 || !data) {
            instanceDataErrorComp.innerHTML = "Une erreur est survenue lors de la récupération de l'instance : <b>" + data.message + "</b>";
            instanceDataErrorComp.hidden = false;
            return
        } else {
            instanceDataErrorComp.hidden = true;
        }

        const instanceNameComp = document.getElementById("game-board-instance-name");
        const instanceModeComp = document.getElementById("game-board-instance-mode");
        const instanceOwnerComp = document.getElementById("game-board-owner");
        const instanceStatusComp = document.getElementById("game-board-status");
        const instanceCurrentTurnComp = document.getElementById("game-board-current-turn");
        const instanceCurrentPlayerComp = document.getElementById("game-board-current-player");

        instanceNameComp.innerHTML = data.name;
        instanceModeComp.innerHTML = data.mode;
        instanceOwnerComp.innerHTML = data.owner;
        instanceStatusComp.innerHTML = data.gameState;
        instanceCurrentTurnComp.innerHTML = data.rounds;
        instanceCurrentPlayerComp.innerHTML = data.currentPlayer;

        console.log('# Display of Instance Data OK');
    });
}