module.exports = (sequelize, DataTypes) => {
  const rules = sequelize.define(
    "rules",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      condition: DataTypes.STRING,
      action: DataTypes.STRING,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "rules",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return rules;
};