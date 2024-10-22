const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const EmailQueue = sequelize.define(
    "email_queue",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      status: {
        type: DataTypes.ENUM('send', 'not sent'),
        defaultValue: 'not sent',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      send_at: DataTypes.DATE,
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "email_queues",
    }
  );

  return EmailQueue;
};
