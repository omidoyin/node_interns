const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const ShippingDock = sequelize.define(
    "shipping_dock",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
            type: DataTypes.ENUM,
            values: ['active', 'inactive'],
            defaultValue: 'active'
          }
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "shipping_docks",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return ShippingDock;
};
