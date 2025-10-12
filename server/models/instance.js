const { DataTypes } = require('sequelize');

function model(sequelize) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        mode: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        gameState: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        currentPlayerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        maxPlayers: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rounds: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    };

    const options = {
        freezeTableName: true,
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,
    };
    return sequelize.define("instance", attributes, options);
}

module.exports = model;