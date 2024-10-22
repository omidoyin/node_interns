const {db} = require("../models/index")
const { Movie, Review, Director, Actor, Genre, MovieActor, GenreMovie } = require('../models/movie');

const resolvers = {
    Query: {
      movies: () => Movie.findAll(),
      reviews: () => Review.findAll(),
      directors: () => Director.findAll(),
      actors: () => Actor.findAll(),
      moviesWithReviewsAbove: (_, { threshold }) => {
        return Movie.findAll({
          where: {
            review: {
              [Op.gt]: threshold,
            },
          },
        });
      },
    },
    Mutation: {
      addActorToGenreMovies: async (_, { actorId, genreName }) => {
        const genre = await Genre.findOne({ where: { name: genreName } });
        const movies = await genre.getMovies();
        
        await Promise.all(
          movies.map(async (movie) => {
            await MovieActor.create({ movie_id: movie.id, actor_id: actorId });
          })
        );
        
        return movies;
      },
    },
    Movie: {
      director: (movie) => Director.findByPk(movie.director_id),
      actors: (movie) => movie.getActors(),
    },
    Review: {
      movie: (review) => Movie.findByPk(review.movie_id),
    },
  };

  module.exports=resolvers