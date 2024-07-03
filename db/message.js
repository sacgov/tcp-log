const db = require('../db/sequelize');
const { DataTypes } = require('sequelize');

const Habit = db.define(
  'Messages',
  {
    // Model attributes are defined here
    header: {
      type: DataTypes.STRING,
    },
    imei: {
      type: DataTypes.STRING,
    },
    rawMessage: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    receivedTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    error: {
      type: DataTypes.STRING,
    },
    parsedMessage: {
      type: DataTypes.JSON,
    },
  },
  {
    // Other model options go here
  }
);

module.exports = Messages;
