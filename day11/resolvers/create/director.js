"use strict";
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * Movie Resolvers
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */
// const Director = require('../models/Director'); // Adjust path as needed
// const Movie = require('../models/Movie'); // Adjust path as needed
const { Genre, Director, Movie, Actor } = require("../../models");

module.exports = {
  Movie: {
    director: async (movie, _, { db }) => {
      try {
        return await Director.findByPk(movie.director_id);
      } catch (error) {
        console.log("Movie.director -> error", error);
        throw new ApolloError("InternalServerError");
      }
    },
    actors: async (movie, _, { db }) => {
      try {
        // Fetch the full Movie instance if it's not already loaded
        const fullMovie = await Movie.findByPk(movie.id, {
          include: [Actor],
        });
        return fullMovie.Actors;
      } catch (error) {
        console.log("Movie.actors -> error", error);
        throw new ApolloError("InternalServerError");
      }
    },
  },
};
