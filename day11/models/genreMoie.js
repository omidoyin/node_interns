module.exports = (sequelize, DataTypes) => {
    const GenreMovie = sequelize.define("GenreMovie", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      movie_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Movies",
          key: "id",
        },
      },
      genre_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Genres",
          key: "id",
        },
      },
    });
  
    return GenreMovie;
  };
  