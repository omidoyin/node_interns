"use strict";
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * Review Resolvers
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */
// const Movie = require('../models/Movie'); // Adjust path as needed

module.exports = {
  Review: {
    movie: async (review, _, { db }) => {
      try {
        return await db.Movie.findByPk(review.movie_id);
      } catch (error) {
        console.log('Review.movie -> error', error);
        throw new ApolloError('InternalServerError');
      }
    },
  },
};
