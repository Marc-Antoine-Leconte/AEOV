const { DataTypes } = require('sequelize');

function model(sequelize) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(512),
            allowNull: true,
        },
        requiredBuildings: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: '[]'
        },
        requiredResources: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: '[]'
        },
        effects: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: '[]'
        },
        type: {
            type: DataTypes.STRING(100),
            allowNull: false,
        }
    };

    const options = {
        freezeTableName: true,
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,
    };
    return sequelize.define("action", attributes, options);
}

module.exports = model;