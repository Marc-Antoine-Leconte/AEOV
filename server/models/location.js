const { DataTypes } = require('sequelize');

function model(sequelize) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        instanceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        pointId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        buildings: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: '[]'
        },
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
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
    return sequelize.define("location", attributes, options);
}

module.exports = model;