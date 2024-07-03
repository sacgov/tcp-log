const { Sequelize } = require('sequelize');

const db = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

db.sync({ alter: true });

module.exports = db;
