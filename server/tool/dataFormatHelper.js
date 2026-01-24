export const getPublicInstancePlayerData = (instancePlayerData, instanceData, currentPlayerData) => {
    const dataValues = instancePlayerData.dataValues ? instancePlayerData.dataValues : instancePlayerData;

    console.log('getPublicInstancePlayerData - dataValues => ', dataValues);
    console.log('getPublicInstancePlayerData - currentPlayerData => ', currentPlayerData);
    const result = {
        playerName: dataValues.name,
        civilization: dataValues.civilization,
        color: dataValues.color,
        isOwner: (dataValues.playerId == instanceData.ownerId),
        isCurrentPlayer: (dataValues.id == instanceData.currentPlayerId),
        isUser: (dataValues.playerId == currentPlayerData.id),
        buildings: dataValues.buildings,
        armyPosition: dataValues.armyPosition,
        endTurn: dataValues.endTurn,
        army: dataValues.army,
        food: dataValues.food,
        market: dataValues.market,
        marketIsOpen: dataValues.marketIsOpen,
        instancePlayerId: dataValues.id,
    }
    return result;
}

export const getPublicInstancePlayerScoreData = (instancePlayerData, instanceData, currentPlayerData) => {
    const dataValues = instancePlayerData.dataValues ? instancePlayerData.dataValues : instancePlayerData;

    console.log('getPublicInstancePlayerScoreData - dataValues => ', dataValues);
    console.log('getPublicInstancePlayerScoreData - currentPlayerData => ', currentPlayerData);
    const result = {
        playerName: dataValues.name,
        civilization: dataValues.civilization,
        color: dataValues.color,
        isOwner: (dataValues.playerId == instanceData.ownerId),
        isCurrentPlayer: (dataValues.id == instanceData.currentPlayerId),
        isUser: (dataValues.playerId == currentPlayerData.id),
        buildings: dataValues.buildings,
        armyPosition: dataValues.armyPosition,
        endTurn: dataValues.endTurn,
        army: dataValues.army,
        food: dataValues.food,
        market: dataValues.market,
        marketIsOpen: dataValues.marketIsOpen,
        instancePlayerId: dataValues.id,
        treasure: dataValues.treasure,
    }
    return result;
}

export const getPublicInstancePlayerDataList = (instancePlayerDataList, instanceData, currentPlayerData) => {
    return instancePlayerDataList.map((element) => getPublicInstancePlayerData(element, instanceData, currentPlayerData));
}

export const getPrivatePlayerData = (playerData, accessToken) => {
    const dataValues = playerData.dataValues ? playerData.dataValues : playerData;
    const result = {
        name: dataValues.name,
        accessToken: accessToken,
    }
    return result;
}

export const getPublicInstanceData = (instanceData, currentPlayerData) => {
    const dataValues = instanceData.dataValues ? instanceData.dataValues : instanceData;
    const playerDataValues = currentPlayerData.dataValues ? currentPlayerData.dataValues : currentPlayerData;

    console.log('getPublicInstanceData - dataValues => ', dataValues);
    const result = {
        id: dataValues.id,
        mode: dataValues.mode,
        name: dataValues.name,
        gameState: dataValues.gameState,
        maxPlayers: dataValues.maxPlayers,
        isOwnedByPlayer: (dataValues.ownerId == playerDataValues.id),
        rounds: dataValues.rounds,
        parameters: dataValues.parameters
    }
    return result;
}

export const getPublicInstanceDataList = (instanceDataList, currentPlayerData) => {
    return instanceDataList.map((element) => getPublicInstanceData(element, currentPlayerData));
}