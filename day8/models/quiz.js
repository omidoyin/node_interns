const Answer = require('./answer'); 


module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define(
    "quiz",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      correct_answer: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING, // or ENUM if you have predefined types
        allowNull: false,
      },
    },
    {
      tableName: "quiz",
      timestamps: false,
    }
  )

  // Quiz.hasMany(Answer, {
  //   foreignKey: 'quizId',
  //   as: 'answers',
  // })

return Quiz
};



// Define association
