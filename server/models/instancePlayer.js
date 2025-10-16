const { DataTypes } = require('sequelize');

function model(sequelize) {
    const attributes = {
        playerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        instanceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        civilization: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        color: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        gold: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 50,
        },
        food: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100,
        },
        wood: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100,
        },
        stone: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100,  
        },
        iron: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100,
        },
        diamond: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        army: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 2,
        },
        population: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
        },
        tool: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10,
        },
        weapon: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10,
        },
        armor: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10,
        },
        horse: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        }
    };

    const options = {
        freezeTableName: true,
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,
    };
    return sequelize.define("instancePlayer", attributes, options);
}

module.exports = model;