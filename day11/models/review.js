module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define("Review", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      notes: {
        type: DataTypes.TEXT,
      },
      movie_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Movies",
          key: "id",
        },
      },
    });
  
    Review.associate = (models) => {
      Review.belongsTo(models.Movie, { foreignKey: 'movie_id' });
    };
  
    return Review;
  };
  