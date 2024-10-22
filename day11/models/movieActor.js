module.exports = (sequelize, DataTypes) => {
    const MovieActor = sequelize.define("MovieActor", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      actor_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Actors",
          key: "id",
        },
      },
      movie_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Movies",
          key: "id",
        },
      },
    });
  
    return MovieActor;
  };
  