"use strict";
const { ApolloError } = require('apollo-server-express');
const Sequelize = require('sequelize');
// const { Movie } = require('../models');
const { Movie } = require("../../models");

module.exports = async (_, { threshold }, { db, credential }) => {
  try {
    const options = {
      where: {
        review: {
          [Sequelize.Op.gt]: threshold,
        },
      },
    };

    const movies = await Movie.findAll(options);
 

    return {data: movies.map((movie)=>movie.toJSON())}
  } catch (error) {
    console.log('movieWithReviewsAbove -> error', error);
    return new ApolloError('InternalServerError');
  }
};
