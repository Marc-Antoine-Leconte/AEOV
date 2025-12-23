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
            allowNull: false,
            defaultValue: 'waiting'
        },
        currentPlayerId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        maxPlayers: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 8
        },
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rounds: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        playerRotation: {
            type: DataTypes.STRING(100),
            allowNull: true,
        }
    };

    const options = {
        freezeTableName: true,
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,
    };
    return sequelize.define("instance", attributes, options);
}

module.exports = model;