module.exports = (sequelize, DataTypes) => {
  const rules = sequelize.define(
    "variables",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "variables",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return rules;
};