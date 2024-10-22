const { sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  // Movie Model
  const Movie = sequelize.define("Movie", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    director_id: {
      type: DataTypes.INTEGER,
      // references: {
      //   model: 'Director',
      //   key: 'id',
      // },
    },
    main_genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    review: {
      type: DataTypes.FLOAT,
    },
  });

  // // Review Model
  // const Review = sequelize.define("Review", {
  //   id: {
  //     type: DataTypes.INTEGER,
  //     autoIncrement: true,
  //     primaryKey: true,
  //   },
  //   notes: {
  //     type: DataTypes.TEXT,
  //   },
  //   movie_id: {
  //     type: DataTypes.INTEGER,
  //     references: {
  //       model: "Movies",
  //       key: "id",
  //     },
  //   },
  // });

  // // Director Model
  // const Director = sequelize.define("Director", {
  //   id: {
  //     type: DataTypes.INTEGER,
  //     autoIncrement: true,
  //     primaryKey: true,
  //   },
  //   name: {
  //     type: DataTypes.STRING,
  //     allowNull: false,
  //   },
  // });

  // // Actor Model
  // const Actor = sequelize.define("Actor", {
  //   id: {
  //     type: DataTypes.INTEGER,
  //     autoIncrement: true,
  //     primaryKey: true,
  //   },
  //   name: {
  //     type: DataTypes.STRING,
  //     allowNull: false,
  //   },
  // });

  // // Movie_Actor Model
  // const MovieActor = sequelize.define("MovieActor", {
  //   id: {
  //     type: DataTypes.INTEGER,
  //     autoIncrement: true,
  //     primaryKey: true,
  //   },
  //   actor_id: {
  //     type: DataTypes.INTEGER,
  //     references: {
  //       model: "Actors",
  //       key: "id",
  //     },
  //   },
  //   movie_id: {
  //     type: DataTypes.INTEGER,
  //     references: {
  //       model: "Movies",
  //       key: "id",
  //     },
  //   },
  // });

  // // Genre Model
  // const Genre = sequelize.define("Genre", {
  //   id: {
  //     type: DataTypes.INTEGER,
  //     autoIncrement: true,
  //     primaryKey: true,
  //   },
  //   name: {
  //     type: DataTypes.STRING,
  //     allowNull: false,
  //   },
  // });

  // // Genre_Movie Model
  // const GenreMovie = sequelize.define("GenreMovie", {
  //   id: {
  //     type: DataTypes.INTEGER,
  //     autoIncrement: true,
  //     primaryKey: true,
  //   },
  //   movie_id: {
  //     type: DataTypes.INTEGER,
  //     references: {
  //       model: "Movies",
  //       key: "id",
  //     },
  //   },
  //   genre_id: {
  //     type: DataTypes.INTEGER,
  //     references: {
  //       model: "Genres",
  //       key: "id",
  //     },
  //   },
  // });

  // // Associations
  // Movie.belongsToMany(Actor, { through: MovieActor, foreignKey: "movie_id" });
  // Actor.belongsToMany(Movie, { through: MovieActor, foreignKey: "actor_id" });
  // Movie.belongsTo(Director, { foreignKey: "director_id" });
  // Movie.belongsToMany(Genre, { through: GenreMovie, foreignKey: "movie_id" });
  // Genre.belongsToMany(Movie, { through: GenreMovie, foreignKey: "genre_id" });
  // Review.belongsTo(Movie, { foreignKey: "movie_id" });

  // return {
  //   GenreMovie,
  //   Genre,
  //   MovieActor,
  //   Actor,
  //   Director,
  //   Review,
  //   Movie,
  // };

  Movie.associate = (models) => {
    Movie.belongsTo(models.Director, { foreignKey: 'director_id' });
    Movie.belongsToMany(models.Actor, { through: models.MovieActor, foreignKey: 'movie_id' });
    Movie.belongsToMany(models.Genre, { through: models.GenreMovie, foreignKey: 'movie_id' });
    Movie.hasMany(models.Review, { foreignKey: 'movie_id' });
  };
  return Movie
};

// module.exports = { Movie, Review, Director, Actor, MovieActor, Genre, GenreMovie };
