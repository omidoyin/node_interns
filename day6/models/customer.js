// models/customer.js

module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define('customers', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      shopify_customer_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      shopify_customer_email: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }

);
  
    return Customer;
  };
  