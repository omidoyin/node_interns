module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define(
    "answer",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      answer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quizId: {
        type: DataTypes.INTEGER,
        references: {
          model: "quiz",
          key: "id",
        },
      },
    },
    {
      tableName: "answer",
      timestamps: false,
    }
  );

  return Answer;
};
