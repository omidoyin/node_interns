'use strict';
// /Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2020/
/**
 * Sequelize File
 * @copyright 2020 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */
const fs = require('fs');
const path = require('path');
let Sequelize = require('sequelize');
const basename = path.basename(__filename);
const { DataTypes } = require('sequelize');
const config = {
  DB_DATABASE: 'root',
  DB_USERNAME: 'root',
  DB_PASSWORD: 'root',
  DB_ADAPTER: 'mysql',
  DB_NAME: 'root',
  DB_HOSTNAME: 'localhost',
  DB_PORT: 3306,
};

let db = {};

let sequelize = new Sequelize(config.DB_DATABASE, config.DB_USERNAME, config.DB_PASSWORD, {
  dialect: config.DB_ADAPTER,
  username: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  host: config.DB_HOSTNAME,
  port: config.DB_PORT,
  logging: console.log,
  timezone: '-04:00',
  pool: {
    maxConnections: 1,
    minConnections: 0,
    maxIdleTime: 100,
  },
  define: {
    timestamps: false,
    underscoredAll: true,
    underscored: true,
  },
});

const shipping_dock = require('./shippingDock')(sequelize, DataTypes);
// const shipping_dock = sequelize.define('shipping_dock', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//     allowNull: false
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   status: {
//     type: DataTypes.ENUM,
//     values: ['active', 'inactive'],
//     defaultValue: 'active'
//   }
// }, {
//   tableName: 'shipping_docks' 
// });

const transaction = sequelize.define('transaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  shipping_dock_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'transactions' 
});

const order = sequelize.define('order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tax: {
    type: DataTypes.STRING,
    allowNull: false
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM,
    values: ['paid', 'not paid'],
    defaultValue: 'not paid'
  }
}, {
  tableName: 'orders'
});

sequelize.sync({force: true});

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    var model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = {
  db,
  order,
  transaction,
  shipping_dock
};