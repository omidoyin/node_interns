const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Email = sequelize.define(
    "email",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
      },
      subject: DataTypes.STRING,
      body: DataTypes.TEXT,
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
      },
    },
    {
      timestamps: false, // If you don't want Sequelize to manage createdAt and updatedAt
      freezeTableName: true,
      tableName: "emails",
    }
  );

  return Email;
};
