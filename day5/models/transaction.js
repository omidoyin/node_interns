const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "transaction",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      shipping_dock_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      tax: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        get() {
          // calculate total dynamically
          const amount = this.getDataValue('amount');
          const discount = this.getDataValue('discount') || 0;
          const tax = this.getDataValue('tax') || 0;
          return amount - discount + tax;
        }
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('paid', 'not paid'),
        allowNull: false,
        get() {
          const status = this.getDataValue('status');
          return status === 'paid' ? 1 : 0; // Mapping paid to 1, not paid to 0
        },
        set(value) {
          const status = value === 1 ? 'paid' : 'not paid';
          this.setDataValue('status', status);
        }
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "transactions",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return Transaction;
};
