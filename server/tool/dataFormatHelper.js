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
    }
    return result;
}

export const getPublicInstancePlayerDataList = (instancePlayerDataList, instanceData, currentPlayerData) => {
    return instancePlayerDataList.map((element) => getPublicInstancePlayerData(element, instanceData, currentPlayerData));
}