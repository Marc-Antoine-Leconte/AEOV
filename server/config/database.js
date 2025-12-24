const { Sequelize } = require('sequelize');
require('dotenv').config();
const instanceModel = require('../models/instance')
const instancePlayerModel = require('../models/instancePlayer')
const playerModel = require('../models/player')
const actionModel = require('../models/action')
const locationModel = require('../models/location')

const options_devenv = {
    options: {
        encrypt: true,
        trustServerCertificate: true, // For local development
    }
};

const options_prodenv = {
    options: {
        encrypt: true,
    },
    ssl: {
        ca: 'server/certs/isrgrootx1.pem',
    }
}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DIALECT,
        dialectModule: require('mysql2'),
        dialectOptions: process.env.NODE_ENV === 'production' ? options_prodenv : options_devenv,
    }
);

const db = {};
db.Sequelize = sequelize;
db.Instance = instanceModel(sequelize);
db.InstancePlayer = instancePlayerModel(sequelize);
db.Player = playerModel(sequelize);
db.Action = actionModel(sequelize);
db.Location = locationModel(sequelize);

db.Instance.hasMany(db.InstancePlayer, { foreignKey: 'instanceId' });
db.InstancePlayer.belongsTo(db.Instance, { foreignKey: 'instanceId' });

db.Player.hasMany(db.InstancePlayer, { foreignKey: 'playerId' });
db.InstancePlayer.belongsTo(db.Player, { foreignKey: 'playerId' });

db.Instance.hasMany(db.Location, { foreignKey: 'instanceId' });
db.Location.belongsTo(db.Instance, { foreignKey: 'instanceId' });

module.exports = db;