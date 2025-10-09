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
    };

    const options = {
        freezeTableName: true,
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,
    };
    return sequelize.define("instancePlayer", attributes, options);
}

module.exports = model;