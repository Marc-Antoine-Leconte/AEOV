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
        effects: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: '[]'
        },
        maxLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        constructible: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        cost: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: '[]'
        },
        upgradeCost: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: '[]'
        },
    };

    const options = {
        freezeTableName: true,
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,
    };
    return sequelize.define("building", attributes, options);
}

module.exports = model;