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

function executeAction(actionId, cost, effects, next) {
    currentInstance.currentPlayerTurn.push(actionId);

    Object.entries(cost).forEach(([key, value]) => {
        subtractResourceDuringPlayerTurn(key, parseInt(value));
    });

    Object.entries(effects).forEach(([key, value]) => {
        addResourceDuringPlayerTurn(key, parseInt(value));
    });

    next();
}