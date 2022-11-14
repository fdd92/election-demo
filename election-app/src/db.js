const Sequelize = require('sequelize');
const cls = require('cls-hooked');
const config = require('../config/database');

// 自动传递事务
const namespace = cls.createNamespace('election-demo');
Sequelize.useCLS(namespace);

module.exports = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 30000,
  },
});
