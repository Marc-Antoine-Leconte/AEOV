function addResourceDuringPlayerTurn(resourceType, amount) {
    const currentPlayer = currentInstance.currentPlayer;
    currentPlayer[resourceType] = (currentPlayer[resourceType] || 0) + amount;

    console.log(`# Added ${amount} ${resourceType} to ${currentPlayer.name}'s resources`);
}

function subtractResourceDuringPlayerTurn(resourceType, amount) {
    const currentPlayer = currentInstance.currentPlayer;
    currentPlayer[resourceType] = (currentPlayer[resourceType] || 0) - amount;

    console.log(`# Subtracted ${amount} ${resourceType} from ${currentPlayer.name}'s resources`);
}

function executeAction(actionId, cost, effects, next, actionParam = null) {
    currentInstance.currentPlayerTurn.push({actionId, actionParam});

    Object.entries(cost).forEach(([key, value]) => {
        subtractResourceDuringPlayerTurn(key, parseInt(value));
    });

    Object.entries(effects).forEach(([key, value]) => {
        addResourceDuringPlayerTurn(key, parseInt(value));
    });

    if (actionId === 40) { // If the action is "Move Army"
        currentInstance.playerList.forEach((element, id) => {
            if (element.isUser) {
                currentInstance.playerList[id].armyPosition = actionParam;
                return;
            }
        });
    }

    console.log('# Executed actions:', currentInstance.currentPlayerTurn);

    postGameActions(currentInstance.currentPlayerTurn).then((data) => {
        console.log('# End turn actions posted:', data);
        if (data.error || data.message) {
            console.log('# Error posting end turn actions:', data.message);
        } else {
            next();
        }

        console.log('failure messages:', data.failureMessages);
        currentInstance.currentPlayerTurn = [];
        fetchAndDrawBoardScreen();
    });
}