const { Sequelize } = require('sequelize');
require('dotenv').config();
const instanceModel = require('../models/instance')
const instancePlayerModel = require('../models/instancePlayer')
const playerModel = require('../models/player')
const actionModel = require('../models/action')

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DIALECT,
        dialectOptions: {
            options: {
                encrypt: true,
                trustServerCertificate: true, // For local development
            }
        }
    }
);

const db = {};
db.Sequelize = sequelize;
db.Instance = instanceModel(sequelize);
db.InstancePlayer = instancePlayerModel(sequelize);
db.Player = playerModel(sequelize);
db.Action = actionModel(sequelize);

db.Instance.hasMany(db.InstancePlayer, { foreignKey: 'instanceId' });
db.InstancePlayer.belongsTo(db.Instance, { foreignKey: 'instanceId' });
db.Player.hasMany(db.InstancePlayer, { foreignKey: 'playerId' });
db.InstancePlayer.belongsTo(db.Player, { foreignKey: 'playerId' });

module.exports = db;