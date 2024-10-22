// seed.js
const { Sequelize } = require("sequelize");
const config = {
  DB_DATABASE: "root",
  DB_USERNAME: "root",
  DB_PASSWORD: "Omidihoney10",
  DB_ADAPTER: "mysql",
  // DB_NAME: "root",
  DB_HOSTNAME: "localhost",
  DB_PORT: 3306,
};

//   let db = {};

let sequelize = new Sequelize(
  config.DB_DATABASE,
  config.DB_USERNAME,
  config.DB_PASSWORD,
  {
    dialect: config.DB_ADAPTER,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    // database: config.DB_NAME,
    host: config.DB_HOSTNAME,
    port: config.DB_PORT,
    logging: console.log,
    timezone: "-04:00",
    pool: {
      maxConnections: 1,
      minConnections: 0,
      maxIdleTime: 100,
    },
    define: {
      timestamps: false,
      underscoredAll: true,
      underscored: true,
    },
  }
);

// const { Sequelize } = require('sequelize');
// const sequelize = new Sequelize('database', 'username', 'password', {
//   dialect: 'mysql',
//   host: 'localhost',
// });

const db = require("./models");

console.log("model", db.models);
// const {Genre, Movie,Actor , Review} = db.models

// const Genre = require('./models/Genre');
// const Movie = require('./models/Movie');
// const Actor = require('./models/Actor');
// const Review = require('./models/Review');

(async () => {
  await sequelize.sync({ force: true });

  const actionGenre = await Genre.create({ name: "Action" });
  const dramaGenre = await Genre.create({ name: "Drama" });

  const movie1 = await Movie.create({
    title: "Action Movie 1",
    genre_id: actionGenre.id,
  });
  const movie2 = await Movie.create({
    title: "Action Movie 2",
    genre_id: actionGenre.id,
  });

  await Review.create({ review: 6, movie_id: movie1.id });
  await Review.create({ review: 7, movie_id: movie2.id });

  const actor1 = await Actor.create({ name: "Actor 1" });
  const actor2 = await Actor.create({ name: "Actor 2" });

  console.log("Database seeded");
  process.exit();
})();
