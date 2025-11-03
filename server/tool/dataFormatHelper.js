export const getPublicInstancePlayerData = (instancePlayerData, instanceData, currentPlayerData) => {
    const dataValues = instancePlayerData.dataValues ? instancePlayerData.dataValues : instancePlayerData;

    const result = {
        playerName: dataValues.name,
        civilization: dataValues.civilization,
        color: dataValues.color,
        isOwner: (dataValues.playerId == instanceData.ownerId),
        isCurrentPlayer: (dataValues.id == instanceData.currentPlayerId),
        isUser: (dataValues.playerId == currentPlayerData.playerId),
        buildings: dataValues.buildings,
        armyPosition: dataValues.armyPosition,
        endTurn: dataValues.endTurn
    }
    return result;
}

export const getPublicInstancePlayerDataList = (instancePlayerDataList, instanceData, currentPlayerData) => {
    return instancePlayerDataList.map((element) => getPublicInstancePlayerData(element, instanceData, currentPlayerData));
}