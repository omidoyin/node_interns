"use strict";
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * Mutation Resolvers
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */
const { ApolloError } = require('apollo-server-express');
const { Genre, MovieActor } = require("../../models");
// const Genre = require('../models/Genre'); // Adjust path as needed
// const Movie = require('../models/Movie'); // Adjust path as needed
// const MovieActor = require('../models/MovieActor'); // Adjust path as needed

module.exports = {
  Mutation: {
    addActorToGenreMovies: async (_, { actorId, genreName }, { db }) => {
      try {
        const genre = await Genre.findOne({ where: { name: genreName } });
        if (!genre) {
          throw new ApolloError('Genre not found');
        }
        
        const movies = await genre.getMovies();
        
        await Promise.all(
          movies.map(async (movie) => {
            await MovieActor.create({ movie_id: movie.id, actor_id: actorId });
          })
        );
        console.log("actorId",actorId,genreName);
        
        return { data: movies.map((movie)=>movie.toJSON())};
      } catch (error) {
        console.log('addActorToGenreMovies -> error', error);
        throw new ApolloError('InternalServerError');
      }
    },
  },
};
