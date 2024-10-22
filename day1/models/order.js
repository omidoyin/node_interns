const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const order = sequelize.define(
    "order",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      tax: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("paid", "not paid"),
        allowNull: false,
        get() {
          const status = this.getDataValue("status");
          return status === "paid" ? 1 : 0; // Mapping paid to 1, not paid to 0
        },
        set(value) {
          const status = value === 1 ? "paid" : "not paid";
          this.setDataValue("status", status);
        },
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "order",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return order;
};
